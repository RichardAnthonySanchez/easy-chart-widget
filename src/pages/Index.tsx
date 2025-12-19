import { useState, useEffect } from "react";
import { ChartTypeSelector } from "@/components/ChartTypeSelector";
import { DataInput } from "@/components/DataInput";
import { ChartPreview } from "@/components/ChartPreview";
import { EmbedCode } from "@/components/EmbedCode";
import { LabelInput } from "@/components/LabelInput";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Papa from "papaparse";

type ChartType = "bar" | "line" | "pie" | "doughnut";
type InputType = "json" | "csv";

const SAMPLE_DATA = [
  { category: "Tech", value: 120 },
  { category: "Travel", value: 90 },
  { category: "Food", value: 150 },
  { category: "Lifestyle", value: 80 },
];

const SAMPLE_JSON = JSON.stringify(SAMPLE_DATA, null, 2);
const SAMPLE_CSV = "category,value\nTech,120\nTravel,90\nFood,150\nLifestyle,80";

const Index = () => {
  const [jsonInput, setJsonInput] = useState(SAMPLE_JSON);
  const [csvInput, setCsvInput] = useState(SAMPLE_CSV);
  const [inputType, setInputType] = useState<InputType>("json");

  const [chartType, setChartType] = useState<ChartType>("bar");
  const [chartData, setChartData] = useState<{ category: string; value: number }[]>(SAMPLE_DATA);
  const [error, setError] = useState<string | null>(null);
  const [valueLabel, setValueLabel] = useState("Values");
  const [showLabelInput, setShowLabelInput] = useState(false);

  // Auto-generate on mount
  useEffect(() => {
    if (chartData.length > 0) return;
    handleGenerate();
  }, []);

  const handleGenerate = () => {
    try {
      let validated: { category: string; value: number }[] = [];

      if (inputType === "json") {
        const parsed = JSON.parse(jsonInput);
        if (!Array.isArray(parsed)) {
          throw new Error("JSON must be an array of objects");
        }
        validated = parsed.map((item, index) => {
          if (typeof item.category !== "string" || typeof item.value !== "number") {
            throw new Error(`Item ${index + 1}: Each object needs "category" (string) and "value" (number)`);
          }
          return { category: item.category, value: item.value };
        });
      } else {
        const parsed = Papa.parse(csvInput, { header: true, dynamicTyping: true });

        if (parsed.errors.length > 0) {
          throw new Error(`CSV Error: ${parsed.errors[0].message}`);
        }

        validated = (parsed.data as any[]).map((item, index) => {
          // Find category and value columns regardless of case
          const keys = Object.keys(item);
          const categoryKey = keys.find(k => k.toLowerCase() === "category") || keys[0];
          const valueKey = keys.find(k => k.toLowerCase() === "value") || keys[1];

          const category = String(item[categoryKey]);
          const value = Number(item[valueKey]);

          if (!category || isNaN(value)) {
            throw new Error(`Row ${index + 1}: Invalid data. Expected "category" (string) and "value" (number)`);
          }

          return { category, value };
        });
      }

      setChartData(validated);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid data format");
      setChartData([]);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient">
            Convert JSON/CSV to Charts Easily
          </h1>
          <p className="text-muted-foreground text-lg">
            No-code tool to transform your data into beautiful charts.
            <br />
            Perfect for non-technical bloggers!
          </p>
        </header>

        {/* Chart Type Selector */}
        <ChartTypeSelector selected={chartType} onSelect={setChartType} />

        {/* Data Input Section */}
        <Tabs value={inputType} onValueChange={(v) => setInputType(v as InputType)} className="w-full">
          <div className="flex justify-center mb-4">
            <TabsList className="grid w-[200px] grid-cols-2 bg-slate-200/50 dark:bg-slate-800/50 border border-border mt-2 shadow-inner">
              <TabsTrigger value="json">JSON</TabsTrigger>
              <TabsTrigger value="csv">CSV</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="json">
            <DataInput
              value={jsonInput}
              inputType="json"
              onChange={setJsonInput}
              onGenerate={handleGenerate}
              error={error}
            />
          </TabsContent>

          <TabsContent value="csv">
            <DataInput
              value={csvInput}
              inputType="csv"
              onChange={setCsvInput}
              onGenerate={handleGenerate}
              error={error}
            />
          </TabsContent>
        </Tabs>

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
          Paste JSON/CSV • Pick chart type • Copy embed code
        </footer>
      </div>
    </div>
  );
};

export default Index;
