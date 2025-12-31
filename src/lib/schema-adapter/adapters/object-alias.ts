import { Adapter } from "../types";
import { CanonicalData } from "../canonical-schema";

export const ObjectAliasAdapter: Adapter = {
    name: "Object Array Alias",
    priority: 5,
    matches(input: any): boolean {
        if (!Array.isArray(input) || input.length === 0) return false;

        const firstItem = input[0];
        if (typeof firstItem !== "object" || firstItem === null) return false;

        const keys = Object.keys(firstItem);
        const hasCategoryAlias = keys.some(k => ["label", "category", "name", "x", "key"].includes(k.toLowerCase()));
        const hasValueAlias = keys.some(k => ["value", "count", "amount", "y"].includes(k.toLowerCase()));

        return hasCategoryAlias && hasValueAlias;
    },
    transform(input: any[]): CanonicalData {
        const firstItem = input[0];
        const keys = Object.keys(firstItem);

        const categoryKey = keys.find(k => ["label", "category", "name", "x", "key"].includes(k.toLowerCase()))!;
        const valueKey = keys.find(k => ["value", "count", "amount", "y"].includes(k.toLowerCase()))!;

        return input.map(item => ({
            category: String(item[categoryKey]),
            value: Number(item[valueKey]),
        }));
    },
};
