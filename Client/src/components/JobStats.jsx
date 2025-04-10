"use client";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const JobStats = ({ jobs }) => {
  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = [
    { name: "Applied", value: statusCounts["Applied"] || 0, color: "#3b82f6" },
    {
      name: "Interview",
      value: statusCounts["Interview"] || 0,
      color: "#f59e0b",
    },
    { name: "Offer", value: statusCounts["Offer"] || 0, color: "#10b981" },
    {
      name: "Rejected",
      value: statusCounts["Rejected"] || 0,
      color: "#ef4444",
    },
  ];

  const totalApplications = jobs.length;
  const activeApplications =
    totalApplications - (statusCounts["Rejected"] || 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Application Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground text-sm">Total</p>
              <p className="text-3xl font-bold">{totalApplications}</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground text-sm">Active</p>
              <p className="text-3xl font-bold">{activeApplications}</p>
            </div>
          </div>

          {totalApplications > 0 && (
            <div className="h-[200px] mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      percent > 0
                        ? `${name} ${(percent * 100).toFixed(0)}%`
                        : ""
                    }
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 mt-4">
            {chartData.map((status) => (
              <div key={status.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                <span className="text-sm">
                  {status.name}: {status.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default JobStats;
