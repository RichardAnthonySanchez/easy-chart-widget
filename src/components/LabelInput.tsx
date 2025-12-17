import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LabelInputProps {
    value: string;
    onChange: (value: string) => void;
}

export function LabelInput({ value, onChange }: LabelInputProps) {
    return (
        <div className="bg-card rounded-lg p-6 card-elevated border border-border">
            <div className="space-y-3">
                <Label htmlFor="value-label" className="text-base font-semibold">
                    What do your values represent?
                </Label>
                <Input
                    id="value-label"
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Values"
                    className="bg-secondary/50 border-border focus:border-primary"
                />
                <p className="text-sm text-muted-foreground">
                    e.g., Sales, Revenue, Page Views, Downloads, etc.
                </p>
            </div>
        </div>
    );
}
