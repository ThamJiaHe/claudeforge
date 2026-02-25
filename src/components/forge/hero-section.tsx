'use client';

import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-16">
      {/* Subtle gradient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-muted/40 via-transparent to-transparent dark:from-muted/20"
      />

      <motion.div
        className="mx-auto max-w-4xl px-4 text-center sm:px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          variants={childVariants}
        >
          Craft perfect AI prompts
        </motion.h1>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          variants={childVariants}
        >
          Transform plain English into production-ready prompts optimized
          for Claude, GPT, Gemini, Llama, and more
        </motion.p>
      </motion.div>
    </section>
  );
}
