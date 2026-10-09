'use client';
import StandardPageLayout from '@/components/layout/StandardPageLayout';
import {motion} from 'framer-motion';
import React from "react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <StandardPageLayout locale="en">
      <div className={'grid grid-cols-4 gap-8 p-8'}>
        <div></div>
        <motion.div
          initial={{opacity: 0, y: 30}}
          whileInView={{opacity: 1, y: 0}}
          transition={{duration: 0.5}}
          viewport={{once: true}}
          className="group"
        >
          <Link href={"#"}>
          <div
            className={'relative bg-white p-4 rounded shadow'}
          >
            <div className="p-6 flex-1 flex flex-col relative">
              <div className="text-center mb-5">
                <h3 className="text-lg font-bold text-gray-900">Free</h3>
              </div>
            </div>
            <div className="mt-auto pt-4 border-t border-gray-100/60 dark:border-gray-700/60">
              <div className="text-center">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                  Daily Limited
                </div>
                <div
                  className={`text-base font-bold bg-gradient-to-r bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
                  "BBB"
                </div>
              </div>
            </div>
          </div>
          </Link>
        </motion.div>
      </div>
    </StandardPageLayout>
)
}