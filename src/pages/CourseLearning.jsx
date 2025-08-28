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

  useEffect(() => {
    if (course && course.curriculum?.length > 0) {
      const firstModule = course.curriculum[0];
      setActiveModuleId(firstModule.id);

      if (firstModule.video?.length > 0) {
        setActiveVideoId(firstModule.video[0].id);
      }
    }
  }, [course]);

  const markLessonCompleted = (videoId) => {
    if (!completedLessons.includes(videoId)) {
      const newCompleted = [...completedLessons, videoId];
      setCompletedLessons(newCompleted);
      const totalLessons = getTotalLessons();
      const newProgress = Math.round(
        (newCompleted.length / totalLessons) * 100
      );
      setProgress(newProgress);
    }
  };

  const getTotalLessons = () =>
    course?.curriculum?.reduce(
      (total, module) => total + (module.video?.length || 0),
      0
    ) || 1;

  const getCurrentModule = () =>
    course?.curriculum?.find((m) => m.id === activeModuleId) || null;

  const getCurrentVideo = () => {
    const module = getCurrentModule();
    return module?.video?.find((v) => v.id === activeVideoId) || null;
  };

  const goToNextLesson = () => {
    if (!course) return;
    const module = getCurrentModule();
    const video = getCurrentVideo();
    if (!module || !video) return;

    markLessonCompleted(video.id);
    const vidIndex = module.video.findIndex((v) => v.id === video.id);

    if (vidIndex < module.video.length - 1) {
      setActiveVideoId(module.video[vidIndex + 1].id);
      return;
    }

    const modIndex = course.curriculum.findIndex((m) => m.id === module.id);
    if (modIndex < course.curriculum.length - 1) {
      const nextModule = course.curriculum[modIndex + 1];
      setActiveModuleId(nextModule.id);
      if (nextModule.video?.length > 0) {
        setActiveVideoId(nextModule.video[0].id);
      }
    }
  };

  const goToPreviousLesson = () => {
    if (!course) return;
    const module = getCurrentModule();
    const video = getCurrentVideo();
    if (!module || !video) return;

    const vidIndex = module.video.findIndex((v) => v.id === video.id);
    if (vidIndex > 0) {
      setActiveVideoId(module.video[vidIndex - 1].id);
      return;
    }

    const modIndex = course.curriculum.findIndex((m) => m.id === module.id);
    if (modIndex > 0) {
      const prevModule = course.curriculum[modIndex - 1];
      setActiveModuleId(prevModule.id);
      if (prevModule.video?.length > 0) {
        setActiveVideoId(prevModule.video[prevModule.video.length - 1].id);
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
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState />
      ) : course ? (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          {/* Header */}
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
              <Progress value={progress} className="w-32 h-2 hidden md:block" />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden">
                    <List className="h-4 w-4 mr-2" /> Curriculum
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0">
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
                {showSidebar ? <X className="h-4 w-4 mr-2" /> : <List className="h-4 w-4 mr-2" />}
                {showSidebar ? "Hide" : "Show"} Curriculum
              </Button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
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

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {/* Video Player */}
              <div className="bg-black aspect-video rounded-lg overflow-hidden flex items-center justify-center">
                {getCurrentVideo()?.video_file ? (
                  <video
                    src={getCurrentVideo().video_file}
                    controls
                    className="w-full h-full"
                  />
                ) : course.preview_id ? (
                  <video src={course.preview_id} controls className="w-full h-full" />
                ) : (
                  <p className="text-white">No video available</p>
                )}
              </div>

              {/* Lesson Info */}
              <div>
                <h2 className="text-2xl font-bold">
                  {getCurrentVideo()?.title || getCurrentModule()?.title || course.name}
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
                  <ChevronLeft className="h-4 w-4 mr-2" /> Previous Lesson
                </Button>
                <Button
                  onClick={goToNextLesson}
                  disabled={
                    activeModuleId === course.curriculum[course.curriculum.length - 1]?.id &&
                    activeVideoId ===
                      course.curriculum[course.curriculum.length - 1]?.video?.slice(-1)[0]?.id
                  }
                >
                  Next Lesson <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="content">Lesson Content</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="discussion">Discussion</TabsTrigger>
                </TabsList>

                {/* Content Tab */}
                <TabsContent value="content">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-3">Lesson Description</h3>
                      <p>{getCurrentVideo()?.description || "No description available."}</p>
                      <Button
                        className="mt-6"
                        onClick={() => markLessonCompleted(getCurrentVideo()?.id)}
                        disabled={!getCurrentVideo() || completedLessons.includes(getCurrentVideo()?.id)}
                      >
                        {completedLessons.includes(getCurrentVideo()?.id)
                          ? "Lesson Completed"
                          : "Mark as Complete"}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Resources */}
                <TabsContent value="resources">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-3">Lesson Resources</h3>
                      {getCurrentModule()?.course_note ? (
                        <div className="flex items-start gap-3 p-4 border rounded-md">
                          <FileText className="h-8 w-8 text-blue-500" />
                          <div className="flex-1">
                            <h4 className="font-medium">{getCurrentModule().course_note.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {getCurrentModule().course_note.description || "Course notes"}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" /> Download
                          </Button>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No resources available.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Discussion */}
                <TabsContent value="discussion">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground">No comments yet.</p>
                      <Button className="mt-4">Add Comment</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      ) : (
        <ErrorState notFound />
      )}
    </Layout>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="flex flex-col lg:flex-row gap-6">
        <Skeleton className="h-[400px] w-full lg:w-3/4" />
        <Skeleton className="h-[400px] w-full lg:w-1/4" />
      </div>
    </div>
  );
}

function ErrorState({ notFound }) {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-red-500">
        {notFound ? "Course not found" : "Error loading course"}
      </h3>
      <p className="text-muted-foreground mb-4">
        {notFound
          ? "This course doesn't exist or has been removed."
          : "Please try again later."}
      </p>
      <Button onClick={() => window.location.reload()}>Retry</Button>
    </div>
  );
}

function CourseCurriculum({ curriculum, activeModuleId, activeVideoId, completedLessons, onSelectLesson }) {
  if (!curriculum?.length) {
    return <p className="p-4 text-center text-muted-foreground">No curriculum available.</p>;
  }

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-4">Course Curriculum</h3>
      <Accordion type="multiple" defaultValue={[activeModuleId]}>
        {curriculum.map((module, moduleIndex) => (
          <AccordionItem key={module.id} value={module.id}>
            <AccordionTrigger>
              <span className="mr-2">{moduleIndex + 1}.</span>
              <span>{module.title}</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1 pl-6">
                {module.video?.length ? (
                  module.video.map((video, videoIndex) => (
                    <Button
                      key={video.id}
                      variant="ghost"
                      className={`w-full justify-start text-left h-auto py-2 ${
                        activeVideoId === video.id ? "bg-muted" : ""
                      }`}
                      onClick={() => onSelectLesson(module.id, video.id)}
                    >
                      <div className="flex items-center gap-2">
                        {completedLessons.includes(video.id) ? (
                          <CheckCircle className="text-green-500" />
                        ) : (
                          <PlayCircle className="text-gray-500" />
                        )}
                        <span>{`${moduleIndex + 1}.${videoIndex + 1} ${video.title}`}</span>
                      </div>
                    </Button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No lessons</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
