import { CanonicalData } from "./canonical-schema";

export interface ConversionOption {
    label: string;
    data: CanonicalData;
}

export interface Adapter {
    name: string;
    priority: number;
    matches(input: unknown): boolean;
    transform(input: unknown): CanonicalData | ConversionOption[];
}

export interface ConversionResult {
    adapterName: string;
    data: CanonicalData;
    isAmbiguous: boolean;
    options?: ConversionOption[];
    suggestions?: string[];
}
