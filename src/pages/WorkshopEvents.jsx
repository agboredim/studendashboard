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
      date: "01 June 2025",
      time: "4:00 PM - 6:00 PM EST",
      description:
        "Master complex regulatory frameworks, implement robust risk assessment methodologies, and harness cutting-edge compliance technologies to protect your organization.",
      highlights: [
        "Master sophisticated regulatory frameworks essential for global financial operations",
        "Develop comprehensive risk assessment methodologies that ensure institutional protection",
        "Implement intelligent detection systems that dramatically reduce false positives",
      ],
      instructor: {
        name: "Dr. Maria Rodriguez",
        bio: "Leading authority in AML/KYC Compliance with 12+ years transforming regulatory frameworks at Global Finance. Author of 'Modern Approaches to Financial Compliance,' adopted by premier financial institutions worldwide.",
      },
      audience:
        "AML/KYC Compliance Professionals seeking to transform regulatory frameworks with sophisticated machine learning systems",
      icon: <Shield className="h-6 w-6" />,
    },
    {
      id: 2,
      title: "Business Analysis/Project Management",
      date: "05 July 2025",
      time: "4:00 PM - 6:00 PM EST",
      description:
        "Develop critical skills in requirements gathering, process optimization, and stakeholder management to effectively bridge technical and business objectives.",
      highlights: [
        "Implement industry-leading Agile methodologies that accelerate project delivery",
        "Master stakeholder-focused requirements engineering techniques",
        "Gain frameworks for stakeholder alignment and precise ROI measurement",
      ],
      instructor: {
        name: "Jennifer Park",
        bio: "Senior Business Analyst and certified Project Management Professional at StrategyForge known for delivering projects with 98% stakeholder satisfaction across multiple sectors.",
      },
      audience:
        "Business Analysts & Project Managers committed to orchestrating seamless integration of ML solutions",
      icon: <Briefcase className="h-6 w-6" />,
    },
    {
      id: 3,
      title: "Data Analytics",
      date: "05 July 2025",
      time: "4:00 PM - 6:00 PM EST",
      description:
        "Transform complex datasets into strategic insights using advanced analytical techniques and powerful visualization tools that drive informed business decisions.",
      highlights: [
        "Acquire transformative predictive modeling skills",
        "Design compelling data visualization solutions",
        "Learn practical skills in predictive modeling and anomaly detection",
      ],
      instructor: {
        name: "Dr. James Wilson",
        bio: "Innovative Data Analytics Director at AnalyticsPro whose breakthrough methodologies have generated over $500M in value for Fortune 100 companies.",
      },
      audience:
        "Data Analytics Specialists eager to leverage state-of-the-art ML algorithms",
      icon: <BarChart2 className="h-6 w-6" />,
    },
    {
      id: 4,
      title: "Cybersecurity",
      date: "12 July 2025",
      time: "4:00 PM - 6:00 PM EST",
      description:
        "Build expertise in proactive threat detection, comprehensive vulnerability assessment, and implementation of enterprise-grade security protocols to safeguard critical assets.",
      highlights: [
        "Deploy sophisticated proactive threat detection strategies",
        "Architect resilient security frameworks",
        "Learn advanced vulnerability assessment and threat modeling",
      ],
      instructor: {
        name: "Daniel Torres",
        bio: "Chief Information Security Officer at SecureDefend with 15+ years protecting critical infrastructure, having engineered security architectures preventing over $2B in potential breach damages.",
      },
      audience:
        "Cybersecurity Experts dedicated to implementing advanced ML-powered defense systems",
      icon: <Shield className="h-6 w-6" />,
    },
  ];

  // Mapping from event title to backend course name
  const eventToCourseName = {
    "AML/KYC Compliance": "AML/KYC Compliance",
    "Cybersecurity": "Cybersecurity",
    "Business Analysis/Project Management": "Business Analysis & Project Management",
    "Data Analytics": "Data Analysis",
  };

  // For each workshop, find the matching course
  const workshopsWithCourse = workshops.map((workshop) => {
    const backendName = eventToCourseName[workshop.title];
    const matchedCourse = allCourses.find(
      (course) => course.name.trim().toLowerCase() === backendName.trim().toLowerCase()
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
                  <div className="h-36">
                    <h4 className="font-semibold mb-3 text-sm">
                      Workshop Highlights:
                    </h4>
                    <ul className="space-y-2 text-muted-foreground">
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
                — Wonderful Oladipupo, Lead Data Scientist
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
