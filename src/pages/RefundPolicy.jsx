import {
  FileText,
  Clock,
  Shield,
  AlertCircle,
  Mail,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function RefundPolicy() {
  return (
    <div className="bg-background py-12 px-6 md:px-12 lg:px-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Titans Careers Refund Policy
          </h1>
          <p className="text-muted-foreground">Effective Date: May 1, 2025</p>
        </div>

        {/* Introduction */}
        <div className="bg-card p-6 rounded-lg border border-border mb-8">
          <p className="text-muted-foreground">
            At Titans Careers, we are committed to delivering high-quality
            training to help individuals build rewarding careers. This policy
            outlines your rights and our obligations under UK law regarding
            refunds for our courses and subscriptions.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8">
          {/* Cancellation Rights */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 text-primary mr-3" />
              <h2 className="text-xl font-bold">1. Your Right to Cancel</h2>
            </div>
            <ul className="space-y-3 text-muted-foreground pl-8">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>14-day cooling-off period from date of purchase</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Right may be waived if you begin accessing digital content
                </span>
              </li>
            </ul>
          </div>

          {/* Digital Courses */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center mb-4">
              <FileText className="h-5 w-5 text-primary mr-3" />
              <h2 className="text-xl font-bold">2. Digital Course Refunds</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <h3 className="font-medium text-green-800">Eligible When:</h3>
                </div>
                <ul className="space-y-2 text-sm text-green-700 pl-6">
                  <li>Requested within 14 days</li>
                  <li>Less than 20% content accessed</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <X className="h-4 w-4 text-red-600 mr-2" />
                  <h3 className="font-medium text-red-800">
                    Not Eligible When:
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-red-700 pl-6">
                  <li>More than 20% content accessed</li>
                  <li>After 14 days from purchase</li>
                  <li>Certificate issued</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Subscriptions */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 text-primary mr-3" />
              <h2 className="text-xl font-bold">
                3. Subscription Cancellations
              </h2>
            </div>
            <ul className="space-y-3 text-muted-foreground pl-8">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Cancel anytime, but no pro-rata refunds for unused time
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Access continues until end of billing cycle</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Cancel at least 24 hours before renewal to avoid charges
                </span>
              </li>
            </ul>
          </div>

          {/* Exceptions */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 text-primary mr-3" />
              <h2 className="text-xl font-bold">
                4. Exceptional Circumstances
              </h2>
            </div>
            <p className="text-muted-foreground mb-4">
              We may consider refunds for verified:
            </p>
            <ul className="space-y-3 text-muted-foreground pl-8">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Medical emergencies</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Technical failures not caused by user</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Bereavement or force majeure</span>
              </li>
            </ul>
            <p className="text-muted-foreground mt-4 text-sm">
              Supporting documentation may be required.
            </p>
          </div>

          {/* How to Request */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center mb-4">
              <Mail className="h-5 w-5 text-primary mr-3" />
              <h2 className="text-xl font-bold">5. Requesting a Refund</h2>
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Email{" "}
                <span className="text-primary">support@titanscareers.com</span>{" "}
                with:
              </p>
              <ul className="space-y-3 text-muted-foreground pl-8">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Full name and email used during purchase</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Course/subscription title</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Reason for request</span>
                </li>
              </ul>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  Response within 3 working days | Refunds processed in 7-10
                  business days
                </p>
              </div>
            </div>
          </div>

          {/* Dispute Resolution */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-5 w-5 text-primary mr-3" />
              <h2 className="text-xl font-bold">6. Dispute Resolution</h2>
            </div>
            <ul className="space-y-3 text-muted-foreground pl-8">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Initial attempt to resolve amicably</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Alternative Dispute Resolution (ADR) available</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Online Dispute Resolution platform:{" "}
                  <a
                    href="https://ec.europa.eu/consumers/odr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    ODR platform
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Final Note */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mt-12">
          <h3 className="font-bold text-blue-800 mb-2">Important Note</h3>
          <p className="text-blue-700">
            This policy does not affect your statutory rights under UK consumer
            law. Titans Careers reserves the right to amend this policy with
            changes published on our website.
          </p>
        </div>

        {/* Contact Button */}
        <div className="text-center mt-12">
          <Button className="bg-primary hover:bg-primary/90 px-8 py-6 rounded-full text-lg">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
