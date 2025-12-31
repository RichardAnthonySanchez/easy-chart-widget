import { z } from "zod";

export const CanonicalDataItemSchema = z.object({
    category: z.string(),
    value: z.number(),
});

export const CanonicalSchema = z.array(CanonicalDataItemSchema);

export type CanonicalDataItem = {
    category: string;
    value: number;
};

export type CanonicalData = CanonicalDataItem[];
