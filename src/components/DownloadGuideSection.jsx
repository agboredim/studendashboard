import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function DownloadGuideSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Replace with your actual Brevo API integration
      const response = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": "YOUR_BREVO_API_KEY",
        },
        body: JSON.stringify({
          email: email,
          listIds: [YOUR_LIST_ID], // Your Brevo list ID
          attributes: {
            DOWNLOADED_GUIDE: true,
          },
        }),
      });

      if (response.ok) {
        setSuccess(true);
        // Trigger PDF download
        window.open(
          "/path-to-pdf/Launch-Your-UK-Career-Titans-Careers-Guide.pdf",
          "_blank"
        );
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Get Your Free UK Career Guide
          </h2>
          <p className="text-lg text-foreground/80 mb-8">
            Download our comprehensive guide packed with insider strategies for
            international graduates to launch their UK careers. Learn from
            success stories and avoid common pitfalls.
          </p>

          {success ? (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg">
              <p>Thank you! Your guide has been sent to your email.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full sm:w-80"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? "Sending..." : "Get Free Guide"}
              </Button>
            </form>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Market Insights</h3>
              <p className="text-sm text-foreground/70">
                2025 UK job market trends and salary benchmarks
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Visa Strategies</h3>
              <p className="text-sm text-foreground/70">
                Navigating sponsorship and work rights requirements
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Success Stories</h3>
              <p className="text-sm text-foreground/70">
                Real international graduates' career journeys
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DownloadGuideSection;
