
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { ResumeScore } from '@/api/resumeService';
import ResultsTable from '@/components/ResultsTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, BarChart2, Users } from 'lucide-react';
import { toast } from 'sonner';

const Results = () => {
  const [results, setResults] = useState<ResumeScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Get results from localStorage
    const storedResults = localStorage.getItem('resumeResults');
    
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        setResults(parsedResults);
        setIsLoading(false);
      } catch (error) {
        console.error('Error parsing results:', error);
        toast.error('An error occurred loading the results');
        setIsLoading(false);
      }
    } else {
      // If no results found, redirect to upload page after a short delay
      toast.error('No results found. Please upload files first.');
      setTimeout(() => {
        navigate('/upload');
      }, 2000);
    }
  }, [navigate]);

  const handleExportResults = () => {
    try {
      // Generate CSV content
      const headers = "Rank,Name,Score,Experience,Skills,Qualifications\n";
      const csvContent = headers + results.map((result, index) => {
        return `${index + 1},"${result.name}",${result.score},${result.experience},"${result.skills.join(', ')}","${result.qualifications.join(', ')}"`;
      }).join("\n");
      
      // Create a Blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'candidate_results.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Results exported successfully');
    } catch (error) {
      console.error('Error exporting results:', error);
      toast.error('Failed to export results');
    }
  };

  if (isLoading) {
    return (
      <Layout className="pt-20">
        <div className="container py-12 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Loading results...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // If no results, show a message
  if (results.length === 0) {
    return (
      <Layout className="pt-20">
        <div className="container py-12 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-xl mb-4">No resume results found</p>
            <Button onClick={() => navigate('/upload')}>Upload Files</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout className="pt-20">
      <div className="container py-10 px-4">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-block px-3 py-1 mb-3 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Step 2 of 2
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Candidate Ranking Results</h1>
          <p className="text-muted-foreground max-w-2xl">
            AI has analyzed and ranked the candidates based on their relevance to the job description, experience, skills, and qualifications.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white shadow-subtle animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{results.length}</div>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-subtle animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Top Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {results.length > 0 ? Math.round(results[0].score * 100) + '%' : 'N/A'}
                </div>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-subtle animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {results.length > 0 
                    ? (results.reduce((sum, r) => sum + r.experience, 0) / results.length).toFixed(1) + ' yrs'
                    : 'N/A'}
                </div>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-subtle animate-fade-in" style={{ animationDelay: '400ms' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full"
                onClick={handleExportResults}
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl border border-border shadow-subtle mb-8 animate-fade-in" style={{ animationDelay: '500ms' }}>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Ranked Candidates</h2>
            <ResultsTable results={results} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <Button 
            variant="outline" 
            onClick={() => navigate('/upload')}
          >
            Upload New Files
          </Button>
          <Button 
            onClick={() => navigate('/demo')}
          >
            See How It Works
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Results;
