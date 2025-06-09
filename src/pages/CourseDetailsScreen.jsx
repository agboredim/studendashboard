"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/portal/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useGetCourseByIdQuery } from "@/services/coursesApi";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  CheckCircle,
  FileText,
  GraduationCap,
  Play,
  Share2,
  Star,
  Target,
  Video,
  X,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import WistiaVideo from "@/components/WistiaVideo";
// const baseUrl = import.meta.env.VITE_BASE_URL;

export default function CourseDetail() {
  const { courseId: id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [showPreview, setShowPreview] = useState(false); // State to control video preview visibility

  const { data: course, isLoading, error } = useGetCourseByIdQuery(id);

  const handleAddToCart = () => {
    if (!course) return;

    dispatch(
      addToCart({
        id: course.id,
        name: course.name,
        price: course.price,
        quantity: 1,
        image: course.course_image,
      })
    );

    toast({
      title: "Added to cart",
      description: `${course.name} has been added to your cart`,
    });
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Generate random rating for demo purposes
  const getRandomRating = (courseId) => {
    if (!courseId) return 4.5;
    // Use the course ID to generate a consistent rating
    const hash = courseId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (3.5 + (hash % 15) / 10).toFixed(1); // Ratings between 3.5 and 5.0
  };

  // Generate random student count for demo purposes
  const getRandomStudentCount = (courseId) => {
    if (!courseId) return 500;
    // Use the course ID to generate a consistent count
    const hash = courseId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 50 + (hash % 950); // Between 50 and 999 students
  };

  // Get instructor initials
  const getInstructorInitials = (instructor) => {
    if (!instructor) return "IN";
    return (
      (instructor.first_name?.[0] || "") + (instructor.last_name?.[0] || "")
    );
  };

  // Count total videos in curriculum
  const getTotalVideos = (curriculum) => {
    if (!curriculum) return 0;
    return curriculum.reduce(
      (total, module) => total + (module.video?.length || 0),
      0
    );
  };

  // Count total modules in curriculum
  const getTotalModules = (curriculum) => {
    if (!curriculum) return 0;
    return curriculum.length;
  };

  // Calculate total course duration in minutes
  const getTotalDuration = (curriculum) => {
    if (!curriculum) return 0;
    let totalMinutes = 0;

    curriculum.forEach((module) => {
      if (module.video) {
        module.video.forEach((video) => {
          if (video.duration) {
            // Parse duration like "24 minutes" to get the number
            const minutes = Number.parseInt(video.duration.split(" ")[0]);
            if (!isNaN(minutes)) {
              totalMinutes += minutes;
            }
          }
        });
      }
    });

    return totalMinutes;
  };

  // Format duration from minutes to hours and minutes
  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hour${hours > 1 ? "s" : ""}${
      remainingMinutes > 0 ? ` ${remainingMinutes} min` : ""
    }`;
  };

  return (
    <Layout>
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Card>
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <Skeleton className="h-64 w-full md:w-1/3" />
                <div className="p-6 flex-1">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-red-500">
            Error loading course
          </h3>
          <p className="text-muted-foreground">Please try again later</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      ) : course ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <h1 className="text-2xl font-bold">{course.name}</h1>
            <Button
              onClick={() => navigate("/portal/library")}
              variant="outline"
            >
              Back to Titans Courses
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Preview */}
              <Card className="overflow-hidden">
                <div className="relative h-64 md:h-80 w-full bg-muted">
                  {showPreview && course.preview_id ? (
                    <div className="absolute inset-0 bg-black flex flex-col">
                      <div className="flex justify-end p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                          onClick={() => setShowPreview(false)}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <WistiaVideo videoId={course.preview_id} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <img
                        // src={`${baseUrl}${course.course_image}`}
                        src={course.course_image}
                        alt={course.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        {course.preview_id && (
                          <Button
                            size="lg"
                            className="rounded-full"
                            onClick={() => setShowPreview(true)}
                          >
                            <Play className="h-6 w-6 mr-2" /> Watch Preview
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </Card>

              {/* Course Tabs */}
              <Tabs
                defaultValue="overview"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="instructor">Instructor</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About This Course</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>{course.description}</p>

                      {/* Learning Outcomes */}
                      {course.learning_outcomes &&
                        Object.values(course.learning_outcomes).some(
                          Boolean
                        ) && (
                          <div className="mt-6">
                            <h3 className="font-semibold text-lg mb-3">
                              What You'll Learn
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {Object.values(course.learning_outcomes)
                                .filter(Boolean)
                                .map((outcome, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{outcome}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                      {/* Target Audience */}
                      {course.target_audience &&
                        Object.values(course.target_audience).some(Boolean) && (
                          <div className="mt-6">
                            <h3 className="font-semibold text-lg mb-3">
                              Who This Course is For
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {Object.values(course.target_audience)
                                .filter(Boolean)
                                .map((audience, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <Target className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <span>{audience}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                      {/* Required Materials */}
                      {course.required_materials &&
                        Object.values(course.required_materials).some(
                          Boolean
                        ) && (
                          <div className="mt-6">
                            <h3 className="font-semibold text-lg mb-3">
                              Requirements
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {Object.values(course.required_materials)
                                .filter(Boolean)
                                .map((material, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <FileText className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                    <span>{material}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Curriculum Tab */}
                <TabsContent value="curriculum" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Curriculum</CardTitle>
                      <CardDescription>
                        {getTotalModules(course.curriculum)} modules •{" "}
                        {getTotalVideos(course.curriculum)} lessons •{" "}
                        {formatDuration(getTotalDuration(course.curriculum))}{" "}
                        total length
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {course.curriculum && course.curriculum.length > 0 ? (
                          course.curriculum.map((module, moduleIndex) => (
                            <AccordionItem
                              key={module.id}
                              value={`module-${module.id}`}
                            >
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex justify-between items-center w-full pr-4">
                                  <span>
                                    {moduleIndex + 1}. {module.title}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {module.video?.length || 0} lessons
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2 pt-2">
                                  {module.video && module.video.length > 0 ? (
                                    module.video.map((video, videoIndex) => (
                                      <div
                                        key={video.id}
                                        className="flex items-center justify-between p-3 rounded-md hover:bg-muted"
                                      >
                                        <div className="flex items-center">
                                          <Video className="h-5 w-5 mr-3 text-muted-foreground" />
                                          <span>
                                            {moduleIndex + 1}.{videoIndex + 1}{" "}
                                            {video.title}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <span className="text-sm text-muted-foreground">
                                            {video.duration}
                                          </span>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            disabled
                                          >
                                            <Play className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-center py-2 text-muted-foreground">
                                      No lessons available in this module yet
                                    </div>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))
                        ) : (
                          <div className="text-center py-6 text-muted-foreground">
                            Curriculum details are being updated
                          </div>
                        )}
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Instructor Tab */}
                <TabsContent value="instructor" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Meet Your Instructor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {course.instructor ? (
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex flex-col items-center md:items-start">
                            <Avatar className="h-24 w-24 mb-3">
                              <AvatarImage
                                // src={`${baseUrl}${course.instructor.profile_picture}`}
                                src={course.instructor.profile_picture}
                                alt={`${course.instructor.first_name} ${course.instructor.last_name}`}
                              />
                              <AvatarFallback className="text-lg">
                                {getInstructorInitials(course.instructor)}
                              </AvatarFallback>
                            </Avatar>
                            <h3 className="text-lg font-medium">
                              {course.instructor.first_name}{" "}
                              {course.instructor.last_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {course.instructor.role}
                            </p>
                          </div>

                          <div className="space-y-3 flex-1">
                            {course.instructor.bio && (
                              <p>{course.instructor.bio}</p>
                            )}
                            {course.instructor.past_experience && (
                              <div>
                                <h4 className="font-medium mb-1">Experience</h4>
                                <p className="text-sm">
                                  {course.instructor.past_experience}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          Instructor information is not available
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Student Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        <div className="flex flex-col items-center">
                          <div className="text-5xl font-bold">
                            {getRandomRating(course.id)}
                          </div>
                          <div className="flex text-amber-500 my-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-5 w-5 ${
                                  star <= Math.floor(getRandomRating(course.id))
                                    ? "fill-current"
                                    : star - 0.5 <= getRandomRating(course.id)
                                    ? "fill-current text-amber-500/50"
                                    : ""
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Based on {getRandomStudentCount(course.id)} reviews
                          </p>
                        </div>

                        <div className="flex-1 w-full">
                          <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => {
                              // Generate random percentage for each rating
                              const hash = (course.id + rating)
                                .split("")
                                .reduce(
                                  (acc, char) => acc + char.charCodeAt(0),
                                  0
                                );
                              const percentage =
                                rating === 5
                                  ? 65 + (hash % 20)
                                  : rating === 4
                                  ? 15 + (hash % 15)
                                  : 5 + (hash % 5);

                              return (
                                <div
                                  key={rating}
                                  className="flex items-center gap-3"
                                >
                                  <div className="flex items-center w-16">
                                    <span className="text-sm">{rating}</span>
                                    <Star className="h-4 w-4 ml-1 fill-current text-amber-500" />
                                  </div>
                                  <Progress
                                    value={percentage}
                                    className="h-2 flex-1"
                                  />
                                  <span className="text-sm text-muted-foreground w-12">
                                    {percentage}%
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 text-center">
                        <p className="text-muted-foreground mb-3">
                          Detailed reviews will be available after enrollment
                        </p>
                        <Button variant="outline">Write a Review</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Info Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl font-bold mb-4">
                    {formatPrice(course.price)}
                  </div>

                  <div className="space-y-4">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleAddToCart}
                    >
                      Enroll Now
                    </Button>

                    <Button variant="outline" className="w-full" size="lg">
                      <Share2 className="mr-2 h-4 w-4" /> Share Course
                    </Button>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Enrolled Students
                      </span>
                      <span className="font-medium">
                        {course.students || getRandomStudentCount(course.id)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Course Level
                      </span>
                      <Badge variant="outline">
                        {course.level.charAt(0).toUpperCase() +
                          course.level.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">
                        {course.estimated_time}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Lessons</span>
                      <span className="font-medium">
                        {getTotalVideos(course.curriculum)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Category</span>
                      <Badge variant="outline">
                        {course.category?.name.charAt(0).toUpperCase() +
                          course.category?.name.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Video className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Video Lessons</h4>
                      <p className="text-sm text-muted-foreground">
                        {getTotalVideos(course.curriculum)} professional video
                        lessons
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Course Materials</h4>
                      <p className="text-sm text-muted-foreground">
                        Downloadable resources and notes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Certificate</h4>
                      <p className="text-sm text-muted-foreground">
                        Earn a certificate upon completion
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Lifetime Access</h4>
                      <p className="text-sm text-muted-foreground">
                        Learn at your own pace
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Courses */}
          <Card>
            <CardHeader>
              <CardTitle>You Might Also Like</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-muted-foreground">
                Related courses will be shown based on your interests
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Course not found</h3>
          <p className="text-muted-foreground mb-4">
            The course you're looking for doesn't exist or has been removed
          </p>
          <Button onClick={() => navigate("/portal/library")}>
            Browse Courses
          </Button>
        </div>
      )}
    </Layout>
  );
}
