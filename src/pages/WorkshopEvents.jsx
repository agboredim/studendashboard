import {
  Calendar,
  Clock,
  User,
  MapPin,
  BookOpen,
  Shield,
  BarChart2,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetAllCoursesQuery } from "@/services/coursesApi";
import AddToCartButton from "@/components/AddToCartButton";

export function WorkshopEvents() {
  const { data: allCourses = [] } = useGetAllCoursesQuery();

  const scrollToWorkshops = () => {
    const element = document.getElementById("upcoming-workshops");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const workshops = [
    {
      id: 1,
      title: "AML/KYC Compliance",
      date: "17 August 2025",
      time: "4:00 PM - 6:00 PM EST",
      description:
        "Master complex regulatory frameworks, implement robust risk assessment methodologies, and harness cutting-edge compliance technologies to protect your organization.",
      highlights: [
        "Expert-led sessions covering core AML/KYC principles and regulations",
        "Hands-on training using simulated KYC onboarding and transaction monitoring tools",
        "Real-world case studies on financial crime investigations and red flags",
        "Practical exercises on Customer Due Diligence (CDD) and Enhanced Due Diligence (EDD)",
        "Step-by-step guidance on sanctions, PEP, and adverse media screening",
        "SAR (Suspicious Activity Report) drafting workshops with feedback",
        "Insights into UK regulatory expectations and global AML frameworks",
        "CV and interview preparation tailored for AML/KYC roles",
        "Downloadable templates, checklists, and compliance documentation samples",
        "Certificate of completion to enhance your professional profile",
      ],
      instructor: {
        name: "LUMI OTOLORIN",
        bio: "Lumi Otolorin is a dual-qualified lawyer and renowned compliance expert with over a decade of experience in anti-money laundering, counter-terrorist financing, and regulatory risk. With multiple advanced degrees and certifications, he is passionate about empowering the next generation of professionals through practical, high-impact compliance training",
      },
      audience: [
        "Aspiring AML Analysts, KYC Officers, or Compliance Associates",
        "Career changers looking to enter the financial crime or compliance sector",
        "Banking, finance, or legal professionals seeking to expand their regulatory knowledge",
        "Recent graduates aiming for entry-level roles in AML/KYC or financial services",
        "Professionals in customer service, operations, or onboarding teams looking to upskill",
        "Anyone interested in understanding how to detect, prevent, and report financial crime",
      ].join("\n"),
      icon: <Shield className="h-6 w-6" />,
    },
    {
      id: 2,
      title: "Business Analysis/Project Management",
      date: "04 October 2025",
      time: "4:00 PM - 6:00 PM EST",
      description:
        "Develop critical skills in requirements gathering, process optimization, and stakeholder management to effectively bridge technical and business objectives.",
      highlights: [
        "Live, instructor-led sessions with real-world case studies",
        "Hands-on training in requirements gathering, stakeholder engagement, and process mapping",
        "Practical exposure to Agile, Scrum, and Waterfall methodologies",
        "Interactive project simulations to apply what you’ve learned",
        "CV and interview prep tailored for Business Analyst and Project Manager roles",
        "Real-time feedback from experienced facilitators",
        "Access to downloadable templates, documentation samples, and planning frameworks",
        "Peer-to-peer collaboration and group projects",
        "Certificate of completion to boost your job readiness",
      ],
      instructor: {
        name: "WUNMI NWOGU",
        bio: "Wunmi Nwogu is a seasoned Business Analyst and Project Manager renowned for delivering complex, cross-industry projects with precision and impact. With a talent for process improvement, stakeholder alignment, and strategic execution, she transforms challenges into clear, actionable outcomes that drive business success.",
      },
      audience: [
        "Aspiring Business Analysts, Project Managers, or Product Owners",
        "Career changers looking to break into business and tech roles",
        "Professionals in admin, operations, customer service, or IT seeking to upskill",
        "Recent graduates aiming to stand out in competitive job markets",
        "Junior analysts, coordinators, or team leads seeking structured training",
        "Anyone looking to understand how to manage projects or improve business processes",
      ].join("\n"),
      icon: <Briefcase className="h-6 w-6" />,
    },
    {
      id: 3,
      title: "Data Analytics",
      date: "09 August 2025",
      time: "4:00 PM - 6:00 PM EST",
      description:
        "Transform complex datasets into strategic insights using advanced analytical techniques and powerful visualization tools that drive informed business decisions.",
      highlights: [
        "Instructor-led training on core data analysis concepts and techniques",
        "Hands-on projects using Excel, SQL, and Power BI or Tableau",
        "Real-world case studies to develop problem-solving and data storytelling skills",
        "Introduction to data cleaning, transformation, and visualization",
        "Learn to build dashboards and reports that support business decisions",
        "Basics of Python for data analysis (optional module)",
        "CV and LinkedIn support tailored for data analyst roles",
        "Downloadable templates, datasets, and project files",
        "Practical tips on how to transition into a data analytics career",
        "Certificate of completion to showcase your skills to employers",
      ],
      instructor: {
        name: "TOBI OLADIPUPO",
        bio: "Tobi Oladipupo is a skilled Data Analyst with over 6 years of experience turning spatial and non-spatial data into strategic insights for organizations like WHO, eHealth Africa, and various consultancies. Holding an MSc in Information Management, he specialises in training aspiring analysts and professionals to use tools like Excel, SQL, Python, and Power BI to make smarter, data-driven decisions.",
      },
      audience: [
        "Aspiring Data Analysts and Business Intelligence professionals",
        "Career changers looking to break into tech or data-driven roles",
        "Professionals in operations, finance, marketing, or admin seeking to upskill",
        "Graduates and job seekers who want to stand out in today’s data-driven job market",
        "Junior analysts looking to strengthen their technical and analytical skills",
        "Anyone interested in using data to make better business decisions",
      ].join("\n"),
      icon: <BarChart2 className="h-6 w-6" />,
    },
    {
      id: 4,
      title: "Cybersecurity",
      date: "11 October 2025",
      time: "4:00 PM - 6:00 PM EST",
      description:
        "Build expertise in proactive threat detection, comprehensive vulnerability assessment, and implementation of enterprise-grade security protocols to safeguard critical assets.",
      highlights: [
        "Instructor-led sessions on core cybersecurity principles and threat landscapes",
        "Hands-on training in threat detection, incident response, and system hardening",
        "Real-world simulations of phishing, malware, and social engineering attacks",
        "Introduction to network security, firewalls, and access control mechanisms",
        "Basics of ethical hacking, vulnerability scanning, and penetration testing",
        "Cloud security concepts with AWS-focused examples",
        "CV and interview prep tailored for cybersecurity roles",
        "Step-by-step guidance on preparing for entry-level certifications like CompTIA Security+",
        "Downloadable tools, templates, and practice labs",
        "Certificate of completion to validate your new skills",
      ],
      instructor: {
        name: "FEMI OTOLORIN",
        bio: "Femi Otolorin is an accomplished Cloud Solutions and cybersecurity professional with extensive experience in software development, digital media, and IT infrastructure. As an AWS-certified expert and Cybersecurity Facilitator at Titans Careers, he empowers learners with practical skills and real-world insights to secure systems and advance in tech careers.",
      },
      audience: [
        "Aspiring cybersecurity professionals looking to break into the field",
        "Career changers from IT, customer service, or other industries interested in tech security",
        "Graduates and job seekers aiming for roles in cybersecurity, risk, or IT support",
        "Junior IT professionals or network admins seeking to expand into security",
        "Tech-curious individuals who want to understand how to protect systems and data",
        "Anyone preparing for certifications like CompTIA Security+, SSCP, or AWS Security",
      ].join("\n"),
      icon: <Shield className="h-6 w-6" />,
    },
  ];

  // Mapping from event title to backend course name
  const eventToCourseName = {
    "AML/KYC Compliance": "AML/KYC Compliance",
    Cybersecurity: "Cybersecurity",
    "Business Analysis/Project Management":
      "Business Analysis & Project Management",
    "Data Analytics": "Data Analysis",
  };

  // For each workshop, find the matching course
  const workshopsWithCourse = workshops.map((workshop) => {
    const backendName = eventToCourseName[workshop.title];
    const matchedCourse = allCourses.find(
      (course) =>
        course.name.trim().toLowerCase() === backendName.trim().toLowerCase()
    );
    return { ...workshop, course: matchedCourse };
  });

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="py-20 px-6 md:px-12 lg:px-16 bg-primary/10 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Professional Training Series: Expert-Led Workshops
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Intensive masterclasses designed to maximize your professional
            growth and industry expertise
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-primary hover:bg-primary/90 px-8 py-6 rounded-full text-lg">
              Register Now
            </Button>
            <Button
              variant="outline"
              className="px-8 py-6 rounded-full text-lg"
              onClick={scrollToWorkshops}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Workshops Grid */}
      <div
        id="upcoming-workshops"
        className="py-16 px-6 md:px-12 lg:px-16 h-fit"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Upcoming Masterclass Events
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {workshopsWithCourse.map((workshop) => (
              <div
                key={workshop.id}
                className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-all h-full"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    {workshop.icon}
                  </div>
                  <h3 className="text-xl font-bold line-clamp-1">
                    {workshop.title}
                  </h3>
                </div>

                <div className="flex items-center text-muted-foreground mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">{workshop.date}</span>
                </div>
                <div className="flex items-center text-muted-foreground mb-4">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">{workshop.time}</span>
                </div>

                <p className="text-muted-foreground text-sm">
                  {workshop.description}
                </p>
                <div className="flex flex-col gap-2 h-fit space-y-6 mt-4">
                  <div className="h-full">
                    <h4 className="font-semibold mb-3 text-sm">
                      Workshop Highlights:
                    </h4>

                    {/* The hight below controls the eveness of the cards below the highlight. It's intentionally not set to h-full to even out the boxes below the highlight */}
                    <ul className="space-y-2 text-muted-foreground h-80">
                      {workshop.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <span className="mr-2">•</span>
                          <span className="line-clamp-2">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="h-20">
                    <h4 className="font-semibold mb-2 text-sm">
                      Who Should Attend:
                    </h4>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {workshop.audience}
                    </p>
                  </div>

                  <div className=" h-full">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center text-sm">
                        <User className="h-4 w-4 mr-2" />
                        Meet Your Instructor
                      </h4>
                      <p className="font-medium text-sm mb-1">
                        {workshop.instructor.name}
                      </p>
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {workshop.instructor.bio}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  {workshop.course ? (
                    <AddToCartButton course={workshop.course} />
                  ) : (
                    <Button className="w-full text-base" disabled>
                      Course Not Available
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Registration Info */}
      <div className="py-16 px-6 md:px-12 lg:px-16 bg-primary/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Registration Information
          </h2>

          <div className="bg-card p-8 rounded-xl border border-border">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <BookOpen className="h-6 w-6 mr-3 text-primary" />
                <h3 className="text-2xl font-bold">Standard Registration</h3>
              </div>
              <div className="bg-primary/10 px-4 py-2 rounded-full">
                <p className="text-primary font-bold text-lg">£500</p>
              </div>
            </div>

            <h4 className="font-semibold mb-4">Includes:</h4>
            <ul className="space-y-4 text-muted-foreground mb-8">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Access to all premium masterclass sessions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Comprehensive digital learning materials</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Industry-recognized certificate of completion</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Lifetime access to session recordings</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Membership in our exclusive alumni network</span>
              </li>
            </ul>

            <div className="bg-blue-50 p-4 rounded-lg mb-8">
              <p className="text-blue-800">
                "This masterclass completely transformed our ML implementation
                approach..."
              </p>
              <p className="font-medium mt-2 text-blue-900">
                — Tobi Oladipupo, Lead Data Scientist
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-muted-foreground md:max-w-lg">
                Early registration is highly recommended as our masterclasses
                consistently reach capacity.
              </p>
              <Button className="bg-primary hover:bg-primary/90 px-8 py-6 rounded-full text-lg w-full md:w-auto">
                Secure Your Spot Today
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
