"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/portal/layout";
import { useSelector } from "react-redux";
import {
  useGetLibraryMaterialByIdQuery,
  useGetAllLibraryMaterialsQuery,
} from "@/services/coursesApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeftIcon,
  ExternalLinkIcon,
  FileTextIcon,
  LinkIcon,
  DownloadIcon,
  ShareIcon,
  BookmarkIcon,
  BookmarkPlusIcon,
  ClockIcon,
  CalendarIcon,
  InfoIcon,
  CheckCircleIcon,
  EyeIcon,
  UserIcon,
  BookOpenIcon,
} from "lucide-react";

export default function CourseLibraryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [relatedMaterials, setRelatedMaterials] = useState([]);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  // Get current user from Redux store
//   const currentUser = useSelector((state) => state.auth.user);

  // Fetch the specific library material
  const {
    data: material,
    isLoading,
    error,
  } = useGetLibraryMaterialByIdQuery(id);

  // Fetch all library materials for related materials
  const { data: allMaterials = [] } = useGetAllLibraryMaterialsQuery();

  useEffect(() => {
    // Check if this material is saved
    const savedMaterials = JSON.parse(
      localStorage.getItem("savedLibraryMaterials") || "[]"
    );
    setIsSaved(savedMaterials.includes(id));

    // Find related materials (same course or category)
    if (material && allMaterials.length > 0) {
      const related = allMaterials
        .filter(
          (item) =>
            item.id !== material.id &&
            (item.id === material.id ||
              (item.category &&
                material.category &&
                item.category === material.category))
        )
        .slice(0, 3); // Limit to 3 related materials

      setRelatedMaterials(related);
    }
  }, [id, material, allMaterials]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleToggleSave = () => {
    const savedMaterials = JSON.parse(
      localStorage.getItem("savedLibraryMaterials") || "[]"
    );
    let newSavedMaterials;

    if (isSaved) {
      newSavedMaterials = savedMaterials.filter(
        (materialId) => materialId !== id
      );
    } else {
      newSavedMaterials = [...savedMaterials, id];
    }

    localStorage.setItem(
      "savedLibraryMaterials",
      JSON.stringify(newSavedMaterials)
    );
    setIsSaved(!isSaved);
  };

  const handleOpenExternalLink = () => {
    if (material?.url) {
      window.open(material.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownload = () => {
    if (material?.file) {
      window.open(`${baseUrl}${material.file}`, "_blank");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCourseName = (courseId) => {
    // This would ideally come from a mapping or another API call
    const courseMap = {
      "6828477f04ee1e945fa33bef": "AML/KYC Compliance",
      "681a7bca07f36a7c58e11cd3": "Data Analysis",
    };

    return courseMap[courseId] || "Unknown Course";
  };

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </Button>
          </div>

          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-32 rounded-full" />
            </div>

            <Skeleton className="h-64 w-full rounded-lg" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-40 rounded-lg" />
              <Skeleton className="h-40 rounded-lg" />
              <Skeleton className="h-40 rounded-lg" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error || !material) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <InfoIcon className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-red-600 mb-2">
            Material Not Found
          </h3>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            We couldn't find the library material you're looking for. It may
            have been removed or you may have followed an invalid link.
          </p>
          <Button onClick={handleGoBack}>Go Back</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={handleGoBack}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Library
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {material.title}
              </h1>
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
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200"
                >
                  {getCourseName(material.id)}
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {material.url && (
                <Button className="gap-1" onClick={handleOpenExternalLink}>
                  <ExternalLinkIcon className="h-4 w-4" />
                  Open Link
                </Button>
              )}

              {material.file && (
                <Button className="gap-1" onClick={handleDownload}>
                  <DownloadIcon className="h-4 w-4" />
                  Download
                </Button>
              )}

              <Button
                variant="outline"
                className="gap-1"
                onClick={handleToggleSave}
              >
                {isSaved ? (
                  <>
                    <BookmarkIcon className="h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <BookmarkPlusIcon className="h-4 w-4" />
                    Save
                  </>
                )}
              </Button>

              <Button variant="outline" className="gap-1" onClick={handleShare}>
                <ShareIcon className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="related">Related Materials</TabsTrigger>
              {material.file && (
                <TabsTrigger value="preview">Preview</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="overview" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>About This Resource</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {/* If there's no description in the API, provide a generic one */}
                    {material.description ||
                      `This is a ${
                        material.file ? "document" : "link"
                      } resource for the ${getCourseName(
                        material.id
                      )} course. 
                      ${
                        material.file
                          ? "Download the document to view its contents."
                          : "Click the Open Link button to access this resource."
                      }`}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Resource Details</h3>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <UserIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="font-medium">Author/Publisher</div>
                            <div className="text-sm text-muted-foreground">
                              {material.author || "Not specified"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="font-medium">Added On</div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(material.created_at)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <BookOpenIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="font-medium">Related Course</div>
                            <div className="text-sm text-muted-foreground">
                              {getCourseName(material.course_id)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {material.url && (
                        <div>
                          <h3 className="font-medium mb-2">Resource URL</h3>
                          <div className="flex items-center gap-2">
                            <div className="bg-muted p-2 rounded text-sm flex-1 truncate">
                              {material.url}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="shrink-0"
                              onClick={handleOpenExternalLink}
                            >
                              <ExternalLinkIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {material.file && (
                        <div>
                          <h3 className="font-medium mb-2">File</h3>
                          <div className="flex items-center gap-2">
                            <div className="bg-muted p-2 rounded text-sm flex-1 truncate">
                              {material.file.split("/").pop()}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="shrink-0"
                              onClick={handleDownload}
                            >
                              <DownloadIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Resource Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      {material.file ? (
                        <>
                          <FileTextIcon className="h-6 w-6 mr-2 text-blue-600" />
                          <div className="font-medium">Document</div>
                        </>
                      ) : (
                        <>
                          <LinkIcon className="h-6 w-6 mr-2 text-green-600" />
                          <div className="font-medium">External Link</div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {material.category && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Category
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        </div>
                        <div className="font-medium">{material.category}</div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Last Accessed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <ClockIcon className="h-6 w-6 mr-2 text-primary" />
                      <div className="font-medium">Today</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="related" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Related Materials</CardTitle>
                  <CardDescription>
                    Other resources you might find useful
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {relatedMaterials.length > 0 ? (
                    <div className="space-y-4">
                      {relatedMaterials.map((relatedMaterial, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() =>
                            navigate(`/portal/library/${relatedMaterial.id}`)
                          }
                        >
                          <div
                            className={`h-10 w-10 rounded-md flex items-center justify-center ${
                              relatedMaterial.file
                                ? "bg-blue-100 text-blue-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {relatedMaterial.file ? (
                              <FileTextIcon className="h-5 w-5" />
                            ) : (
                              <LinkIcon className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {relatedMaterial.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              {relatedMaterial.category && (
                                <Badge
                                  variant="outline"
                                  className="bg-muted/50"
                                >
                                  {relatedMaterial.category}
                                </Badge>
                              )}
                              <Badge
                                variant="outline"
                                className={
                                  relatedMaterial.file
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-green-50 text-green-700 border-green-200"
                                }
                              >
                                {relatedMaterial.file
                                  ? "Document"
                                  : "External Link"}
                              </Badge>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="ml-auto">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <InfoIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        No related materials
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        There are no related materials for this resource yet.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => navigate("/portal/library")}
                      >
                        Browse All Materials
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {material.file && (
              <TabsContent value="preview" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Document Preview</CardTitle>
                    <CardDescription>
                      Preview of the document content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted rounded-lg p-6 min-h-[400px] flex items-center justify-center">
                      <div className="text-center">
                        <FileTextIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          Preview not available
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-md">
                          Document preview is not available. Please download the
                          document to view its contents.
                        </p>
                        <Button onClick={handleDownload}>
                          <DownloadIcon className="h-4 w-4 mr-2" />
                          Download Document
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
