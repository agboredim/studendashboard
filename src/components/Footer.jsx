import { Mail, Phone, MessageSquare, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { FaXTwitter } from "react-icons/fa6";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

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
              Specializing in high-impact training for AML/KYC Compliance,
              Business Analysis, Project Management, Data Analytics, and
              Cybersecurity professionals.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                <a
                  href="mailto:support@titanscareers.com"
                  className="text-blue-100 hover:underline"
                >
                  support@titanscareers.com
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
                Mon-Fri: 9AM - 5PM
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
                <Link
                  to="/refund-policy"
                  className="text-blue-100 hover:underline"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-primary text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Titans Careers. All rights
            reserved.
          </div>

          <div className="flex space-x-6">
            <a
              href="https://www.facebook.com/profile.php?id=61573103226117"
              className="text-primary hover:text-secondary"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="w-5 h-5" />
            </a>
            <a
              href="https://www.tiktok.com/@titans.careers"
              className="text-primary hover:text-secondary"
              aria-label="TikTok"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTiktok className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/titans.careers/"
              className="text-primary hover:text-secondary"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/aml-pro-trainer-22ab41347/"
              className="text-primary hover:text-secondary"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
            <a
              href="https://x.com/TitansCareers"
              className="text-primary hover:text-secondary"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaXTwitter className="w-5 h-5" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCNUE2QZemJ4vlsvirzJ71kw"
              className="text-primary hover:text-secondary"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
