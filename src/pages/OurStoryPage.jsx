import {
  Sparkles,
  Target,
  Users,
  BarChart,
  Briefcase,
  Award,
  Handshake,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function OurStoryPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="bg-primary/10 text-foreground py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Titans Careers: Transform Your Professional Journey
          </h1>
          <p className="text-xl text-foreground/90 max-w-4xl mx-auto mb-8">
            We eliminate the barriers between your current position and your
            dream career through industry-relevant skills training, one-on-one
            coaching, and a supportive network that recognizes your unique
            potential.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 rounded-full text-lg">
              <Link to="/courses">Explore Our Programs</Link>
            </Button>
            <Button className="bg- border-2 border-foreground hover:bg-foreground hover:text-secondary px-8 py-6 rounded-full text-lg text-foreground">
              <Link to="/community">Join Our Community</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Our Story Timeline */}
      <div className="py-16 px-6 md:px-12 lg:px-16 bg-card">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">
            Our Story
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 md:left-1/2 h-full w-1 bg-muted transform -translate-x-1/2"></div>

            {/* Timeline items */}
            <div className="space-y-16">
              {/* The Spark */}
              <div className="relative flex flex-col md:flex-row items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary z-10 mb-4 md:mb-0 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="md:w-5/12 md:pr-8 md:text-right">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    The Spark
                  </h3>
                  <p className="text-muted-foreground">
                    Titans Careers ignited from countless conversations with
                    talented professionals who felt stuck—individuals with
                    immense potential but struggling to navigate today's complex
                    job market without proper guidance.
                  </p>
                </div>
                <div className="hidden md:block md:w-2/12"></div>
                <div className="md:w-5/12"></div>
              </div>

              {/* The Mission */}
              <div className="relative flex flex-col md:flex-row items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary z-10 mb-4 md:mb-0 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                  <Target className="h-6 w-6" />
                </div>
                <div className="md:w-5/12"></div>
                <div className="hidden md:block md:w-2/12"></div>
                <div className="md:w-5/12 md:pl-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    The Mission
                  </h3>
                  <p className="text-muted-foreground">
                    We built a platform dedicated to equipping ambitious
                    professionals with cutting-edge skills, unwavering
                    confidence, and proven strategies that traditional education
                    and generic career advice simply don't provide.
                  </p>
                </div>
              </div>

              {/* The Impact */}
              <div className="relative flex flex-col md:flex-row items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary z-10 mb-4 md:mb-0 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                  <Users className="h-6 w-6" />
                </div>
                <div className="md:w-5/12 md:pr-8 md:text-right">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    The Impact
                  </h3>
                  <p className="text-muted-foreground">
                    Today, we've transformed the professional trajectories of
                    thousands worldwide, helping them overcome barriers, secure
                    meaningful opportunities, and build fulfilling careers
                    aligned with their unique strengths and aspirations.
                  </p>
                </div>
                <div className="hidden md:block md:w-2/12"></div>
                <div className="md:w-5/12"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Problem We Solve */}
      <div className="py-16 px-6 md:px-12 lg:px-16 bg-secondary/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            The Problem We Solve
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
              <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                <Briefcase className="h-6 w-6 text-primary mr-3" />
                Outdated Advice
              </h3>
              <p className="text-muted-foreground mb-6">
                Traditional career services offer cookie-cutter templates and
                standardized approaches that fail to address your unique
                strengths and market realities.
              </p>
              <div className="bg-primary/10 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  The Titans Solution
                </h4>
                <p className="text-muted-foreground">
                  Comprehensive career transformation through personalized
                  coaching, hands-on skill development, and measurable career
                  advancement outcomes.
                </p>
              </div>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
              <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                <Award className="h-6 w-6 text-primary mr-3" />
                Education-Employment Gap
              </h3>
              <p className="text-muted-foreground mb-6">
                Educational institutions provide abstract concepts without the
                practical, industry-specific skills that employers actively seek
                in today's competitive marketplace.
              </p>
              <div className="bg-primary/10 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  The Titans Solution
                </h4>
                <p className="text-muted-foreground">
                  Practical, market-relevant training that bridges the gap
                  between education and employment with skills employers
                  actually need.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Titans Approach */}
      <div className="py-16 px-6 md:px-12 lg:px-16 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            The Titans Approach
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-all">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Practical, Market-Relevant Training
              </h3>
              <p className="text-muted-foreground">
                Expert-led masterclasses delivering cutting-edge skills in
                high-growth sectors including Business Analysis, Project
                Management, and Cybersecurity that employers actively seek.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-all">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Handshake className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Personalized Career Support
              </h3>
              <p className="text-muted-foreground">
                Transformative 1-on-1 sessions with industry experts who
                optimize your CV, enhance your LinkedIn presence, strengthen
                your interview skills, and create tailored career advancement
                strategies.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-all">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Supportive Community
              </h3>
              <p className="text-muted-foreground">
                Join a powerful network of like-minded professionals and
                experienced mentors who provide invaluable insights, meaningful
                connections, and ongoing encouragement throughout your career
                evolution.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Measurable Impact */}
      <div className="py-16 px-6 md:px-12 lg:px-16 bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Ascend to Your Potential
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">100s</div>
              <h3 className="text-xl font-semibold mb-3">
                Careers Transformed
              </h3>
              <p className="text-primary-foreground/90">
                Professionals worldwide launching into rewarding opportunities
                with newfound confidence
              </p>
            </div>

            <div>
              <div className="text-5xl font-bold mb-2">5+</div>
              <h3 className="text-xl font-semibold mb-3">High-Demand Fields</h3>
              <p className="text-primary-foreground/90">
                Expert-led training in rapidly expanding industries with
                critical talent gaps
              </p>
            </div>

            <div>
              <div className="text-5xl font-bold mb-2">3x</div>
              <h3 className="text-xl font-semibold mb-3">Interview Success</h3>
              <p className="text-primary-foreground/90">
                Dramatically enhanced performance leading to more job offers and
                better compensation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* More Than Training */}
      <div className="py-16 px-6 md:px-12 lg:px-16 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            More Than Training
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-xl border border-border hover:shadow-md transition-all">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Transformative Experience
              </h3>
              <p className="text-muted-foreground">
                Our elite team of industry coaches, veteran recruiters, and
                subject matter experts deliver career-defining transformations
                that extend far beyond conventional training programs.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl border border-border hover:shadow-md transition-all">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Real-World Application
              </h3>
              <p className="text-muted-foreground">
                Every concept, strategy, and skill we teach translates directly
                to on-the-job performance, giving you immediate confidence in
                interviews and day-to-day work scenarios.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl border border-border hover:shadow-md transition-all">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Corporate Solutions
              </h3>
              <p className="text-muted-foreground">
                We partner with forward-thinking companies to elevate team
                capabilities and streamline new employee integration through
                customized training programs aligned with specific business
                objectives.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Vision */}
      <div className="py-16 px-6 md:px-12 lg:px-16 bg-secondary/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Our Vision
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <Rocket className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-bold text-foreground">
                  Curriculum Expansion
                </h3>
              </div>
              <p className="text-muted-foreground">
                Strategically developing cutting-edge courses and specialized
                tracks that anticipate industry trends and prepare professionals
                for tomorrow's challenges.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <Handshake className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-bold text-foreground">
                  Strategic Partnerships
                </h3>
              </div>
              <p className="text-muted-foreground">
                Forging powerful alliances with leading employers and
                educational institutions to create direct pathways to career
                advancement for our learners.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <BarChart className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-bold text-foreground">
                  Accessible Training
                </h3>
              </div>
              <p className="text-muted-foreground">
                Dismantling traditional barriers to professional growth through
                flexible learning options, scholarship programs, and inclusive
                teaching methodologies.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-6 md:px-12 lg:px-16 bg-primary/10  text-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Transform Your Journey With Us
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-primary p-6 rounded-xl backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-3">
                Accelerate Your Career Growth
              </h3>
              <p className="text-primary-foreground/90">
                Master in-demand skills and build the confidence needed to
                propel your professional journey to extraordinary heights.
              </p>
            </div>

            <div className="bg-primary p-6 rounded-xl backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-3">
                Reinvent Your Professional Path
              </h3>
              <p className="text-primary-foreground/90">
                Make a seamless transition to exciting new industries with our
                specialized training programs and expert career guidance.
              </p>
            </div>

            <div className="bg-primary p-6 rounded-xl backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-3">
                Empower Your Organization
              </h3>
              <p className="text-primary-foreground/90">
                Invest in your team's development with targeted training that
                builds the critical capabilities needed to excel in today's
                dynamic business environment.
              </p>
            </div>
          </div>

          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 rounded-full text-lg font-semibold">
            <Link to="/courses">Start Your Transformation Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
