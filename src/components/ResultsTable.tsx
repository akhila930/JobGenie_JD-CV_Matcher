
import { useState } from 'react';
import { 
  Download, 
  SortAsc, 
  SortDesc, 
  Info, 
  Award, 
  Clock, 
  Briefcase, 
  GraduationCap 
} from 'lucide-react';
import { ResumeScore } from '@/api/resumeService';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ResultsTableProps {
  results: ResumeScore[];
}

type SortField = 'score' | 'experience' | 'skills';
type SortDirection = 'asc' | 'desc';

const ResultsTable = ({ results }: ResultsTableProps) => {
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Sorting function
  const sortedResults = [...results].sort((a, b) => {
    if (sortField === 'score') {
      return sortDirection === 'desc' ? b.score - a.score : a.score - b.score;
    } else if (sortField === 'experience') {
      return sortDirection === 'desc' ? b.experience - a.experience : a.experience - b.experience;
    } else if (sortField === 'skills') {
      return sortDirection === 'desc' ? b.skills.length - a.skills.length : a.skills.length - b.skills.length;
    }
    return 0;
  });
  
  // Toggle sort direction and field
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Export results as CSV
  const exportCSV = () => {
    const headers = ['Name', 'Score', 'Experience', 'Skills', 'Qualifications', 'Preview'];
    const csvRows = [
      headers.join(','),
      ...sortedResults.map(r => [
        `"${r.name}"`,
        r.score.toFixed(2),
        r.experience,
        `"${r.skills.join(', ')}"`,
        `"${r.qualifications.join(', ')}"`,
        `"${r.preview.replace(/"/g, '""')}"`
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'job_genie_results.csv');
    link.click();
  };

  return (
    <div className="w-full overflow-hidden bg-white rounded-xl border border-border shadow-subtle">
      <div className="p-4 flex items-center justify-between border-b border-border">
        <h2 className="font-semibold text-lg">Matched Candidates</h2>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={exportCSV} 
          className="flex items-center gap-1"
        >
          <Download size={16} /> 
          <span>Export</span>
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Candidate
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer group"
                onClick={() => toggleSort('score')}
              >
                <div className="flex items-center gap-1">
                  <span>Score</span>
                  {sortField === 'score' ? (
                    sortDirection === 'desc' ? <SortDesc size={14} /> : <SortAsc size={14} />
                  ) : (
                    <SortDesc size={14} className="opacity-0 group-hover:opacity-30" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer group"
                onClick={() => toggleSort('experience')}
              >
                <div className="flex items-center gap-1">
                  <span>Experience</span>
                  {sortField === 'experience' ? (
                    sortDirection === 'desc' ? <SortDesc size={14} /> : <SortAsc size={14} />
                  ) : (
                    <SortDesc size={14} className="opacity-0 group-hover:opacity-30" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer group"
                onClick={() => toggleSort('skills')}
              >
                <div className="flex items-center gap-1">
                  <span>Matched Skills</span>
                  {sortField === 'skills' ? (
                    sortDirection === 'desc' ? <SortDesc size={14} /> : <SortAsc size={14} />
                  ) : (
                    <SortDesc size={14} className="opacity-0 group-hover:opacity-30" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Qualifications
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-border">
            {sortedResults.map((result, idx) => (
              <tr key={result.id} className={cn(
                "transition-colors hover:bg-muted/20",
                idx % 2 === 0 ? 'bg-white' : 'bg-muted/10'
              )}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white",
                      idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-slate-400' : idx === 2 ? 'bg-amber-700' : 'bg-slate-300'
                    )}>
                      {idx < 3 ? <Award size={14} /> : <span className="text-sm font-medium">{idx + 1}</span>}
                    </div>
                    <div className="flex flex-col">
                      <div className="font-medium text-sm truncate max-w-[150px]">{result.name}</div>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="link" className="h-auto p-0 text-xs text-muted-foreground">
                            View preview
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">{result.name}</h4>
                            <p className="text-xs text-muted-foreground">{result.preview}</p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-14 font-medium">
                      {(result.score * 100).toFixed(0)}%
                    </div>
                    
                    <div className="flex-1 max-w-[120px]">
                      <Progress value={result.score * 100} className="h-2" />
                    </div>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-muted-foreground">
                            <Info size={14} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="w-64">
                          <h4 className="font-medium text-sm">Score Breakdown</h4>
                          <div className="mt-2 space-y-2 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-1">
                                <Award size={12} /> Similarity
                              </span>
                              <span>{(result.score * 100 * 0.5).toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-1">
                                <Clock size={12} /> Experience
                              </span>
                              <span>{(result.score * 100 * 0.2).toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-1">
                                <Briefcase size={12} /> Skills
                              </span>
                              <span>{(result.score * 100 * 0.2).toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-1">
                                <GraduationCap size={12} /> Qualifications
                              </span>
                              <span>{(result.score * 100 * 0.1).toFixed(0)}%</span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-muted-foreground" />
                    <span>{result.experience} years</span>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {result.skills.map((skill, i) => (
                      <Badge key={i} variant="outline" className="py-0 h-5">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {result.qualifications.map((qual, i) => (
                      <Badge key={i} className="bg-muted text-muted-foreground py-0 h-5">
                        {qual}
                      </Badge>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
