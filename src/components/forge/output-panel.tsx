'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useForgeStore } from '@/store/use-forge-store';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FormatTabs } from './format-tabs';
import { SkillSuggestions } from './skill-suggestions';
import { ParameterTips } from './parameter-tips';

export function OutputPanel() {
  const result = useForgeStore((s) => s.result);

  return (
    <AnimatePresence>
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Card>
            <CardContent className="space-y-4 p-4 sm:p-6">
              {/* Format tabs with code block and copy button */}
              <FormatTabs />

              {/* Skill suggestions (if any) */}
              {result.suggestedSkills.length > 0 && (
                <>
                  <Separator />
                  <SkillSuggestions skills={result.suggestedSkills} />
                </>
              )}

              {/* Parameter tips (if any) */}
              {result.parameterTips.length > 0 && (
                <>
                  <Separator />
                  <ParameterTips tips={result.parameterTips} />
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
