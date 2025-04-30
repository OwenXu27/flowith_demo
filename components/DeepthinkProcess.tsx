'use client';

import { useState, useEffect } from 'react';
import { Step, StepStatus } from '../types/Step';
import StepCard from './StepCard';

interface DeepthinkProcessProps {
  steps: Step[];
  onUpdate: (steps: Step[]) => void;
}

const DeepthinkProcess = ({ steps, onUpdate }: DeepthinkProcessProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [countdown, setCountdown] = useState(15);
  const [isCountdownActive, setIsCountdownActive] = useState(true);
  const [isProcessRunning, setIsProcessRunning] = useState(false);
  const [isProcessComplete, setIsProcessComplete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCountdownActive && countdown > 0 && !isEditing) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && !isEditing) {
      setIsCountdownActive(false);
      startProcess();
    }
    return () => clearInterval(timer);
  }, [countdown, isCountdownActive, isEditing]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isProcessRunning && currentStepIndex < steps.length) {
      timer = setTimeout(() => {
        const updatedSteps = steps.map((step, index) => {
          if (index === currentStepIndex) {
            return { ...step, status: 'completed' as StepStatus };
          } else if (index === currentStepIndex + 1) {
            return { ...step, status: 'running' as StepStatus };
          }
          return step;
        });
        onUpdate(updatedSteps);
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } else {
          setIsProcessComplete(true);
          setIsProcessRunning(false);
        }
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [currentStepIndex, isProcessRunning, steps, onUpdate]);

  const startProcess = () => {
    if (steps.length === 0) return;
    
    const updatedSteps = steps.map((step, index) => ({
      ...step,
      status: index === 0 ? 'running' as StepStatus : 'pending' as StepStatus
    }));
    onUpdate(updatedSteps);
    setCurrentStepIndex(0);
    setIsProcessRunning(true);
    setIsProcessComplete(false);
  };

  const handleStepUpdate = (stepIndex: number, updatedStep: Step) => {
    const updatedSteps = steps.map((step, index) => 
      index === stepIndex ? updatedStep : step
    );
    onUpdate(updatedSteps);
  };

  const handleEditStart = () => {
    setIsEditing(true);
    setIsCountdownActive(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {steps.map((step, index) => (
          <StepCard
            key={step.id}
            step={step}
            isActive={index === currentStepIndex}
            onUpdate={(updatedStep) => handleStepUpdate(index, updatedStep)}
            onEditStart={handleEditStart}
          />
        ))}
      </div>
      <div className="flex justify-between items-center sticky bottom-0 bg-white p-4 border-t border-[#E5E5E5]">
        <div className="flex items-center gap-2">
          {!isProcessComplete && (
            <span className="text-[14px] font-normal text-[#0A0A0A] leading-[16.8px] tracking-[0.00em]">
              {isCountdownActive && !isEditing ? `${countdown}s` : `Steps ${currentStepIndex + 1} of ${steps.length}`}
            </span>
          )}
          {!isProcessComplete && !isCountdownActive && !isEditing && (
            <div className="w-[200px] h-1 bg-[#E5E5E5] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#0A0A0A] transition-all duration-300"
                style={{ 
                  width: `${((currentStepIndex + 1) / steps.length) * 100}%` 
                }}
              />
            </div>
          )}
        </div>
        <button
          onClick={() => {
            if (!isProcessRunning) {
              setIsCountdownActive(false);
              startProcess();
            }
          }}
          className={`px-4 py-2 rounded-md text-white text-[13px] leading-[15.6px] tracking-[0.00em] transition-colors ${
            isProcessRunning 
              ? 'bg-[#E5E5E5] cursor-not-allowed' 
              : 'bg-[#0A0A0A] hover:bg-[#1A1A1A]'
          }`}
        >
          {isProcessComplete ? 'Restart Process' : 'Start Now'}
        </button>
      </div>
    </div>
  );
};

export default DeepthinkProcess; 