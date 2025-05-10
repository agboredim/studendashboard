"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/portal/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useGetCourseByIdQuery } from "@/services/coursesApi";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Home,
  List,
  MessageSquare,
  PlayCircle,
  Video,
  X,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import WistiaVideo from "@/components/WistiaVideo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function CourseLearning() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("content");
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);

  const { data: course, isLoading, error } = useGetCourseByIdQuery(id);

  // Set initial active module and video when course data loads
  useEffect(() => {
    if (course && course.curriculum && course.curriculum.length > 0) {
      const firstModule = course.curriculum[0];
      setActiveModuleId(firstModule.id);

      if (firstModule.video && firstModule.video.length > 0) {
        setActiveVideoId(firstModule.video[0].id);
      }
    }
  }, [course]);

  // Mark a lesson as completed
  const markLessonCompleted = (videoId) => {
    if (!completedLessons.includes(videoId)) {
      const newCompletedLessons = [...completedLessons, videoId];
      setCompletedLessons(newCompletedLessons);

      // Update progress
      const totalLessons = getTotalLessons();
      const newProgress = Math.round(
        (newCompletedLessons.length / totalLessons) * 100
      );
      setProgress(newProgress);
    }
  };

  // Get total number of lessons
  const getTotalLessons = () => {
    if (!course || !course.curriculum) return 1;
    return course.curriculum.reduce(
      (total, module) => total + (module.video?.length || 0),
      0
    );
  };

  // Get current module and video
  const getCurrentModule = () => {
    if (!course || !course.curriculum) return null;
    return course.curriculum.find((module) => module.id === activeModuleId);
  };

  const getCurrentVideo = () => {
    const currentModule = getCurrentModule();
    if (!currentModule || !currentModule.video) return null;
    return currentModule.video.find((video) => video.id === activeVideoId);
  };

  // Navigation functions
  const goToNextLesson = () => {
    if (!course || !course.curriculum) return;

    const currentModule = getCurrentModule();
    const currentVideo = getCurrentVideo();

    if (!currentModule || !currentVideo) return;

    // Mark current lesson as completed
    markLessonCompleted(currentVideo.id);

    // Find current video index
    const currentVideoIndex = currentModule.video.findIndex(
      (v) => v.id === currentVideo.id
    );

    // If there's a next video in the current module
    if (currentVideoIndex < currentModule.video.length - 1) {
      setActiveVideoId(currentModule.video[currentVideoIndex + 1].id);
      return;
    }

    // Find current module index
    const currentModuleIndex = course.curriculum.findIndex(
      (m) => m.id === currentModule.id
    );

    // If there's a next module
    if (currentModuleIndex < course.curriculum.length - 1) {
      const nextModule = course.curriculum[currentModuleIndex + 1];
      setActiveModuleId(nextModule.id);

      // Set first video of next module as active
      if (nextModule.video && nextModule.video.length > 0) {
        setActiveVideoId(nextModule.video[0].id);
      } else {
        setActiveVideoId(null);
      }
    }
  };

  const goToPreviousLesson = () => {
    if (!course || !course.curriculum) return;

    const currentModule = getCurrentModule();
    const currentVideo = getCurrentVideo();

    if (!currentModule || !currentVideo) return;

    // Find current video index
    const currentVideoIndex = currentModule.video.findIndex(
      (v) => v.id === currentVideo.id
    );

    // If there's a previous video in the current module
    if (currentVideoIndex > 0) {
      setActiveVideoId(currentModule.video[currentVideoIndex - 1].id);
      return;
    }

    // Find current module index
    const currentModuleIndex = course.curriculum.findIndex(
      (m) => m.id === currentModule.id
    );

    // If there's a previous module
    if (currentModuleIndex > 0) {
      const prevModule = course.curriculum[currentModuleIndex - 1];
      setActiveModuleId(prevModule.id);

      // Set last video of previous module as active
      if (prevModule.video && prevModule.video.length > 0) {
        setActiveVideoId(prevModule.video[prevModule.video.length - 1].id);
      } else {
        setActiveVideoId(null);
      }
    }
  };

  const handleSelectLesson = (moduleId, videoId) => {
    setActiveModuleId(moduleId);
    setActiveVideoId(videoId);
  };

  return (
    <Layout>
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-3/4">
              <Skeleton className="h-[400px] w-full" />
            </div>
            <div className="lg:w-1/4">
              <Skeleton className="h-[400px] w-full" />
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-red-500">
            Error loading course
          </h3>
          <p className="text-muted-foreground mb-4">Please try again later</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      ) : course ? (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          {/* Top Navigation */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/portal/courses")}
              >
                <Home className="h-5 w-5" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-lg font-medium truncate max-w-[300px]">
                {course.name}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <Progress value={progress} className="w-32 h-2" />
                <p className="text-xs text-muted-foreground text-right mt-1">
                  {progress}% Complete
                </p>
              </div>

              {/* Mobile curriculum toggle */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden">
                    <List className="h-4 w-4 mr-2" />
                    Curriculum
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[300px] sm:w-[400px] p-0"
                >
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle>Course Curriculum</SheetTitle>
                  </SheetHeader>
                  <div className="overflow-y-auto h-[calc(100vh-5rem)]">
                    <CourseCurriculum
                      curriculum={course.curriculum}
                      activeModuleId={activeModuleId}
                      activeVideoId={activeVideoId}
                      completedLessons={completedLessons}
                      onSelectLesson={handleSelectLesson}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
                className="hidden md:flex"
              >
                {showSidebar ? (
                  <X className="h-4 w-4 mr-2" />
                ) : (
                  <List className="h-4 w-4 mr-2" />
                )}
                {showSidebar ? "Hide" : "Show"} Curriculum
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Curriculum Sidebar (Desktop) */}
            {showSidebar && (
              <div className="hidden md:block w-80 border-r overflow-y-auto">
                <CourseCurriculum
                  curriculum={course.curriculum}
                  activeModuleId={activeModuleId}
                  activeVideoId={activeVideoId}
                  completedLessons={completedLessons}
                  onSelectLesson={handleSelectLesson}
                />
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 md:p-6 space-y-6">
                {/* Video Player */}
                <div className="bg-black aspect-video rounded-lg overflow-hidden">
                  {getCurrentVideo()?.video ? (
                    <WistiaVideo videoId={getCurrentVideo().video} />
                  ) : course.preview_id ? (
                    <WistiaVideo videoId={course.preview_id} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white">
                      <p>No video available for this lesson</p>
                    </div>
                  )}
                </div>

                {/* Lesson Info */}
                <div>
                  <h2 className="text-2xl font-bold">
                    {getCurrentVideo()?.title ||
                      getCurrentModule()?.title ||
                      course.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-muted/50">
                      {getCurrentModule()?.title || "Module"}
                    </Badge>
                    {getCurrentVideo()?.duration && (
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {getCurrentVideo().duration}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={goToPreviousLesson}
                    disabled={
                      activeModuleId === course.curriculum[0]?.id &&
                      activeVideoId === course.curriculum[0]?.video?.[0]?.id
                    }
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous Lesson
                  </Button>

                  <Button
                    onClick={goToNextLesson}
                    disabled={
                      activeModuleId ===
                        course.curriculum[course.curriculum.length - 1]?.id &&
                      activeVideoId ===
                        course.curriculum[course.curriculum.length - 1]
                          ?.video?.[
                          course.curriculum[course.curriculum.length - 1]?.video
                            ?.length - 1
                        ]?.id
                    }
                  >
                    Next Lesson
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>

                {/* Tabs */}
                <Tabs
                  defaultValue="content"
                  value={activeTab}
                  onValueChange={setActiveTab}
                >
                  <TabsList className="mb-4">
                    <TabsTrigger value="content">Lesson Content</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="discussion">Discussion</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="mt-0">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-medium mb-3">
                          Lesson Description
                        </h3>
                        <p>
                          {getCurrentVideo()?.description ||
                            "No description available for this lesson."}
                        </p>

                        {/* Mark as Complete Button */}
                        <Button
                          className="mt-6"
                          onClick={() =>
                            markLessonCompleted(getCurrentVideo()?.id)
                          }
                          disabled={
                            !getCurrentVideo() ||
                            completedLessons.includes(getCurrentVideo()?.id)
                          }
                        >
                          {completedLessons.includes(getCurrentVideo()?.id)
                            ? "Lesson Completed"
                            : "Mark as Complete"}
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="resources" className="mt-0">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-medium mb-3">
                          Lesson Resources
                        </h3>

                        {getCurrentModule()?.course_note ? (
                          <div className="space-y-4">
                            <div className="flex items-start gap-3 p-4 border rounded-md hover:bg-muted/50">
                              <FileText className="h-8 w-8 text-blue-500" />
                              <div className="flex-1">
                                <h4 className="font-medium">
                                  {getCurrentModule().course_note.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {getCurrentModule().course_note.description ||
                                    "Course notes for this module"}
                                </p>
                              </div>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">
                            No resources available for this lesson.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="discussion" className="mt-0">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-medium mb-3">
                          Lesson Discussion
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Ask questions or share your thoughts about this
                          lesson.
                        </p>

                        <div className="text-center py-8">
                          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                          <p className="text-muted-foreground">
                            No comments yet. Be the first to start a discussion!
                          </p>
                          <Button className="mt-4">Add Comment</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Course not found</h3>
          <p className="text-muted-foreground mb-4">
            The course you're looking for doesn't exist or has been removed
          </p>
          <Button onClick={() => navigate("/portal/courses")}>
            Back to My Courses
          </Button>
        </div>
      )}
    </Layout>
  );
}

// Course Curriculum Component
function CourseCurriculum({
  curriculum,
  activeModuleId,
  activeVideoId,
  completedLessons,
  onSelectLesson,
}) {
  if (!curriculum || curriculum.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No curriculum available for this course.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-4">Course Curriculum</h3>

      <Accordion
        type="multiple"
        defaultValue={[activeModuleId]}
        className="w-full"
      >
        {curriculum.map((module, moduleIndex) => (
          <AccordionItem key={module.id} value={module.id}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-start text-left">
                <span className="mr-2">{moduleIndex + 1}.</span>
                <div>
                  <p className="font-medium">{module.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {module.video?.length || 0} lessons
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1 pl-6">
                {module.video && module.video.length > 0 ? (
                  module.video.map((video, videoIndex) => (
                    <Button
                      key={video.id}
                      variant="ghost"
                      className={`w-full justify-start text-left h-auto py-2 ${
                        activeVideoId === video.id ? "bg-muted" : ""
                      }`}
                      onClick={() => onSelectLesson(module.id, video.id)}
                    >
                      <div className="flex items-start">
                        <div className="mr-3 mt-0.5">
                          {completedLessons.includes(video.id) ? (
                            <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                          ) : (
                            <div className="h-5 w-5 rounded-full border border-muted-foreground flex items-center justify-center">
                              <PlayCircle className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-sm">
                            {moduleIndex + 1}.{videoIndex + 1} {video.title}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Video className="h-3 w-3 mr-1" />
                            {video.duration || "Video"}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground py-2 pl-2">
                    No lessons available in this module
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
