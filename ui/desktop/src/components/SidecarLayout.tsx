import React, { useState, createContext, useContext } from 'react';
import SidecarPanel, { DiffSidecarAction } from './SidecarPanel';
import DiffViewer from './DiffViewer';

interface SidecarContextType {
  activeSidecar: string | null;
  setActiveSidecar: (id: string | null) => void;
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

export function SidecarProvider({ children }: SidecarProviderProps) {
  const [activeSidecar, setActiveSidecar] = useState<string | null>(null);
  const [diffContent, setDiffContent] = useState<string>('');
  const [diffFileName, setDiffFileName] = useState<string>('');

  const showDiffViewer = (content: string, fileName = 'File') => {
    setDiffContent(content);
    setDiffFileName(fileName);
    setActiveSidecar('diff');
  };

  const hideDiffViewer = () => {
    setActiveSidecar(null);
    setDiffContent('');
    setDiffFileName('');
  };

  const contextValue: SidecarContextType = {
    activeSidecar,
    setActiveSidecar,
    showDiffViewer,
    hideDiffViewer,
  };

  return (
    <SidecarContext.Provider value={contextValue}>
      <div className="flex h-full relative">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${activeSidecar ? 'mr-[760px]' : ''}`}>
          {children}
        </div>

        {/* Sidecar Panel - Only visible when there's an active sidecar */}
        {activeSidecar && (
          <>
            {/* Thin action panel */}
            <div className="fixed right-[700px] top-0 h-full w-[60px] bg-background-muted border-l border-border-default flex flex-col z-30">
              <SidecarPanel
                actions={[
                  DiffSidecarAction({
                    isActive: activeSidecar === 'diff',
                    onClick: () => {
                      if (activeSidecar === 'diff') {
                        hideDiffViewer();
                      } else {
                        setActiveSidecar('diff');
                      }
                    },
                  }),
                  // Add more sidecar actions here in the future
                ]}
                className="flex-1"
              />
            </div>

            {/* Sidecar Content Panel */}
            <div className="fixed right-0 top-0 h-full w-[700px] z-20 transition-transform duration-300">
              {activeSidecar === 'diff' && (
                <DiffViewer
                  diffContent={diffContent}
                  fileName={diffFileName}
                  onClose={hideDiffViewer}
                  className="h-full"
                />
              )}
              {/* Add more sidecar content panels here */}
            </div>
          </>
        )}
      </div>
    </SidecarContext.Provider>
  );
}
