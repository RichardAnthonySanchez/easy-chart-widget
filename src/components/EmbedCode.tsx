import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Code, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmbedCodeProps {
  data: { category: string; value: number }[];
  chartType: string;
}

export function EmbedCode({ data, chartType }: EmbedCodeProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Generate a data URL with the chart configuration
  const chartConfig = encodeURIComponent(
    JSON.stringify({ data, chartType })
  );
  
  const embedCode = `<iframe src="${window.location.origin}/embed?config=${chartConfig}" width="100%" height="400" frameborder="0" style="border-radius: 8px;"></iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Embed code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try selecting and copying manually",
        variant: "destructive",
      });
    }
  };

  if (data.length === 0) return null;

  return (
    <div className="bg-foreground text-background rounded-lg overflow-hidden card-elevated animate-fade-in">
      <div className="flex items-center justify-between px-4 py-3 border-b border-background/10">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4" />
          <span className="font-medium text-sm">Embed Your Chart:</span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopy}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Code
            </>
          )}
        </Button>
      </div>
      <div className="p-4 overflow-x-auto">
        <code className="text-sm font-mono text-background/80 break-all">
          {embedCode}
        </code>
      </div>
    </div>
  );
}
