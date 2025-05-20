"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/portal/layout";
import { useSelector } from "react-redux";
import { useGetAllLibraryMaterialsQuery } from "@/services/coursesApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpenIcon,
  FileTextIcon,
  LinkIcon,
  SearchIcon,
  FilterIcon,
  ExternalLinkIcon,
  ClockIcon,
  ArrowUpDownIcon,
  MoreHorizontalIcon,
  BookmarkIcon,
  BookmarkPlusIcon,
  ShareIcon,
  DownloadIcon,
  ChevronRightIcon,
} from "lucide-react";

export default function CourseLibrary() {
  const navigate = useNavigate();
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [savedMaterials, setSavedMaterials] = useState([]);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  // Get current user from Redux store
  const currentUser = useSelector((state) => state.auth.user);

  // Fetch library materials using RTK Query
  const {
    data: materials = [],
    isLoading,
    error,
  } = useGetAllLibraryMaterialsQuery();

  useEffect(() => {
    // Load saved materials from localStorage
    const saved = localStorage.getItem("savedLibraryMaterials");
    if (saved) {
      setSavedMaterials(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Filter materials based on search query and active tab
    let filtered = [...materials];

    if (searchQuery) {
      filtered = filtered.filter((material) =>
        material.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeTab !== "all") {
      if (activeTab === "documents") {
        filtered = filtered.filter((material) => material.file);
      } else if (activeTab === "links") {
        filtered = filtered.filter((material) => material.url);
      } else if (activeTab === "saved") {
        filtered = filtered.filter((material) =>
          savedMaterials.includes(material.id)
        );
      } else {
        // For category filtering, we need to check if the category exists
        // Since the API might not return category, we'll need to handle that case
        filtered = filtered.filter(
          (material) =>
            material.category &&
            material.category.toLowerCase() === activeTab.toLowerCase()
        );
      }
    }

    // Sort materials
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);

      if (sortOrder === "newest") {
        return dateB - dateA;
      } else if (sortOrder === "oldest") {
        return dateA - dateB;
      } else if (sortOrder === "a-z") {
        return a.title.localeCompare(b.title);
      } else if (sortOrder === "z-a") {
        return b.title.localeCompare(a.title);
      }

      return 0;
    });

    setFilteredMaterials(filtered);
  }, [materials, searchQuery, activeTab, sortOrder, savedMaterials]);

  const handleViewDetails = (id) => {
    navigate(`/portal/library/${id}`);
  };

  const handleSaveMaterial = (id, event) => {
    event.stopPropagation();
    let newSavedMaterials;

    if (savedMaterials.includes(id)) {
      newSavedMaterials = savedMaterials.filter(
        (materialId) => materialId !== id
      );
    } else {
      newSavedMaterials = [...savedMaterials, id];
    }

    setSavedMaterials(newSavedMaterials);
    // Save to localStorage for persistence
    localStorage.setItem(
      "savedLibraryMaterials",
      JSON.stringify(newSavedMaterials)
    );
  };

  const handleOpenExternalLink = (url, event) => {
    event.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getUniqueCategories = () => {
    // Extract categories from materials, handling the case where category might not exist
    const categories = materials
      .filter((material) => material.category)
      .map((material) => material.category);

    // Return unique categories
    return [...new Set(categories)];
  };

  // Get course name from course_id
  const getCourseName = (courseId) => {
    // This would ideally come from a mapping or another API call
    // For now, we'll use a simple mapping
    const courseMap = {
      "6828477f04ee1e945fa33bef": "AML/KYC Compliance",
      "681a7bca07f36a7c58e11cd3": "Data Analysis",
    };

    return courseMap[courseId] || "Unknown Course";
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Course Library
            </h1>
            <p className="text-muted-foreground mt-1">
              Access supplementary materials and resources for your courses
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <ArrowUpDownIcon className="h-4 w-4" />
                  {sortOrder === "newest"
                    ? "Newest"
                    : sortOrder === "oldest"
                    ? "Oldest"
                    : sortOrder === "a-z"
                    ? "A-Z"
                    : "Z-A"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={() => setSortOrder("newest")}>
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
                  Oldest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("a-z")}>
                  A-Z
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("z-a")}>
                  Z-A
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-64 lg:w-72 space-y-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search library..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="bg-card border rounded-lg p-4 space-y-3">
              <h3 className="font-medium text-sm">Filter By</h3>

              <div className="space-y-1">
                <Button
                  variant={activeTab === "all" ? "default" : "ghost"}
                  className="w-full justify-start h-9"
                  onClick={() => setActiveTab("all")}
                >
                  <BookOpenIcon className="h-4 w-4 mr-2" />
                  All Materials
                </Button>

                <Button
                  variant={activeTab === "documents" ? "default" : "ghost"}
                  className="w-full justify-start h-9"
                  onClick={() => setActiveTab("documents")}
                >
                  <FileTextIcon className="h-4 w-4 mr-2" />
                  Documents
                </Button>

                <Button
                  variant={activeTab === "links" ? "default" : "ghost"}
                  className="w-full justify-start h-9"
                  onClick={() => setActiveTab("links")}
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  External Links
                </Button>

                <Button
                  variant={activeTab === "saved" ? "default" : "ghost"}
                  className="w-full justify-start h-9"
                  onClick={() => setActiveTab("saved")}
                >
                  <BookmarkIcon className="h-4 w-4 mr-2" />
                  Saved Materials
                </Button>
              </div>

              {getUniqueCategories().length > 0 && (
                <div className="pt-2">
                  <h3 className="font-medium text-sm mb-2">Categories</h3>
                  <ScrollArea className="h-[180px] pr-3">
                    <div className="space-y-1">
                      {getUniqueCategories().map((category, index) => (
                        <Button
                          key={index}
                          variant={
                            activeTab === category.toLowerCase()
                              ? "default"
                              : "ghost"
                          }
                          className="w-full justify-start h-9"
                          onClick={() => setActiveTab(category.toLowerCase())}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            {isLoading ? (
              <div className="space-y-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <Skeleton className="h-10 w-10 rounded-md" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="flex gap-2 pt-1">
                              <Skeleton className="h-5 w-16 rounded-full" />
                              <Skeleton className="h-5 w-24 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            ) : error ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <SearchIcon className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-red-600">
                    Error loading materials
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    We encountered an error while loading the library materials.
                    Please try again later.
                  </p>
                  <Button onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </CardContent>
              </Card>
            ) : filteredMaterials.length > 0 ? (
              <div className="space-y-4">
                {filteredMaterials.map((material) => (
                  <Card
                    key={material.id}
                    className="overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer"
                    onClick={() => handleViewDetails(material.id)}
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`h-10 w-10 rounded-md flex items-center justify-center ${
                            material.file
                              ? "bg-blue-100 text-blue-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {material.file ? (
                            <FileTextIcon className="h-5 w-5" />
                          ) : (
                            <LinkIcon className="h-5 w-5" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-lg">
                              {material.title}
                            </h3>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) =>
                                  handleSaveMaterial(material.id, e)
                                }
                              >
                                {savedMaterials.includes(material.id) ? (
                                  <BookmarkIcon className="h-4 w-4 text-primary" />
                                ) : (
                                  <BookmarkPlusIcon className="h-4 w-4" />
                                )}
                              </Button>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <MoreHorizontalIcon className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewDetails(material.id);
                                    }}
                                  >
                                    View Details
                                  </DropdownMenuItem>
                                  {material.url && (
                                    <DropdownMenuItem
                                      onClick={(e) =>
                                        handleOpenExternalLink(material.url, e)
                                      }
                                    >
                                      Open Link
                                    </DropdownMenuItem>
                                  )}
                                  {material.file && (
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(
                                          `${baseUrl}${material.file}`,
                                          "_blank"
                                        );
                                      }}
                                    >
                                      Download
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Share logic would go here
                                      navigator.clipboard.writeText(
                                        window.location.origin +
                                          `/portal/library/${material.id}`
                                      );
                                      alert("Link copied to clipboard!");
                                    }}
                                  >
                                    Share
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <ClockIcon className="h-3.5 w-3.5" />
                            <span>Added {formatDate(material.created_at)}</span>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {material.category && (
                              <Badge variant="outline" className="bg-muted/50">
                                {material.category}
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={
                                material.file
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-green-50 text-green-700 border-green-200"
                              }
                            >
                              {material.file ? "Document" : "External Link"}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-muted-foreground">
                              {getCourseName(material.course_id)}
                            </div>

                            <div className="flex items-center text-sm font-medium text-primary">
                              View Details
                              <ChevronRightIcon className="h-4 w-4 ml-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <SearchIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No materials found
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    {searchQuery
                      ? `No results found for "${searchQuery}". Try a different search term or clear your filters.`
                      : activeTab === "saved"
                      ? "You haven't saved any materials yet. Click the bookmark icon to save materials for quick access."
                      : "No materials found with the current filters. Try adjusting your filters or check back later."}
                  </p>
                  {searchQuery && (
                    <Button onClick={() => setSearchQuery("")}>
                      Clear Search
                    </Button>
                  )}
                  {activeTab !== "all" && !searchQuery && (
                    <Button onClick={() => setActiveTab("all")}>
                      View All Materials
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
