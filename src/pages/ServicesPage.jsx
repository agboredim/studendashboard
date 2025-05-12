import {
  BookOpen,
  BarChart2,
  Shield,
  Users,
  TrendingUp,
  Briefcase,
  Database,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function ServicesPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="py-20 px-6 md:px-12 lg:px-16 bg-primary/10 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Powering Career Growth for Individuals. Building Capabilities for
            Teams.
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Practical, expert-led masterclasses that equip professionals with
            the in-demand skills needed to thrive in today's competitive
            marketplace.
          </p>
          <Button className="bg-primary hover:bg-primary/90 px-8 py-6 rounded-full text-lg">
            <Link to="/courses">Explore Our Programs</Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            75% success rate with professionals advancing their careers within 6
            months
          </p>
        </div>
      </div>

      {/* Masterclasses Section */}
      <div className="py-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Expert-Led Masterclasses
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FileText className="h-8 w-8" />,
                title: "Business Analysis",
                description:
                  "Master requirements gathering, process modeling, stakeholder management, and solution validation.",
                color: "bg-blue-100 text-blue-800",
              },
              {
                icon: <Briefcase className="h-8 w-8" />,
                title: "Project Management",
                description:
                  "Excel in project initiation, delivery, execution control, and team leadership methodologies.",
                color: "bg-purple-100 text-purple-800",
              },
              {
                icon: <Database className="h-8 w-8" />,
                title: "Data Analysis",
                description:
                  "Transform raw data into strategic insights with advanced visualization and processing skills.",
                color: "bg-green-100 text-green-800",
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Cybersecurity",
                description:
                  "Develop expertise in threat detection, security architecture, compliance, and ethical hacking.",
                color: "bg-red-100 text-red-800",
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
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specialized Training */}
      <div className="py-16 px-6 md:px-12 lg:px-16 bg-primary/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Specialized Training Programs
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <BarChart2 className="h-8 w-8" />,
                title: "AML/KYC Compliance",
                description:
                  "Master regulatory frameworks, customer due diligence, transaction monitoring, and compliance management.",
                color: "bg-orange-100 text-orange-800",
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Corporate Training",
                description:
                  "Custom programs, team onboarding, workforce upskilling, and skills certification tailored to your organization.",
                color: "bg-indigo-100 text-indigo-800",
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
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Metrics */}
      <div className="py-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Proven Results
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: <TrendingUp className="h-8 w-8 mx-auto" />,
                value: "75%",
                label: "Success Rate",
                description:
                  "Participants advance their careers within 6 months",
              },
              {
                icon: <Users className="h-8 w-8 mx-auto" />,
                value: "100%",
                label: "Corporate Trust",
                description:
                  "Organizations trust us to develop their workforce",
              },
              {
                icon: <Briefcase className="h-8 w-8 mx-auto" />,
                value: "97%",
                label: "Career Enhancement",
                description:
                  "Professionals enhance their skills through our programs",
              },
            ].map((stat, index) => (
              <div key={index} className="bg-card p-6 rounded-xl">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <h3 className="text-xl font-semibold mb-2">{stat.label}</h3>
                <p className="text-muted-foreground">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-6 md:px-12 lg:px-16 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Your Trusted Learning Partner
          </h2>
          <p className="text-xl mb-8">
            Whether you're an individual seeking career advancement or an
            organization building capabilities across teams, we deliver
            practical, expert-led training that produces measurable results.
          </p>
          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 rounded-full text-lg">
            <Link to="/courses">Get Started Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
