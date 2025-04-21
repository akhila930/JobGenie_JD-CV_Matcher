
import { useState, useEffect } from 'react';
import { Play, Pause, Code, FileText, Database, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { resumeService } from '@/api/resumeService';
import { cn } from '@/lib/utils';

interface DemoVisualizerProps {
  onComplete?: () => void;
}

const DemoVisualizer = ({ onComplete }: DemoVisualizerProps) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  // Load logs
  useEffect(() => {
    const loadLogs = async () => {
      try {
        const logs = await resumeService.getProcessingLogs();
        setLogs(logs);
      } catch (error) {
        console.error('Failed to load logs:', error);
      }
    };
    
    loadLogs();
  }, []);
  
  // Process logs with a timer
  useEffect(() => {
    let timer: number;
    
    if (isRunning && currentLogIndex < logs.length) {
      timer = window.setTimeout(() => {
        setCurrentLogIndex(prev => prev + 1);
        setProgress(((currentLogIndex + 1) / logs.length) * 100);
      }, 1000);
    } else if (currentLogIndex >= logs.length && logs.length > 0) {
      setIsRunning(false);
      setShowResults(true);
      if (onComplete) {
        onComplete();
      }
    }
    
    return () => clearTimeout(timer);
  }, [isRunning, currentLogIndex, logs.length, onComplete]);
  
  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };
  
  const resetSimulation = () => {
    setCurrentLogIndex(0);
    setProgress(0);
    setIsRunning(false);
    setShowResults(false);
  };
  
  return (
    <div className="w-full h-full bg-white rounded-xl border border-border shadow-subtle overflow-hidden flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold flex items-center gap-2">
          <Code size={18} />
          <span>AI Processing Simulation</span>
        </h2>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isRunning ? "default" : "outline"}
            size="sm"
            onClick={toggleSimulation}
            disabled={currentLogIndex >= logs.length}
            className="gap-1"
          >
            {isRunning ? (
              <>
                <Pause size={14} /> Pause
              </>
            ) : (
              <>
                <Play size={14} /> {currentLogIndex === 0 ? 'Start' : 'Resume'}
              </>
            )}
          </Button>
          
          {(currentLogIndex > 0 || showResults) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetSimulation}
            >
              Reset
            </Button>
          )}
        </div>
      </div>
      
      <div className="px-4 py-2 bg-muted/30">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>Progress: {Math.round(progress)}%</span>
          <span>{currentLogIndex} / {logs.length} steps</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-border">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <Database size={16} />
            <span>Processing Logs</span>
          </div>
          
          <ScrollArea className="h-[300px] rounded-md border border-border bg-muted/20 p-4">
            <div className="font-mono text-xs space-y-2">
              {logs.slice(0, currentLogIndex).map((log, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "p-2 rounded border-l-2 animate-fade-in",
                    index === currentLogIndex - 1 ? "border-primary bg-primary/5" : "border-muted"
                  )}
                  style={{ animationDuration: '300ms' }}
                >
                  {log}
                </div>
              ))}
              
              {currentLogIndex === 0 && !isRunning && logs.length > 0 && (
                <div className="text-center p-4 text-muted-foreground">
                  Click "Start" to begin the processing simulation
                </div>
              )}
              
              {logs.length === 0 && (
                <div className="text-center p-4 text-muted-foreground">
                  Loading simulation data...
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        
        <div className="flex-1 p-4 flex flex-col">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <FileText size={16} />
            <span>Document Processing</span>
          </div>
          
          <div className="flex-1 rounded-md border border-border bg-muted/20 p-4 flex flex-col items-center justify-center">
            {showResults ? (
              <div className="text-center animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <ArrowRight size={24} />
                </div>
                <h3 className="text-lg font-medium mb-2">Processing Complete</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Resumes have been analyzed and ranked successfully
                </p>
                <Button 
                  className="mt-2"
                  onClick={() => window.location.href = '/results'}
                >
                  View Results
                </Button>
              </div>
            ) : (
              <div className="w-full max-w-md">
                <div className="relative">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20">
                    {isRunning && (
                      <div className="w-full h-full rounded-full border-t-2 border-primary animate-spin" />
                    )}
                  </div>

                  <div className="flex justify-between mb-12">
                    <div className={cn(
                      "w-32 text-center transition-opacity",
                      currentLogIndex < 4 ? "opacity-40" : "opacity-100"
                    )}>
                      <div className="w-16 h-16 mx-auto rounded-lg bg-white shadow-elevation border border-border flex items-center justify-center text-primary">
                        <FileText size={24} />
                      </div>
                      <p className="mt-2 text-xs font-medium">Job Description</p>
                    </div>
                    
                    <div className={cn(
                      "w-32 text-center transition-opacity",
                      currentLogIndex < 4 ? "opacity-40" : "opacity-100"
                    )}>
                      <div className="w-16 h-16 mx-auto rounded-lg bg-white shadow-elevation border border-border flex items-center justify-center text-primary">
                        <FileText size={24} />
                      </div>
                      <p className="mt-2 text-xs font-medium">Resumes</p>
                    </div>
                  </div>
                  
                  <div className="h-32 rounded-lg border border-dashed border-border bg-white p-3 shadow-sm">
                    <div className="text-center text-xs text-muted-foreground">
                      {currentLogIndex < 4 && "Preparing for processing..."}
                      {currentLogIndex >= 4 && currentLogIndex < 8 && "Analyzing text content..."}
                      {currentLogIndex >= 8 && "Matching and ranking candidates..."}
                    </div>
                    
                    <div className="mt-2 h-[72px] overflow-hidden">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div 
                          key={i}
                          className={cn(
                            "h-2 my-1 bg-muted rounded",
                            currentLogIndex > i + 4 ? "bg-primary/40" : ""
                          )}
                          style={{ 
                            width: `${currentLogIndex > i + 4 ? 100 : Math.min(currentLogIndex * 8, 60)}%`,
                            transition: 'width 0.5s ease-out'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoVisualizer;
