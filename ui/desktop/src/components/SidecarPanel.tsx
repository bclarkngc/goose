import React from 'react';
import { History } from './icons';

interface SidecarAction {
  id: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  tooltip?: string;
}

interface SidecarPanelProps {
  actions: SidecarAction[];
  className?: string;
}

export default function SidecarPanel({ actions, className = '' }: SidecarPanelProps) {
  return (
    <div className={`flex flex-col items-center gap-3 py-4 px-2 ${className}`}>
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={action.onClick}
          className={`
            flex items-center justify-center
            w-12 h-8 rounded-2xl
            transition-all duration-200
            ${action.isActive 
              ? 'bg-background-accent text-text-on-accent' 
              : 'bg-background-muted text-text-muted hover:bg-background-medium'
            }
          `}
          title={action.tooltip}
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
}

// Specific sidecar action components
export function DiffSidecarAction({ 
  isActive, 
  onClick 
}: { 
  isActive: boolean; 
  onClick: () => void; 
}) {
  return {
    id: 'diff',
    icon: <History className="w-4 h-4" />,
    isActive,
    onClick,
    tooltip: 'View Diff'
  };
}
