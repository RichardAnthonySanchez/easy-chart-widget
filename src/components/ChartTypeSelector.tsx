import { BarChart3, LineChart, PieChart, Circle } from "lucide-react";

type ChartType = "bar" | "line" | "pie" | "doughnut";

interface ChartTypeSelectorProps {
  selected: ChartType;
  onSelect: (type: ChartType) => void;
}

const chartTypes: { type: ChartType; label: string; icon: React.ReactNode }[] = [
  { type: "bar", label: "Bar Chart", icon: <BarChart3 className="w-4 h-4" /> },
  { type: "line", label: "Line Chart", icon: <LineChart className="w-4 h-4" /> },
  { type: "pie", label: "Pie Chart", icon: <PieChart className="w-4 h-4" /> },
  { type: "doughnut", label: "Doughnut Chart", icon: <Circle className="w-4 h-4" /> },
];

export function ChartTypeSelector({ selected, onSelect }: ChartTypeSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {chartTypes.map(({ type, label, icon }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium
            transition-all duration-200 border
            ${selected === type
              ? "bg-primary text-primary-foreground border-primary btn-glow"
              : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-secondary"
            }
          `}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
}
