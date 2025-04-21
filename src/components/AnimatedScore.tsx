
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedScoreProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AnimatedScore = ({ value, size = 'md', className }: AnimatedScoreProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const duration = 1500; // Animation duration in milliseconds
  
  useEffect(() => {
    startTimeRef.current = null;
    
    const animateValue = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function for smoother animation
      const easedProgress = percentage < 0.5
        ? 4 * percentage * percentage * percentage
        : 1 - Math.pow(-2 * percentage + 2, 3) / 2;
      
      setDisplayValue(Math.min(value * easedProgress, value));
      
      if (progress < duration) {
        animationRef.current = requestAnimationFrame(animateValue);
      }
    };
    
    animationRef.current = requestAnimationFrame(animateValue);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value]);
  
  // Determine size classes
  const sizeClasses = {
    sm: "w-16 h-16 text-lg",
    md: "w-24 h-24 text-2xl",
    lg: "w-32 h-32 text-3xl",
  };
  
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 0.9) return "text-green-500";
    if (score >= 0.7) return "text-blue-500";
    if (score >= 0.5) return "text-amber-500";
    return "text-red-500";
  };
  
  const circumference = 2 * Math.PI * 45; // Radius is 45
  const dashOffset = circumference * (1 - displayValue);
  
  return (
    <div className={cn(
      "relative flex items-center justify-center",
      sizeClasses[size],
      className
    )}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-muted/30"
        />
        
        {/* Progress arc */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className={getScoreColor(displayValue)}
          transform="rotate(-90 50 50)"
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn(
          "font-medium",
          getScoreColor(displayValue)
        )}>
          {Math.round(displayValue * 100)}%
        </span>
      </div>
    </div>
  );
};

export default AnimatedScore;
