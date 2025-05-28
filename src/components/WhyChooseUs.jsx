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
  LifeBuoy,
  BookOpen,
  ArrowUpRight,
  Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export function WhyChooseUs() {
  const features = [
    {
      icon: <GraduationCap className="h-8 w-8 text-primary " />,
      title: "Industry-Relevant Training",
      description:
        "Our programs are built in collaboration with seasoned professionals who understand the real-world demands of Compliance and IT Industries. You'll gain the knowledge and hands-on experience employers seek.",
    },
    {
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      title: "Practical, Job-Focused Learning",
      description:
        "We don't just teach theory—we simulate real-world projects and scenarios. From AML/KYC case studies to Data Analysis projects, you'll be trained to think, act, and deliver like a professional from day one.",
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Expert-Led Masterclasses",
      description:
        "Learn directly from experienced Compliance officers, IT consultants, Data Analysts, Business Analysts, and Project Managers who have walked the path you aspire to take.",
    },
    {
      icon: <HeartHandshake className="h-8 w-8 text-primary" />,
      title: "Career Support & Mentorship",
      description:
        "Get personalized career coaching: CV support, interview preparation, and ongoing mentorship to help you secure the right job opportunities and grow your career.",
    },
    {
      icon: <LifeBuoy className="h-8 w-8 text-primary" />, // New feature
      title: "12-Month Ongoing Support",
      description:
        "Receive continuous assistance even after course completion with extended mentorship, technical guidance, and career advice to ensure your long-term success in the industry.",
    },
    {
      icon: <Check className="h-8 w-8 text-primary" />,
      title: "Affordable and Accessible",
      description:
        "Our mission is to make high-quality training affordable without compromising on excellence. Flexible payment plans are available.",
    },
  ];

  const audience = [
    "Recent graduates seeking a career in Compliance or IT",
    "Professionals looking to upskill or transition to better opportunities",
    "International professionals, especially global professionals such as legal practitioners, bankers, and care workers.",
  ];

  const socialLinks = [
    {
      icon: <FaLinkedin className="h-5 w-5" />,
      name: "LinkedIn",
      link: "https://www.linkedin.com/in/aml-pro-trainer-22ab41347/",
    },
    {
      icon: <FaInstagram className="h-5 w-5" />,
      name: "Instagram",
      link: "https://www.instagram.com/titans.careers/",
    },
    {
      icon: <FaFacebook className="h-5 w-5" />,
      name: "Facebook",
      link: "https://www.facebook.com/profile.php?id=61573103226117",
    },
    {
      icon: <FaTiktok className="h-5 w-5" />,
      name: "TikTok",
      link: "https://www.tiktok.com/@titans.careers",
    },
    {
      icon: <FaYoutube className="h-5 w-5" />,
      name: "YouTube",
      link: "https://www.youtube.com/channel/UCNUE2QZemJ4vlsvirzJ71kw",
    },
    {
      icon: <FaXTwitter className="h-5 w-5" />,
      name: "Twitter",
      link: "https://x.com/TitansCareers",
    },
  ];

  return (
    <section className="py-16 px-6 md:px-12 lg:px-16 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
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
                <h3 className="text-xl font-semibold text-foreground">
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
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
              Who We Serve
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-center mb-4">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <p className="text-gray-700 text-center">{audience[0]}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-center mb-4">
                  <ArrowUpRight className="h-8 w-8 text-primary" />
                </div>
                <p className="text-gray-700 text-center">{audience[1]}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-center mb-4">
                  <Globe2 className="h-8 w-8 text-primary" />
                </div>
                <p className="text-gray-700 text-center">{audience[2]}</p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-600 italic text-lg">
                "At Titans Careers, diversity, ambition, and potential are
                celebrated and cultivated."
              </p>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
            Join Our Community
          </h3>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Follow us on social media
          </h3>
          <div className="flex justify-center gap-6 mb-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.link}
                className="text-foreground hover:text-primary transition-colors"
                aria-label={`Follow us on ${social.name}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.icon}
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Stay updated with new course offerings, success stories, webinars,
            and career tips!
          </p>
          <p className="text-lg font-bold text-foreground">
            Titans Careers - Where Ambitions Meet Opportunities.
          </p>
        </div>
      </div>
    </section>
  );
}
