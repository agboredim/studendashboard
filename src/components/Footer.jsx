import { Mail, Phone, MessageSquare, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-foreground text-white pt-12 pb-8 px-6 md:px-12 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Titans Careers</h3>
            <p className="text-blue-100 mb-4">
              Building Careers. Empowering Futures.
            </p>
            <p className="text-blue-100">
              Specializing in high-impact training for Compliance, Financial
              Crime Prevention, Data Analytics, and Cybersecurity professionals.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                <a
                  href="mailto:info@titanscareers.com"
                  className="text-blue-100 hover:underline"
                >
                  info@titanscareers.com
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                <a
                  href="tel:+442045720475"
                  className="text-blue-100 hover:underline"
                >
                  +44 20 4572 0475
                </a>
              </li>
              <li className="flex items-start">
                <MessageSquare className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                <a
                  href="https://wa.me/07539434403"
                  className="text-blue-100 hover:underline"
                >
                  WhatsApp: +44 7539 434403
                </a>
              </li>
            </ul>
          </div>

          {/* Office Location */}
          <div>
            <h3 className="text-xl font-bold mb-4">Our Office</h3>
            <div className="flex items-start mb-3">
              <MapPin className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
              <address className="text-blue-100 not-italic">
                3rd Floor
                <br />
                45 Albemarle Street
                <br />
                Mayfair, London
                <br />
                W1S 4JL
              </address>
            </div>
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
              <div className="text-blue-100">
                Mon-Fri: 9AM - 6PM
                <br />
                Weekends by appointment
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/courses" className="text-blue-100 hover:underline">
                  Our Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-blue-100 hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-blue-100 hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-blue-100 hover:underline">
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/career-support"
                  className="text-blue-100 hover:underline"
                >
                  Career Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-800 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-primary text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Titans Careers. All rights
            reserved.
          </div>

          <div className="flex space-x-6">
            <a
              href="#"
              className="text-primary hover:text-white"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-primary hover:text-white"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-primary hover:text-white"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
