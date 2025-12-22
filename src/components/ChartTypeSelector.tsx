import { useState } from "react";
import { BarChart3, LineChart, PieChart, Circle, HelpCircle } from "lucide-react";

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

const explanations: Record<ChartType, string> = {
  bar: "Best for comparing things between different groups or tracking changes over time.",
  line: "Best for showing trends over time, like stock prices or temperature changes.",
  pie: "Best for showing how a single entity is broken down into parts (percentages).",
  doughnut: "Similar to a pie chart, but with a cutout center - good for a modern look.",
};

export function ChartTypeSelector({ selected, onSelect }: ChartTypeSelectorProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-center items-center gap-2">
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

        <button
          onClick={() => setShowHelp(!showHelp)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold
            transition-all duration-200 border ml-2
            ${showHelp
              ? "bg-secondary text-primary border-primary/30"
              : "bg-transparent text-muted-foreground border-border hover:border-primary/30 hover:text-primary"
            }
          `}
          title="Toggle help explanations"
        >
          <HelpCircle className={`w-3.5 h-3.5 ${showHelp ? "text-primary" : "text-muted-foreground"}`} />
          {showHelp ? "Hide Help" : "Show Help"}
        </button>
      </div>

      {showHelp && (
        <div className="flex justify-center animate-in fade-in slide-in-from-top-1 duration-200">
          <p className="text-sm text-muted-foreground bg-secondary/30 px-4 py-2 rounded-lg border border-border/50 max-w-xl text-center italic">
            {explanations[selected]}
          </p>
        </div>
      )}
    </div>
  );
}
