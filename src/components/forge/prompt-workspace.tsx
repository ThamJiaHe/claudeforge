'use client';

import { motion } from 'framer-motion';
import { ConfigBar } from './config-bar';
import { InputPanel } from './input-panel';
import { OutputPanel } from './output-panel';

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
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
};

export function PromptWorkspace() {
  return (
    <motion.section
      className="mx-auto max-w-4xl space-y-6 px-4 pb-16 sm:px-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={childVariants}>
        <ConfigBar />
      </motion.div>
      <motion.div variants={childVariants}>
        <InputPanel />
      </motion.div>
      <motion.div variants={childVariants}>
        <OutputPanel />
      </motion.div>
    </motion.section>
  );
}
