import { BarChart2, UserCheck, CheckCircle } from "lucide-react";

export function FeaturesBanner() {
  return (
    <section className="bg-gray-800 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 md:justify-between">
          <div className="flex items-center gap-3">
            <div className="text-blue-500">
              <BarChart2 className="h-8 w-8" />
            </div>
            <span className="text-lg font-medium text-white">
              Real-Time Digital Creations
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-blue-500">
              <UserCheck className="h-8 w-8" />{" "}
              {/* Replaced Star with UserCheck */}
            </div>
            <span className="text-lg font-medium text-white">
              Skilled Mentors
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-blue-500">
              <CheckCircle className="h-8 w-8" />
            </div>
            <span className="text-lg font-medium text-white">
              Global Access, Your Pace
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
