'use client';

import React from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import useScroll from '../Hooks/use-scroll';
import { cn } from '../../lib/utils';

const Header = () => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();

  return (
    <div
      className={cn(
        `sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-blue-400 bg-white`,
        {
          'bg-white/90 backdrop-blur-md': scrolled || selectedLayout,
        }
      )}
    >
      <div className="flex h-[60px] items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-3">
            {/*Logo*/}
            <img src="/Images/inj.png" alt="Logo" className="h-7 w-7" />
            <span className="text-Doc font-bold text-xl">Healthy Me</span>
          </Link>
        </div>

        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-700 hover:text-Doc font-medium">
            Home
          </Link>
          <Link href="/symptom-checker" className="text-gray-700 hover:text-Doc font-medium">
            Pre-Diagnosis Report
          </Link>
          <Link href="/prescription" className="text-gray-700 hover:text-Doc font-medium">
            Prescription Reader
          </Link>
          <Link href="/skin-infection-checker" className="text-gray-700 hover:text-Doc font-medium">
            Skin Infection Checker
          </Link>
          <Link href="/common-remedies" className="text-gray-700 hover:text-Doc font-medium">
            Common Remedies
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Header;
