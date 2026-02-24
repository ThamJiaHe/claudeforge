'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const shimmer =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent';

function SkeletonBar({
  width,
  height = 'h-4',
  delay = 0,
}: {
  width: string;
  height?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`${height} ${width} rounded-md bg-muted ${shimmer}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
    />
  );
}

export function GenerationSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Card>
        <CardContent className="space-y-4 p-4 sm:p-6">
          {/* Tab bar skeleton */}
          <div className="flex gap-2">
            <SkeletonBar width="w-20" height="h-8" delay={0} />
            <SkeletonBar width="w-20" height="h-8" delay={0.05} />
            <SkeletonBar width="w-20" height="h-8" delay={0.1} />
          </div>

          {/* Code block skeleton */}
          <div className="space-y-3 rounded-lg bg-muted/30 p-4">
            <SkeletonBar width="w-3/4" delay={0.1} />
            <SkeletonBar width="w-full" delay={0.15} />
            <SkeletonBar width="w-5/6" delay={0.2} />
            <SkeletonBar width="w-2/3" delay={0.25} />
            <SkeletonBar width="w-full" delay={0.3} />
            <SkeletonBar width="w-1/2" delay={0.35} />
          </div>

          {/* Footer skeleton */}
          <div className="flex items-center gap-3 pt-2">
            <SkeletonBar width="w-24" height="h-3" delay={0.35} />
            <SkeletonBar width="w-16" height="h-3" delay={0.4} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
