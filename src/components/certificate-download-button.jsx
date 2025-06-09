import React, { useState, useRef } from "react";
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
import { toast } from "sonner";

const CertificateDownloadButton = ({
  course,
  variant = "default",
  size = "default",
  showPreview = true,
  className = "",
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);
  const [generateCertificate, { isLoading: isGeneratingCertificate }] =
    useGenerateCertificateMutation();
  const certificateRef = useRef(null);

  // Helper function to get student display name
  const getStudentName = () => {
    if (currentUser?.first_name && currentUser?.last_name) {
      return `${currentUser.first_name} ${currentUser.last_name}`;
    }
    if (currentUser?.first_name) {
      return currentUser.first_name;
    }
    return currentUser?.username || "Student";
  };

  // Helper function to get certificate ID
  const getCertificateId = () => {
    return `TC-${course.id}-${currentUser?.id}`;
  };

  // Function to convert certificate HTML to PDF
  const generatePDFFromHTML = async () => {
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const jsPDF = (await import("jspdf")).default;

      const element = certificateRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: element.offsetWidth,
        height: element.offsetHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 0.95; // Slightly smaller to ensure margins
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = (pdfHeight - imgHeight * ratio) / 2;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );

      return pdf;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };

  // Function to handle backend PDF download
  const downloadFromBackend = async () => {
    try {
      const response = await generateCertificate({
        courseId: course.id,
        userId: currentUser?.id,
        studentName: getStudentName(),
        certificateId: getCertificateId(),
      });

      // Handle the response properly to avoid Redux serialization issues
      if (response.data) {
        // If the API returns a blob directly
        let blob;
        if (response.data instanceof Blob) {
          blob = response.data;
        } else if (response.data.blob) {
          blob = response.data.blob;
        } else {
          // If it's base64 or other format, convert to blob
          const binaryString = atob(response.data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          blob = new Blob([bytes], { type: "application/pdf" });
        }

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        const filename = `Certificate-${course.name.replace(
          /[^a-zA-Z0-9]/g,
          "_"
        )}-${getStudentName().replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;

        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return true;
      }
      return false;
    } catch (error) {
      console.error("Backend certificate download error:", error);
      throw error;
    }
  };

  const handleDownloadCertificate = async () => {
    console.log("Downloading certificate for course:", course.name);
    try {
      if (showPreview && certificateRef.current) {
        // Generate PDF from the preview HTML
        const pdf = await generatePDFFromHTML();
        const filename = `Certificate-${course.name.replace(
          /[^a-zA-Z0-9]/g,
          "_"
        )}-${getStudentName().replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
        pdf.save(filename);
      } else {
        // Fallback to backend API
        await downloadFromBackend();
      }

      toast.success(
        `Your certificate for "${course.name}" has been downloaded successfully.`,
        {
          icon: <AwardIcon className="h-5 w-5 text-blue-600" />,
        }
      );

      setShowDialog(false);
    } catch (error) {
      console.error("Certificate download error:", error.message);
      toast.error("Failed to download certificate. Please try again.", {
        icon: <AwardIcon className="h-5 w-5 text-red-600" />,
      });
    }
  };

  // Enhanced certificate preview that matches the actual design
  const CertificatePreview = () => {
    return (
      <div
        ref={certificateRef}
        className="bg-gradient-to-br from-slate-50 via-white to-blue-50 aspect-[297/210] max-w-full mx-auto relative overflow-hidden shadow-2xl"
        style={{
          fontFamily: "Georgia, serif",
          width: "842px",
          height: "595px",
        }} // A4 landscape dimensions in pixels
      >
        {/* Elegant border frame */}
        <div className="absolute inset-4 border-4 border-double border-blue-900/20 rounded-lg">
          <div className="absolute inset-2 border border-yellow-400/30 rounded-md"></div>
        </div>

        {/* Corner decorative elements */}
        <div className="absolute top-6 left-6 w-16 h-16">
          <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full opacity-20"></div>
          <div className="absolute inset-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full opacity-30"></div>
        </div>
        <div className="absolute top-6 right-6 w-16 h-16">
          <div className="w-full h-full bg-gradient-to-bl from-yellow-400 to-yellow-600 rounded-full opacity-20"></div>
          <div className="absolute inset-2 bg-gradient-to-bl from-blue-600 to-blue-800 rounded-full opacity-30"></div>
        </div>
        <div className="absolute bottom-6 left-6 w-16 h-16">
          <div className="w-full h-full bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-full opacity-20"></div>
          <div className="absolute inset-2 bg-gradient-to-tr from-blue-600 to-blue-800 rounded-full opacity-30"></div>
        </div>
        <div className="absolute bottom-6 right-6 w-16 h-16">
          <div className="w-full h-full bg-gradient-to-tl from-yellow-400 to-yellow-600 rounded-full opacity-20"></div>
          <div className="absolute inset-2 bg-gradient-to-tl from-blue-600 to-blue-800 rounded-full opacity-30"></div>
        </div>

        {/* Watermark pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 transform -rotate-45 text-6xl font-bold text-blue-900">
            TITANS CAREERS
          </div>
          <div className="absolute bottom-1/4 right-1/4 transform -rotate-45 text-6xl font-bold text-blue-900">
            TITANS CAREERS
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-12 py-8">
          {/* Header with logo */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 rounded-full shadow-lg flex items-center justify-center">
                <GraduationCapIcon className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full -z-10 opacity-50"></div>
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                TITANS CAREERS
              </div>
              <div className="text-sm text-blue-600 font-medium tracking-wider">
                PROFESSIONAL DEVELOPMENT
              </div>
            </div>
          </div>

          {/* Certificate title with decorative elements */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 bg-clip-text text-transparent tracking-wide">
                CERTIFICATE
              </h1>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
            </div>
            <h2 className="text-2xl font-semibold text-blue-800 tracking-widest">
              OF COMPLETION
            </h2>
          </div>

          {/* Certification content */}
          <div className="space-y-6 max-w-3xl">
            <p className="text-lg text-slate-600 font-medium tracking-wide">
              THIS IS TO CERTIFY THAT
            </p>

            {/* Student name with elegant styling */}
            <div className="relative py-4">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50 to-transparent rounded-lg"></div>
              <p className="relative text-3xl font-bold text-blue-900 py-3 px-8 tracking-wide">
                {getStudentName().toUpperCase()}
              </p>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-0.5 bg-gradient-to-r from-transparent via-blue-900 to-transparent"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-80 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
            </div>

            <p className="text-lg text-slate-600 font-medium">
              has successfully completed the comprehensive
            </p>

            {/* Course name with elegant styling */}
            <div className="relative py-4">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-50 to-transparent rounded-lg"></div>
              <p className="relative text-2xl font-bold text-blue-800 py-3 px-8 tracking-wide">
                {course.name}
              </p>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-0.5 bg-gradient-to-r from-transparent via-blue-800 to-transparent"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-80 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
            </div>

            <p className="text-lg text-slate-600 font-medium">
              demonstrating excellence and dedication on this day of
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-lg py-3 px-6 border border-blue-100">
              <p className="text-xl font-bold text-blue-900">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Professional seal */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-800 to-blue-900 rounded-full shadow-lg flex items-center justify-center">
                <div className="w-20 h-20 border-2 border-yellow-400 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <AwardIcon className="h-6 w-6 text-yellow-400 mx-auto mb-1" />
                    <div className="text-xs text-yellow-400 font-bold">
                      CERTIFIED
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                <div className="text-sm font-semibold text-blue-900 mb-1">
                  Official Seal
                </div>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-blue-900 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Certificate ID with professional styling */}
          <div className="absolute bottom-4 right-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-blue-100 shadow-sm">
              <div className="text-xs text-slate-500 font-medium">
                Certificate ID
              </div>
              <div className="text-sm font-bold text-blue-900">
                {getCertificateId()}
              </div>
            </div>
          </div>

          {/* Signature area */}
          <div className="absolute bottom-4 left-8">
            <div className="text-center">
              <div
                className="text-2xl font-script text-blue-900 mb-2"
                style={{ fontFamily: "cursive" }}
              >
                Digitally Signed
              </div>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-blue-900 to-transparent"></div>
              <div className="text-xs text-slate-600 mt-1 font-medium">
                Director of Education
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced dialog preview
  const DialogPreview = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 via-white to-yellow-50 p-8 rounded-xl border-2 border-blue-100 shadow-lg">
        <div className="text-center space-y-4">
          {/* Header */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-full shadow-lg">
                <GraduationCapIcon className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full -z-10 opacity-50"></div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
              CERTIFICATE OF COMPLETION
            </h3>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto"></div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <p className="text-sm text-slate-600 font-medium">
              This is to certify that
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-transparent rounded-lg py-2 px-4">
              <p className="text-xl font-bold text-blue-900">
                {getStudentName()}
              </p>
            </div>

            <p className="text-sm text-slate-600">
              has successfully completed the
            </p>

            <div className="bg-gradient-to-r from-yellow-50 to-transparent rounded-lg py-2 px-4">
              <p className="text-lg font-semibold text-blue-800">
                {course.name}
              </p>
            </div>

            <p className="text-sm text-slate-600">on this day</p>

            <div className="bg-gradient-to-r from-blue-100 to-yellow-100 rounded-lg py-2 px-4">
              <p className="text-base font-bold text-blue-900">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Seal */}
          <div className="flex justify-center pt-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-800 to-blue-900 rounded-full shadow-md flex items-center justify-center">
              <AwardIcon className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: UserIcon, label: "Student", value: getStudentName() },
          { icon: BookOpenIcon, label: "Course", value: course.name },
          {
            icon: CalendarIcon,
            label: "Completed",
            value: new Date().toLocaleDateString(),
          },
          {
            icon: AwardIcon,
            label: "Certificate ID",
            value: getCertificateId(),
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-2 rounded-lg">
                <item.icon className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  {item.label}
                </div>
                <div className="text-sm font-semibold text-slate-900 truncate">
                  {item.value}
                </div>
              </div>
            </div>
          </div>
        ))}
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
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto overflow-x-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AwardIcon className="h-5 w-5 text-blue-600" />
              Certificate Preview & Download
            </DialogTitle>
            <DialogDescription>
              Preview your certificate before downloading. The PDF will include
              your name and certificate ID.
            </DialogDescription>
          </DialogHeader>

          {/* Full certificate preview */}
          <div className="my-4 flex justify-center">
            <div className="max-w-full overflow-auto">
              <CertificatePreview />
            </div>
          </div>

          {/* Summary info */}
          <DialogPreview />

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
