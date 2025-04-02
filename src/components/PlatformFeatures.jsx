import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function PlatformFeatures() {
  const features = [
    {
      title: "Expert-led training",
      description:
        "The program is spearheaded by dual-qualified solicitor with over decades of experience solicitor and banking industries. His extensivein background and hands-on experience in high-profile institutions provide participants with insights and expertise that are rare in training environments.",
      link: "/expert-training",
    },
    {
      title: "Real-world relevance",
      description:
        "Ami Pro trainer emphasizes practical, real-world applications of AML and KYC principles. The training incorporates current case studies and scenarios that participants are likely to encounter in their careers, ensuring that they can apply what they lean immediately and effectively",
      link: "/real-world-training",
    },
    {
      title: "Comprehensive mentorship",
      description:
        "Unlike many other programs, AML Pro Trainers offers personalized mentorship. Olumide and his team guide participants through the nuances to mastering job interviews and networking in the industry",
      link: "/mentorship",
    },
    {
      title: "Industry networking opportunities",
      description:
        "The program provides unique networking opportunities, connecting trainees with professionals in the banking and legal sectors. this facilitates valuable industry contacts that can lead to job opportunities and career advancement.",
      link: "/networking",
    },
    {
      title: "Regulator dynamic",
      description:
        "With a curriculum updated to reflect the latest regulatory change and global compliance trends, AML Pro Trainners ensures that its participants are ahead of the curve in understanding and implementing necessary compliance measures",
      link: "/regulatory-updates",
    },
    {
      title: "Anti-money laundering",
      description:
        "Specifically targets anti-money laundering with a globla standard recognized internationally, offering advanced certifications for specialized roles in risk management and auditing.",
      link: "/aml-certification",
    },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <span className="inline-block px-6 py-2 bg-white rounded-full text-gray-800 font-semibold text-sm uppercase tracking-wider">
            PLATFORM FEATURES
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
          Main features
        </h2>

        <p className="text-xl text-center text-gray-600 mb-12">
          Build to solve your training challenges
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <Link
                to={feature.link}
                className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium"
              >
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
