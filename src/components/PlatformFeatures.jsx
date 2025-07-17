import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export function PlatformFeatures() {
  const features = [
    {
      title: "Expert-Led Training",
      description:
        "At Titans Careers, every course is led by professionals who’ve worked and excelled in the industries they now teach. Our trainers aren’t just instructors; they’re active experts with years of hands-on experience managing real business challenges. They bring more than knowledge, they bring perspective, mentorship, and insight. You’ll gain exposure to best practices, tools used in the field, and industry expectations, all shared through engaging, interactive sessions. With expert-led instruction, you’ll learn exactly what’s needed to succeed in today’s job market delivered in a way that’s practical, accessible, and immediately applicable to your career goals.",
      link: "/expert-training",
    },
    {
      title: "Real-World Experience",
      description:
        "We don’t just teach concepts, we train you to apply them. Our programs are designed to mirror the real-world challenges you’ll face in the workplace. Through simulations, live case studies, practical exercises, and hands-on assignments, you’ll gain experience solving business problems as if you were already on the job. You’ll work with real tools, make real decisions, and build confidence through action. By the time you complete your course, you’ll have a portfolio of work, a practical skillset, and the confidence to step into your next role prepared, proven, and ready to contribute from day one.",
      link: "/real-world-training",
    },
    {
      title: "Comprehensive Mentorship",
      description:
        "At Titans Careers, mentorship isn’t an add-on as it’s built into every step of your journey. Our learners receive ongoing support from industry professionals who serve as both guides and motivators. Whether you’re navigating a difficult concept, building a portfolio, or preparing for interviews, your mentor is just a message away. They’ll provide personalized feedback, help you align your goals with career paths, and keep you accountable. This isn’t passive learning, it’s an interactive, empowering experience. With a dedicated mentor in your corner, you’ll never feel stuck or lost and you’ll feel seen, supported, and set up for success. There will be 12 months support for all candidates.",
      link: "/mentorship",
    },
    {
      title: "Industry Networking Skills",
      description:
        "Technical skills get your foot in the door but networking opens it wider. That’s why we help you develop powerful, practical networking skills that elevate your visibility and professional presence. Learn how to build meaningful connections, grow your LinkedIn network, engage confidently at industry events, and present yourself with purpose. We’ll show you how to approach professionals, maintain connections, and make lasting impressions. Whether you're starting out or pivoting careers, mastering the art of networking will connect you with mentors, recruiters, and peers expanding your opportunities and keeping you top-of-mind in a competitive job market.",
      link: "/networking",
    },
    {
      title: "Interview Preparation",
      description:
        "An interview is your moment to shine and we’ll make sure you’re ready. Our interview preparation training helps you master the art of communication, strategy, and confidence. You’ll participate in mock interviews tailored to your desired industry, get feedback on your performance, and learn how to answer even the toughest questions with clarity and purpose. We cover everything from posture and tone to storytelling and situational responses. You’ll also learn how to navigate technical, behavioural, and panel interviews with ease. With Titans Careers, you walk into your next interview not just prepared but prepared to win. There will be 12 months support for all candidates.",
      link: "/regulatory-updates",
    },
    {
      title: "CV Drafting",
      description:
        "Choose Titans Careers for expert-led CV drafting tailored to today’s competitive job market. Our course blends proven strategies, personalized coaching, and real-world insights to help you craft a CV that highlights your strengths and achievements. You’ll gain the skills to stand out, attract recruiters, and secure interviews whether you're entering the workforce or advancing your career. With Titans, your CV becomes your strongest career asset.",
    },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <span className="inline-block px-6 py-2 bg-white rounded-full text-navy-800 font-semibold text-sm uppercase tracking-wider">
            PLATFORM FEATURES
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-center text-navy-800 mb-4">
          Main features
        </h2>

        <p className="text-xl text-center text-gray-600 mb-12">
          Build to solve your training challenges
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionLength = 100; // Adjust this value to control when to truncate

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const displayedDescription = isExpanded
    ? feature.description
    : feature.description.slice(0, descriptionLength) +
      (feature.description.length > descriptionLength ? "..." : "");

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-semibold mb-3 text-navy-800">
        {feature.title}
      </h3>
      <p className="text-gray-600 mb-4">{displayedDescription}</p>
      {feature.description.length > descriptionLength && (
        <button
          className="text-primary font-semibold text-sm focus:outline-none"
          onClick={toggleExpand}
        >
          {isExpanded ? "See Less" : "See More"}
        </button>
      )}
    </div>
  );
}
