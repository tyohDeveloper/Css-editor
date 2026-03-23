import React, { useEffect } from 'react';
import { Header } from '@/components/panels/Header';
import { Sidebar } from '@/components/panels/Sidebar';
import { EditorPanel } from '@/components/panels/EditorPanel';
import { PreviewPanel } from '@/components/panels/PreviewPanel';
import { motion } from 'framer-motion';

export default function Home() {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const raw = sessionStorage.getItem('css-builder-storage');
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw) as { state?: { isDirty?: boolean } };
        if (parsed.state?.isDirty) {
          e.preventDefault();
        }
      } catch {
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden font-sans">
      <Header />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex-1 flex overflow-hidden relative"
      >
        <Sidebar />

        <div className="flex-1 flex min-w-0">
          <div className="w-[350px] lg:w-[400px] xl:w-[450px] shrink-0 flex flex-col">
            <EditorPanel />
          </div>

          <div className="flex-1 min-w-0 border-l border-border shadow-2xl z-10">
            <PreviewPanel />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
