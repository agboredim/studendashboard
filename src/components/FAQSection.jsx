import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

export function FAQSection() {
  const faqCategories = [
    {
      title: "Courses & Curriculum",
      items: [
        {
          question: "What courses does Titans Careers offer?",
          answer:
            "Titans Careers offers courses in AML/KYC Compliance, Cybersecurity, Data Analytics, and Business Analysis/Project Management.",
        },
        {
          question: "Are your courses suitable for beginners?",
          answer:
            "Yes, our courses are designed for all levels. Each course includes foundational content for beginners and advanced modules for professionals.",
        },
        {
          question: "How long does each course take to complete?",
          answer:
            "Each course is self-paced but typically takes 4 to 12 weeks, depending on the learner's schedule and chosen intensity.",
        },
        {
          question: "What materials are provided with each course?",
          answer:
            "You get access to video lessons, downloadable resources, case studies, assessments, and mentor support.",
        },
      ],
    },
    {
      title: "Career Support & Outcomes",
      items: [
        {
          question: "Do you help with CV writing and job applications?",
          answer:
            "Yes, we provide tailored CV reviews, LinkedIn optimization, and job application guidance as part of our career support.",
        },
        {
          question: "Is interview preparation included in the package?",
          answer:
            "Absolutely. We offer mock interviews, coaching sessions, and industry-specific interview tips.",
        },
        {
          question: "Will I receive a certificate upon completion?",
          answer:
            "Yes, a digital certificate is issued upon successful completion of each course, which can be shared on LinkedIn or added to your CV.",
        },
        {
          question: "Can Titans Careers help me transition careers?",
          answer:
            "Yes. Many of our learners come from non-technical backgrounds and successfully transition into new roles using our structured learning paths.",
        },
        {
          question: "How long does career support last?",
          answer:
            "Our support continues for 12 months after your course starts, ensuring you have guidance even after landing your first role.",
        },
      ],
    },
    {
      title: "Platform & Access",
      items: [
        {
          question: "How do I access the courses?",
          answer:
            "Courses are accessed through our online learning portal, available 24/7 from any device with internet access.",
        },
        {
          question: "Can I download course materials?",
          answer:
            "Yes, most materials are downloadable, although some interactive elements are available only through the platform.",
        },
        {
          question: "Do I need any special software?",
          answer:
            "No special software is required. All you need is a web browser and internet connection.",
        },
        {
          question: "Is there a mobile app?",
          answer: "A mobile-friendly version of the site is available.",
        },
        {
          question: "Can I pause or defer my course?",
          answer:
            "Yes, we offer flexible scheduling and you can pause or defer access within your 12-month enrollment period.",
        },
      ],
    },
    {
      title: "Pricing & Payment",
      items: [
        {
          question: "What does a course cost?",
          answer:
            "Prices vary per course, starting from £500. We also offer bundle deals and installment options.",
        },
        {
          question: "Do you offer discounts or scholarships?",
          answer:
            "Yes, we periodically offer discounts, early-bird pricing, and scholarships for eligible learners.",
        },
        {
          question: "Are there any hidden fees?",
          answer:
            "No, the course price includes access to all materials, mentorship, and career support. There are no hidden costs.",
        },
        {
          question: "Do you offer refunds?",
          answer:
            "Yes, we have a transparent refund policy. You can request a refund within 7 days if you haven't accessed over 20% of the course.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept credit/debit cards, PayPal, and selected international payment gateways.",
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 md:px-12 lg:px-16">
      <h2 className="text-3xl font-bold text-center mb-12">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqCategories.map((category, categoryIndex) => (
          <Collapsible
            key={categoryIndex}
            className="bg-card rounded-lg border border-border"
          >
            <CollapsibleTrigger className="w-full flex justify-between items-center p-6 hover:bg-muted/50 transition-colors">
              <h3 className="text-xl font-semibold text-left">
                {category.title}
              </h3>
              <ChevronDown className="h-5 w-5 transition-transform duration-200 [&[data-state=open]]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 pb-6">
              <div className="space-y-6">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="border-b border-border/50 pb-6 last:border-0 last:pb-0"
                  >
                    <h4 className="font-medium text-lg mb-2">
                      {item.question}
                    </h4>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
