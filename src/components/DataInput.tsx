import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface DataInputProps {
    value: string;
    inputType: "json" | "csv";
    onChange: (value: string) => void;
    onGenerate: () => void;
    error: string | null;
}

export function DataInput({ value, inputType, onChange, onGenerate, error }: DataInputProps) {
    const title = inputType === "json" ? "Input Your JSON Data Below" : "Input Your CSV Data Below";
    const placeholder = inputType === "json"
        ? '[\n  { "category": "A", "value": 10 },\n  { "category": "B", "value": 20 }\n]'
        : "category,value\nA,10\nB,20";

    return (
        <div className="bg-card rounded-lg p-6 card-elevated border border-border">
            <h2 className="text-lg font-semibold text-center mb-4">{title}</h2>
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="min-h-[200px] font-mono text-sm bg-secondary/50 border-border focus:border-primary resize-none"
            />
            {error && (
                <p className="text-destructive text-sm mt-2">{error}</p>
            )}
            <div className="flex justify-center mt-4">
                <Button
                    onClick={onGenerate}
                    className="btn-glow px-8 py-2 font-semibold"
                    size="lg"
                >
                    Generate Chart
                </Button>
            </div>
        </div>
    );
}
