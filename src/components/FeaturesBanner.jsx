import { BarChart2, UserCheck, CheckCircle } from "lucide-react";

export function FeaturesBanner() {
  return (
    <section className="bg-foreground py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 md:justify-between">
          <div className="flex items-center gap-3">
            <div className="text-primary">
              <BarChart2 className="h-8 w-8" />
            </div>
            <span className="text-lg font-medium text-primary">
              Real-Time Digital Creations
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-primary">
              <UserCheck className="h-8 w-8" />{" "}
              {/* Replaced Star with UserCheck */}
            </div>
            <span className="text-lg font-medium text-primary">
              Skilled Mentors
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-primary">
              <CheckCircle className="h-8 w-8" />
            </div>
            <span className="text-lg font-medium text-primary">
              Global Access, Your Pace
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
