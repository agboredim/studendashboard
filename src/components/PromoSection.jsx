import { Button } from "@/components/ui/button";

export function PromoSection() {
  return (
    <section className="relative w-full  items-center flex">
      {/* Background collage */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2">
        <div
          className="bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')",
          }}
        ></div>
        <div
          className="bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')",
          }}
        ></div>
        <div
          className="bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')",
          }}
        ></div>
        <div
          className="bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')",
          }}
        ></div>
        <div
          className="bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')",
          }}
        ></div>
        <div
          className="bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')",
          }}
        ></div>
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left side content */}
          <div className="mb-10 md:mb-0 text-white max-w-xl">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="text-orange-500">5,000+</span> Reasons
            </h2>
            <p className="text-2xl md:text-3xl font-light mb-2">
              To join the fastest online elearning platform
            </p>
            <p className="text-xl text-orange-300 font-medium">
              #eWorkexperience
            </p>
          </div>

          {/* Right side logo */}
          <div className="text-white text-center">
            <div className="inline-flex items-center justify-center border-4 border-white rounded-md h-20 w-20 mb-4">
              <span className="text-4xl font-bold">e</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold">eWorkexperience</h3>
          </div>
        </div>

        {/* Call to action buttons */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-gray-900 py-6 text-lg font-medium"
          >
            DBT Awards 2017
          </Button>
          <Button
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-gray-900 py-6 text-lg font-medium"
          >
            DBT Awards 2014-2016
          </Button>
          <Button
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-gray-900 py-6 text-lg font-medium"
          >
            Listen To Candidates
          </Button>
          <Button
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-gray-900 py-6 text-lg font-medium"
          >
            View Success Stories
          </Button>
        </div>
      </div>
    </section>
  );
}
