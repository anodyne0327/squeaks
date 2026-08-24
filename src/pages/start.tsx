import { Monitor, Smartphone } from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";

export default function StartPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-2xl space-y-10 text-center">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Cycle 7
          </p>
          <h1 className="text-4xl font-bold">
            From Upload to Work-Ready Documents
          </h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link to="/v1/antrag/nachweise" className="block">
            <Card className="hover:bg-muted">
              <CardContent className="flex flex-col items-center gap-3 py-10">
                <Monitor className="h-8 w-8" />
                <span className="text-lg font-bold">Start from desktop</span>
              </CardContent>
            </Card>
          </Link>

          <Link to="/mobile-start" className="block">
            <Card className="hover:bg-muted">
              <CardContent className="flex flex-col items-center gap-3 py-10">
                <Smartphone className="h-8 w-8" />
                <span className="text-lg font-bold">Start from mobile</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
