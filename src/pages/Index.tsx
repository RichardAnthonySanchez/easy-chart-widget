import { useState, useEffect } from "react";
import { ChartTypeSelector } from "@/components/ChartTypeSelector";
import { JsonInput } from "@/components/JsonInput";
import { ChartPreview } from "@/components/ChartPreview";
import { EmbedCode } from "@/components/EmbedCode";
import { LabelInput } from "@/components/LabelInput";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type ChartType = "bar" | "line" | "pie" | "doughnut";

const SAMPLE_DATA = [
  { category: "Tech", value: 120 },
  { category: "Travel", value: 90 },
  { category: "Food", value: 150 },
  { category: "Lifestyle", value: 80 },
];

const SAMPLE_JSON = JSON.stringify(SAMPLE_DATA, null, 2);

const Index = () => {
  const [jsonInput, setJsonInput] = useState(SAMPLE_JSON);
  // Initialize with sample data immediately
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [chartData, setChartData] = useState<{ category: string; value: number }[]>(SAMPLE_DATA);
  const [error, setError] = useState<string | null>(null);
  const [valueLabel, setValueLabel] = useState("Values");
  const [showLabelInput, setShowLabelInput] = useState(false);

  // Auto-generate on chart type change
  useEffect(() => {
    if (chartData.length > 0) return; // Already has data
    handleGenerate();
  }, []);

  const handleGenerate = () => {
    try {
      const parsed = JSON.parse(jsonInput);

      // Validate the structure
      if (!Array.isArray(parsed)) {
        throw new Error("JSON must be an array of objects");
      }

      const validated = parsed.map((item, index) => {
        if (typeof item.category !== "string" || typeof item.value !== "number") {
          throw new Error(`Item ${index + 1}: Each object needs "category" (string) and "value" (number)`);
        }
        return { category: item.category, value: item.value };
      });

      setChartData(validated);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON format");
      setChartData([]);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient">
            Convert JSON to Charts Easily
          </h1>
          <p className="text-muted-foreground text-lg">
            No-code tool to transform your JSON data into beautiful charts.
            <br />
            Perfect for non-technical bloggers!
          </p>
        </header>

        {/* Chart Type Selector */}
        <ChartTypeSelector selected={chartType} onSelect={setChartType} />



        {/* JSON Input */}
        <JsonInput
          value={jsonInput}
          onChange={setJsonInput}
          onGenerate={handleGenerate}
          error={error}
        />

        {/* Chart Preview */}
        <ChartPreview data={chartData} chartType={chartType} valueLabel={valueLabel} />

        {/* Label Input */}
        <Collapsible open={showLabelInput} onOpenChange={setShowLabelInput}>
          <div className="flex justify-center">
            <CollapsibleTrigger className="text-sm text-primary hover:underline focus:outline-none">
              {showLabelInput ? '− Hide label customization' : '+ Customize value label'}
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-4">
            <LabelInput value={valueLabel} onChange={setValueLabel} />
          </CollapsibleContent>
        </Collapsible>

        {/* Embed Code */}
        <EmbedCode data={chartData} chartType={chartType} valueLabel={valueLabel} />

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pt-4">
          Paste JSON • Pick chart type • Copy embed code
        </footer>
      </div>
    </div>
  );
};

export default Index;
