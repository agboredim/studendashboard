import {
  SiFacebook,
  SiInstagram,
  SiLinkedin,
  SiYoutube,
  SiTiktok,
  SiX,
} from "react-icons/si";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Globe,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";

export function CommunityPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="py-20 px-6 md:px-12 lg:px-16 bg-primary/10 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Join Our Community of 10,000+ Digital Professionals
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Connect with industry leaders and ambitious peers to access daily
            tips, success stories, and expert advice tailored to help you thrive
            in today's digital landscape.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button variant="outline" className="px-6 py-4 rounded-full">
              <SiFacebook className="mr-2 h-5 w-5" />
              Facebook
            </Button>
            <Button variant="outline" className="px-6 py-4 rounded-full">
              <SiInstagram className="mr-2 h-5 w-5" />
              Instagram
            </Button>
            <Button variant="outline" className="px-6 py-4 rounded-full">
              <SiLinkedin className="mr-2 h-5 w-5" />
              LinkedIn
            </Button>
            <Button variant="outline" className="px-6 py-4 rounded-full">
              <SiX className="mr-2 h-5 w-5" />
              Twitter
            </Button>
            <Button variant="outline" className="px-6 py-4 rounded-full">
              <SiTiktok className="mr-2 h-5 w-5" />
              TikTok
            </Button>
            <Button variant="outline" className="px-6 py-4 rounded-full">
              <SiYoutube className="mr-2 h-5 w-5" />
              YouTube
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            80% of members report faster career advancement and valuable
            industry connections
          </p>
        </div>
      </div>

      {/* Social Platform Highlights */}
      <div className="py-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Where Our Community Connects
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <SiLinkedin className="h-8 w-8" />,
                platform: "LinkedIn",
                description:
                  "Engage with thought leaders' posts to gain insights on emerging trends. Share your achievements weekly to expand your network.",
                url: "https://www.linkedin.com/in/aml-pro-trainer-22ab41347/",
                color: "bg-blue-100 text-blue-800",
              },
              {
                icon: <SiInstagram className="h-8 w-8" />,
                platform: "Instagram",
                description:
                  "Follow daily career motivation graphics and 60-second skill tutorials. Save weekly infographics for quick reference.",
                url: "https://www.instagram.com/titans.careers/",
                color: "bg-pink-100 text-pink-800",
              },
              {
                icon: <SiFacebook className="h-8 w-8" />,
                platform: "Facebook",
                description:
                  "Join private groups exchanging success stories. Participate in weekly live Q&A sessions with industry mentors.",
                url: "https://www.facebook.com/profile.php?id=61573103226117",
                color: "bg-indigo-100 text-indigo-800",
              },
              {
                icon: <SiTiktok className="h-8 w-8" />,
                platform: "TikTok",
                description:
                  "Discover bite-sized career advice and industry insights through engaging short-form videos.",
                url: "https://www.tiktok.com/@titans.careers",
                color: "bg-black text-white",
              },
              {
                icon: <SiX className="h-8 w-8" />,
                platform: "Twitter",
                description:
                  "Get real-time industry updates, participate in discussions, and connect with professionals in your field.",
                url: "https://x.com/TitansCareers",
                color: "bg-sky-100 text-sky-800",
              },
              {
                icon: <SiYoutube className="h-8 w-8" />,
                platform: "YouTube",
                description:
                  "Access masterclass recordings, success story interviews, and in-depth tutorials on career development.",
                url: "https://www.youtube.com/channel/UCNUE2QZemJ4vlsvirzJ71kw",
                color: "bg-red-100 text-red-800",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-xl border border-border hover:shadow-md transition-all"
              >
                <div
                  className={`${item.color} w-14 h-14 rounded-full flex items-center justify-center mb-6`}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {item.platform}
                </h3>
                <p className="text-muted-foreground mb-6">{item.description}</p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Visit our {item.platform} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community Benefits */}
      <div className="py-16 px-6 md:px-12 lg:px-16 bg-primary/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Community Success Pathways
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-8">
              {[
                {
                  icon: <BookOpen className="h-6 w-6" />,
                  title: "Master Essential Skills",
                  description:
                    "4 - 12 weeks masterclass series sharing practical leadership strategies",
                },
                {
                  icon: <Users className="h-6 w-6" />,
                  title: "Network Strategically",
                  description:
                    "Monthly virtual roundtables with 15-20 professionals in your field",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-card p-6 rounded-lg border border-border"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              {[
                {
                  icon: <TrendingUp className="h-6 w-6" />,
                  title: "Implement and Evolve",
                  description:
                    "Proven 5-step framework with 87% reporting career advancement in 6 months",
                },
                {
                  icon: <MessageSquare className="h-6 w-6" />,
                  title: "Become a Thought Leader",
                  description:
                    "Contribute to our blog (50,000+ monthly readers) and speaker series",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-card p-6 rounded-lg border border-border"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="py-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            By The Numbers
          </h2>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              {
                icon: <Globe className="h-8 w-8 mx-auto" />,
                value: "6",
                label: "Platforms",
                description: "From LinkedIn to YouTube, engage across channels",
              },
              {
                icon: <BookOpen className="h-8 w-8 mx-auto" />,
                value: "1000+",
                label: "Resources",
                description: "Case studies, masterclasses, and strategies",
              },
              {
                icon: <Users className="h-8 w-8 mx-auto" />,
                value: "10K+",
                label: "Members",
                description: "Industry leaders, mentors, and peers",
              },
              {
                icon: <TrendingUp className="h-8 w-8 mx-auto" />,
                value: "80%",
                label: "Faster Growth",
                description: "Report accelerated career advancement",
              },
            ].map((stat, index) => (
              <div key={index} className="bg-card p-6 rounded-xl">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <h3 className="text-xl font-semibold mb-2">{stat.label}</h3>
                <p className="text-muted-foreground">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-6 md:px-12 lg:px-16 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Transform Your Professional Journey
          </h2>
          <p className="text-xl mb-8">
            Leverage our community resources to accelerate your growth, just
            like thousands of success stories before you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              {
                name: "Facebook",
                icon: <SiFacebook className="h-5 w-5" />,
                url: "https://www.facebook.com/profile.php?id=61573103226117",
              },
              {
                name: "Instagram",
                icon: <SiInstagram className="h-5 w-5" />,
                url: "https://www.instagram.com/titans.careers/",
              },
              {
                name: "LinkedIn",
                icon: <SiLinkedin className="h-5 w-5" />,
                url: "https://www.linkedin.com/in/aml-pro-trainer-22ab41347/",
              },
              {
                name: "Twitter",
                icon: <SiX className="h-5 w-5" />,
                url: "https://x.com/TitansCareers",
              },
              {
                name: "TikTok",
                icon: <SiTiktok className="h-5 w-5" />,
                url: "https://www.tiktok.com/@titans.careers",
              },
              {
                name: "YouTube",
                icon: <SiYoutube className="h-5 w-5" />,
                url: "https://www.youtube.com/channel/UCNUE2QZemJ4vlsvirzJ71kw",
              },
            ].map((platform, index) => (
              <a
                key={index}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 px-6 py-4 rounded-full flex items-center transition-colors"
              >
                {platform.icon}
                <span className="ml-2">{platform.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
