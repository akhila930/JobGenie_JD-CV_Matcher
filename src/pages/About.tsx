
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  ShieldCheck, 
  Brain, 
  FileCheck, 
  BookOpen, 
  Users, 
  Lock,
  MessageSquare, 
  ArrowUpRight 
} from 'lucide-react';

const About = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout className="pt-20">
      <div className="container max-w-6xl py-10 px-4">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About JobGenie AI</h1>
          <p className="text-muted-foreground max-w-2xl">
            Empowering recruiters with AI-driven candidate matching while ensuring fairness, transparency, and ethical considerations.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                JobGenie AI was founded with a clear purpose: to transform the hiring process by removing inefficiencies and bias from resume screening, while helping companies find the best talent faster.
              </p>
              <p className="text-muted-foreground mb-4">
                We believe that the right match between candidate and job creates success for both the individual and the organization. Our AI technology makes this matching process more accurate, fair, and efficient.
              </p>
              <Button 
                className="mt-2"
                onClick={() => navigate('/upload')}
              >
                Start Matching Now
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white shadow-subtle hover:shadow-elevation transition-shadow">
                <CardContent className="p-6">
                  <Brain className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-lg font-medium mb-1">Smart AI</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced algorithms for precise matching
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-subtle hover:shadow-elevation transition-shadow">
                <CardContent className="p-6">
                  <FileCheck className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-lg font-medium mb-1">Time Saving</h3>
                  <p className="text-sm text-muted-foreground">
                    Reduce screening time by up to 75%
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-subtle hover:shadow-elevation transition-shadow">
                <CardContent className="p-6">
                  <ShieldCheck className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-lg font-medium mb-1">Unbiased</h3>
                  <p className="text-sm text-muted-foreground">
                    Fair evaluation based on skills
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-subtle hover:shadow-elevation transition-shadow">
                <CardContent className="p-6">
                  <BookOpen className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-lg font-medium mb-1">Transparent</h3>
                  <p className="text-sm text-muted-foreground">
                    Clear explanation of all results
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Ethics Section */}
        <div className="bg-white rounded-xl border border-border shadow-subtle p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Ethical Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">Bias Mitigation</h3>
              <p className="text-muted-foreground">
                Our algorithms are designed to focus on skills and qualifications, not demographic factors, ensuring fair treatment for all candidates.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">Data Privacy</h3>
              <p className="text-muted-foreground">
                We process all data securely and temporarily, adhering to GDPR principles. Your resumes and job descriptions are never stored permanently.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">Transparency</h3>
              <p className="text-muted-foreground">
                We believe in full explainability. Our AI provides clear reasons for every match and ranking, with no black-box decisions.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>How accurate is JobGenie AI?</AccordionTrigger>
              <AccordionContent>
                JobGenie AI achieves 85-95% accuracy in matching candidates to job requirements, based on our internal testing. The system combines document similarity with explicit extraction of experience, skills, and qualifications to ensure comprehensive evaluation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Does JobGenie replace human recruiters?</AccordionTrigger>
              <AccordionContent>
                No. JobGenie AI is designed to augment human decision-making, not replace it. Our AI handles the time-consuming initial screening process, allowing recruiters to focus their expertise on evaluating the best-matched candidates and making final hiring decisions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How does JobGenie handle different resume formats?</AccordionTrigger>
              <AccordionContent>
                JobGenie uses advanced PDF parsing and OCR technology to handle various resume formats, including text-based PDFs and scanned documents. Our preprocessing pipeline normalizes extracted text for consistent analysis regardless of original formatting.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>What measures are in place to prevent bias?</AccordionTrigger>
              <AccordionContent>
                JobGenie AI focuses exclusively on skills, experience, and qualifications. We've designed our algorithms to ignore demographic information and personal details that could lead to bias. We also regularly audit our system with diverse test datasets to identify and mitigate any potential biases.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Is my data secure with JobGenie?</AccordionTrigger>
              <AccordionContent>
                Yes. We process all documents temporarily and securely. Files are encrypted during transfer and processing, and are not permanently stored on our servers. We comply with GDPR and other privacy regulations, ensuring your recruitment data remains confidential.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-xl border border-border shadow-subtle p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Have questions or need more information? Our team is ready to help you transform your hiring process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Contact Us
            </Button>
            <Button variant="outline" className="gap-2">
              <ArrowUpRight className="h-4 w-4" />
              Documentation
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
