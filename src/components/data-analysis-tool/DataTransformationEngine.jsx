"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Filter, Play, Save, Trash2, ArrowRight } from "lucide-react"

interface TransformationStep {
  id: string
  type: "filter" | "sort" | "group" | "calculate" | "merge" | "pivot"
  name: string
  config: Record<string, any>
  enabled: boolean
}

export const DataTransformationEngine = () => {
  const [transformationSteps, setTransformationSteps] = useState<TransformationStep[]>([])
  const [selectedStep, setSelectedStep] = useState<string>("")
  const [previewData, setPreviewData] = useState<any[]>([])

  const addTransformationStep = (type: TransformationStep["type"]) => {
    const newStep: TransformationStep = {
      id: `step_${Date.now()}`,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Step`,
      config: {},
      enabled: true,
    }

    setTransformationSteps((prev) => [...prev, newStep])
    setSelectedStep(newStep.id)
  }

  const updateStep = (stepId: string, updates: Partial<TransformationStep>) => {
    setTransformationSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, ...updates } : step)))
  }

  const deleteStep = (stepId: string) => {
    setTransformationSteps((prev) => prev.filter((step) => step.id !== stepId))
    if (selectedStep === stepId) {
      setSelectedStep("")
    }
  }

  const renderStepConfig = (step: TransformationStep) => {
    switch (step.type) {
      case "filter":
        return (
          <div className="space-y-4">
            <div>
              <Label>Filter Condition</Label>
              <Textarea
                placeholder="e.g., age > 25 AND department = 'Engineering'"
                value={step.config.condition || ""}
                onChange={(e) =>
                  updateStep(step.id, {
                    config: { ...step.config, condition: e.target.value },
                  })
                }
              />
            </div>
          </div>
        )

      case "sort":
        return (
          <div className="space-y-4">
            <div>
              <Label>Sort Column</Label>
              <Input
                placeholder="Column name"
                value={step.config.column || ""}
                onChange={(e) =>
                  updateStep(step.id, {
                    config: { ...step.config, column: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label>Sort Order</Label>
              <Select
                value={step.config.order || "asc"}
                onValueChange={(value) =>
                  updateStep(step.id, {
                    config: { ...step.config, order: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "group":
        return (
          <div className="space-y-4">
            <div>
              <Label>Group By Columns</Label>
              <Input
                placeholder="column1, column2"
                value={step.config.groupBy || ""}
                onChange={(e) =>
                  updateStep(step.id, {
                    config: { ...step.config, groupBy: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label>Aggregation</Label>
              <Select
                value={step.config.aggregation || "count"}
                onValueChange={(value) =>
                  updateStep(step.id, {
                    config: { ...step.config, aggregation: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="count">Count</SelectItem>
                  <SelectItem value="sum">Sum</SelectItem>
                  <SelectItem value="avg">Average</SelectItem>
                  <SelectItem value="min">Minimum</SelectItem>
                  <SelectItem value="max">Maximum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "calculate":
        return (
          <div className="space-y-4">
            <div>
              <Label>New Column Name</Label>
              <Input
                placeholder="calculated_field"
                value={step.config.columnName || ""}
                onChange={(e) =>
                  updateStep(step.id, {
                    config: { ...step.config, columnName: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label>Formula</Label>
              <Textarea
                placeholder="e.g., salary * 1.1 OR CONCAT(first_name, ' ', last_name)"
                value={step.config.formula || ""}
                onChange={(e) =>
                  updateStep(step.id, {
                    config: { ...step.config, formula: e.target.value },
                  })
                }
              />
            </div>
          </div>
        )

      default:
        return <div>Configuration for {step.type} coming soon...</div>
    }
  }

  const selectedStepData = transformationSteps.find((step) => step.id === selectedStep)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Data Transformation</h3>
          <p className="text-slate-600">Clean, reshape, and prepare your data</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Play className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Apply Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transformation Steps */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Transformation Steps</CardTitle>
            <CardDescription>Build your data pipeline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => addTransformationStep("filter")}>
                <Filter className="w-3 h-3 mr-1" />
                Filter
              </Button>
              <Button variant="outline" size="sm" onClick={() => addTransformationStep("sort")}>
                Sort
              </Button>
              <Button variant="outline" size="sm" onClick={() => addTransformationStep("group")}>
                Group
              </Button>
              <Button variant="outline" size="sm" onClick={() => addTransformationStep("calculate")}>
                Calculate
              </Button>
            </div>

            <div className="space-y-2">
              {transformationSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedStep === step.id ? "bg-blue-50 border-blue-200" : "hover:bg-slate-50"
                  }`}
                  onClick={() => setSelectedStep(step.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{index + 1}</Badge>
                      <span className="font-medium text-sm">{step.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge variant={step.enabled ? "default" : "secondary"}>{step.enabled ? "On" : "Off"}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteStep(step.id)
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    {step.type.charAt(0).toUpperCase() + step.type.slice(1)} operation
                  </div>
                  {index < transformationSteps.length - 1 && (
                    <div className="flex justify-center mt-2">
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </div>
                  )}
                </div>
              ))}

              {transformationSteps.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No transformation steps yet.
                  <br />
                  Add steps to build your pipeline.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Step Configuration */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{selectedStepData ? `Configure: ${selectedStepData.name}` : "Select a Step"}</CardTitle>
            <CardDescription>
              {selectedStepData
                ? "Configure the parameters for this transformation step"
                : "Select a transformation step to configure its settings"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedStepData ? (
              <div className="space-y-6">
                <div>
                  <Label>Step Name</Label>
                  <Input
                    value={selectedStepData.name}
                    onChange={(e) => updateStep(selectedStepData.id, { name: e.target.value })}
                  />
                </div>

                {renderStepConfig(selectedStepData)}

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={selectedStepData.enabled}
                    onChange={(e) => updateStep(selectedStepData.id, { enabled: e.target.checked })}
                  />
                  <Label htmlFor="enabled">Enable this step</Label>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                Select a transformation step from the left panel to configure it.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Data Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Data Preview</CardTitle>
          <CardDescription>Preview of your data after applying transformations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">
            Data preview will appear here after running transformations.
            <br />
            <Button variant="outline" className="mt-2 bg-transparent">
              <Play className="w-4 h-4 mr-2" />
              Run Preview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
