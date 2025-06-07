import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGenerateCertificateMutation } from "@/services/coursesApi";
import { useSelector } from "react-redux";
import {
  AwardIcon,
  DownloadIcon,
  GraduationCapIcon,
  UserIcon,
  CalendarIcon,
  BookOpenIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CertificateDownloadButton = ({
  course,
  variant = "default",
  size = "default",
  showPreview = false,
  className = "",
}) => {
  const toast = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);
  const [generateCertificate, { isLoading: isGeneratingCertificate }] =
    useGenerateCertificateMutation();

  const handleDownloadCertificate = async () => {
    try {
      const result = await generateCertificate({
        courseId: course.id,
        userId: currentUser?.id,
      }).unwrap();

      // Create download link
      const url = window.URL.createObjectURL(result.blob);
      const link = document.createElement("a");
      link.href = url;

      // Extract filename from content-disposition header or create default
      let filename = `Certificate-${course.name.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}-${currentUser?.first_name || "Student"}.pdf`;
      if (result.filename) {
        const matches = result.filename.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");
        }
      }

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Certificate Downloaded",
        description: `Your certificate for "${course.name}" has been downloaded successfully.`,
      });

      setShowDialog(false);
    } catch (error) {
      console.error("Certificate download error:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download certificate. Please try again.",
        variant: "destructive",
      });
    }
  };

  const CertificatePreview = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-blue-50 to-yellow-50 p-6 rounded-lg border-2 border-dashed border-blue-200">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-blue-600 to-yellow-500 p-3 rounded-full">
              <GraduationCapIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-blue-900">
            CERTIFICATE OF COMPLETION
          </h3>
          <p className="text-sm text-gray-600">This is to certify that</p>
          <p className="text-xl font-bold text-blue-800">
            {currentUser?.first_name || currentUser.first_name === ""
              ? currentUser.username
              : currentUser.first_name || currentUser?.last_name || "Student"}
          </p>
          <p className="text-sm text-gray-600">
            has successfully completed the
          </p>
          <p className="text-lg font-semibold text-blue-700">{course.name}</p>
          <p className="text-sm text-gray-600">on this day</p>
          <p className="text-base font-medium">
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <UserIcon className="h-4 w-4 text-blue-600" />
          <span>Student ID: {currentUser?.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpenIcon className="h-4 w-4 text-blue-600 " />
          <span>Course: {course.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-blue-600" />
          <span>Completed: {new Date().toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <AwardIcon className="h-4 w-4 text-blue-600 text-wrap" />
          <span>
            Certificate ID: TC-{course.id}-{currentUser?.id}
          </span>
        </div>
      </div>
    </div>
  );

  if (showPreview) {
    return (
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <Button variant={variant} size={size} className={className}>
            <AwardIcon className="h-4 w-4 mr-2" />
            Certificate
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AwardIcon className="h-5 w-5 text-blue-600" />
              Download Certificate
            </DialogTitle>
            <DialogDescription>
              Preview your certificate before downloading
            </DialogDescription>
          </DialogHeader>

          <CertificatePreview />

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleDownloadCertificate}
              disabled={isGeneratingCertificate}
              className="flex-1"
            >
              {isGeneratingCertificate ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white rounded-full border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleDownloadCertificate}
      disabled={isGeneratingCertificate}
    >
      {isGeneratingCertificate ? (
        <>
          <div className="animate-spin h-4 w-4 mr-2 border-2 border-current rounded-full border-t-transparent" />
          Generating...
        </>
      ) : (
        <>
          <AwardIcon className="h-4 w-4 mr-2" />
          Certificate
        </>
      )}
    </Button>
  );
};

export default CertificateDownloadButton;
