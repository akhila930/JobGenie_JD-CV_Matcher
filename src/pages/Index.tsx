
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, AlertCircle, Users, Clock, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: <Users className="h-5 w-5" />,
    title: "Smart Candidate Matching",
    description: "AI-powered resume analysis that matches the right candidates to your job openings with precision."
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Save Time & Resources",
    description: "Reduce the hiring process from weeks to minutes. No more manual resume screening."
  },
  {
    icon: <Award className="h-5 w-5" />,
    title: "Fair & Objective",
    description: "Eliminate unconscious bias with our transparent AI system that focuses on skills and qualifications."
  }
];

const benefits = [
  "Automatically extract skills, experience & qualifications",
  "Match candidates based on your specific job requirements",
  "Rank candidates with clear matching scores",
  "Get detailed insights on each candidate's strengths",
  "Export results for easy sharing and collaboration",
  "Transparent AI process with full explanations"
];

const limitations = [
  "AI cannot replace human judgment entirely",
  "Resume quality affects extraction accuracy",
  "Domain-specific terminology may require customization",
];

const Index = () => {
  const navigate = useNavigate();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <Hero />
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              How JobGenie AI <span className="text-gradient">Works</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Our advanced AI technology streamlines your hiring process by automating resume screening and candidate ranking.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="bg-white p-6 rounded-xl border border-border shadow-subtle hover:shadow-elevation transition-shadow animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 mb-4 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 order-2 md:order-1">
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-xl border border-border shadow-elevation animate-fade-up">
                  <h3 className="text-xl font-semibold mb-4">What JobGenie AI Can Do</h3>
                  <ul className="space-y-3">
                    {benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-border shadow-subtle animate-fade-up animate-delay-300">
                  <h3 className="text-xl font-semibold mb-4">Limitations to Be Aware Of</h3>
                  <ul className="space-y-3">
                    {limitations.map((limitation, i) => (
                      <li key={i} className="flex items-start gap-2 animate-fade-up" style={{ animationDelay: `${(i + 3) * 100}ms` }}>
                        <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex-1 order-1 md:order-2">
              <div className="relative">
                <div className="relative z-10 bg-white rounded-xl overflow-hidden border border-border shadow-elevation animate-fade-up">
                  <div className="h-8 bg-muted flex items-center px-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="h-5 w-24 bg-muted rounded animate-pulse-soft"></div>
                    
                    <div className="mt-5 space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between animate-fade-up" style={{ animationDelay: `${i * 100 + 200}ms` }}>
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-white",
                              i === 0 ? "bg-amber-500" : i === 1 ? "bg-slate-400" : "bg-slate-300"
                            )}>
                              {i + 1}
                            </div>
                            <div className="h-4 bg-muted rounded w-32"></div>
                          </div>
                          <div className="h-4 bg-muted rounded w-16"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/4 translate-x-1/4 -z-10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full translate-y-1/4 -translate-x-1/4 -z-10 blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-muted to-background">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of companies that are saving time and finding better candidates with JobGenie AI.
          </p>
          <Button 
            size="lg" 
            className="px-8 group"
            onClick={() => navigate('/upload')}
          >
            Get Started
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
