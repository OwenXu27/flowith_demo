export type StepStatus = 'pending' | 'running' | 'completed';

export interface Step {
  id: string;
  title: string;
  items: string[];
  status: StepStatus;
}

export interface DeepthinkProcessProps {
  steps: Step[];
  onComplete?: () => void;
} 