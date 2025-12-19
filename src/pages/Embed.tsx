import { useSearchParams } from "react-router-dom";
import { ChartPreview } from "@/components/ChartPreview";
import { useEffect, useState } from "react";

const Embed = () => {
    const [searchParams] = useSearchParams();
    const [config, setConfig] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const configParam = searchParams.get("config");
        if (configParam) {
            try {
                const decoded = JSON.parse(decodeURIComponent(configParam));
                setConfig(decoded);
            } catch (err) {
                console.error("Failed to parse chart config:", err);
                setError("Invalid chart configuration");
            }
        } else {
            setError("No chart configuration provided");
        }
    }, [searchParams]);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4 text-muted-foreground bg-background">
                <div className="text-center space-y-2">
                    <p className="text-lg font-medium text-destructive">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!config) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="animate-pulse text-muted-foreground text-sm">Loading chart...</div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-background p-2">
            <ChartPreview
                data={config.data}
                chartType={config.chartType}
                valueLabel={config.valueLabel}
                minimal={true}
            />
        </div>
    );
};

export default Embed;
