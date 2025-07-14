"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Database,
  Link,
  Settings,
  Filter,
  Search,
  Trash2,
  Edit,
  Play,
} from "lucide-react";

// Enhanced data modeling hook
const useDataModel = () => {
  const [dataModel, setDataModel] = useState({
    tables: [],
    relationships: [],
    transformations: [],
  });

  const addTable = useCallback((table) => {
    const newTable = {
      ...table,
      id: `table_${Date.now()}`,
      columns: table.columns || [],
      data: table.data || [],
      relationships: [],
    };

    setDataModel((prev) => ({
      ...prev,
      tables: [...prev.tables, newTable],
    }));

    return newTable.id;
  }, []);

  const updateTable = useCallback((tableId, updates) => {
    setDataModel((prev) => ({
      ...prev,
      tables: prev.tables.map((table) =>
        table.id === tableId ? { ...table, ...updates } : table
      ),
    }));
  }, []);

  const deleteTable = useCallback((tableId) => {
    setDataModel((prev) => ({
      ...prev,
      tables: prev.tables.filter((table) => table.id !== tableId),
      relationships: prev.relationships.filter(
        (rel) => rel.fromTable !== tableId && rel.toTable !== tableId
      ),
    }));
  }, []);

  const addColumn = useCallback((tableId, column) => {
    const newColumn = {
      ...column,
      id: `col_${Date.now()}`,
    };

    setDataModel((prev) => ({
      ...prev,
      tables: prev.tables.map((table) =>
        table.id === tableId
          ? { ...table, columns: [...table.columns, newColumn] }
          : table
      ),
    }));
  }, []);

  const deleteColumn = useCallback((tableId, columnId) => {
    setDataModel((prev) => ({
      ...prev,
      tables: prev.tables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              columns: table.columns.filter((col) => col.id !== columnId),
            }
          : table
      ),
    }));
  }, []);

  const addRelationship = useCallback((relationship) => {
    const newRelationship = {
      ...relationship,
      id: `rel_${Date.now()}`,
    };

    setDataModel((prev) => ({
      ...prev,
      relationships: [...prev.relationships, newRelationship],
    }));
  }, []);

  const deleteRelationship = useCallback((relationshipId) => {
    setDataModel((prev) => ({
      ...prev,
      relationships: prev.relationships.filter(
        (rel) => rel.id !== relationshipId
      ),
    }));
  }, []);

  // Enhanced import function with better type detection
  const importFromData = useCallback(
    (importedData) => {
      console.log("Processing imported data:", importedData);

      // Detect column types based on data
      const detectColumnType = (values) => {
        const nonEmptyValues = values.filter(
          (v) => v !== null && v !== undefined && v !== ""
        );
        if (nonEmptyValues.length === 0) return "string";

        // Check if all values are numbers
        const numericValues = nonEmptyValues.filter(
          (v) => !isNaN(Number(v)) && v !== ""
        );
        if (numericValues.length === nonEmptyValues.length) return "number";

        // Check if all values are dates
        const dateValues = nonEmptyValues.filter((v) => !isNaN(Date.parse(v)));
        if (
          dateValues.length === nonEmptyValues.length &&
          dateValues.length > 0
        )
          return "date";

        // Check if all values are boolean-like
        const boolValues = nonEmptyValues.filter((v) =>
          ["true", "false", "yes", "no", "1", "0"].includes(
            v.toString().toLowerCase()
          )
        );
        if (boolValues.length === nonEmptyValues.length) return "boolean";

        return "string";
      };

      const columns = importedData.headers.map((header, index) => {
        // Get sample values for this column
        const columnValues = importedData.data
          .map((row) => row[header])
          .slice(0, 100); // Sample first 100 rows
        const detectedType = detectColumnType(columnValues);

        return {
          id: `col_${Date.now()}_${index}`,
          name: header,
          type: detectedType,
          nullable: true,
          primaryKey: false,
        };
      });

      const tableId = addTable({
        name: importedData.tableName,
        columns,
        data: importedData.data,
        source: "csv_import",
        importedAt: new Date().toISOString(),
        originalFileName: importedData.fileName,
      });

      console.log("Created table with ID:", tableId);
      return tableId;
    },
    [addTable]
  );

  const exportToSQL = useCallback(() => {
    let sql = "";

    dataModel.tables.forEach((table) => {
      sql += `CREATE TABLE ${table.name} (\n`;
      sql += table.columns
        .map((col) => {
          let colDef = `  ${col.name} ${col.type.toUpperCase()}`;
          if (!col.nullable) colDef += " NOT NULL";
          if (col.primaryKey) colDef += " PRIMARY KEY";
          return colDef;
        })
        .join(",\n");
      sql += "\n);\n\n";
    });

    dataModel.relationships.forEach((rel) => {
      const fromTable = dataModel.tables.find((t) => t.id === rel.fromTable);
      const toTable = dataModel.tables.find((t) => t.id === rel.toTable);
      if (fromTable && toTable) {
        sql += `ALTER TABLE ${fromTable.name} ADD CONSTRAINT FK_${rel.id} `;
        sql += `FOREIGN KEY (${rel.fromColumn}) REFERENCES ${toTable.name}(${rel.toColumn});\n`;
      }
    });

    return sql;
  }, [dataModel]);

  const getVisualizationData = useCallback(() => {
    return dataModel.tables.map((table) => ({
      tableName: table.name,
      data: table.data,
      columns: table.columns,
    }));
  }, [dataModel]);

  return {
    dataModel,
    addTable,
    updateTable,
    deleteTable,
    addColumn,
    deleteColumn,
    addRelationship,
    deleteRelationship,
    importFromData,
    exportToSQL,
    getVisualizationData,
  };
};

export const DataModeling = ({
  onDataModelChange,
  pendingImport,
  onImportProcessed,
}) => {
  const {
    dataModel,
    addTable,
    updateTable,
    deleteTable,
    addColumn,
    deleteColumn,
    addRelationship,
    deleteRelationship,
    importFromData,
    exportToSQL,
    getVisualizationData,
  } = useDataModel();

  const { toast } = useToast();
  const [selectedTable, setSelectedTable] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddTableDialog, setShowAddTableDialog] = useState(false);
  const [showAddColumnDialog, setShowAddColumnDialog] = useState(false);
  const [showAddRelationshipDialog, setShowAddRelationshipDialog] =
    useState(false);

  // Form states
  const [newTableName, setNewTableName] = useState("");
  const [newColumn, setNewColumn] = useState({
    name: "",
    type: "string",
    nullable: true,
    primaryKey: false,
  });
  const [newRelationship, setNewRelationship] = useState({
    fromTable: "",
    fromColumn: "",
    toTable: "",
    toColumn: "",
    type: "one-to-many",
  });

  /**
   * Memoise visualisation payload so the parent only receives a
   * new reference when the underlying dataModel actually mutates.
   */
  const visualizationData = useMemo(
    () => getVisualizationData(),
    [getVisualizationData]
  );

  useEffect(() => {
    onDataModelChange?.(visualizationData);
  }, [visualizationData, onDataModelChange]);

  // Process pending imports
  useEffect(() => {
    if (pendingImport) {
      console.log("Processing pending import:", pendingImport);

      const tableId = importFromData(pendingImport);
      setSelectedTable(tableId);

      toast({
        title: "Data imported successfully",
        description: `Table "${pendingImport.tableName}" created with ${pendingImport.rowCount} rows and ${pendingImport.columnCount} columns.`,
      });

      // Clear the pending import
      onImportProcessed?.();
    }
  }, [pendingImport, importFromData, onImportProcessed, toast]);

  const handleAddTable = () => {
    if (!newTableName.trim()) return;

    const tableId = addTable({
      name: newTableName,
      columns: [],
      data: [],
    });

    setSelectedTable(tableId);
    setNewTableName("");
    setShowAddTableDialog(false);

    toast({
      title: "Table created",
      description: `Table "${newTableName}" has been created successfully.`,
    });
  };

  const handleAddColumn = () => {
    if (!selectedTable || !newColumn.name?.trim()) return;

    addColumn(selectedTable, newColumn);
    setNewColumn({
      name: "",
      type: "string",
      nullable: true,
      primaryKey: false,
    });
    setShowAddColumnDialog(false);

    toast({
      title: "Column added",
      description: `Column "${newColumn.name}" has been added successfully.`,
    });
  };

  const handleAddRelationship = () => {
    if (!newRelationship.fromTable || !newRelationship.toTable) return;

    addRelationship(newRelationship);
    setNewRelationship({
      fromTable: "",
      fromColumn: "",
      toTable: "",
      toColumn: "",
      type: "one-to-many",
    });
    setShowAddRelationshipDialog(false);

    toast({
      title: "Relationship created",
      description: "Table relationship has been created successfully.",
    });
  };

  const handleExportSQL = () => {
    const sql = exportToSQL();
    const blob = new Blob([sql], { type: "text/sql" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schema.sql";
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Schema exported",
      description: "SQL schema has been exported successfully.",
    });
  };

  const selectedTableData = dataModel.tables.find(
    (t) => t.id === selectedTable
  );
  const filteredColumns =
    selectedTableData?.columns.filter((col) =>
      col.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Data Modeling</h2>
          <p className="text-slate-600">
            Manage tables, relationships, and data structure
          </p>
        </div>
        <div className="flex space-x-2">
          {pendingImport && (
            <Badge variant="default" className="bg-yellow-100 text-yellow-800">
              <Upload className="w-3 h-3 mr-1" />
              Processing Import...
            </Badge>
          )}
          <Button
            variant="outline"
            onClick={handleExportSQL}
            disabled={dataModel.tables.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export SQL
          </Button>
          <Dialog
            open={showAddTableDialog}
            onOpenChange={setShowAddTableDialog}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Table
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Table</DialogTitle>
                <DialogDescription>
                  Enter a name for your new table.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="table-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="table-name"
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    className="col-span-3"
                    placeholder="Enter table name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddTable}>Create Table</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Import Status Card */}
      {dataModel.tables.length > 0 && (
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Data Model Status</h3>
                <p className="text-sm text-slate-600">
                  {dataModel.tables.length} table(s) with{" "}
                  {dataModel.tables.reduce(
                    (sum, table) => sum + table.data.length,
                    0
                  )}{" "}
                  total records
                </p>
              </div>
              <Badge
                variant="default"
                className="bg-emerald-100 text-emerald-800"
              >
                {dataModel.tables.length} Tables Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="tables" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
          <TabsTrigger value="transformations">Transformations</TabsTrigger>
          <TabsTrigger value="schema">Schema Designer</TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tables List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Database Tables</CardTitle>
                <CardDescription>Manage your data tables</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {dataModel.tables.map((table) => (
                  <div
                    key={table.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedTable === table.id
                        ? "bg-blue-50 border-blue-200"
                        : "hover:bg-slate-50"
                    }`}
                    onClick={() => setSelectedTable(table.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Database className="w-4 h-4 text-slate-600" />
                        <span className="font-medium">{table.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Badge variant="secondary">{table.data.length}</Badge>
                        {table.source === "csv_import" && (
                          <Badge variant="outline" className="text-xs">
                            CSV
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTable(table.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-600">
                      {table.columns.length} columns •{" "}
                      {table.relationships?.length || 0} relationships
                      {table.originalFileName && (
                        <div className="text-xs text-slate-500 mt-1">
                          From: {table.originalFileName}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {dataModel.tables.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    No tables yet. Upload a CSV file or create your first table
                    manually.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Table Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>
                      {selectedTableData?.name || "Select a Table"}
                    </CardTitle>
                    <CardDescription>
                      {selectedTableData
                        ? `${selectedTableData.data.length} rows • ${selectedTableData.columns.length} columns`
                        : "Column structure and properties"}
                    </CardDescription>
                  </div>
                  {selectedTable && (
                    <Dialog
                      open={showAddColumnDialog}
                      onOpenChange={setShowAddColumnDialog}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Column
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Column</DialogTitle>
                          <DialogDescription>
                            Define the properties for your new column.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="column-name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="column-name"
                              value={newColumn.name || ""}
                              onChange={(e) =>
                                setNewColumn((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="column-type" className="text-right">
                              Type
                            </Label>
                            <Select
                              value={newColumn.type}
                              onValueChange={(value) =>
                                setNewColumn((prev) => ({
                                  ...prev,
                                  type: value,
                                }))
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="string">String</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="boolean">Boolean</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Options</Label>
                            <div className="col-span-3 space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="nullable"
                                  checked={newColumn.nullable}
                                  onCheckedChange={(checked) =>
                                    setNewColumn((prev) => ({
                                      ...prev,
                                      nullable: !!checked,
                                    }))
                                  }
                                />
                                <Label htmlFor="nullable">Nullable</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="primary-key"
                                  checked={newColumn.primaryKey}
                                  onCheckedChange={(checked) =>
                                    setNewColumn((prev) => ({
                                      ...prev,
                                      primaryKey: !!checked,
                                    }))
                                  }
                                />
                                <Label htmlFor="primary-key">Primary Key</Label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddColumn}>Add Column</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedTable ? (
                  <>
                    <div className="flex items-center space-x-2 mb-4">
                      <Search className="w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Search columns..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                      />
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Column Name</TableHead>
                          <TableHead>Data Type</TableHead>
                          <TableHead>Nullable</TableHead>
                          <TableHead>Constraints</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredColumns.map((column) => (
                          <TableRow key={column.id}>
                            <TableCell className="font-medium">
                              {column.name}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  column.type === "number"
                                    ? "border-blue-200 text-blue-800"
                                    : column.type === "date"
                                    ? "border-green-200 text-green-800"
                                    : column.type === "boolean"
                                    ? "border-purple-200 text-purple-800"
                                    : "border-gray-200 text-gray-800"
                                }
                              >
                                {column.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  column.nullable ? "secondary" : "destructive"
                                }
                              >
                                {column.nullable ? "Yes" : "No"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {column.primaryKey && (
                                  <Badge variant="default" className="text-xs">
                                    PK
                                  </Badge>
                                )}
                                {column.foreignKey && (
                                  <Badge variant="outline" className="text-xs">
                                    FK
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    deleteColumn(selectedTable, column.id)
                                  }
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    Select a table to view its columns
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="relationships" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Table Relationships</CardTitle>
                  <CardDescription>
                    Manage foreign key relationships between tables
                  </CardDescription>
                </div>
                <Dialog
                  open={showAddRelationshipDialog}
                  onOpenChange={setShowAddRelationshipDialog}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Relationship
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Relationship</DialogTitle>
                      <DialogDescription>
                        Define a relationship between two tables.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>From Table</Label>
                          <Select
                            value={newRelationship.fromTable}
                            onValueChange={(value) =>
                              setNewRelationship((prev) => ({
                                ...prev,
                                fromTable: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select table" />
                            </SelectTrigger>
                            <SelectContent>
                              {dataModel.tables.map((table) => (
                                <SelectItem key={table.id} value={table.id}>
                                  {table.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>To Table</Label>
                          <Select
                            value={newRelationship.toTable}
                            onValueChange={(value) =>
                              setNewRelationship((prev) => ({
                                ...prev,
                                toTable: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select table" />
                            </SelectTrigger>
                            <SelectContent>
                              {dataModel.tables.map((table) => (
                                <SelectItem key={table.id} value={table.id}>
                                  {table.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Relationship Type</Label>
                        <Select
                          value={newRelationship.type}
                          onValueChange={(value) =>
                            setNewRelationship((prev) => ({
                              ...prev,
                              type: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="one-to-one">
                              One to One
                            </SelectItem>
                            <SelectItem value="one-to-many">
                              One to Many
                            </SelectItem>
                            <SelectItem value="many-to-many">
                              Many to Many
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddRelationship}>
                        Create Relationship
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From Table</TableHead>
                    <TableHead>To Table</TableHead>
                    <TableHead>Relationship Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataModel.relationships.map((rel) => {
                    const fromTable = dataModel.tables.find(
                      (t) => t.id === rel.fromTable
                    );
                    const toTable = dataModel.tables.find(
                      (t) => t.id === rel.toTable
                    );

                    return (
                      <TableRow key={rel.id}>
                        <TableCell className="font-medium">
                          {fromTable?.name || "Unknown"}
                        </TableCell>
                        <TableCell>{toTable?.name || "Unknown"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{rel.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteRelationship(rel.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {dataModel.relationships.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No relationships defined yet. Create relationships between
                  your tables.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transformations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Transformations</CardTitle>
              <CardDescription>
                Apply transformations to clean and prepare your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <Filter className="h-6 w-6" />
                  <span>Filter Data</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <Database className="h-6 w-6" />
                  <span>Sort Columns</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <Settings className="h-6 w-6" />
                  <span>Group By</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <Play className="h-6 w-6" />
                  <span>Calculate Fields</span>
                </Button>
              </div>
              <div className="text-center py-8 text-slate-500">
                Select a transformation type above to begin cleaning and
                preparing your data.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Schema Statistics</CardTitle>
                <CardDescription>Overview of your data model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {dataModel.tables.length}
                    </div>
                    <div className="text-sm text-blue-600">Tables</div>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">
                      {dataModel.relationships.length}
                    </div>
                    <div className="text-sm text-emerald-600">
                      Relationships
                    </div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {dataModel.tables.reduce(
                        (sum, table) => sum + table.columns.length,
                        0
                      )}
                    </div>
                    <div className="text-sm text-orange-600">Total Columns</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {dataModel.tables.reduce(
                        (sum, table) => sum + table.data.length,
                        0
                      )}
                    </div>
                    <div className="text-sm text-purple-600">Total Records</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common data modeling tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Generate Sample Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Link className="w-4 h-4 mr-2" />
                  Auto-detect Relationships
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Optimize Schema
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Validate Data Model
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
