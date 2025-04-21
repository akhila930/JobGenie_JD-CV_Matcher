
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, PlayCircle, Code, FileText, BarChart4 } from 'lucide-react';
import { resumeService } from '@/api/resumeService';
import { useNavigate } from 'react-router-dom';

const Demo = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const startDemo = async () => {
    setIsRunning(true);
    setLogs([]);
    setCurrentLogIndex(0);
    setProgress(0);
    
    try {
      const demoLogs = await resumeService.getProcessingLogs();
      
      // Display logs one by one with delay
      for (let i = 0; i < demoLogs.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLogs(prev => [...prev, demoLogs[i]]);
        setCurrentLogIndex(i);
        setProgress(Math.round(((i + 1) / demoLogs.length) * 100));
      }
      
      // Demo complete
      setTimeout(() => {
        setIsRunning(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error running demo:', error);
      setIsRunning(false);
    }
  };

  return (
    <Layout className="pt-20">
      <div className="container max-w-6xl py-10 px-4">
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">How JobGenie AI Works</h1>
          <p className="text-muted-foreground max-w-2xl">
            See a live demonstration of our AI-powered resume matching process. Watch how the algorithms extract, analyze and rank candidates.
          </p>
        </div>

        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="demo" className="gap-2">
              <PlayCircle className="h-4 w-4" />
              Live Demo
            </TabsTrigger>
            <TabsTrigger value="explanation" className="gap-2">
              <Code className="h-4 w-4" />
              How It Works
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="demo" className="space-y-8">
            <div className="bg-white rounded-xl border border-border shadow-subtle p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Resume Matching Process</h2>
                  <p className="text-muted-foreground">Watch our AI analyze job descriptions and resumes in real-time</p>
                </div>
                <Button 
                  size="lg" 
                  onClick={startDemo} 
                  disabled={isRunning}
                  className="md:w-auto w-full"
                >
                  {isRunning ? 'Processing...' : 'Start Demo'}
                </Button>
              </div>
              
              <div className="mb-6">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Processing</span>
                  <span>{progress}% Complete</span>
                </div>
              </div>
              
              <div className="bg-muted/30 rounded-lg border border-border h-[400px] relative">
                <div className="absolute top-0 left-0 right-0 bg-muted/50 p-2 px-4 text-xs font-mono border-b border-border">
                  AI Processing Logs
                </div>
                <ScrollArea className="h-[400px]">
                  <div className="p-4 pt-10 font-mono text-sm">
                    {logs.map((log, index) => (
                      <div 
                        key={index} 
                        className="py-1 flex items-start animate-fade-in"
                      >
                        <ChevronRight className="h-4 w-4 mr-2 text-primary mt-1 flex-shrink-0" />
                        <div>
                          {index === currentLogIndex && isRunning ? (
                            <span className="text-primary">
                              {log}
                              <span className="animate-pulse">_</span>
                            </span>
                          ) : (
                            <span>{log}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button
                variant="outline" 
                onClick={() => navigate('/upload')}
              >
                Try It Yourself
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="explanation" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white shadow-subtle">
                <CardContent className="p-6">
                  <div className="w-12 h-12 mb-4 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Text Extraction</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-semibold">•</span>
                      <span>Extract text from PDFs using pdfplumber</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-semibold">•</span>
                      <span>Use OCR for scanned documents via pytesseract</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-semibold">•</span>
                      <span>Pre-process text using NLP techniques</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-subtle">
                <CardContent className="p-6">
                  <div className="w-12 h-12 mb-4 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Code className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-semibold">•</span>
                      <span>Convert text to vectors using TF-IDF</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-semibold">•</span>
                      <span>Calculate similarity with cosine distance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-semibold">•</span>
                      <span>Extract experience, skills and qualifications</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-subtle">
                <CardContent className="p-6">
                  <div className="w-12 h-12 mb-4 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <BarChart4 className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Scoring System</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-semibold">•</span>
                      <span>50% - Document similarity score</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-semibold">•</span>
                      <span>20% - Years of experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-semibold">•</span>
                      <span>20% - Relevant skills matched</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-semibold">•</span>
                      <span>10% - Required qualifications</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-white rounded-xl border border-border shadow-subtle p-6">
              <h3 className="text-xl font-semibold mb-4">Technical Process</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">1. Text Preprocessing</h4>
                  <p className="text-muted-foreground mb-2">
                    All document text is normalized, tokenized, and filtered to improve matching accuracy:
                  </p>
                  <pre className="bg-muted/30 p-3 rounded text-xs overflow-x-auto">
{`# Preprocess text
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r"[^a-zA-Z\\s]", "", text)
    tokens = word_tokenize(text)
    tokens = [t for t in tokens if t not in stopwords.words("english")]
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(t) for t in tokens]
    return " ".join(tokens)`}
                  </pre>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">2. Vector Representation</h4>
                  <p className="text-muted-foreground mb-2">
                    TF-IDF (Term Frequency-Inverse Document Frequency) converts text to numerical vectors:
                  </p>
                  <pre className="bg-muted/30 p-3 rounded text-xs overflow-x-auto">
{`vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform([jd_clean] + cv_cleaned)
similarity_scores = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1:])[0]`}
                  </pre>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">3. Scoring Algorithm</h4>
                  <p className="text-muted-foreground mb-2">
                    Final score calculation combines multiple factors:
                  </p>
                  <pre className="bg-muted/30 p-3 rounded text-xs overflow-x-auto">
{`hybrid_score = (similarity_scores[idx] * 0.5) + 
             (experience * 0.2) + 
             (skills_count * 0.2) + 
             (qualification_count * 0.1)`}
                  </pre>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={() => navigate('/upload')}
              >
                Try It Yourself
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Demo;
