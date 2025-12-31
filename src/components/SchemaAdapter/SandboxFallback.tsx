import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ExternalLink, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface SandboxFallbackProps {
    error: string;
}

export const SandboxFallback: React.FC<SandboxFallbackProps> = ({ error }) => {
    const [copied, setCopied] = React.useState(false);

    const canonicalExample = `[
  { "category": "Jan", "value": 100 },
  { "category": "Feb", "value": 120 }
]`;

    const handleCopySchema = () => {
        navigator.clipboard.writeText(canonicalExample);
        setCopied(true);
        toast.success("Example schema copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="border-destructive/20 bg-destructive/5 dark:bg-destructive/10 animate-in fade-in slide-in-from-top-4 duration-500">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    <CardTitle className="text-lg font-semibold text-destructive">
                        Data Conversion Failed
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {error || "We couldn’t safely convert this data."}
                    <br />
                    No worries! You can use our schema sandbox to validate and fix your JSON.
                </p>

                <div className="flex flex-col gap-3">
                    <div className="bg-background/50 p-3 rounded-md border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Required Format</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopySchema}>
                                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                            </Button>
                        </div>
                        <pre className="text-[10px] font-mono opacity-80">{canonicalExample}</pre>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2 border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                            asChild
                        >
                            <a href="https://www.jsonschemavalidator.net/s/o0xCJmbu" target="_blank" rel="noopener noreferrer">
                                Open Sandbox
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </Button>
                    </div>
                </div>

                <p className="text-[10px] text-center text-muted-foreground italic">
                    "Return here once it validates"
                </p>
            </CardContent>
        </Card>
    );
};
