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
  React.useEffect(() => {
    // Parse unified diff format - for now just display the raw diff
    // In the future, this could be enhanced to parse the diff and show side-by-side view
  }, [diffContent]);

  return (
    <div className="h-full flex flex-col bg-[#1E1E1E]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#232323]">
        <div className="flex items-center space-x-2">
          <GitBranch size={16} className="text-blue-400" />
          <span className="text-white font-medium">{fileName}</span>
          <span className="text-gray-400 text-sm">• File changes: 320-345 line</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
            <X size={14} className="mr-1" />
            Deny all
          </Button>
          <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
            <span className="mr-1">✓</span>
            Approve all
          </Button>
        </div>
      </div>

      {/* Changed Import Statements Section */}
      <div className="p-4 border-b border-[#232323]">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-green-400 font-medium">Changed import statements</span>
          <span className="text-gray-400 text-sm">• 1 item changed: 320-345 line</span>
        </div>
      </div>

      {/* Diff Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full bg-[#0D1117] font-mono text-sm">
          <pre className="h-full overflow-auto p-4 text-white whitespace-pre-wrap">
            {diffContent}
          </pre>
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
