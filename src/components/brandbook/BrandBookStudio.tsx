import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { useBrandBook } from '../../hooks/useBrandBook';
import { generateDeck } from '../../utils/deckGenerator';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { DeckViewer } from './DeckViewer';
import { SlideRenderer } from './SlideRenderer';
import { AssistantDock } from './AssistantDock';
import { SvgColorExtractorModal } from './SvgColorExtractorModal';
import { ImagePickerModal } from './ImagePickerModal';
import { ProjectsModal } from './ProjectsModal';
import { StudioSettingsModal } from './StudioSettingsModal';
import { AuthModal } from './AuthModal';
import { ExportPdfModal } from './ExportPdfModal';
import { AuthGate } from './AuthGate';
import { SettingsPage } from './SettingsPage';
import { SettingsWorkspacePanel } from './SettingsWorkspacePanel';

export const BrandBookStudio: React.FC = () => {
  const {
    state,
    overrides,
    updateState,
    updateOverrides,
    activeSlide,
    setActiveSlide,
    viewMode,
    setViewMode,
    guides,
    setGuides,
    isAssistantOpen,
    setIsAssistantOpen,
    isImageModalOpen,
    setIsImageModalOpen,
    isSvgExtractorOpen,
    setIsSvgExtractorOpen,
    isProjectsOpen,
    setIsProjectsOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    appView,
    setAppView,
    settingsTab,
    setSettingsTab,
    openSettingsModal,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    openAuthModal,
    currentUser,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    updateProfile,
    savedProjects,
    activeProjectId,
    saveCurrentAsProject,
    loadProject,
    deleteProject,
    duplicateProject,
    exportJson,
    importJson,
    studioSettings,
    updateStudioSettings,
    clearLocalStorage,
    detectedSvgColors,
    chatMessages,
    sendAssistantMessage,
    handleLogoUpload,
    applyDetectedPalette,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useBrandBook();

  // Support physical slide reordering across the canvas
  const [slideOrder, setSlideOrder] = useState<number[]>(() =>
    Array.from({ length: 64 }, (_, i) => i + 1)
  );

  // Generate 64-slide deck reactively with slideOrder support
  const slides = useMemo(() => {
    const raw = generateDeck(state, overrides);
    if (!slideOrder || slideOrder.length !== raw.length) return raw;
    const rawMap = new Map<number, (typeof raw)[0]>();
    raw.forEach((s, idx) => rawMap.set(idx + 1, s));
    return slideOrder.map((origNum, newIdx) => {
      const orig = rawMap.get(origNum);
      return orig || raw[newIdx];
    });
  }, [state, overrides, slideOrder]);

  const handleSwapSlides = useCallback((slideA: number, slideB: number) => {
    setSlideOrder(prev => {
      const copy = [...prev];
      const idxA = copy.indexOf(slideA);
      const idxB = copy.indexOf(slideB);
      if (idxA !== -1 && idxB !== -1) {
        copy[idxA] = slideB;
        copy[idxB] = slideA;
      }
      return copy;
    });
  }, []);

  const [activePlaceholderId, setActivePlaceholderId] = React.useState<string>('m_ph1');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [slidesToPrint, setSlidesToPrint] = useState<number[] | null>(null);

  const handlePlaceholderClick = (placeholderId: string) => {
    setActivePlaceholderId(placeholderId);
    setIsImageModalOpen(true);
  };

  // Global hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (!isTyping) {
          e.preventDefault();
          if (e.shiftKey) redo();
          else undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        if (!isTyping) {
          e.preventDefault();
          redo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsAssistantOpen(prev => !prev);
      } else if (e.key.toLowerCase() === 'g' && !isTyping) {
        setGuides(g => !g);
      } else if (e.key === 'Escape') {
        setIsAssistantOpen(false);
        setIsImageModalOpen(false);
        setIsSvgExtractorOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, setIsAssistantOpen, setGuides]);

  // Selective PDF Export Handlers
  const handleExportPdf = () => {
    setIsPdfModalOpen(true);
  };

  const handleConfirmPrint = (selectedIndices: number[]) => {
    setSlidesToPrint(selectedIndices);
    const trigger = () => {
      setTimeout(() => {
        window.print();
      }, 160);
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(trigger);
    } else {
      trigger();
    }
  };

  useEffect(() => {
    const handleAfterPrint = () => {
      setSlidesToPrint(null);
    };
    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, []);

  const handleExportPptx = async () => {
    // If window.PptxGenJS is available
    const PptxGen = (window as any).PptxGenJS;
    if (!PptxGen) {
      alert('PptxGenJS library is still initializing. Please wait a moment and retry.');
      return;
    }

    try {
      const pptx = new PptxGen();
      pptx.layout = 'LAYOUT_WIDE';
      pptx.author = state.name;
      pptx.title = `${state.name} Brand Guidelines`;

      for (const s of slides) {
        const slide = pptx.addSlide();
        slide.background = { color: s.bg.replace('#', '') };

        for (const it of s.items) {
          if (it.hid) continue;
          if (it.k === 't') {
            slide.addText(it.t || '', {
              x: (it.x / 13.333) * 13.333,
              y: (it.y / 7.5) * 7.5,
              w: (it.w / 13.333) * 13.333,
              h: (it.h / 7.5) * 7.5,
              fontSize: it.s || 14,
              color: (it.c || '#000000').replace('#', ''),
              bold: Boolean(it.b),
            });
          }
        }
      }

      await pptx.writeFile({ fileName: `${state.name}-BrandBook.pptx` });
    } catch (err) {
      console.error('PPTX export error:', err);
    }
  };

  const handleTextChange = (slideIndex: number, textId: string, newText: string) => {
    updateOverrides(prev => {
      const slideOv = prev[slideIndex] || {};
      return {
        ...prev,
        [slideIndex]: {
          ...slideOv,
          customTexts: {
            ...(slideOv.customTexts || {}),
            [textId]: newText,
          },
        },
      };
    });
  };

  const handleRemoveImage = (imageId: string) => {
    updateState(prev => {
      const nextImg = { ...prev.img };
      delete nextImg[imageId];
      return { img: nextImg };
    });
  };

  const handleSelectImageForFrame = (targetFrameId: string, url: string, credit?: string) => {
    updateState(prev => ({
      img: {
        ...prev.img,
        [targetFrameId]: url,
      },
      credits: credit ? [...prev.credits, credit] : prev.credits,
    }));
  };

  // 1. Mandatory Auth Gate: Users must sign in with Google or account before accessing the studio
  if (!currentUser) {
    return (
      <AuthGate
        onSignIn={signIn}
        onSignUp={signUp}
        onGoogleSignIn={signInWithGoogle}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#EDEDF0] text-zinc-950 font-sans antialiased p-2.5 gap-2.5 print:block print:h-auto print:w-auto print:overflow-visible print:bg-white print:p-0 print:m-0 print:gap-0">
      {/* 1. Top Island Container (Screen only) */}
      <div className="relative z-40 print:hidden flex-shrink-0">
        <TopBar
          viewMode={viewMode}
          setViewMode={setViewMode}
          activeSlide={activeSlide}
          totalSlides={slides.length}
          onPrevSlide={() => setActiveSlide(Math.max(0, activeSlide - 1))}
          onNextSlide={() => setActiveSlide(Math.min(slides.length - 1, activeSlide + 1))}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          guides={guides}
          onToggleGuides={() => setGuides(g => !g)}
          onPresent={() => {
            setViewMode('one');
            document.documentElement.requestFullscreen?.().catch(() => {});
          }}
          onOpenImages={() => setIsImageModalOpen(true)}
          onOpenAssistant={() => setIsAssistantOpen(true)}
          onOpenProjects={() => setIsProjectsOpen(true)}
          onOpenSettings={() => setAppView(appView === 'settings' ? 'studio' : 'settings')}
          onOpenSettingsTab={(tab) => {
            if (tab) setSettingsTab(tab as any);
            setAppView('settings');
          }}
          onExportPdf={handleExportPdf}
          onExportPptx={handleExportPptx}
          currentUser={currentUser}
          onOpenAuth={openAuthModal}
          onSignOut={signOut}
        />
      </div>

      {/* 2. Bottom Workspace: 3 Segmented Island Containers (Screen only) */}
      <div className="flex-1 min-h-0 flex gap-2.5 overflow-hidden print:hidden">
        <Sidebar
          brandState={state}
          updateState={updateState}
          slides={slides}
          activeSlide={activeSlide}
          setActiveSlide={setActiveSlide}
          onLogoUpload={handleLogoUpload}
          appView={appView}
          setAppView={setAppView}
          settingsTab={settingsTab}
          setSettingsTab={setSettingsTab}
          currentUser={currentUser}
          savedProjects={savedProjects}
          onSignOut={signOut}
        />

        {appView === 'settings' ? (
          <SettingsWorkspacePanel
            settingsTab={settingsTab}
            onSelectTab={setSettingsTab}
            currentUser={currentUser}
            onUpdateProfile={updateProfile}
            onBackToStudio={() => setAppView('studio')}
            onSignOut={signOut}
            savedProjects={savedProjects}
            activeProjectId={activeProjectId}
            onLoadProject={loadProject}
            onClearCache={clearLocalStorage}
          />
        ) : (
          <DeckViewer
            slides={slides}
            brandState={state}
            activeSlide={activeSlide}
            setActiveSlide={setActiveSlide}
            viewMode={viewMode}
            guides={guides}
            onTextChange={handleTextChange}
            onRemoveImage={handleRemoveImage}
            onPlaceholderClick={handlePlaceholderClick}
          />
        )}
      </div>

      {/* 3. Dedicated Selective Vector Print Stage (Print only) */}
      <div id="printRoot" className="hidden print:block print:w-[13.333in] print:m-0 print:p-0">
        {slides.map((s, idx) => {
          if (slidesToPrint !== null && !slidesToPrint.includes(idx)) {
            return null;
          }
          return (
            <div
              key={idx}
              className="print-slide @container"
              style={{
                width: '13.333in',
                height: '7.5in',
                background: s.bg,
              }}
            >
              <SlideRenderer
                slide={s}
                slideIndex={idx}
                brandState={state}
                isPrint={true}
              />
            </div>
          );
        })}
      </div>

      {/* On-Device Assistant Floating Dock (Screen only) */}
      <div className="print:hidden">
        <AssistantDock
          isOpen={isAssistantOpen}
          onClose={() => setIsAssistantOpen(false)}
          onOpen={() => setIsAssistantOpen(true)}
          totalSlides={slides.length}
          currentSlide={activeSlide + 1}
          brandState={state}
          onUpdateState={updateState}
          onUpdateOverrides={updateOverrides}
          onSwapSlides={handleSwapSlides}
          onNavigateSlide={setActiveSlide}
          onExportPdf={handleExportPdf}
          onExportPptx={handleExportPptx}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          onOpenImages={() => setIsImageModalOpen(true)}
          messages={chatMessages}
          onSendMessage={sendAssistantMessage}
        />
      </div>

      {/* Detected SVG Palette Modal (Screen only) */}
      <div className="print:hidden">
        <SvgColorExtractorModal
          isOpen={isSvgExtractorOpen}
          onClose={() => setIsSvgExtractorOpen(false)}
          detectedColors={detectedSvgColors}
          onApplyPalette={applyDetectedPalette}
        />
      </div>

      {/* Unsplash & Openverse Asset Picker Modal (Screen only) */}
      <div className="print:hidden">
        <ImagePickerModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          onSelectImage={handleSelectImageForFrame}
          targetFrameId={activePlaceholderId}
        />
      </div>

      {/* Local-First Projects & Templates Modal (Screen only) */}
      <div className="print:hidden">
        <ProjectsModal
          isOpen={isProjectsOpen}
          onClose={() => setIsProjectsOpen(false)}
          currentState={state}
          currentOverrides={overrides}
          savedProjects={savedProjects}
          activeProjectId={activeProjectId}
          onSelectProject={loadProject}
          onSaveCurrentAsProject={saveCurrentAsProject}
          onDeleteProject={deleteProject}
          onDuplicateProject={duplicateProject}
          onExportJson={exportJson}
          onImportJson={importJson}
        />
      </div>

      {/* Studio Standards & Product Hub Settings Modal (Screen only) */}
      <div className="print:hidden">
        <StudioSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          defaultTab={settingsTab}
          settings={studioSettings}
          onUpdateSettings={updateStudioSettings}
          onClearLocalStorage={clearLocalStorage}
          currentUser={currentUser}
          onUpdateProfile={updateProfile}
          onSignOut={signOut}
          onOpenAuth={() => openAuthModal('signin')}
          savedProjects={savedProjects}
          activeProjectId={activeProjectId}
          onLoadProject={loadProject}
        />
      </div>

      {/* Sovereign Auth Modal (Sign In / Create Account) (Screen only) */}
      <div className="print:hidden">
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultTab={authModalTab}
          onSignIn={signIn}
          onSignUp={signUp}
        />
      </div>

      {/* Selective PDF Export Modal (Screen only) */}
      <div className="print:hidden">
        <ExportPdfModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          slides={slides}
          currentSlideIndex={activeSlide}
          onExport={handleConfirmPrint}
        />
      </div>
    </div>
  );
};
