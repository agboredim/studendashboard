import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Database, Link, Plus, Settings, Filter, Search } from "lucide-react";

const tables = [
  {
    name: "Applications",
    records: 12543,
    columns: 15,
    lastUpdated: "2 hours ago",
    relationships: 3,
  },
  {
    name: "Candidates",
    records: 8291,
    columns: 22,
    lastUpdated: "1 hour ago",
    relationships: 5,
  },
  {
    name: "Positions",
    records: 847,
    columns: 18,
    lastUpdated: "30 minutes ago",
    relationships: 4,
  },
  {
    name: "Interviews",
    records: 3429,
    columns: 12,
    lastUpdated: "45 minutes ago",
    relationships: 2,
  },
  {
    name: "Departments",
    records: 24,
    columns: 8,
    lastUpdated: "1 day ago",
    relationships: 6,
  },
];

const relationships = [
  {
    from: "Applications",
    to: "Candidates",
    type: "Many-to-One",
    field: "candidate_id",
  },
  {
    from: "Applications",
    to: "Positions",
    type: "Many-to-One",
    field: "position_id",
  },
  {
    from: "Interviews",
    to: "Applications",
    type: "Many-to-One",
    field: "application_id",
  },
  {
    from: "Positions",
    to: "Departments",
    type: "Many-to-One",
    field: "department_id",
  },
];

const sampleColumns = [
  { name: "id", type: "Integer", nullable: false, primaryKey: true },
  {
    name: "candidate_id",
    type: "Integer",
    nullable: false,
    foreignKey: "candidates.id",
  },
  {
    name: "position_id",
    type: "Integer",
    nullable: false,
    foreignKey: "positions.id",
  },
  { name: "application_date", type: "Date", nullable: false },
  { name: "status", type: "String", nullable: false },
  { name: "resume_url", type: "String", nullable: true },
  { name: "cover_letter", type: "Text", nullable: true },
  { name: "rating", type: "Decimal", nullable: true },
];

export const DataModeling = () => {
  const [selectedTable, setSelectedTable] = useState("Applications");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredColumns = sampleColumns.filter((col) =>
    col.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Button variant="outline">
            <Database className="w-4 h-4 mr-2" />
            Schema Diagram
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Table
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tables" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
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
                {tables.map((table, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedTable === table.name
                        ? "bg-blue-50 border-blue-200"
                        : "hover:bg-slate-50"
                    }`}
                    onClick={() => setSelectedTable(table.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Database className="w-4 h-4 text-slate-600" />
                        <span className="font-medium">{table.name}</span>
                      </div>
                      <Badge variant="secondary">
                        {table.records.toLocaleString()}
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-slate-600">
                      {table.columns} columns • {table.relationships}{" "}
                      relationships
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Table Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{selectedTable} Table</CardTitle>
                    <CardDescription>
                      Column structure and properties
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <Search className="w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search columns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Column Name</TableHead>
                      <TableHead>Data Type</TableHead>
                      <TableHead>Nullable</TableHead>
                      <TableHead>Constraints</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredColumns.map((column, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {column.name}
                        </TableCell>
                        <TableCell>{column.type}</TableCell>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Relationship
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From Table</TableHead>
                    <TableHead>To Table</TableHead>
                    <TableHead>Relationship Type</TableHead>
                    <TableHead>Foreign Key</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relationships.map((rel, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{rel.from}</TableCell>
                      <TableCell>{rel.to}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rel.type}</Badge>
                      </TableCell>
                      <TableCell>{rel.field}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Settings className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Link className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Relationship Diagram */}
          <Card>
            <CardHeader>
              <CardTitle>Schema Diagram</CardTitle>
              <CardDescription>
                Visual representation of table relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                <div className="text-center">
                  <Database className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-600">
                    Interactive schema diagram will appear here
                  </p>
                  <Button variant="outline" className="mt-2">
                    Generate Diagram
                  </Button>
                </div>
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
                      {tables.length}
                    </div>
                    <div className="text-sm text-blue-600">Tables</div>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">
                      {relationships.length}
                    </div>
                    <div className="text-sm text-emerald-600">
                      Relationships
                    </div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {tables.reduce((sum, table) => sum + table.columns, 0)}
                    </div>
                    <div className="text-sm text-orange-600">Total Columns</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {tables
                        .reduce((sum, table) => sum + table.records, 0)
                        .toLocaleString()}
                    </div>
                    <div className="text-sm text-purple-600">Total Records</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Quality</CardTitle>
                <CardDescription>
                  Health check of your data model
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Schema Integrity</span>
                    <Badge className="bg-emerald-100 text-emerald-800">
                      98%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Relationship Consistency</span>
                    <Badge className="bg-emerald-100 text-emerald-800">
                      95%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Completeness</span>
                    <Badge className="bg-yellow-100 text-yellow-800">87%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Index Optimization</span>
                    <Badge className="bg-blue-100 text-blue-800">92%</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Run Full Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
