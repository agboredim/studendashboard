import {
  Award,
  Rocket,
  Briefcase,
  Shield,
  Users,
  Target,
  Book,
  Star,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function AboutPage() {
  // Core Values (from about.png)
  const coreValues = [
    {
      icon: <Award className="h-6 w-6" />,
      title: "Excellence",
      description:
        "We maintain the highest standards across our training programs, ensuring that every student receives the skills and knowledge demanded by modern industries.",
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "Empowerment",
      description:
        "We believe every student has the potential to succeed. Our training is designed to equip individuals with real-world skills, confidence, and clarity to pursue their professional goals.",
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Practicality",
      description:
        "Our curriculum is shaped by industry realities. We simulate the tasks, challenges, and projects our students will face in actual roles — ensuring true job readiness.",
    },
  ];

  // Additional Values (from about2.png)
  const additionalValues = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Integrity",
      description:
        "Honesty, professionalism, and ethical practice underpin everything we do, from course development to student support.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Inclusivity",
      description:
        "We celebrate diversity and inclusiveness, providing opportunities for learners from all backgrounds to access career-changing education.",
    },
  ];

  // Why Choose Us (from about2.png)
  const whyChooseUs = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Career-Focused Learning",
      description:
        "Our programs are designed with the end goal in mind: employability. Every module, assignment, and project is crafted to make our students stand out in the job market.",
    },
    {
      icon: <Book className="h-6 w-6" />,
      title: "Industry-Driven Curriculum",
      description:
        "We stay ahead of evolving trends, regulatory changes, and employer expectations to ensure our students are always industry-ready.",
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "End-to-End Career Support",
      description:
        "From CV enhancement to interview preparation and sponsorship guidance, we offer a comprehensive career journey — not just training.",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Flexible and Accessible",
      description:
        "Our courses are delivered through flexible, modern platforms, with affordable pricing and payment plans that make excellence accessible.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Global Community",
      description:
        "Titans Careers students come from across the UK and internationally, forming a vibrant professional network that opens new doors and new opportunities.",
    },
  ];

  return (
    <section className="bg-white">
      {/* Hero Section */}
      <div className="py-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto text-center">
          {/* Heading using primary color */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
            ABOUT US
          </h1>
          {/* Subheading using primary/90 color */}
          <h2 className="text-2xl md:text-3xl font-semibold text-primary/90 mb-6">
            Building Careers. Empowering Futures.
          </h2>
          {/* Paragraph using foreground color */}
          <p className="text-lg text-foreground max-w-4xl mx-auto">
            At <strong>Titans Careers</strong>, we believe education should go
            beyond theory — it should open doors, transform lives, and equip
            individuals with the skills to lead in the real world. We specialize
            in delivering high-impact training in{" "}
            <strong>
              Compliance, Financial Crime Prevention, Data Analytics, Business
              Analysis
            </strong>
            , and <strong>Cybersecurity</strong>, preparing our students to
            excel in today's competitive job market.
          </p>
        </div>
      </div>

      {/* Mission & Vision Section */}
      {/* Background color primary/5 */}
      <div className="py-12 px-6 md:px-12 lg:px-16 bg-primary/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Card background white, shadow remains */}
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              {/* Icon color primary/90 */}
              <Target className="h-8 w-8 text-primary/90 mr-4" />
              {/* Heading using primary color */}
              <h3 className="text-2xl font-bold text-primary">Our Mission</h3>
            </div>
            {/* Paragraph using foreground color */}
            <p className="text-foreground">
              To bridge the gap between ambition and achievement by providing
              practical, career-focused training that empowers students to
              launch, transition, and elevate their careers in Compliance and
              Information Technology industries.
            </p>
          </div>

          {/* Card background white, shadow remains */}
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              {/* Icon color primary/90 */}
              <Target className="h-8 w-8 text-primary/90 mr-4" />
              {/* Heading using primary color */}
              <h3 className="text-2xl font-bold text-primary">Our Vision</h3>
            </div>
            {/* Paragraph using foreground color */}
            <p className="text-foreground">
              To be recognized as a global leader in professional training —
              renowned for transforming talent into industry-ready professionals
              through hands-on education, expert guidance, and unwavering career
              support.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          {/* Heading using primary color */}
          <h3 className="text-3xl font-bold text-center text-primary mb-12">
            What We Stand For
          </h3>

          {/* Core Values */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-all"
              >
                {/* Icon background primary/10 */}
                <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  {/* Icon color inherits from parent text color or is default */}
                  {value.icon}
                </div>
                {/* Title using primary/90 color */}
                <h4 className="text-xl font-semibold text-primary/90 mb-2">
                  {value.title}
                </h4>
                {/* Description using foreground/80 color */}
                <p className="text-foreground/80">{value.description}</p>
              </div>
            ))}
          </div>

          {/* Additional Values */}
          <div className="grid md:grid-cols-2 gap-6">
            {additionalValues.map((value, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex items-center mb-4">
                  {/* Icon background primary/10 */}
                  <div className="bg-primary/10 p-2 rounded-full mr-4">
                    {/* Icon color inherits from parent text color or is default */}
                    {value.icon}
                  </div>
                  {/* Title using primary/90 color */}
                  <h4 className="text-xl font-semibold text-primary/90">
                    {value.title}
                  </h4>
                </div>
                {/* Description using foreground/80 color */}
                <p className="text-foreground/80">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Titans Careers Section */}
      {/* Background color primary/5 */}
      <div className="py-16 px-6 md:px-12 lg:px-16 bg-primary/5">
        <div className="max-w-6xl mx-auto">
          {/* Heading using primary color */}
          <h3 className="text-3xl font-bold text-center text-primary mb-12">
            Why Titans Careers?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex items-center mb-4">
                  {/* Icon background primary/10 */}
                  <div className="bg-primary/10 p-2 rounded-full mr-4">
                    {/* Icon color inherits from parent text color or is default */}
                    {item.icon}
                  </div>
                  {/* Title using primary/90 color */}
                  <h4 className="text-xl font-semibold text-primary/90">
                    {item.title}
                  </h4>
                </div>
                {/* Description using foreground color */}
                <p className="text-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Blockquote using foreground color */}
          <div className="text-center mb-12">
            <p className="text-xl italic text-foreground max-w-3xl mx-auto">
              "At Titans Careers, we don't just teach — we empower. We don't
              just certify — we transform. Your future begins here."
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Heading using primary color */}
          <h3 className="text-2xl md:text-3xl font-bold text-primary mb-6">
            Your Career Transformation Starts Today
          </h3>
          {/* Paragraph using foreground color */}
          <p className="text-lg text-foreground mb-8">
            Whether you're starting a new career journey, transitioning into a
            new industry, or seeking to upskill for greater opportunities,
            Titans Careers is your trusted partner. We're here to guide you,
            challenge you, and celebrate your success.
          </p>
          <Button className="bg-primary hover:bg-primary/90 px-8 py-6 rounded-full text-lg text-white">
            <Link to="/courses">Start Your Journey Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
export default AboutPage;
