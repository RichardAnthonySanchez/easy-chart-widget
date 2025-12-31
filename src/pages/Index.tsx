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
import { registry } from "@/lib/schema-adapter/registry";
import { ConversionPreview } from "@/components/SchemaAdapter/ConversionPreview";
import { SandboxFallback } from "@/components/SchemaAdapter/SandboxFallback";
import { ConversionResult } from "@/lib/schema-adapter/types";
import { CanonicalData, CanonicalDataItem } from "@/lib/schema-adapter/canonical-schema";
import { AlertTriangle } from "lucide-react";

type ChartType = "bar" | "line" | "pie" | "doughnut";
type InputType = "json" | "csv";

const SAMPLE_DATA: CanonicalData = [
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
  const [chartData, setChartData] = useState<CanonicalData>(SAMPLE_DATA);
  const [error, setError] = useState<string | null>(null);
  const [valueLabel, setValueLabel] = useState("Values");
  const [showLabelInput, setShowLabelInput] = useState(false);
  const [showDataHelp, setShowDataHelp] = useState(false);
  const [pendingConversion, setPendingConversion] = useState<ConversionResult | null>(null);

  // Auto-generate on mount
  useEffect(() => {
    if (chartData.length > 0) return;
    handleGenerate();
  }, []);

  const handleGenerate = () => {
    try {
      let validated: CanonicalData = [];

      if (inputType === "json") {
        const parsed = JSON.parse(jsonInput);

        // Use Registry to try and transform the data
        const conversion = registry.tryTransform(parsed);

        if (conversion) {
          if (conversion.adapterName === "Canonical") {
            validated = conversion.data;
          } else {
            // Found a match, show preview instead of immediate update
            setPendingConversion({ ...conversion, data: conversion.data }); // We might want to store the raw parsed data too for the preview
            setError(null);
            return;
          }
        } else {
          // Fallback to existing manual validation if no adapter matches
          if (!Array.isArray(parsed)) {
            throw new Error("JSON must be an array of objects");
          }
          validated = (parsed.map((item: any, index: number): CanonicalDataItem => {
            if (typeof item.category !== "string" || typeof item.value !== "number") {
              throw new Error(`Item ${index + 1}: Each object needs "category" (string) and "value" (number)`);
            }
            return { category: item.category, value: item.value };
          }) as CanonicalData);
        }
      } else {
        const parsed = Papa.parse(csvInput, { header: true, dynamicTyping: true });

        if (parsed.errors.length > 0) {
          throw new Error(`CSV Error: ${parsed.errors[0].message}`);
        }

        validated = ((parsed.data as any[]).map((item, index): CanonicalDataItem => {
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
        }) as CanonicalData);
      }

      setChartData(validated);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid data format");
      setChartData([]);
      setPendingConversion(null);
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

          {/* Data Source Help */}
          <Collapsible open={showDataHelp} onOpenChange={setShowDataHelp}>
            <div className="flex justify-center mt-4">
              <CollapsibleTrigger className="text-sm text-primary hover:underline focus:outline-none">
                {showDataHelp ? '− Hide data guide' : "+ Don't know where to get JSON or CSV data?"}
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="mt-4 bg-card rounded-lg p-6 border border-border animate-in fade-in slide-in-from-top-2">
              <div className="text-sm space-y-4">
                {inputType === "csv" ? (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Getting CSV Data</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      CSV (Comma Separated Values) is the most common format for spreadsheet data.
                      If you use Google Sheets, you can easily export your data.
                    </p>
                    <p>
                      <a
                        href="https://xfanatical.com/blog/how-to-export-google-sheets-as-csv/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                      >
                        Learn how to export Google Sheets as CSV →
                      </a>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Getting JSON Data</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Most modern relational databases have built-in commands to format query results as JSON directly within the engine.
                      Consult your database's documentation for JSON data export.
                    </p>
                    <p className="text-muted-foreground leading-relaxed italic">
                      Tip: You can also ask an LLM (like ChatGPT or Gemini) to format your raw data into JSON for you!
                    </p>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <TabsContent value="json">
            <DataInput
              value={jsonInput}
              inputType="json"
              onChange={setJsonInput}
              onGenerate={handleGenerate}
              error={null} // SandboxFallback handles JSON error now
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

        {/* Errors & Conversion Flow */}
        <div className="space-y-4">
          {error && inputType === "json" && !pendingConversion && (
            <SandboxFallback error={error} />
          )}

          {error && inputType === "csv" && (
            <div className="bg-destructive/10 p-4 rounded-md border border-destructive/20 text-destructive text-sm animate-in fade-in slide-in-from-top-2">
              <p className="font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Error: {error}
              </p>
            </div>
          )}

          {pendingConversion && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <ConversionPreview
                adapterName={pendingConversion.adapterName}
                originalData={JSON.parse(jsonInput)}
                convertedData={pendingConversion.data}
                isAmbiguous={pendingConversion.isAmbiguous}
                options={pendingConversion.options}
                onApply={(finalData) => {
                  setChartData(finalData);
                  setJsonInput(JSON.stringify(finalData, null, 2));
                  setPendingConversion(null);
                  setError(null);
                }}
                onCancel={() => {
                  setPendingConversion(null);
                }}
              />
            </div>
          )}
        </div>



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
    </div >
  );
};

export default Index;
