import { Adapter, ConversionOption } from "../types";
import { CanonicalData } from "../canonical-schema";

export const HeuristicObjectArrayAdapter: Adapter = {
    name: "Generic Object Array",
    priority: 1, // Lowest priority, run after specific adapters
    matches(input: any): boolean {
        if (!Array.isArray(input) || input.length === 0) return false;

        const firstItem = input[0];
        if (typeof firstItem !== "object" || firstItem === null) return false;

        const values = Object.values(firstItem);
        const hasString = values.some(v => typeof v === "string");
        const hasNumber = values.some(v => typeof v === "number");

        return hasString && hasNumber;
    },
    transform(input: any[]): CanonicalData {
        const firstItem = input[0];
        const keys = Object.keys(firstItem);

        const stringKeys = keys.filter(k => typeof firstItem[k] === "string");
        const numberKeys = keys.filter(k => typeof firstItem[k] === "number");

        // Guardrail: If multiple numeric/string fields, we might want to flag as ambiguous,
        // but Plan v2 says "Select first string field -> category" and "Select first numeric field -> value"
        // with a guardrail: "If multiple numeric candidates -> error + prompt"

        // For simplicity in this MVP of the heuristic, we pick the first ones but could be improved.
        const categoryKey = stringKeys[0];
        const valueKey = numberKeys[0];

        if (numberKeys.length > 1) {
            // Technically this should trigger an ambiguity prompt, but for now we follow the "first" rule
            // or we could throw an error if we strictly follow Plan v2 guardrail.
            // Let's implement it as a multi-option if there are multiple number keys to be safe and "deterministic".
            return numberKeys.map(numKey => ({
                label: `Using "${numKey}" as value`,
                data: input.map(item => ({
                    category: String(item[categoryKey]),
                    value: Number(item[numKey]),
                })),
            })) as any; // Cast to any because our registry handles ConversionOption[]
        }

        return input.map(item => ({
            category: String(item[categoryKey]),
            value: Number(item[valueKey]),
        }));
    },
};
