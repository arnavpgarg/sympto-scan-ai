import { useState, useEffect } from "react";
import { Eye, Calendar, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentReport {
  id: string;
  fileName: string;
  uploadDate: string;
  summary: string;
  status: "processed" | "processing" | "error";
}

const Dashboard = () => {
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRecentReports([
        {
          id: "1",
          fileName: "blood_test_results_march.pdf",
          uploadDate: "2024-01-15",
          summary: "Blood work showing normal glucose levels and slightly elevated cholesterol...",
          status: "processed"
        },
        {
          id: "2", 
          fileName: "chest_xray_report.pdf",
          uploadDate: "2024-01-10",
          summary: "Chest X-ray results indicate clear lungs with no abnormalities...",
          status: "processed"
        },
        {
          id: "3",
          fileName: "allergy_test_report.pdf", 
          uploadDate: "2024-01-08",
          summary: "Comprehensive allergy panel showing sensitivity to pollen and dust mites...",
          status: "processing"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="medical-card animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your recent medical reports and health data
          </p>
        </div>
        
        <Button className="medical-button-primary">
          <FileText className="h-4 w-4 mr-2" />
          New Upload
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold text-foreground">{recentReports.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Eye className="h-5 w-5 text-secondary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Processed</p>
                <p className="text-2xl font-bold text-foreground">
                  {recentReports.filter(r => r.status === 'processed').length}
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

      {/* Recent Reports */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Reports</span>
            <Button variant="ghost" className="text-primary hover:text-primary-hover">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-foreground">{report.fileName}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        report.status === 'processed'
                          ? 'bg-green-100 text-green-700'
                          : report.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Uploaded on {formatDate(report.uploadDate)}
                  </p>
                  <p className="text-sm text-foreground line-clamp-2">
                    {report.summary}
                  </p>
                </div>
                
                <div className="ml-4">
                  <Button 
                    className="medical-button-primary"
                    disabled={report.status !== 'processed'}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Summary
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;