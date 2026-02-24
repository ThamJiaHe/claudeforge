'use client';

import type { SkillSuggestion } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SkillSuggestionsProps {
  skills: SkillSuggestion[];
}

export function SkillSuggestions({ skills }: SkillSuggestionsProps) {
  if (skills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-sm font-medium text-muted-foreground">
        Suggested skills:
      </span>
      <TooltipProvider delayDuration={300}>
        {skills.map((skill) => (
          <Tooltip key={skill.id}>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="cursor-default">
                {skill.name}
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p>{skill.description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}
