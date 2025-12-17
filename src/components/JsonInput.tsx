import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface JsonInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  error: string | null;
}

export function JsonInput({ value, onChange, onGenerate, error }: JsonInputProps) {
  return (
    <div className="bg-card rounded-lg p-6 card-elevated border border-border">
      <h2 className="text-lg font-semibold text-center mb-4">Input Your JSON Data Below</h2>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your JSON here..."
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
