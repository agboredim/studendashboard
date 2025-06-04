import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSendGuideMutation } from "@/services/api";
import { toast } from "@/hooks/use-toast";

function DownloadGuideSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sendGuide, { isLoading, isError, isSuccess, error }] =
    useSendGuideMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await sendGuide({ email }).unwrap();
      setSubmitted(true);
    } catch {
      toast({
        title: "Error sending guide",
        description:
          error?.data?.detail ||
          error?.message ||
          "Something went wrong. Please try again.",
        variant: "destructive",
      });
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

          {isSuccess && submitted ? (
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
                disabled={isLoading || submitted}
              />
              <Button
                type="submit"
                disabled={isLoading || submitted}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading
                  ? "Sending..."
                  : submitted && isSuccess
                  ? "Sent!"
                  : "Get Free Guide"}
              </Button>
            </form>
          )}

          {isError && (
            <p className="mt-4 text-red-600">
              Something went wrong. Please try again.
            </p>
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
