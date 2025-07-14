"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const ReportsCenter = ({ modeledData = [] }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reports Center</h2>
          <p className="text-slate-600">Generate and manage data reports</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Application Summary</CardTitle>
            <CardDescription>
              Overview of application statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-slate-600">
                Total Applications: 12,543
              </p>
              <p className="text-sm text-slate-600">Positions Filled: 2,847</p>
              <p className="text-sm text-slate-600">Success Rate: 74.2%</p>
            </div>
            <Button variant="outline" className="mt-4 w-full bg-transparent">
              View Report
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Performance metrics by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-slate-600">
                Engineering: 1,250 applications
              </p>
              <p className="text-sm text-slate-600">Sales: 890 applications</p>
              <p className="text-sm text-slate-600">
                Marketing: 650 applications
              </p>
            </div>
            <Button variant="outline" className="mt-4 w-full bg-transparent">
              View Report
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Interview Feedback</CardTitle>
            <CardDescription>Feedback analysis from interviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-slate-600">Positive Feedback: 85%</p>
              <p className="text-sm text-slate-600">Negative Feedback: 15%</p>
            </div>
            <Button variant="outline" className="mt-4 w-full bg-transparent">
              View Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
