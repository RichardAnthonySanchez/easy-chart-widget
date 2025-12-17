import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

type ChartType = "bar" | "line" | "pie" | "doughnut";

interface ChartPreviewProps {
  data: { category: string; value: number }[];
  chartType: ChartType;
  valueLabel?: string;
}

const COLORS = [
  "hsl(215, 80%, 55%)",   // blue
  "hsl(28, 90%, 55%)",    // orange
  "hsl(142, 70%, 45%)",   // green
  "hsl(265, 60%, 55%)",   // purple
  "hsl(340, 75%, 55%)",   // pink
  "hsl(180, 60%, 45%)",   // teal
];

export function ChartPreview({ data, chartType, valueLabel = "Values" }: ChartPreviewProps) {
  if (data.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6 card-elevated border border-border">
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          Enter JSON data and click "Generate Chart" to see preview
        </div>
      </div>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 40, right: 30, left: 20, bottom: 5 }} barSize={60}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="category"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                label={{ value: valueLabel, angle: -90, position: 'insideLeft', style: { fill: 'hsl(var(--muted-foreground))' } }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Bar dataKey="value" name={valueLabel} radius={[4, 4, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <LabelList dataKey="value" position="top" fill="hsl(var(--foreground))" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="category"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name={valueLabel}
                stroke={COLORS[0]}
                strokeWidth={3}
                dot={{ fill: COLORS[0], strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "pie":
      case "doughnut":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }) => `${category} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={120}
                innerRadius={chartType === "doughnut" ? 60 : 0}
                fill="#8884d8"
                dataKey="value"
                nameKey="category"
                paddingAngle={2}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 card-elevated border border-border animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-4 text-sm font-medium text-muted-foreground">
            Your Chart Preview:
          </span>
        </div>
      </div>
      <div className="mt-4">
        {renderChart()}
      </div>
    </div>
  );
}
