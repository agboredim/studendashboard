import React from "react";

const companies = [
  {
    name: "HSBC",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
  },
  {
    name: "Oracle",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
  },
  {
    name: "Shell",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
  },
  {
    name: "Barclays",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
  },
  {
    name: "KPMG",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
  },
  {
    name: "Accenture",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
  },
  {
    name: "NHS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
  },
  {
    name: "Capgemini",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
  },
];

const partners = [
  {
    name: "Digital Marketing Institute",
    logo: "https://via.placeholder.com/160x60?text=Digital+Marketing",
  },
  {
    name: "Authorized Partner",
    logo: "https://via.placeholder.com/160x60?text=Authorized+Partner",
  },
];

const PartnerShowcase = () => {
  return (
    <section className="bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto text-center px-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Our Candidates Work for
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-6 mt-6">
          {companies.map((company, index) => (
            <img
              key={index}
              src={company.logo}
              alt={company.name}
              className="h-10 md:h-12 max-w-[120px]"
            />
          ))}
        </div>
        <p className="mt-4 text-gray-600">and more</p>
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-xl font-medium text-gray-500">
          Proud Digital Partners with
        </h3>
        <div className="flex justify-center items-center gap-6 mt-4">
          {partners.map((partner, index) => (
            <img
              key={index}
              src={partner.logo}
              alt={partner.name}
              className="h-12 md:h-14 max-w-[160px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerShowcase;
