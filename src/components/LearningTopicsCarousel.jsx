import Slider from "react-slick";
import {
  Lock,
  Shield,
  GitBranch,
  Trello,
  BarChart,
  LineChart,
  Activity,
  Search,
  Globe,
} from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const topics = [
  { name: "Data Protection", icon: <Lock className="h-8 w-8" /> },
  { name: "GDPR", icon: <Shield className="h-8 w-8" /> },
  { name: "PMO Analysis", icon: <GitBranch className="h-8 w-8" /> },
  { name: "Project Planning", icon: <Trello className="h-8 w-8" /> },
  { name: "Data Analysis", icon: <BarChart className="h-8 w-8" /> },
  { name: "Business Intelligence", icon: <LineChart className="h-8 w-8" /> },
  { name: "Web Analysis", icon: <Activity className="h-8 w-8" /> },
  { name: "SEO", icon: <Search className="h-8 w-8" /> },
  { name: "Social Media", icon: <Globe className="h-8 w-8" /> },
];

export function LearningTopicsCarousel() {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: true,
    speed: 3000,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-800">
          What are you going to learn?
        </h2>

        <div className="mx-auto max-w-6xl">
          <Slider {...settings}>
            {topics.map((topic, index) => (
              <div key={index} className="px-4">
                <div className="flex flex-col items-center">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 p-3 text-gray-600">
                    {topic.icon}
                  </div>
                  <span className="text-center text-sm">{topic.name}</span>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}
