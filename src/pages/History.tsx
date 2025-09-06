import { useState, useEffect } from "react";
import { Search, Eye, Play, Calendar, FileText, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HistoryRecord {
  id: string;
  fileName: string;
  uploadDate: string;
  summary: string;
  status: "processed" | "processing" | "error";
  fileType: string;
}

const History = () => {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<HistoryRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockRecords: HistoryRecord[] = [
        {
          id: "1",
          fileName: "blood_test_results_march.pdf",
          uploadDate: "2024-01-15",
          summary: "Blood work showing normal glucose levels and slightly elevated cholesterol. Complete metabolic panel within normal ranges except LDL.",
          status: "processed",
          fileType: "PDF"
        },
        {
          id: "2",
          fileName: "chest_xray_report.pdf", 
          uploadDate: "2024-01-10",
          summary: "Chest X-ray results indicate clear lungs with no abnormalities detected. Heart size and position normal.",
          status: "processed",
          fileType: "PDF"
        },
        {
          id: "3",
          fileName: "allergy_test_report.pdf",
          uploadDate: "2024-01-08", 
          summary: "Comprehensive allergy panel showing sensitivity to pollen and dust mites. Moderate reactions to environmental allergens.",
          status: "processed",
          fileType: "PDF"
        },
        {
          id: "4",
          fileName: "mri_scan_knee.pdf",
          uploadDate: "2024-01-05",
          summary: "MRI scan of left knee revealing minor meniscal tear without significant joint effusion. Conservative treatment recommended.",
          status: "processed",
          fileType: "PDF"
        },
        {
          id: "5",
          fileName: "lab_results_december.pdf",
          uploadDate: "2023-12-28",
          summary: "Routine lab work with excellent kidney function markers. Vitamin D levels slightly below optimal range.",
          status: "processed",
          fileType: "PDF"
        },
        {
          id: "6",
          fileName: "ecg_results.pdf",
          uploadDate: "2023-12-20",
          summary: "Electrocardiogram showing normal sinus rhythm with no arrhythmias detected. Electrical conduction within normal limits.",
          status: "processing",
          fileType: "PDF"
        }
      ];
      
      setRecords(mockRecords);
      setFilteredRecords(mockRecords);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRecords(records);
    } else {
      const filtered = records.filter(record =>
        record.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecords(filtered);
    }
  }, [searchQuery, records]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePlayAudio = async (recordId: string) => {
    // Simulate TTS API call
    console.log(`Playing audio for record ${recordId}`);
    // In real implementation, this would call the /tts endpoint
  };

  const handleViewSummary = (recordId: string) => {
    // Navigate to summary page
    console.log(`Viewing summary for record ${recordId}`);
  };

  if (loading) {
    return (
      <div className="space-y-6 fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">History</h1>
        </div>
        
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex space-x-4 animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-4 bg-muted rounded w-1/6"></div>
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-1/6"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Medical History</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your uploaded medical reports
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">
            {filteredRecords.length} of {records.length} reports
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="medical-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports by filename or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 medical-input"
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold text-foreground">{records.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Processed</p>
                <p className="text-2xl font-bold text-foreground">
                  {records.filter(r => r.status === 'processed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-foreground">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Report History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead className="hidden md:table-cell">Summary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id} className="hover:bg-accent/50">
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{record.fileName}</p>
                          <p className="text-xs text-muted-foreground">{record.fileType}</p>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{formatDate(record.uploadDate)}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="hidden md:table-cell max-w-xs">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {record.summary}
                      </p>
                    </TableCell>
                    
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          record.status === 'processed'
                            ? 'bg-green-100 text-green-700'
                            : record.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {record.status}
                      </span>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewSummary(record.id)}
                          disabled={record.status !== 'processed'}
                          className="h-8"
                        >
                          <Eye className="h-3 w-3" />
                          <span className="hidden sm:inline ml-1">View</span>
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePlayAudio(record.id)}
                          disabled={record.status !== 'processed'}
                          className="h-8"
                        >
                          <Volume2 className="h-3 w-3" />
                          <span className="hidden sm:inline ml-1">Audio</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredRecords.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No reports match your search.' : 'No reports uploaded yet.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default History;