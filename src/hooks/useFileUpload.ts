
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { resumeService, ResumeScore } from '@/api/resumeService';

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export const useFileUpload = () => {
  const [jobDescFile, setJobDescFile] = useState<File | null>(null);
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [jobRole, setJobRole] = useState<string>('Software Engineer');
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ResumeScore[]>([]);

  const navigate = useNavigate();
  
  // Update progress based on status
  useEffect(() => {
    if (uploadStatus === 'idle') {
      setProgress(0);
    } else if (uploadStatus === 'uploading') {
      setProgress(35);
    } else if (uploadStatus === 'processing') {
      setProgress(70);
    } else if (uploadStatus === 'success') {
      setProgress(100);
    }
  }, [uploadStatus]);

  const handleJobDescFileChange = (files: File[]) => {
    if (files.length > 0) {
      setJobDescFile(files[0]);
    } else {
      setJobDescFile(null);
    }
  };

  const handleResumeFilesChange = (files: File[]) => {
    setResumeFiles(files);
  };

  const handleSubmit = async () => {
    if (!jobDescFile) {
      toast.error('Please upload a job description file.');
      return;
    }

    if (resumeFiles.length === 0) {
      toast.error('Please upload at least one resume.');
      return;
    }

    try {
      setUploadStatus('uploading');
      
      // Upload job description
      await resumeService.uploadJobDescription(jobDescFile, jobRole);
      
      // Upload resumes
      await resumeService.uploadResumes(resumeFiles);
      
      setUploadStatus('processing');
      
      // Process the files with the actual job desc file, resumes and role
      const results = await resumeService.processFiles(jobDescFile, resumeFiles, jobRole);
      
      setResults(results);
      setUploadStatus('success');
      
      // Save the results to local storage for other pages to access
      localStorage.setItem('resumeResults', JSON.stringify(results));
      
      // Show success message
      toast.success('Files processed successfully');
      
      // Navigate to the results page
      setTimeout(() => {
        navigate('/results');
      }, 500);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('error');
      toast.error('Upload failed. Please try again.');
    }
  };

  const reset = () => {
    setJobDescFile(null);
    setResumeFiles([]);
    setUploadStatus('idle');
    setProgress(0);
  };

  const isReady = jobDescFile !== null && resumeFiles.length > 0;
  const isUploading = uploadStatus === 'uploading' || uploadStatus === 'processing';

  return {
    jobDescFile,
    resumeFiles,
    jobRole,
    setJobRole,
    uploadStatus,
    progress,
    results,
    handleJobDescFileChange,
    handleResumeFilesChange,
    handleSubmit,
    reset,
    isReady,
    isUploading
  };
};
