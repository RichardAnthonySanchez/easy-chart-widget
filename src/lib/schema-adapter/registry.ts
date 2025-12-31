import { Adapter, ConversionResult, ConversionOption } from "./types";
import { CanonicalSchema, CanonicalDataItem, CanonicalData } from "./canonical-schema";
import { ParallelArraysAdapter } from "./adapters/parallel-arrays";
import { ObjectAliasAdapter } from "./adapters/object-alias";
import { MultiSeriesAdapter } from "./adapters/multi-series";
import { HeuristicObjectArrayAdapter } from "./adapters/heuristic-object-array";
import { WrappedDataAdapter } from "./adapters/wrapped-data";

export class AdapterRegistry {
    private adapters: Adapter[] = [];

    register(adapter: Adapter) {
        this.adapters.push(adapter);
        this.adapters.sort((a, b) => b.priority - a.priority);
    }

    tryTransform(input: unknown): ConversionResult | null {
        // First, check if it's already canonical
        const validation = CanonicalSchema.safeParse(input);
        if (validation.success) {
            return {
                adapterName: "Canonical",
                data: validation.data as CanonicalData,
                isAmbiguous: false,
            };
        }

        // Try each adapter
        for (const adapter of this.adapters) {
            if (adapter.matches(input)) {
                try {
                    const transformed = adapter.transform(input);

                    let resultData: CanonicalData;
                    let options: ConversionOption[] | undefined;

                    if (Array.isArray(transformed) && transformed.length > 0 && 'label' in (transformed as any)[0]) {
                        options = transformed as any as ConversionOption[];
                        resultData = options[0].data;
                    } else {
                        resultData = transformed as CanonicalData;
                    }

                    const finalValidation = CanonicalSchema.safeParse(resultData);
                    if (finalValidation.success) {
                        return {
                            adapterName: adapter.name,
                            data: finalValidation.data as CanonicalData,
                            isAmbiguous: !!options && options.length > 1,
                            options: options,
                        };
                    }
                } catch (e) {
                    console.error(`Adapter ${adapter.name} failed to transform:`, e);
                    continue;
                }
            }
        }

        return null;
    }
}

export const registry = new AdapterRegistry();
registry.register(ParallelArraysAdapter);
registry.register(ObjectAliasAdapter);
registry.register(MultiSeriesAdapter);
registry.register(HeuristicObjectArrayAdapter);
registry.register(WrappedDataAdapter);
