"use client";

import { useState, useEffect, useRef } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useInView } from "../hooks/useInView";
import "react-circular-progressbar/dist/styles.css";

const stats = [
  {
    value: 98,
    text: "98%",
    title: "Compliance Rate",
    description:
      "Our graduates achieve near-perfect compliance scores in regulatory assessments",
  },
  {
    value: 75,
    text: "75%",
    title: "Risk Reduction",
    description:
      "Organizations report a 75% reduction in compliance risks after staff complete our AML training",
  },
  {
    value: 50,
    text: "50+",
    title: "Regulatory Frameworks",
    description:
      "Our KYC & AML curriculum covers over 50 global regulatory frameworks and standards",
  },
  {
    value: 100,
    text: "100%",
    title: "Expert-Led Training",
    description:
      "All courses are designed and taught by certified AML and KYC compliance professionals",
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
              pathColor: "#F59E0B", // Navy blue
              textColor: "#F59E0B",
              trailColor: "#f5f5f5",
              strokeLinecap: "round",
              // Use ease-out for smoother animation
              pathTransition: "stroke-dashoffset 1.5s ease-out",
              pathTransitionDuration: 1.5,
            })}
          />
        </div>
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-800">{stat.title}</h3>
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
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-yellow-600 mb-4">
            INDUSTRY-LEADING KYC & AML COMPLIANCE SOLUTIONS
          </h2>
          <p className="text-3xl font-medium text-yellow-600">
            Over{" "}
            <span className="text-primary">
              10,000 Compliance Professionals
            </span>{" "}
            Trained
          </p>
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
