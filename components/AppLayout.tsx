'use client';

import { ReactNode, useState } from 'react';
import DeepthinkProcess from './DeepthinkProcess';
import { Step, StepStatus } from '../types/Step';

interface AppLayoutProps {
  children: ReactNode;
}

const steps: Step[] = [
  {
    id: '1',
    title: 'Discover',
    items: [
      'Analyze the job description to extract key responsibilities, required skills, and core expectations for the Anker GTM position.',
      'Research Anker: Gather essential information including company history, main product categories, target markets, major competitors, and recent news or financial updates.',
      'Research the consumer electronics accessory industry, especially sectors relevant to Anker (charging, portable power, audio), identifying major trends, market dynamics, competitive landscape, and potential challenges.'
    ],
    status: 'pending' as StepStatus
  },
  {
    id: '2',
    title: 'Plan',
    items: [
      'Synthesize collected information to highlight the most relevant points for a Go-To-Market (GTM) role at Anker.',
      'Design a comprehensive interview question framework based on the job description and industry context, covering:\n• Behavioral questions\n• Situational questions\n• Company-specific questions\n• Industry-related questions\n• Role-specific questions'
    ],
    status: 'pending' as StepStatus
  },
  {
    id: '3',
    title: 'Create',
    items: [
      'Draft a full interview preparation guide, including:\n• Key role expectations\n• Insights on Anker and the industry\n• Categorized interview questions\n• Answering strategies or hints for each type',
      'Create a structured webpage layout to present the preparation guide clearly and accessibly.'
    ],
    status: 'pending' as StepStatus
  },
  {
    id: '4',
    title: 'Refine',
    items: [
      'Review and enhance the content for clarity, completeness, and logical flow.',
      'Optimize webpage structure for better navigation and user experience, adding elements like a quick-access table of contents or categorized sections.'
    ],
    status: 'pending' as StepStatus
  },
  {
    id: '5',
    title: 'Deliver',
    items: [
      'Publish the finalized interview preparation guide as a complete webpage or document.',
      'Use the material for actual interview preparation or share it with other candidates targeting similar roles.'
    ],
    status: 'pending' as StepStatus
  }
];

export default function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(375);
  const [currentSteps, setCurrentSteps] = useState(steps);

  const handleResize = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.clientX - startX);
      if (newWidth >= 375 && newWidth <= 600) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleStepsUpdate = (updatedSteps: Step[]) => {
    setCurrentSteps(updatedSteps);
  };

  return (
    <div className="flex h-screen bg-[#F5F5F5]">
      {/* Left Sidebar - DeepthinkProcess */}
      <div
        className={`
          fixed md:static
          h-screen
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          border-r border-[#E5E5E5] bg-white overflow-y-auto
        `}
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="pt-6">
          <div className="flex items-center justify-between mb-6 px-3">
            <h1 className="text-[16px] font-normal text-[#0A0A0A] leading-[19.2px] tracking-[0.00em]">
              Deep Thinking Process
            </h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <DeepthinkProcess steps={currentSteps} onUpdate={handleStepsUpdate} />
        </div>
        <div
          className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-gray-200 active:bg-gray-300"
          onMouseDown={handleResize}
        />
      </div>

      {/* Right Canvas Area */}
      <div className="flex-1 overflow-hidden">
        <div className="md:hidden p-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
} 