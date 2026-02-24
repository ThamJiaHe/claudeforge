'use client';

import { Lightbulb } from 'lucide-react';

interface ParameterTipsProps {
  tips: string[];
}

export function ParameterTips({ tips }: ParameterTipsProps) {
  if (tips.length === 0) return null;

  return (
    <div className="flex gap-2 text-sm text-muted-foreground">
      <Lightbulb className="mt-0.5 size-4 shrink-0" />
      {tips.length === 1 ? (
        <p className="italic">{tips[0]}</p>
      ) : (
        <ul className="list-disc space-y-1 pl-4">
          {tips.map((tip, index) => (
            <li key={index} className="italic">
              {tip}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
