
import { ResumeScore } from './resumeService';

// This simulation uses the core logic from the Python code you provided,
// adapted to TypeScript for frontend integration

// Dictionary of Job Roles with Required Degrees and Skills
export const JOB_ROLES = {
  "Graphic Designer": { degrees: ["bachelor", "diploma"], skills: ["photoshop", "illustrator", "typography"] },
  "UI/UX Designer": { degrees: ["bachelor", "diploma"], skills: ["figma", "adobe xd", "wireframing"] },
  "Interior Designer": { degrees: ["bachelor", "diploma"], skills: ["autocad", "3ds max", "rendering"] },
  "Fashion Designer": { degrees: ["bachelor", "diploma"], skills: ["textile", "pattern making", "fashion illustration"] },
  "Business Analyst": { degrees: ["bachelor", "mba"], skills: ["sql", "excel", "data visualization"] },
  "Marketing Manager": { degrees: ["bachelor", "mba"], skills: ["seo", "social media", "branding"] },
  "Software Engineer": { degrees: ["bachelor", "master"], skills: ["python", "java", "c++"] },
  "Data Scientist": { degrees: ["bachelor", "master", "phd"], skills: ["machine learning", "deep learning", "nlp"] },
  "AI Engineer": { degrees: ["bachelor", "master"], skills: ["tensorflow", "pytorch", "computer vision"] },
  "Cloud Engineer": { degrees: ["bachelor", "master"], skills: ["aws", "azure", "gcp"] },
  "Musician": { degrees: ["diploma", "bachelor"], skills: ["composition", "instrument", "music production"] },
  "Film Director": { degrees: ["bachelor", "master"], skills: ["screenwriting", "cinematography", "storytelling"] },
  "Football Coach": { degrees: ["diploma", "bachelor"], skills: ["strategy", "fitness training", "team management"] },
  "Mathematics Teacher": { degrees: ["bachelor", "master"], skills: ["calculus", "algebra", "geometry"] }
};

// Main functions to simulate backend processing

// Extract text from PDF (simulated)
const extractTextFromPdf = async (file: File): Promise<string> => {
  // In a real implementation, we would call a backend API to extract text
  // For now, we'll simulate with some text extraction based on the file name
  return new Promise((resolve) => {
    // Simulate PDF processing delay
    setTimeout(() => {
      console.log(`Extracting text from ${file.name}`);
      
      const fileName = file.name.toLowerCase();
      let extractedText = `${file.name} content. `;
      
      // Add some simulated content based on file name patterns
      if (fileName.includes("engineer") || fileName.includes("developer")) {
        extractedText += "Experienced software engineer with 5 years of experience. Proficient in python, java, and c++. " +
          "Bachelor's degree in Computer Science. Worked on multiple projects including web applications and APIs.";
      } else if (fileName.includes("design")) {
        extractedText += "UI/UX designer with 3 years of experience. Skilled in figma, wireframing and user research. " +
          "Diploma in Design. Created user interfaces for mobile and web applications.";
      } else if (fileName.includes("market") || fileName.includes("brand")) {
        extractedText += "Marketing professional with 4 years experience in social media, seo, and branding. " +
          "MBA graduate. Led multiple successful marketing campaigns.";
      } else if (fileName.includes("data") || fileName.includes("analyst")) {
        extractedText += "Data scientist with 2 years experience in machine learning, deep learning, and nlp. " +
          "Master's degree in Data Science. Built predictive models and conducted data analysis.";
      } else {
        // Generic text if no specific pattern matched
        extractedText += "Professional with relevant experience in the field. " +
          "Has necessary qualifications and skills for the position. " +
          (Math.random() > 0.5 ? "Bachelor's" : "Master's") + " degree. " +
          (Math.random() > 0.7 ? "5" : Math.random() > 0.5 ? "3" : "2") + " years of experience.";
      }
      
      resolve(extractedText);
    }, 800);
  });
};

// Preprocess text (simplified version of the Python implementation)
const preprocessText = (text: string): string => {
  return text.toLowerCase().replace(/[^a-zA-Z\s]/g, " ");
};

// Extract experience from text
const extractExperience = (text: string): number => {
  const match = text.match(/(\d+)\s*(?:years?|yrs?)\s*(?:of experience|experience)/i);
  return match ? parseInt(match[1], 10) : Math.floor(Math.random() * 5) + 1; // Random fallback
};

// Extract qualifications
const extractQualification = (text: string, jobRole: string): [number, string[]] => {
  const requiredDegrees = JOB_ROLES[jobRole as keyof typeof JOB_ROLES]?.degrees || [];
  const foundDegrees = requiredDegrees.filter(degree => text.toLowerCase().includes(degree));
  return [foundDegrees.length, foundDegrees];
};

// Extract skills
const extractSkills = (text: string, jobRole: string): [number, string[]] => {
  const requiredSkills = JOB_ROLES[jobRole as keyof typeof JOB_ROLES]?.skills || [];
  const matchedSkills = requiredSkills.filter(skill => text.toLowerCase().includes(skill));
  return [matchedSkills.length, matchedSkills];
};

// Calculate similarity score (simplified)
const calculateSimilarity = (jdText: string, cvText: string): number => {
  // This is a simplified version of cosine similarity calculation
  // In reality, we would use TF-IDF and proper vector calculations
  const jdWords = new Set(preprocessText(jdText).split(/\s+/));
  const cvWords = new Set(preprocessText(cvText).split(/\s+/));
  
  // Calculate Jaccard similarity as a simple alternative
  const intersection = new Set([...jdWords].filter(x => cvWords.has(x)));
  const union = new Set([...jdWords, ...cvWords]);
  
  const similarity = intersection.size / union.size;
  
  // Add some randomness to simulate more realistic matching scores
  return similarity * 0.5 + Math.random() * 0.5;
};

// Main function to process resumes
export const processResumes = async (
  jobDescFile: File,
  resumeFiles: File[],
  jobRole: string
): Promise<ResumeScore[]> => {
  console.log(`Processing ${resumeFiles.length} resumes for job role: ${jobRole}`);
  
  // Extract text from job description
  const jobDescText = await extractTextFromPdf(jobDescFile);
  
  // Process each resume
  const results: ResumeScore[] = [];
  
  for (let i = 0; i < resumeFiles.length; i++) {
    const resumeFile = resumeFiles[i];
    const resumeText = await extractTextFromPdf(resumeFile);
    
    // Calculate similarity
    const similarityScore = calculateSimilarity(jobDescText, resumeText);
    
    // Extract experience, skills, and qualifications
    const experience = extractExperience(resumeText);
    const [skillsCount, matchedSkills] = extractSkills(resumeText, jobRole);
    const [qualCount, matchedQualifications] = extractQualification(resumeText, jobRole);
    
    // Calculate hybrid score
    const hybridScore = (
      similarityScore * 0.5 + 
      (Math.min(experience, 10) / 10) * 0.2 + 
      (skillsCount / 3) * 0.2 + 
      (qualCount / 2) * 0.1
    );
    
    results.push({
      id: (i + 1).toString(),
      name: resumeFile.name,
      score: hybridScore,
      experience: experience,
      skills: matchedSkills,
      qualifications: matchedQualifications,
      preview: resumeText.slice(0, 200) + "..." // Preview of the first 200 characters
    });
  }
  
  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  
  return results;
};
