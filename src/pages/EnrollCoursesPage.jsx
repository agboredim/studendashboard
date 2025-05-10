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
import {
  useGetAllCoursesQuery,
  useGetCoursesByCategoryQuery,
  useSearchCoursesQuery,
} from "@/services/coursesApi";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Clock,
  Users,
  Filter,
  ChevronDown,
  GraduationCap,
  Bookmark,
  Star,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const baseUrl = import.meta.env.VITE_BASE_URL;
export default function CourseLibrary() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [filterLevel, setFilterLevel] = useState("all");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const dispatch = useDispatch();
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

  // Fetch all courses
  const {
    data: allCourses,
    isLoading: isAllCoursesLoading,
    error: allCoursesError,
  } = useGetAllCoursesQuery(undefined, {
    skip: activeTab !== "all" || debouncedSearchTerm !== "",
  });

  // Fetch courses by category
  const {
    data: categoryCoursesData,
    isLoading: isCategoryCoursesLoading,
    error: categoryCoursesError,
  } = useGetCoursesByCategoryQuery(activeTab, {
    skip: activeTab === "all" || debouncedSearchTerm !== "",
  });

  // Search courses
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearchCoursesQuery(debouncedSearchTerm, {
    skip: debouncedSearchTerm === "",
  });

  // Determine which courses to display
  const getDisplayCourses = () => {
    if (debouncedSearchTerm) return searchResults || [];
    if (activeTab !== "all") return categoryCoursesData || [];
    return allCourses || [];
  };

  const isLoading =
    isAllCoursesLoading || isCategoryCoursesLoading || isSearchLoading;
  const error = allCoursesError || categoryCoursesError || searchError;

  // Apply filters and sorting
  const getFilteredAndSortedCourses = () => {
    let courses = getDisplayCourses();

    // Apply level filter
    if (filterLevel !== "all") {
      courses = courses.filter((course) => course.level === filterLevel);
    }

    // Apply sorting
    return [...courses].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return (
            new Date(b.created_at || Date.now()) -
            new Date(a.created_at || Date.now())
          );
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "popular":
        default:
          // Sort by number of students (or a default order if students is null)
          return (b.students || 0) - (a.students || 0);
      }
    });
  };

  const filteredCourses = getFilteredAndSortedCourses();

  const handleAddToCart = (course) => {
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

  const handleViewCourse = (courseId) => {
    navigate(`/portal/enroll-courses/${courseId}`);
  };

  // Get all available categories from courses
  const getCategories = () => {
    if (!allCourses) return [];
    const categories = allCourses
      .map((course) => course.category?.name)
      .filter(Boolean);
    return [...new Set(categories)];
  };

  const categories = getCategories();

  // Get all available levels from courses
  const getLevels = () => {
    if (!allCourses) return [];
    const levels = allCourses.map((course) => course.level).filter(Boolean);
    return [...new Set(levels)];
  };

  const levels = getLevels();

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
    // Use the course ID to generate a consistent rating
    const hash = courseId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (3.5 + (hash % 15) / 10).toFixed(1); // Ratings between 3.5 and 5.0
  };

  // Generate random student count for demo purposes
  const getRandomStudentCount = (courseId) => {
    // Use the course ID to generate a consistent count
    const hash = courseId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 50 + (hash % 950); // Between 50 and 999 students
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with search and filters */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <h1 className="text-2xl font-bold">Enroll For a new Course</h1>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Desktop filters */}
              <div className="hidden md:flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Filter by Level</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setFilterLevel("all")}>
                      All Levels
                    </DropdownMenuItem>
                    {levels.map((level) => (
                      <DropdownMenuItem
                        key={level}
                        onClick={() => setFilterLevel(level)}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex gap-2">
                      Sort <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSortBy("popular")}>
                      Most Popular
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("newest")}>
                      Newest
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("price-low")}>
                      Price: Low to High
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("price-high")}>
                      Price: High to Low
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("name-asc")}>
                      Name: A to Z
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("name-desc")}>
                      Name: Z to A
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile filters */}
              <div className="md:hidden">
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline" className="w-full flex gap-2">
                      <Filter className="h-4 w-4" />
                      Filters & Sort
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Filters & Sorting</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Filter by Level</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant={
                              filterLevel === "all" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setFilterLevel("all")}
                          >
                            All Levels
                          </Button>
                          {levels.map((level) => (
                            <Button
                              key={level}
                              variant={
                                filterLevel === level ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setFilterLevel(level)}
                            >
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Sort By</h3>
                        <div className="grid grid-cols-1 gap-2">
                          <Button
                            variant={
                              sortBy === "popular" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setSortBy("popular")}
                          >
                            Most Popular
                          </Button>
                          <Button
                            variant={
                              sortBy === "newest" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setSortBy("newest")}
                          >
                            Newest
                          </Button>
                          <Button
                            variant={
                              sortBy === "price-low" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setSortBy("price-low")}
                          >
                            Price: Low to High
                          </Button>
                          <Button
                            variant={
                              sortBy === "price-high" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setSortBy("price-high")}
                          >
                            Price: High to Low
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex w-full h-auto flex-wrap justify-start">
            <TabsTrigger value="all" className="mb-1">
              All Courses
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="mb-1">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {/* Active filters display */}
            {(filterLevel !== "all" || sortBy !== "popular") && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filterLevel !== "all" && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Level:{" "}
                    {filterLevel.charAt(0).toUpperCase() + filterLevel.slice(1)}
                    <button
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                      onClick={() => setFilterLevel("all")}
                    >
                      ✕
                    </button>
                  </Badge>
                )}
                <Badge variant="outline" className="flex items-center gap-1">
                  Sort:{" "}
                  {sortBy === "price-low"
                    ? "Price ↑"
                    : sortBy === "price-high"
                    ? "Price ↓"
                    : sortBy}
                  <button
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                    onClick={() => setSortBy("popular")}
                  >
                    ✕
                  </button>
                </Badge>
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="p-0">
                        <Skeleton className="h-48 w-full rounded-t-lg" />
                      </CardHeader>
                      <CardContent className="p-4 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex gap-2 mt-2">
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-9 w-24" />
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-red-500">
                  Error loading courses
                </h3>
                <p className="text-muted-foreground">Please try again later</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4"
                >
                  Retry
                </Button>
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="overflow-hidden flex flex-col"
                  >
                    <div className="relative">
                      <img
                        src={`${baseUrl}${course.course_image}`}
                        alt={course.name}
                        className="h-48 w-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Badge className="bg-primary/90 hover:bg-primary">
                          {course.level.charAt(0).toUpperCase() +
                            course.level.slice(1)}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 left-2 bg-background/80 hover:bg-background/90 rounded-full h-8 w-8"
                      >
                        <Bookmark className="h-4 w-4" />
                        <span className="sr-only">Save course</span>
                      </Button>
                    </div>
                    <CardContent className="p-4 flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="bg-muted/50">
                          {course.category?.name.charAt(0).toUpperCase() +
                            course.category?.name.slice(1)}
                        </Badge>
                        <div className="flex items-center text-amber-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-xs font-medium ml-1">
                            {getRandomRating(course.id)}
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-lg line-clamp-2 h-14">
                        {course.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2 h-10">
                        {course.preview_description ||
                          course.description.substring(0, 100) + "..."}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <GraduationCap className="h-3.5 w-3.5 mr-1" />
                          <span>
                            {course.instructor?.first_name +
                              " " +
                              course.instructor?.last_name}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>{course.estimated_time}</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Users className="h-3.5 w-3.5 mr-1" />
                          <span>
                            {course.students ||
                              getRandomStudentCount(course.id)}{" "}
                            students
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center border-t mt-2">
                      <div className="font-bold">
                        {formatPrice(course.price)}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewCourse(course.id)}
                        >
                          Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(course)}
                        >
                          Enroll
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No courses found</h3>
                <p className="text-muted-foreground">
                  {debouncedSearchTerm
                    ? `No results for "${debouncedSearchTerm}"`
                    : filterLevel !== "all"
                    ? `No ${filterLevel} level courses found in this category`
                    : "There are no courses in this category yet"}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
