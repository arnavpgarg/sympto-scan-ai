import { useState, useCallback } from "react";
import { Upload as UploadIcon, FileText, Image, File, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined. Please set it in your environment variables.");
}

interface UploadState {
  file: File | null;
  uploading: boolean;
  progress: number;
  summary: string | null;
  error: string | null;
}

const Upload = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    uploading: false,
    progress: 0,
    summary: null,
    error: null,
  });
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    const validTypes = ["application/pdf", "text/plain", "image/jpeg", "image/png", "image/jpg"];

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, TXT, or image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadState((prev) => ({
      ...prev,
      file,
      error: null,
      summary: null,
    }));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const uploadAndProcess = async () => {
    if (!uploadState.file) return;

    setUploadState((prev) => ({ ...prev, uploading: true, progress: 0 }));

    try {
      const formData = new FormData();
      formData.append("user_id", "test123"); // Replace with real logged-in user_id later
      formData.append("file", uploadState.file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadState((prev) => {
          const newProgress = prev.progress + 10;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return { ...prev, progress: 100 };
          }
          return { ...prev, progress: newProgress };
        });
      }, 300);

      // 1) Upload report
      const uploadRes = await fetch(`${API_URL}/upload-report`, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.detail || "Upload failed");

      // 2) Summarize report
      const summarizeRes = await fetch(`${API_URL}/summarize-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document_id: uploadData.document_id }),
      });
      const summaryData = await summarizeRes.json();
      if (!summarizeRes.ok) throw new Error(summaryData.detail || "Summarization failed");

      // ✅ Set backend response in state
      setUploadState((prev) => ({
        ...prev,
        uploading: false,
        summary: summaryData.summary_text,
      }));

      toast({
        title: "Upload successful",
        description: "Your medical report has been processed and summarized.",
      });
    } catch (error: any) {
      setUploadState((prev) => ({
        ...prev,
        uploading: false,
        error: error.message || "Failed to process the file. Please try again.",
      }));

      toast({
        title: "Upload failed",
        description: error.message || "There was an error processing your file.",
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.toLowerCase().includes(".pdf")) return <FileText className="h-8 w-8 text-red-500" />;
    if (fileName.toLowerCase().match(/\.(jpg|jpeg|png)$/)) return <Image className="h-8 w-8 text-blue-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Upload Your Medical Report</h1>
        <p className="text-muted-foreground">
          Upload your medical documents for AI-powered analysis and summarization
        </p>
      </div>

      {/* Upload Card */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Document Upload</CardTitle>
        </CardHeader>
        <CardContent>
          {!uploadState.file ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              aria-label="Drag and drop your file here"
            >
              <UploadIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Drag and drop your file here</h3>
              <p className="text-muted-foreground mb-4">PDF, TXT, or Image files supported</p>
              <label htmlFor="file-upload">
                <Button className="medical-button-primary" type="button">
                  Browse Files
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.txt,.jpg,.jpeg,.png"
                  onChange={handleFileInput}
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Preview */}
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                {getFileIcon(uploadState.file.name)}
                <div className="flex-1">
                  <p className="font-medium text-foreground">{uploadState.file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadState.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                {!uploadState.uploading && !uploadState.summary && (
                  <Button
                    variant="outline"
                    onClick={() => setUploadState((prev) => ({ ...prev, file: null }))}
                  >
                    Remove
                  </Button>
                )}
              </div>

              {/* Progress Bar */}
              {uploadState.uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing...</span>
                    <span>{uploadState.progress}%</span>
                  </div>
                  <Progress value={uploadState.progress} className="w-full" />
                </div>
              )}

              {/* Action Button */}
              {!uploadState.uploading && !uploadState.summary && (
                <Button className="medical-button-secondary w-full" onClick={uploadAndProcess}>
                  Parse & Summarize
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Preview */}
      {uploadState.summary && (
        <Card className="medical-card slide-in-right">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Summary Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4 mb-4">
              <p className="text-foreground">{uploadState.summary}</p>
            </div>

            <div className="flex space-x-3">
              <Button className="medical-button-primary">View Full Report</Button>
              <Button variant="outline" onClick={() => setUploadState({ ...uploadState, file: null, summary: null })}>
                Upload Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {uploadState.error && (
        <Card className="medical-card border-destructive">
          <CardContent className="p-6">
            <p className="text-destructive">{uploadState.error}</p>
            <Button
              className="mt-3"
              variant="outline"
              onClick={() => setUploadState((prev) => ({ ...prev, error: null }))}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Upload;