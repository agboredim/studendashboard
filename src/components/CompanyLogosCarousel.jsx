import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const companyLogos = [
  {
    url: "https://cdn.prod.website-files.com/66254039650e96e0e05713a3/66254039650e96e0e05713a6_Deloitte.svg",
    alt: "Deloitte",
  },
  {
    url: "https://cdn.prod.website-files.com/66254039650e96e0e05713a3/66254039650e96e0e0571416_Cipla.svg",
    alt: "Cipla",
  },
  {
    url: "https://cdn.prod.website-files.com/66254039650e96e0e05713a3/66254039650e96e0e0571468_ASG.svg",
    alt: "ASG",
  },
  {
    url: "https://cdn.prod.website-files.com/66254039650e96e0e05713a3/66254039650e96e0e0571498_Weylandts.svg",
    alt: "Weylandts",
  },
  {
    url: "https://cdn.prod.website-files.com/66254039650e96e0e05713a3/66cd7b89dc52b453def6fe7e_perno.png",
    alt: "Perno",
  },
  {
    url: "https://cdn.prod.website-files.com/66254039650e96e0e05713a3/66254039650e96e0e05713c9_Capitec.svg",
    alt: "Capitec",
  },
  {
    url: "https://cdn.prod.website-files.com/66254039650e96e0e05713a3/66254039650e96e0e057144d_Mukuru.svg",
    alt: "Mukuru",
  },
  {
    url: "https://cdn.prod.website-files.com/66254039650e96e0e05713a3/66254039650e96e0e0571481_cardano.svg",
    alt: "Cardano",
  },
  {
    url: "https://cdn.prod.website-files.com/66254039650e96e0e05713a3/66254039650e96e0e05714e6_FLM.svg",
    alt: "FLM",
  },
  {
    url: "https://cdn.prod.website-files.com/66254039650e96e0e05713a3/66254039650e96e0e05713fa_Informa.svg",
    alt: "Informa",
  },
  {
    url: "https://cdn.prod.website-files.com/66254039650e96e0e05713a3/66254039650e96e0e0571434_Nedbank.svg",
    alt: "Nedbank",
  },
  {
    url: "https://cdn.prod.website-files.com/66254039650e96e0e05713a3/66254039650e96e0e05714c0_TRU.svg",
    alt: "TRU",
  },
  {
    url: "https://cdn.prod.website-files.com/66254039650e96e0e05713a3/66cc5571b771073ceb212b24_FOM.svg",
    alt: "FOM",
  },
];

export function CompanyLogosCarousel() {
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
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-800">
          Trusted by leading companies
        </h2>

        <div className="">
          <Slider {...settings}>
            {companyLogos.map((logo, index) => (
              <div key={index} className="px-2">
                <div className="flex h-24 items-center justify-center p-4 grayscale transition-all hover:grayscale-0">
                  <img
                    src={logo.url}
                    alt={logo.alt}
                    className="max-h-12 max-w-full object-contain"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}
