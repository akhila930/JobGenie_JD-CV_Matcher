
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, User, BarChart4 } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative px-4 pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-genie-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] rounded-full bg-accent/10 blur-3xl" />
      </div>
      
      <div className="container max-w-6xl">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
              AI-Powered Smart Hiring
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-tight animate-fade-up">
              Find Your Perfect <span className="text-gradient">Candidate</span> With AI Magic
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto md:mx-0 animate-fade-up animate-delay-200">
              JobGenie AI automates resume screening with precision, fairness, and transparency. 
              Match the right talent to your team in minutes, not days.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start animate-fade-up animate-delay-300">
              <Button 
                size="lg" 
                className="w-full sm:w-auto group"
                onClick={() => navigate('/upload')}
              >
                Start Matching Now
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={() => navigate('/demo')}
              >
                See How It Works
              </Button>
            </div>
          </div>
          
          <div className="flex-1 relative w-full md:w-auto">
            <div className="relative w-full max-w-md mx-auto">
              {/* Main feature card */}
              <div className="glass rounded-2xl p-6 shadow-elevation animate-fade-in animate-delay-400">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-xl">Resume Matching</h3>
                    <p className="text-muted-foreground mt-1">Powered by AI</p>
                  </div>
                  <div className="p-2 rounded-full genie-gradient text-white">
                    <BarChart4 size={20} />
                  </div>
                </div>
                
                <div className="mt-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-muted-foreground" />
                      <span>Candidate A</span>
                    </div>
                    <div className="font-medium text-genie-600">94%</div>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="genie-gradient h-2 rounded-full animate-pulse-soft" style={{ width: '94%' }}></div>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-muted-foreground" />
                      <span>Candidate B</span>
                    </div>
                    <div className="font-medium text-genie-600">78%</div>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="genie-gradient h-2 rounded-full animate-pulse-soft" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 glass rounded-lg p-3 shadow-elevation animate-float animate-delay-700">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-genie-500" />
                  <span className="text-sm font-medium">50+ Resumes Processed</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 glass rounded-lg p-3 shadow-elevation animate-float animate-delay-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">98% Accuracy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
