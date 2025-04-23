import {
  Check,
  GraduationCap,
  Briefcase,
  Users,
  Award,
  HeartHandshake,
  Linkedin,
  Instagram,
  Facebook,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function WhyChooseUs() {
  const features = [
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: "Industry-Relevant Training",
      description:
        "Our programs are built in collaboration with seasoned professionals who understand the real-world demands of Compliance and IT Industries. You'll gain the knowledge and hands-on experience employers seek.",
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Practical, Job-Focused Learning",
      description:
        "We don't just teach theory—we simulate real-world projects and scenarios. From AML/KYC case studies to Data Analysis projects, you'll be trained to think, act, and deliver like a professional from day one.",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Expert-Led Masterclasses",
      description:
        "Learn directly from experienced Compliance officers, IT consultants, Data Analysts, Business Analysts, and Project Managers who have walked the path you aspire to take.",
    },
    {
      icon: <HeartHandshake className="h-8 w-8" />,
      title: "Career Support & Mentorship",
      description:
        "Get personalized career coaching: CV support, interview preparation, and ongoing mentorship to help you secure the right job opportunities and grow your career.",
    },
    {
      icon: <Check className="h-8 w-8" />,
      title: "Affordable and Accessible",
      description:
        "Our mission is to make high-quality training affordable without compromising on excellence. Flexible payment plans are available.",
    },
  ];

  const audience = [
    "Recent graduates seeking a career in Compliance or IT",
    "Professionals looking to upskill or transition to better opportunities",
    "International professionals, especially from African and Caribbean backgrounds, aiming to establish strong careers in the UK",
    "Individuals aspiring to roles that attract sponsorships and career growth",
  ];

  const socialLinks = [
    { icon: <Linkedin className="h-5 w-5" />, name: "LinkedIn" },
    { icon: <Instagram className="h-5 w-5" />, name: "Instagram" },
    { icon: <Facebook className="h-5 w-5" />, name: "Facebook" },
  ];

  return (
    <section className="py-16 px-6 md:px-12 lg:px-16 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-950 mb-4">
            Why Choose Titans Careers?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            At Titans Careers, we nurture diversity, ambition, and potential to
            build successful careers.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-blue-950">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Who We Serve Section */}
        <div className="bg-blue-50 rounded-xl p-8 md:p-12 mb-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-blue-950 mb-6 text-center">
              Who We Serve
            </h3>
            <ul className="space-y-4 mb-8">
              {audience.map((item, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-center text-gray-600 mb-8 italic">
              "At Titans Careers, diversity, ambition, and potential are
              celebrated and cultivated."
            </p>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-blue-950 mb-6 text-center">
            Join Our Community
          </h3>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Follow us on social media
          </h3>
          <div className="flex justify-center gap-6 mb-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href="#"
                className="text-blue-950 hover:text-blue-700 transition-colors"
                aria-label={`Follow us on ${social.name}`}
              >
                {social.icon}
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Stay updated with new course offerings, success stories, webinars,
            and career tips!
          </p>
          <p className="text-lg font-bold text-blue-950">
            Titans Careers - Where Ambitions Meet Opportunities.
          </p>
        </div>
      </div>
    </section>
  );
}
