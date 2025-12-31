import { Adapter, ConversionOption } from "../types";
import { CanonicalData } from "../canonical-schema";

export const MultiSeriesAdapter: Adapter = {
    name: "Multi-Series",
    priority: 8,
    matches(input: any): boolean {
        if (typeof input !== "object" || input === null || Array.isArray(input)) return false;

        const keys = Object.keys(input);
        const hasCategories = keys.some(k => ["categories", "labels", "x"].includes(k.toLowerCase()));
        const hasSeries = keys.some(k => ["series", "datasets"].includes(k.toLowerCase()));

        if (hasCategories && hasSeries) {
            const categories = input[keys.find(k => ["categories", "labels", "x"].includes(k.toLowerCase()))!];
            const series = input[keys.find(k => ["series", "datasets"].includes(k.toLowerCase()))!];
            return Array.isArray(categories) && Array.isArray(series) && series.length > 0 &&
                (Array.isArray(series[0].data) || Array.isArray(series[0].values));
        }

        return false;
    },
    transform(input: any): CanonicalData | ConversionOption[] {
        const keys = Object.keys(input);
        const categoryKey = keys.find(k => ["categories", "labels", "x"].includes(k.toLowerCase()))!;
        const seriesKey = keys.find(k => ["series", "datasets"].includes(k.toLowerCase()))!;

        const categories = input[categoryKey];
        const series = input[seriesKey];

        if (series.length > 1) {
            return series.map((s: any) => ({
                label: s.name || s.label || "Untitled Series",
                data: categories.map((cat: any, index: number) => ({
                    category: String(cat),
                    value: Number((s.data || s.values)[index]),
                })),
            }));
        }

        // Default to a single CanonicalData if only one series
        const firstSeries = series[0];
        const data = firstSeries.data || firstSeries.values;

        return categories.map((cat: any, index: number) => ({
            category: String(cat),
            value: Number(data[index]),
        }));
    },
};
