import { cn } from "@/lib/utils";

export default function CircularProgress({
  value = 0,
  size = 120,
  strokeWidth = 8,
  className = "",
  label,
  secondaryLabel,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
    >
      {/* Background circle */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1a365d"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Center content */}
      {(label || secondaryLabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {label && <div className="text-2xl font-bold">{label}</div>}
          {secondaryLabel && (
            <div className="text-xs text-muted-foreground">
              {secondaryLabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
