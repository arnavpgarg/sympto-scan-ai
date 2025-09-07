import { useState, useEffect } from "react";
import { ArrowLeft, Play, Download, User, Calendar, FileText, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined. Please set it in your environment variables.");
}

interface PatientInfo {
  name: string;
  age: number;
  dateOfBirth: string;
  gender: string;
  patientId: string;
}

interface LabResult {
  test: string;
  result: string;
  reference: string;
  status: "normal" | "high" | "low" | "critical";
}

interface ReportData {
  id: string;
  fileName: string;
  uploadDate: string;
  patientInfo: PatientInfo;
  labResults: LabResult[];
  summary: string;
  clinicalNotes: string;
}

const Summary = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [playingAudio, setPlayingAudio] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(`${API_URL}/history/test123`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Failed to load summary");

        // Get the latest summary from backend
        const latest = data.summaries[data.summaries.length - 1];

        setReportData({
          id: latest.id,
          fileName: latest.filename || "report.pdf",
          uploadDate: latest.upload_date,
          patientInfo: {
            name: "N/A", // Backend doesn’t provide this yet
            age: 0,
            dateOfBirth: "",
            gender: "",
            patientId: "N/A",
          },
          labResults: [], // (Optional) Map backend structured data later
          summary: latest.summary_text,
          clinicalNotes: latest.recommendations?.join(", ") || "No clinical notes available.",
        });
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to load the report summary. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [toast]);

  const handlePlayAudio = async () => {
    setPlayingAudio(true);

    try {
      // Simulate TTS API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Audio Generated",
        description: "Playing audio summary of your medical report.",
      });

      // In real implementation, this would call the /tts endpoint
      // and play the returned audio
    } catch (error) {
      toast({
        title: "Audio Error",
        description: "Failed to generate audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPlayingAudio(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      // Simulate PDF export API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "PDF Exported",
        description: "Your medical report summary has been downloaded.",
      });

      // In real implementation, this would call /export-summary/{id}
    } catch (error) {
      toast({
        title: "Export Error",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-700 bg-green-50";
      case "high":
        return "text-orange-700 bg-orange-50";
      case "low":
        return "text-blue-700 bg-blue-50";
      case "critical":
        return "text-red-700 bg-red-50";
      default:
        return "text-gray-700 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 fade-in">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
          <div className="h-8 bg-muted rounded w-1/4 animate-pulse"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="medical-card animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Report not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-3xl font-bold text-foreground">Report Summary</h1>
            <p className="text-muted-foreground">{reportData.fileName}</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={handlePlayAudio}
            disabled={playingAudio}
            className="medical-button-primary"
          >
            <Play className="h-4 w-4 mr-2" />
            {playingAudio ? "Playing..." : "Play Voice"}
          </Button>

          <Button
            onClick={handleExportPDF}
            className="medical-button-secondary"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Patient Information */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2 text-primary" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-foreground font-medium">{reportData.patientInfo.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Age</p>
              <p className="text-foreground font-medium">{reportData.patientInfo.age} years</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
              <p className="text-foreground font-medium">
                {new Date(reportData.patientInfo.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Gender</p>
              <p className="text-foreground font-medium">{reportData.patientInfo.gender}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lab Results */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-primary" />
            Lab Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Reference Range</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.labResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{result.test}</TableCell>
                    <TableCell>{result.result}</TableCell>
                    <TableCell className="text-muted-foreground">{result.reference}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
                          result.status
                        )}`}
                      >
                        {result.status.toUpperCase()}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary & Clinical Notes */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">{reportData.summary}</p>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Clinical Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">{reportData.clinicalNotes}</p>
          </CardContent>
        </Card>
      </div>

      {/* Floating Back Button - Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Button
          onClick={() => window.history.back()}
          className="rounded-full shadow-lg medical-button-primary h-12 w-12"
          size="icon"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Summary;