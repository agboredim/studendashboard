"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/portal/layout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  useGetAllLiveClassesQuery,
  useGetUpcomingLiveClassesQuery,
} from "@/services/live-classes-api";
import {
  Search,
  Clock,
  Calendar,
  Video,
  Bell,
  ExternalLink,
  CalendarDays,
  Timer,
  Sparkles,
  Users,
  BookOpen,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function LiveClassesSchedule() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const { toast } = useToast();

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Fetch all live classes
  const {
    data: allLiveClasses,
    isLoading: isAllClassesLoading,
    error: allClassesError,
  } = useGetAllLiveClassesQuery();

  // Fetch upcoming live classes
  const {
    data: upcomingClasses,
    isLoading: isUpcomingLoading,
    error: upcomingError,
  } = useGetUpcomingLiveClassesQuery();

  // Filter classes based on search term
  const getFilteredClasses = (classes) => {
    if (!classes) return [];
    if (!debouncedSearchTerm) return classes;

    return classes.filter(
      (liveClass) =>
        liveClass.teacher.first_name
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        liveClass.teacher.last_name
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
    );
  };

  // Separate classes into upcoming and past
  const separateClasses = (classes) => {
    if (!classes) return { upcoming: [], past: [] };

    const now = new Date();
    const upcoming = [];
    const past = [];

    classes.forEach((liveClass) => {
      const startTime = new Date(liveClass.start_time);
      if (startTime > now) {
        upcoming.push(liveClass);
      } else {
        past.push(liveClass);
      }
    });

    // Sort upcoming classes by start time (earliest first)
    upcoming.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

    // Sort past classes by start time (most recent first)
    past.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));

    return { upcoming, past };
  };

  const { upcoming: upcomingFiltered, past: pastFiltered } = separateClasses(
    getFilteredClasses(allLiveClasses)
  );

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (date - now) / (1000 * 60 * 60);

    const dateOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const formattedDate = date.toLocaleDateString("en-US", dateOptions);
    const formattedTime = date.toLocaleDateString("en-US", timeOptions);

    let timeIndicator = "";
    if (diffInHours < 1 && diffInHours > 0) {
      timeIndicator = " (Starting soon!)";
    } else if (diffInHours < 24 && diffInHours > 0) {
      timeIndicator = " (Today)";
    }

    return {
      date: formattedDate,
      time: formattedTime,
      indicator: timeIndicator,
      isStartingSoon: diffInHours < 1 && diffInHours > 0,
      isToday: diffInHours < 24 && diffInHours > 0,
    };
  };

  // Calculate duration
  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffInMinutes = (end - start) / (1000 * 60);

    if (diffInMinutes < 60) {
      return `${Math.round(diffInMinutes)} min`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = Math.round(diffInMinutes % 60);
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  };

  // Handle join class
  const handleJoinClass = (liveClass) => {
    const { isStartingSoon } = formatDateTime(liveClass.start_time);

    if (isStartingSoon) {
      window.open(liveClass.link, "_blank");
      toast({
        title: "🎉 Joining live class",
        description: `Opening ${liveClass.teacher.first_name} ${liveClass.teacher.last_name}'s class`,
      });
    } else {
      toast({
        title: "⏰ Class not started yet",
        description: "You can join the class when it starts",
        variant: "destructive",
      });
    }
  };

  // Handle set reminder
  const handleSetReminder = (liveClass) => {
    toast({
      title: "🔔 Reminder set",
      description: `You'll be notified before ${liveClass.teacher.first_name}'s class starts`,
    });
  };

  const isLoading = isAllClassesLoading || isUpcomingLoading;
  const error = allClassesError || upcomingError;

  // Get classes to display based on active tab
  const getDisplayClasses = () => {
    switch (activeTab) {
      case "upcoming":
        return upcomingFiltered;
      case "past":
        return pastFiltered;
      case "all":
      default:
        return getFilteredClasses(allLiveClasses) || [];
    }
  };

  const displayClasses = getDisplayClasses();

  return (
    <Layout>
      <div className="space-y-8">
        {/* Enhanced Header with gradient background */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-primary/50 p-8 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-yellow-300" />
                  <h1 className="text-3xl font-bold">Live Classes Schedule</h1>
                </div>
                <p className="text-blue-100 text-lg">
                  Join interactive sessions with expert instructors
                </p>
                <div className="flex items-center gap-4 text-sm text-blue-100">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{allLiveClasses?.length || 0} Total Classes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{upcomingFiltered.length} Upcoming</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search by instructor..."
                  className="pl-10 w-full md:w-80 bg-white/90 backdrop-blur-sm border-white/20 text-gray-900 placeholder:text-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>
        </div>

        {/* Enhanced upcoming classes alert */}
        {upcomingFiltered.length > 0 && (
          <Alert className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-l-emerald-500">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-emerald-600" />
              <Sparkles className="h-4 w-4 text-emerald-500" />
            </div>
            <AlertTitle className="text-emerald-800 font-semibold">
              🎯 {upcomingFiltered.length} Upcoming Live Session
              {upcomingFiltered.length > 1 ? "s" : ""}
            </AlertTitle>
            <AlertDescription className="text-emerald-700">
              {upcomingFiltered.some(
                (cls) => formatDateTime(cls.start_time).isStartingSoon
              ) && (
                <span className="font-medium text-orange-600">
                  ⚡ Some classes are starting soon!{" "}
                </span>
              )}
              Don't miss your chance to learn from industry experts.
            </AlertDescription>
          </Alert>
        )}

        {/* Enhanced Tabs */}
        <Tabs
          defaultValue="upcoming"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger
              value="upcoming"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              <CalendarDays className="h-4 w-4" />
              <span className="font-medium">Upcoming</span>
              <Badge
                variant="secondary"
                className="ml-1 bg-blue-100 text-blue-700 text-xs"
              >
                {upcomingFiltered.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-600 data-[state=active]:to-gray-700 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              <Clock className="h-4 w-4" />
              <span className="font-medium">Past</span>
              <Badge
                variant="secondary"
                className="ml-1 bg-gray-100 text-gray-700 text-xs"
              >
                {pastFiltered.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              <Calendar className="h-4 w-4" />
              <span className="font-medium">All Classes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardHeader className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-10 w-full" />
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-red-600 mb-2">
                  Error loading live classes
                </h3>
                <p className="text-gray-600 mb-4">
                  We're having trouble connecting to our servers
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Try Again
                </Button>
              </div>
            ) : displayClasses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayClasses.map((liveClass) => {
                  const dateTime = formatDateTime(liveClass.start_time);
                  const duration = calculateDuration(
                    liveClass.start_time,
                    liveClass.end_time
                  );

                  return (
                    <Card
                      key={liveClass.id}
                      className={`group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 ${
                        dateTime.isStartingSoon
                          ? "bg-gradient-to-br from-green-50 to-emerald-50 ring-2 ring-green-400 ring-opacity-50 shadow-lg shadow-green-100"
                          : dateTime.isToday
                          ? "bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-100"
                          : "bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-purple-100"
                      }`}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
                                <AvatarImage
                                  src={
                                    liveClass.teacher.profile_picture
                                      ? `${baseUrl}${liveClass.teacher.profile_picture}`
                                      : undefined
                                  }
                                  alt={`${liveClass.teacher.first_name} ${liveClass.teacher.last_name}`}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-semibold">
                                  {liveClass.teacher.first_name[0]}
                                  {liveClass.teacher.last_name[0]}
                                </AvatarFallback>
                              </Avatar>
                              {dateTime.isStartingSoon && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse ring-2 ring-white"></div>
                              )}
                            </div>
                            <div>
                              <CardTitle className="text-lg font-semibold text-gray-800">
                                {liveClass.teacher.first_name}{" "}
                                {liveClass.teacher.last_name}
                              </CardTitle>
                              <p className="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full inline-block">
                                {liveClass.teacher.role}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            {dateTime.isStartingSoon && (
                              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse shadow-md">
                                🔴 Live Soon
                              </Badge>
                            )}
                            {dateTime.isToday && !dateTime.isStartingSoon && (
                              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md">
                                📅 Today
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex items-center text-sm bg-white/60 rounded-lg p-3 border border-gray-100">
                            <Calendar className="h-4 w-4 mr-3 text-blue-500" />
                            <span className="font-medium text-gray-700">
                              {dateTime.date}
                            </span>
                          </div>
                          <div className="flex items-center text-sm bg-white/60 rounded-lg p-3 border border-gray-100">
                            <Clock className="h-4 w-4 mr-3 text-purple-500" />
                            <span className="font-medium text-gray-700">
                              {dateTime.time}
                              <span className="text-green-600 font-semibold ml-1">
                                {dateTime.indicator}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center text-sm bg-white/60 rounded-lg p-3 border border-gray-100">
                            <Timer className="h-4 w-4 mr-3 text-orange-500" />
                            <span className="font-medium text-gray-700">
                              {duration}
                            </span>
                          </div>
                        </div>

                        {liveClass.teacher.bio && (
                          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3 border border-gray-100">
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                              {liveClass.teacher.bio.substring(0, 120)}...
                            </p>
                          </div>
                        )}
                      </CardContent>

                      <CardFooter className="flex gap-2 pt-4">
                        {activeTab === "upcoming" ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetReminder(liveClass)}
                              className="flex-1 group-hover:border-purple-300 transition-colors"
                            >
                              <Bell className="h-4 w-4 mr-2" />
                              Remind Me
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleJoinClass(liveClass)}
                              disabled={!dateTime.isStartingSoon}
                              className={`flex-1 transition-all duration-200 ${
                                dateTime.isStartingSoon
                                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-200"
                                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                              }`}
                            >
                              <Video className="h-4 w-4 mr-2" />
                              {dateTime.isStartingSoon
                                ? "🚀 Join Now"
                                : "Join Class"}
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(liveClass.link, "_blank")
                            }
                            className="w-full group-hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Recording
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-10 w-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No live classes found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {debouncedSearchTerm
                    ? `No results found for "${debouncedSearchTerm}". Try adjusting your search.`
                    : activeTab === "upcoming"
                    ? "No upcoming live classes scheduled. Check back soon for new sessions!"
                    : activeTab === "past"
                    ? "No past live classes found. Attend some sessions to see them here."
                    : "No live classes available at the moment."}
                </p>
                {debouncedSearchTerm && (
                  <Button
                    onClick={() => setSearchTerm("")}
                    className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
