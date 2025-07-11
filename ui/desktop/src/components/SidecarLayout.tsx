import React, { useState, createContext, useContext } from 'react';
import { X, GitBranch } from 'lucide-react';
import { Button } from './ui/button';

interface SidecarView {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface SidecarContextType {
  activeView: string | null;
  views: SidecarView[];
  showView: (view: SidecarView) => void;
  hideView: () => void;
  showDiffViewer: (diffContent: string, fileName?: string) => void;
  hideDiffViewer: () => void;
}

const SidecarContext = createContext<SidecarContextType | null>(null);

export const useSidecar = () => {
  const context = useContext(SidecarContext);
  // Return null if no context (allows optional usage)
  return context;
};

interface SidecarProviderProps {
  children: React.ReactNode;
}

// Monaco Editor Diff Component
function MonacoDiffViewer({ diffContent, fileName }: { diffContent: string; fileName: string }) {
  const [parsedDiff, setParsedDiff] = useState<{
    beforeLines: Array<{ content: string; lineNumber: number; type: 'context' | 'removed' | 'added' }>;
    afterLines: Array<{ content: string; lineNumber: number; type: 'context' | 'removed' | 'added' }>;
  }>({ beforeLines: [], afterLines: [] });

  React.useEffect(() => {
    // Parse unified diff format into before/after with line numbers
    const lines = diffContent.split('\n');
    const beforeLines: Array<{ content: string; lineNumber: number; type: 'context' | 'removed' | 'added' }> = [];
    const afterLines: Array<{ content: string; lineNumber: number; type: 'context' | 'removed' | 'added' }> = [];
    
    let beforeLineNum = 1;
    let afterLineNum = 1;
    let inHunk = false;
    
    for (const line of lines) {
      if (line.startsWith('@@')) {
        inHunk = true;
        const match = line.match(/@@ -(\d+),?\d* \+(\d+),?\d* @@/);
        if (match) {
          beforeLineNum = parseInt(match[1]);
          afterLineNum = parseInt(match[2]);
        }
        continue;
      }
      
      if (!inHunk) continue;
      
      if (line.startsWith('-')) {
        // Removed line - only in before
        const content = line.substring(1);
        beforeLines.push({ content, lineNumber: beforeLineNum, type: 'removed' });
        beforeLineNum++;
      } else if (line.startsWith('+')) {
        // Added line - only in after
        const content = line.substring(1);
        afterLines.push({ content, lineNumber: afterLineNum, type: 'added' });
        afterLineNum++;
      } else if (line.startsWith(' ')) {
        // Context line - in both
        const content = line.substring(1);
        beforeLines.push({ content, lineNumber: beforeLineNum, type: 'context' });
        afterLines.push({ content, lineNumber: afterLineNum, type: 'context' });
        beforeLineNum++;
        afterLineNum++;
      }
    }
    
    setParsedDiff({ beforeLines, afterLines });
  }, [diffContent]);

  const renderDiffLine = (line: { content: string; lineNumber: number; type: 'context' | 'removed' | 'added' }, side: 'before' | 'after') => {
    const getLineStyle = () => {
      switch (line.type) {
        case 'removed':
          return 'bg-red-900/30 border-l-2 border-red-500';
        case 'added':
          return 'bg-green-900/30 border-l-2 border-green-500';
        case 'context':
        default:
          return 'bg-transparent';
      }
    };

    const getTextColor = () => {
      switch (line.type) {
        case 'removed':
          return 'text-red-300';
        case 'added':
          return 'text-green-300';
        case 'context':
        default:
          return 'text-gray-300';
      }
    };

    const getLinePrefix = () => {
      switch (line.type) {
        case 'removed':
          return '-';
        case 'added':
          return '+';
        case 'context':
        default:
          return ' ';
      }
    };

    return (
      <div key={`${side}-${line.lineNumber}`} className={`flex font-mono text-sm ${getLineStyle()}`}>
        <div className="w-12 text-gray-500 text-right pr-2 py-1 select-none flex-shrink-0">
          {line.lineNumber}
        </div>
        <div className="w-4 text-gray-500 text-center py-1 select-none flex-shrink-0">
          {getLinePrefix()}
        </div>
        <div className={`flex-1 py-1 pr-4 ${getTextColor()}`}>
          <code>{line.content || ' '}</code>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#1E1E1E]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#232323]">
        <div className="flex items-center space-x-2">
          <GitBranch size={16} className="text-blue-400" />
          <span className="text-white font-medium">{fileName}</span>
        </div>
      </div>

      {/* Split Diff Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Before (Left Side) */}
        <div className="flex-1 border-r border-[#232323]">
          <div className="bg-[#2D1B1B] text-red-300 px-4 py-2 text-sm font-medium border-b border-[#232323]">
            Before
          </div>
          <div className="h-[calc(100%-40px)] overflow-auto">
            {parsedDiff.beforeLines.map((line) => renderDiffLine(line, 'before'))}
          </div>
        </div>

        {/* After (Right Side) */}
        <div className="flex-1">
          <div className="bg-[#1B2D1B] text-green-300 px-4 py-2 text-sm font-medium border-b border-[#232323]">
            After
          </div>
          <div className="h-[calc(100%-40px)] overflow-auto">
            {parsedDiff.afterLines.map((line) => renderDiffLine(line, 'after'))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SidecarProvider({ children }: SidecarProviderProps) {
  const [activeView, setActiveView] = useState<string | null>(null);
  const [views, setViews] = useState<SidecarView[]>([]);

  const showView = (view: SidecarView) => {
    setViews(prev => {
      const existing = prev.find(v => v.id === view.id);
      if (existing) {
        return prev.map(v => v.id === view.id ? view : v);
      }
      return [...prev, view];
    });
    setActiveView(view.id);
  };

  const hideView = () => {
    setActiveView(null);
  };

  const showDiffViewer = (content: string, fileName = 'File') => {
    const diffView: SidecarView = {
      id: 'diff',
      title: 'Diff Viewer',
      icon: <GitBranch size={16} />,
      content: <MonacoDiffViewer diffContent={content} fileName={fileName} />
    };
    showView(diffView);
  };

  const hideDiffViewer = () => {
    setViews(prev => prev.filter(v => v.id !== 'diff'));
    if (activeView === 'diff') {
      setActiveView(null);
    }
  };

  const contextValue: SidecarContextType = {
    activeView,
    views,
    showView,
    hideView,
    showDiffViewer,
    hideDiffViewer,
  };

  const currentView = views.find(v => v.id === activeView);

  return (
    <SidecarContext.Provider value={contextValue}>
      <div className="flex h-full relative">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${activeView ? 'mr-[700px]' : ''}`}>
          {children}
        </div>

        {/* Sidecar Panel - Only visible when there's an active view */}
        {activeView && currentView && (
          <div className="fixed right-0 top-0 h-full w-[700px] bg-[#1E1E1E] border-l border-[#232323] z-20 transition-transform duration-300">
            {/* Sidecar Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#232323]">
              <div className="flex items-center space-x-2">
                {currentView.icon}
                <span className="text-white font-medium">{currentView.title}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={hideView}
                className="text-gray-400 hover:text-white"
              >
                <X size={16} />
              </Button>
            </div>

            {/* Sidecar Content */}
            <div className="h-[calc(100%-60px)] overflow-hidden">
              {currentView.content}
            </div>
          </div>
        )}
      </div>
    </SidecarContext.Provider>
  );
}
