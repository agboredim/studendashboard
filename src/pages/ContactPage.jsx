import {
  Mail,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  Users,
  Briefcase,
  FileText,
  UserCheck,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FAQSection } from "@/components/FAQSection";

export function ContactPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="py-16 px-6 md:px-12 lg:px-16 bg-blue-50">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Contact Titans Careers: We're Here to Help
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Have questions or ideas? Reach out today and discover how our team
            can support your career journey.
          </p>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="py-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Multiple Ways to Connect
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <Mail className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-semibold text-primary">Email Us</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Send your questions to our support team
              </p>
              <a
                href="mailto:info@titanscareers.com"
                className="text-foreground hover:underline"
              >
                info@titanscareers.com
              </a>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <Phone className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-semibold text-primary">Call Us</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Speak directly with our career advisors
              </p>
              <a
                href="tel:+442045720475"
                className="text-foreground hover:underline"
              >
                +44 20 4572 0475
              </a>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-semibold text-primary">WhatsApp</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Message us anytime for quick support
              </p>
              <a
                href="https://wa.me/07539434403"
                className="text-foreground hover:underline"
              >
                +44 7539 434403
              </a>
            </div>
          </div>

          {/* Office Location */}
          <div className="bg-blue-50 rounded-xl p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              Visit Our London Office
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="flex items-start mb-6">
                  <MapPin className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Address</h3>
                    <p className="text-gray-700">
                      3rd Floor
                      <br />
                      45 Albemarle Street
                      <br />
                      Mayfair, London
                      <br />
                      W1S 4JL
                    </p>
                  </div>
                </div>

                <div className="flex items-start mb-6">
                  <Clock className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Office Hours</h3>
                    <p className="text-gray-700">
                      Monday - Friday
                      <br />
                      9:00 AM - 5:00 PM
                      <br />
                      Weekends by appointment
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Nearby Transport
                    </h3>
                    <p className="text-gray-700">
                      Green Park Station - 5 min walk
                      <br />
                      Bus Routes: 8, 9, 14, 19, 22, 38
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg overflow-hidden h-96">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-0.1475%2C51.5075%2C-0.1425%2C51.5100&layer=mapnik&marker=51.5088,-0.1450"
                  className="border-0"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Process Timeline */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              What to Expect When You Contact Us
            </h2>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  title: "Initial Contact",
                  description: "We'll respond within 24 hours",
                },
                {
                  title: "Consultation",
                  description: "Personalized discussion about your needs",
                },
                {
                  title: "Customized Plan",
                  description: "Tailored strategies for your goals",
                },
                {
                  title: "Ongoing Support",
                  description: "Continuous guidance on your journey",
                },
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-foreground font-bold text-xl">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="bg-blue-50 rounded-xl p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              Our Team Is Ready to Help With...
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Briefcase className="h-6 w-6 text-primary" />,
                  title: "Career Transitions",
                  description:
                    "Expert guidance for changing industries or roles",
                },
                {
                  icon: <UserCheck className="h-6 w-6 text-primary" />,
                  title: "Interview Preparation",
                  description: "Personalized coaching to help you shine",
                },
                {
                  icon: <FileText className="h-6 w-6 text-primary" />,
                  title: "CV Optimization",
                  description:
                    "Professional review and enhancement of your resume",
                },
                {
                  icon: <Search className="h-6 w-6 text-primary" />,
                  title: "Job Search Strategy",
                  description:
                    "Targeted approaches to find your ideal position",
                },
              ].map((service, index) => (
                <div key={index} className="bg-white p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{service.title}</h3>
                  </div>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          {/* <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div> */}
          <FAQSection />

          {/* Final CTA */}
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Whether you're starting fresh, transitioning careers, or aiming
              higher in your current field - we're here to help you succeed.
            </p>
            <Button className="bg-primary hover:bg-primary/90 px-8 py-6 rounded-full text-lg">
              <Link to="/courses">Explore Our Courses</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
