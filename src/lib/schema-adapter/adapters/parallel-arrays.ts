import { Adapter } from "../types";
import { CanonicalData } from "../canonical-schema";

export const ParallelArraysAdapter: Adapter = {
    name: "Parallel Arrays",
    priority: 10,
    matches(input: any): boolean {
        if (typeof input !== "object" || input === null || Array.isArray(input)) return false;

        const keys = Object.keys(input);
        const labelKey = keys.find(k => ["labels", "categories", "names", "x"].includes(k.toLowerCase()));
        const valueKey = keys.find(k => ["values", "data", "counts", "y"].includes(k.toLowerCase()));

        if (labelKey && valueKey) {
            const labels = input[labelKey];
            const values = input[valueKey];
            return Array.isArray(labels) && Array.isArray(values) && labels.length === values.length && labels.length > 0;
        }

        return false;
    },
    transform(input: any): CanonicalData {
        const keys = Object.keys(input);
        const labelKey = keys.find(k => ["labels", "categories", "names", "x"].includes(k.toLowerCase()))!;
        const valueKey = keys.find(k => ["values", "data", "counts", "y"].includes(k.toLowerCase()))!;

        const labels = input[labelKey];
        const values = input[valueKey];

        return labels.map((label: any, index: number) => ({
            category: String(label),
            value: Number(values[index]),
        }));
    },
};
