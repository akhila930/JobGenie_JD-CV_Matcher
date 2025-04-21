
import { toast } from "sonner";
import { processResumes, JOB_ROLES } from "./nlpService";

// Types
export interface ResumeScore {
  id: string;
  name: string;
  score: number;
  experience: number;
  skills: string[];
  qualifications: string[];
  preview: string;
}

// Export job roles from NLP service
export { JOB_ROLES };

// API base URL
const API_BASE_URL = "http://localhost:8000";

// API endpoints
export const resumeService = {
  // Upload job description
  uploadJobDescription: async (file: File, jobRole: string): Promise<{ success: boolean }> => {
    try {
      // No need to upload separately as we'll process everything together
      return { success: true };
    } catch (error) {
      console.error("Error uploading job description:", error);
      toast.error("Failed to upload job description. Please try again.");
      throw error;
    }
  },
  
  // Upload resumes
  uploadResumes: async (files: File[]): Promise<{ success: boolean }> => {
    try {
      // No need to upload separately as we'll process everything together
      return { success: true };
    } catch (error) {
      console.error("Error uploading resumes:", error);
      toast.error("Failed to upload resumes. Please try again.");
      throw error;
    }
  },
  
  // Process files and return results
  processFiles: async (jobDescFile: File, resumeFiles: File[], jobRole: string): Promise<ResumeScore[]> => {
    try {
      const formData = new FormData();
      formData.append('job_description', jobDescFile);
      resumeFiles.forEach(file => {
        formData.append('resumes', file);
      });
      formData.append('job_role', jobRole);

      const response = await fetch(`${API_BASE_URL}/process-files`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error processing files:", error);
      toast.error("An error occurred during processing. Please try again.");
      throw error;
    }
  },
  
  // Get processing logs (for demo page)
  getProcessingLogs: async (): Promise<string[]> => {
    try {
      // Simulate API call
      await simulateApiCall(1000);
      
      // Return mock logs
      return [
        "Starting job processing...",
        "Extracting text from PDF documents...",
        "Applying NLP preprocessing to job description...",
        "Tokenizing and lemmatizing text...",
        "Removing stopwords and special characters...",
        "Creating TF-IDF vectors for documents...",
        "Computing cosine similarity between JD and resumes...",
        "Extracting experience information from resumes...",
        "Matching skills with job requirements...",
        "Identifying relevant qualifications...",
        "Calculating final scores and ranking candidates...",
        "Processing complete. Generating results...",
      ];
    } catch (error) {
      console.error("Error fetching processing logs:", error);
      throw error;
    }
  },
};

// Helper to simulate API request time
const simulateApiCall = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
