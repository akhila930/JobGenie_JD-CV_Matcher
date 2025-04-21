
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload as UploadIcon } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { JOB_ROLES } from '@/api/resumeService';

const Upload = () => {
  const {
    jobDescFile,
    resumeFiles,
    jobRole,
    setJobRole,
    uploadStatus,
    progress,
    handleJobDescFileChange,
    handleResumeFilesChange,
    handleSubmit,
    isReady,
    isUploading
  } = useFileUpload();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout className="pt-20">
      <div className="container max-w-4xl py-10 px-4">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-block px-3 py-1 mb-3 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Step 1 of 2
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Upload Your Documents</h1>
          <p className="text-muted-foreground max-w-2xl">
            Upload your job description and candidate resumes. Our AI will analyze and rank them based on relevance, experience, and qualifications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl p-6 border border-border shadow-subtle">
            <h2 className="text-xl font-semibold mb-2">Job Description</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Upload the job description PDF to help our AI understand what you're looking for.
            </p>
            
            <div className="mb-5">
              <Label htmlFor="job-role" className="mb-2 block">Job Role</Label>
              <Select value={jobRole} onValueChange={setJobRole}>
                <SelectTrigger id="job-role" className="w-full">
                  <SelectValue placeholder="Select a job role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(JOB_ROLES).map((role) => (
                   <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}

                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                Selecting the correct role helps improve matching accuracy.
              </p>
            </div>
            
            <FileUpload
              title="Job Description"
              description="Upload your job description PDF"
              accept={{ 'application/pdf': ['.pdf'] }}
              onFilesAdded={handleJobDescFileChange}
            />
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-border shadow-subtle">
            <h2 className="text-xl font-semibold mb-2">Candidate Resumes</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Upload up to 10 candidate resumes in PDF format for analysis.
            </p>
            <FileUpload
              title="Candidate Resumes"
              description="Upload candidate resume PDFs"
              accept={{ 'application/pdf': ['.pdf'] }}
              multiple
              maxFiles={10}
              onFilesAdded={handleResumeFilesChange}
            />
          </div>
        </div>
        
        {(isUploading || progress > 0) && (
          <div className="w-full bg-white rounded-xl p-6 border border-border shadow-subtle mb-8 animate-fade-in">
            <h3 className="font-medium mb-3">Processing Documents</h3>
            <Progress value={progress} className="h-2 mb-2" />
            <p className="text-sm text-muted-foreground">
              {uploadStatus === 'uploading' && 'Uploading your documents...'}
              {uploadStatus === 'processing' && 'Analyzing documents with AI...'}
              {uploadStatus === 'success' && 'Processing complete! Redirecting to results...'}
              {uploadStatus === 'error' && 'An error occurred. Please try again.'}
            </p>
          </div>
        )}
        
        <div className="flex justify-center">
          <Button 
            size="lg" 
            onClick={handleSubmit}
            disabled={!isReady || isUploading}
            className="px-8"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <UploadIcon className="mr-2 h-4 w-4" />
                {isReady ? 'Process Documents' : 'Upload Files to Continue'}
              </>
            )}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Upload;
