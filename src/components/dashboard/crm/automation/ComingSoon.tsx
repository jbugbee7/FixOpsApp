import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface ComingSoonProps {
  feature: string;
  description?: string;
}

const ComingSoon = ({ feature, description }: ComingSoonProps) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5" />
            {feature} - Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {description || `The ${feature} feature is currently under development and will be available in a future update.`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoon;
