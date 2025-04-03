import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export function CompliancePromo() {
  return (
    <section className="relative w-full">
      {/* Background collage */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2">
        <div
          className="bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')",
          }}
        ></div>
        <div
          className="bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')",
          }}
        ></div>
        <div
          className="bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')",
          }}
        ></div>
        <div
          className="bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1591696205602-2f950c417cb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')",
          }}
        ></div>
        <div
          className="bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')",
          }}
        ></div>
        <div
          className="bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')",
          }}
        ></div>
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left side content */}
          <div className="mb-10 md:mb-0 text-white max-w-xl">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="text-yellow-600">Compliance</span> Excellence
            </h2>
            <p className="text-2xl md:text-3xl font-light mb-2">
              Transforming KYC & AML challenges into opportunities
            </p>
            <p className="text-xl text-yellow-300 font-medium">
              #ComplianceMatters
            </p>
          </div>

          {/* Right side logo */}
          <div className="text-white text-center">
            <div className="inline-flex items-center justify-center border-4 border-white rounded-md h-20 w-20 mb-4">
              <Shield className="h-12 w-12" />
            </div>
            <h3 className="text-4xl md:text-5xl font-bold">AML Pro</h3>
          </div>
        </div>

        {/* Call to action buttons */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-gray-900 py-6 text-lg font-medium"
          >
            KYC Certification
          </Button>
          <Button
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-gray-900 py-6 text-lg font-medium"
          >
            AML Training
          </Button>
          <Button
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-gray-900 py-6 text-lg font-medium"
          >
            Compliance Resources
          </Button>
          <Button
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-gray-900 py-6 text-lg font-medium"
          >
            Success Stories
          </Button>
        </div>
      </div>
    </section>
  );
}
