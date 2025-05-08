import {
  Users,
  TrendingUp,
  Handshake,
  GraduationCap,
  Briefcase,
  BookOpen,
  Globe,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function PartnerWithUs() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="py-20 px-6 md:px-12 lg:px-16 bg-primary/10 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Let's Build the Future of Work—Together
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Partner with us to empower the next generation of professionals and
            shape future-ready careers.
          </p>
          <Button className="bg-primary hover:bg-primary/90 px-8 py-6 rounded-full text-lg">
            Start Partnering
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Join our network of 10,000+ digital professionals and organizations
          </p>
        </div>
      </div>

      {/* Partnership Opportunities */}
      <div className="py-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Partnership Opportunities
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <GraduationCap className="h-8 w-8" />,
                title: "Training Providers",
                benefits: [
                  "Expand your reach to motivated learners",
                  "Validate curriculum with market insights",
                  "Build relationships with hiring organizations",
                ],
                color: "bg-blue-100 text-blue-800",
              },
              {
                icon: <Briefcase className="h-8 w-8" />,
                title: "Hiring Organizations",
                benefits: [
                  "Access vetted, job-ready talent",
                  "Reduce hiring costs and streamline recruitment",
                  "Build diverse teams with fresh perspectives",
                ],
                color: "bg-purple-100 text-purple-800",
              },
              {
                icon: <BookOpen className="h-8 w-8" />,
                title: "Educational Institutions",
                benefits: [
                  "Bridge the education-career gap",
                  "Future-proof your academic programs",
                  "Enhance graduate employment outcomes",
                ],
                color: "bg-green-100 text-green-800",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-xl border border-border hover:shadow-md transition-all"
              >
                <div
                  className={`${item.color} w-14 h-14 rounded-full flex items-center justify-center mb-6`}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {item.title}
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  {item.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Approach */}
      <div className="py-16 px-6 md:px-12 lg:px-16 bg-primary/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Our Collaborative Approach
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Handshake className="h-6 w-6" />,
                title: "Co-Create Solutions",
                description:
                  "Develop customized programs that address specific talent challenges",
              },
              {
                icon: <TrendingUp className="h-6 w-6" />,
                title: "Refine Together",
                description:
                  "Continuously improve based on real-world results and feedback",
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Build Connections",
                description:
                  "Facilitate meaningful relationships across our partner ecosystem",
              },
              {
                icon: <MessageSquare className="h-6 w-6" />,
                title: "Measure Impact",
                description:
                  "Track outcomes with our advanced analytics platform",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-lg border border-border"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 p-2 rounded-full mr-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community Benefits */}
      <div className="py-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Join Our Thriving Community
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-xl border border-border">
              <h3 className="text-xl font-bold text-foreground mb-6">
                Daily Professional Growth
              </h3>
              <div className="space-y-6">
                {[
                  {
                    icon: <MessageSquare className="h-5 w-5" />,
                    platform: "LinkedIn",
                    tip: "Engage with thought leaders' posts and share achievements weekly",
                  },
                  {
                    icon: <Globe className="h-5 w-5" />,
                    platform: "Instagram",
                    tip: "Follow daily career graphics and 60-second skill tutorials",
                  },
                  {
                    icon: <Users className="h-5 w-5" />,
                    platform: "Facebook",
                    tip: "Join private groups and weekly live Q&A sessions with mentors",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{item.platform}</h4>
                      <p className="text-muted-foreground text-sm">
                        {item.tip}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card p-8 rounded-xl border border-border">
              <h3 className="text-xl font-bold text-foreground mb-6">
                Success Pathways
              </h3>
              <div className="space-y-6">
                {[
                  "12-week masterclass series with Fortune 500 CEOs",
                  "Monthly virtual roundtables with industry peers",
                  "Proven 5-step career advancement framework",
                  "Opportunities to contribute to our 50,000+ reader blog",
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <p className="text-muted-foreground text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partnership Process */}
      <div className="py-16 px-6 md:px-12 lg:px-16 bg-primary/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Simple Partnership Process
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: <MessageSquare className="h-8 w-8 mx-auto" />,
                step: "1",
                title: "Initial Consultation",
                description:
                  "We'll discuss your goals and how we can support them",
              },
              {
                icon: <Handshake className="h-8 w-8 mx-auto" />,
                step: "2",
                title: "Custom Plan",
                description:
                  "Together we'll create a tailored partnership strategy",
              },
              {
                icon: <TrendingUp className="h-8 w-8 mx-auto" />,
                step: "3",
                title: "Implementation",
                description: "Seamless onboarding with guidance from our team",
              },
            ].map((item, index) => (
              <div key={index} className="bg-card p-6 rounded-xl">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-2xl font-bold text-primary mb-2">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Partnership FAQs
          </h2>

          <div className="space-y-6">
            {[
              {
                question: "What types of organizations can partner with us?",
                answer:
                  "We partner with training providers, hiring organizations, educational institutions, and industry associations of all sizes.",
              },
              {
                question: "What are the costs associated with partnership?",
                answer:
                  "Partnership models vary based on organization type and needs. We offer flexible arrangements designed for mutual benefit.",
              },
              {
                question: "How quickly can we implement a partnership?",
                answer:
                  "Most partnerships launch within 4-6 weeks after initial consultation, with some quick-start options available.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-lg border border-border"
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {item.question}
                </h3>
                <p className="text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-6 md:px-12 lg:px-16 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Careers Together?
          </h2>
          <p className="text-xl mb-8">
            Join our network of forward-thinking organizations and professionals
            committed to building the future of work.
          </p>
          <Button
            as={Link}
            to="/courses"
            className="bg-secondary text-secondary-foreground hover:bg-foreground hover:text-secondary ease-in px-8 py-6 rounded-full text-lg"
          >
            Start Your Partnership Journey
          </Button>
        </div>
      </div>
    </div>
  );
}
