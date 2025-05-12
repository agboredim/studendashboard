"use client";

import { useState, useEffect, useRef } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useInView } from "../hooks/useInView";
import "react-circular-progressbar/dist/styles.css";

const stats = [
  {
    value: 78,
    text: "78%",
    title: "Securing Interviews",
    description:
      "78% of our students secured interviews within 3 months of course completion",
  },
  {
    value: 92,
    text: "92%",
    title: "Confidence Boost",
    description:
      "92% of students report increased confidence to transition into Compliance or IT roles after training",
  },
  {
    value: 95,
    text: "95%",
    title: "Student Satisfaction",
    description:
      "95% student satisfaction rate with course content and delivery",
  },
  {
    value: 100,
    text: "100%",
    title: "Expert Led Training",
    description:
      "100% expert led training - All courses are designed and taught by certified Compliance and IT experts",
  },
];

function StatItem({ stat, index }) {
  // Use a lower threshold and adjust rootMargin to make detection more stable
  const [ref, isInView] = useInView({
    threshold: 0.1,
    rootMargin: "-10px 0px",
  });

  const [percentage, setPercentage] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const animationTimeoutRef = useRef(null);
  const isAnimatingRef = useRef(false);

  // Handle animation when visibility changes
  useEffect(() => {
    // Clear any existing animation timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    if (isInView) {
      // If coming into view, start animation
      isAnimatingRef.current = true;

      // Reset to 0 first
      setPercentage(0);

      // Small delay before starting animation
      animationTimeoutRef.current = setTimeout(() => {
        setPercentage(stat.value);
      }, 50);
    } else {
      // If element is no longer in view and was animating, reset after a delay
      if (isAnimatingRef.current) {
        animationTimeoutRef.current = setTimeout(() => {
          setPercentage(0);
          isAnimatingRef.current = false;
        }, 200); // Delay reset to prevent flickering
      }
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isInView, stat.value]);

  // Determine what text to show during animation
  const displayText = percentage === 0 ? "" : stat.text;

  return (
    <div className="flex flex-col items-center">
      <div
        ref={ref}
        className="w-40 h-40 relative hover-scale"
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {hoveredIndex === index && (
          <div className="absolute inset-0 z-0">
            <CircularProgressbar
              value={percentage}
              text=""
              styles={buildStyles({
                pathColor: "rgba(10, 26, 53, 0.3)", // Navy blue with opacity
                trailColor: "transparent",
                strokeLinecap: "round",
                pathTransition: "stroke-dashoffset 1.5s ease-out",
                pathTransitionDuration: 1.5,
                strokeWidth: 8,
              })}
            />
          </div>
        )}
        <div className="absolute inset-0 z-10">
          <CircularProgressbar
            value={percentage}
            text={displayText}
            styles={buildStyles({
              pathColor: "#00adee",
              textColor: "#00adee",
              trailColor: "#f5f5f5",
              strokeLinecap: "round",
              // Use ease-out for smoother animation
              pathTransition: "stroke-dashoffset 1.5s ease-out",
              pathTransitionDuration: 1.5,
            })}
          />
        </div>
      </div>
      <h3 className="mt-4 text-lg font-medium text-foreground">{stat.title}</h3>
      <p className="mt-2 text-sm text-gray-600 text-center">
        {stat.description}
      </p>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Build Skills. Unlock Opportunities. Become a Titan{" "}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <StatItem key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
