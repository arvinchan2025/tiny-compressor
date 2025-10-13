'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface NoteItem {
  icon: string;
  title: string;
  content: string;
  type: 'warning' | 'tip' | 'info' | 'success';
}

interface NotesSectionProps {
  customNotes: NoteItem[];
}

export default function NotesSection({ customNotes }: NotesSectionProps) {
  if (!customNotes || customNotes.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="py-12 bg-slate-50"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Critical Information
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Key details you should know before processing your images
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {customNotes.map((note, index) => {
              const colorClasses = [
                'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
                'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
                'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200',
                'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'
              ];
              const textColorClasses = [
                'text-blue-900 text-blue-700 text-blue-600',
                'text-green-900 text-green-700 text-green-600',
                'text-purple-900 text-purple-700 text-purple-600',
                'text-orange-900 text-orange-700 text-orange-600'
              ];
              
              const colorIndex = index % 4;
              const [bgClass, borderClass] = colorClasses[colorIndex].split(' ') || ['', ''];
              const [titleColor, contentColor, dotColor] = textColorClasses[colorIndex].split(' ') || ['', '', ''];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  className={`${bgClass} ${borderClass} p-6 rounded-xl border hover:shadow-lg transition-all duration-200 hover:scale-105`}
                >
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-3">{note.icon}</div>
                    <h3 className={`text-lg font-semibold ${titleColor} mb-3`}>
                      {note.title}
                    </h3>
                  </div>
                  <p className={`text-sm ${contentColor} leading-relaxed`}>
                    {note.content}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

