import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useState } from "react";

export function PlatformFeatures() {
  const [openIndex, setOpenIndex] = useState(null);
  const features = [
    {
      title: "Expert-Led Training",
      description:
        "At Titans Careers, every course is led by professionals who’ve worked—and excelled— in the industries they now teach. Our trainers aren’t just instructors; they’re active experts with years of hands-on experience managing real business challenges. They bring more than knowledge—they bring perspective, mentorship, and insight. You’ll gain exposure to best practices, tools used in the field, and industry expectations, all shared through engaging, interactive sessions. With expert-led instruction, you’ll learn exactly what’s needed to succeed in today’s job market—delivered in a way that’s practical, accessible, and immediately applicable to your career goals.",
      link: "/expert-training",
    },
    {
      title: "Real-World Experience",
      description:
        "We don’t just teach concepts—we train you to apply them. Our programs are designed to mirror the real-world challenges you’ll face in the workplace. Through simulations, live case studies, practical exercises, and hands-on assignments, you’ll gain experience solving business problems as if you were already on the job. You’ll work with real tools, make real decisions, and build confidence through action. By the time you complete your course, you’ll have a portfolio of work, a practical skillset, and the confidence to step into your next role prepared, proven, and ready to contribute from day one",
      link: "/real-world-training",
    },
    {
      title: "Comprehensive Mentorship",
      description:
        "At Titans Careers, mentorship isn’t an add-on—it’s built into every step of your journey. Our learners receive ongoing support from industry professionals who serve as both guides and motivators. Whether you’re navigating a diƯicult concept, building a portfolio, or preparing for interviews, your mentor is just a message away. They’ll provide personalized feedback, help you align your goals with career paths, and keep you accountable. This isn’t passive learning—it’s an interactive, empowering experience. With a dedicated mentor in your corner, you’ll never feel stuck or lost—you’ll feel seen, supported, and set up for success. There will be 12 months support for all candidates.",
      link: "/mentorship",
    },
    {
      title: "Industry Networking Skills",
      description:
        "Technical skills get your foot in the door—but networking opens it wider. That’s why we help you develop powerful, practical networking skills that elevate your visibility and professional presence. Learn how to build meaningful connections, grow your LinkedIn network, engage confidently at industry events, and present yourself with purpose. We’ll show you how to approach professionals, maintain connections, and make lasting impressions. Whether you're starting out or pivoting careers, mastering the art of networking will connect you with mentors, recruiters, and peers—expanding your opportunities and keeping you top-of-mind in a competitive job market.",
      link: "/networking",
    },
    {
      title: "Interview Preparation",
      description:
        "An interview is your moment to shine—and we’ll make sure you’re ready. Our interview preparation training helps you master the art of communication, strategy, and confidence. You’ll participate in mock interviews tailored to your desired industry, get feedback on your performance, and learn how to answer even the toughest questions with clarity and purpose. We cover everything from posture and tone to storytelling and situational responses. You’ll also learn how to navigate technical, behavioural, and panel interviews with ease. With Titans Careers, you walk into your next interview not just prepared—but prepared to win. There will be 12 months support for all candidates",
      link: "/regulatory-updates",
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
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-2"
            >
              <h3 className="text-xl font-semibold mb-3 text-navy-800">
                {feature.title}
              </h3>

              <Collapsible.Root
                open={openIndex === index}
                onOpenChange={(open) => setOpenIndex(open ? index : null)}
              >
                <Collapsible.Content
                  className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp"
                  style={{ "--base-height": "6rem" }} // Adjust based on your line height
                >
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                </Collapsible.Content>

                <Collapsible.Trigger asChild>
                  <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 w-full justify-end mt-2">
                    {openIndex === index ? "See less" : "See more"}
                    <svg
                      className={`transform transition-transform ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                    >
                      <path
                        d="M4 6L7.5 9.5L11 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>
                </Collapsible.Trigger>
              </Collapsible.Root>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
