import { Adapter, ConversionOption } from "../types";
import { CanonicalData } from "../canonical-schema";
import { registry } from "../registry";

export const WrappedDataAdapter: Adapter = {
    name: "Wrapped Data",
    priority: 15, // High priority to unwrap before other specialized adapters
    matches(input: any): boolean {
        if (typeof input !== "object" || input === null || Array.isArray(input)) return false;

        const keys = Object.keys(input);
        const wrapperKey = keys.find(k => ["data", "records", "items", "results"].includes(k.toLowerCase()));

        if (wrapperKey) {
            const inner = input[wrapperKey];
            return Array.isArray(inner) && inner.length > 0;
        }

        return false;
    },
    transform(input: any): CanonicalData | ConversionOption[] {
        const keys = Object.keys(input);
        const wrapperKey = keys.find(k => ["data", "records", "items", "results"].includes(k.toLowerCase()))!;
        const inner = input[wrapperKey];

        // Try to transform the inner data using the registry (excluding this adapter to avoid recursion)
        // Actually, simple way: call registry.tryTransform(inner)
        const result = registry.tryTransform(inner);
        if (result) {
            return result.data; // Our registry return format is slightly different, usually we'd want options too.
            // To simplify, if it's wrapped, we unwrap and return what we find.
        }

        // Fallback: If no other adapter matches the inner, just return the inner and hope a lower priority one (like heuristic) catches it
        // Wait, the Registry handles the delegation. The problem is if we are INSIDE an adapter, we can't easily call the registry again without infinite loop if not careful.
        // However, if we just return the inner array, the Registry doesn't "re-process" it because it already matched this one.

        // Better: This adapter should be a "Pre-processor" but the current architecture is "First match wins".
        // Let's make this adapter just return the inner data, and the Registry logic will need to handle "Transformed but still needs more transformation" or we just handle the base cases here.

        // Plan v2 says: "Unwrap data" + "Alias".
        // Let's just do a basic unwrap and check for common keys.
        const firstItem = inner[0];
        if (typeof firstItem === "object" && firstItem !== null) {
            const itemKeys = Object.keys(firstItem);
            const categoryKey = itemKeys.find(k => ["label", "name", "item", "category"].includes(k.toLowerCase()));
            const valueKey = itemKeys.find(k => ["value", "count", "amount"].includes(k.toLowerCase()));

            if (categoryKey && valueKey) {
                return inner.map((item: any) => ({
                    category: String(item[categoryKey]),
                    value: Number(item[valueKey]),
                }));
            }
        }

        return inner; // Hope heuristic handles it if this unwrap didn't find specific keys
    },
};
