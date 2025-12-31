import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle } from "lucide-react";
import { CanonicalData } from "@/lib/schema-adapter/canonical-schema";
import { ConversionOption } from "@/lib/schema-adapter/types";

interface ConversionPreviewProps {
    adapterName: string;
    originalData: any;
    convertedData: CanonicalData;
    isAmbiguous?: boolean;
    options?: ConversionOption[];
    onApply: (data: CanonicalData) => void;
    onCancel: () => void;
}

export const ConversionPreview: React.FC<ConversionPreviewProps> = ({
    adapterName,
    originalData,
    convertedData,
    isAmbiguous,
    options,
    onApply,
    onCancel,
}) => {
    const [selectedOptionIndex, setSelectedOptionIndex] = React.useState(0);
    const currentData = options && options.length > 0 ? options[selectedOptionIndex].data : convertedData;

    return (
        <Card className="border-primary/20 bg-background/50 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            {adapterName} detected
                        </Badge>
                        Data Conversion
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Before</p>
                        <div className="bg-muted/50 p-3 rounded-md overflow-hidden">
                            <pre className="text-[10px] font-mono opacity-60">
                                {JSON.stringify(originalData, null, 2).slice(0, 150)}...
                            </pre>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">After</p>
                        {isAmbiguous && options && options.length > 1 && (
                            <div className="mb-2 space-y-2">
                                <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                                    <AlertCircle className="h-3 w-3" />
                                    Multiple series detected. Select one:
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {options.map((opt, idx) => (
                                        <Badge
                                            key={idx}
                                            variant={selectedOptionIndex === idx ? "default" : "outline"}
                                            className="cursor-pointer text-[10px]"
                                            onClick={() => setSelectedOptionIndex(idx)}
                                        >
                                            {opt.label}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="bg-primary/5 p-3 rounded-md border border-primary/10">
                            <div className="flex flex-col gap-1">
                                {currentData.slice(0, 3).map((item, i) => (
                                    <div key={i} className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">{item.category}</span>
                                        <span className="font-mono text-primary">{item.value}</span>
                                    </div>
                                ))}
                                {currentData.length > 3 && (
                                    <span className="text-[10px] text-muted-foreground text-center italic">
                                        + {currentData.length - 3} more items
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                    <Button variant="ghost" size="sm" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button size="sm" onClick={() => onApply(currentData)} className="gap-2">
                        <Check className="h-4 w-4" />
                        Apply Conversion
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
