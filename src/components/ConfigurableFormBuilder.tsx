import React, { useState } from 'react';
import type { FormConfig } from '../types/form';
import { FormBuilderProvider } from '../context/FormBuilderContext';
import { useFormBuilder } from '../hooks/useFormBuilder';
import { BuilderPanel } from './builder/BuilderPanel';
import { LivePreviewPanel } from './preview/LivePreviewPanel';
import { ExportModal } from './modal/ExportModal';
import { ImportModal } from './modal/ImportModal';
import { DownloadIcon, UploadIcon, EyeIcon, CodeIcon } from './ui/Icons';

export interface ConfigurableFormBuilderProps {
  initialConfig?: FormConfig;
}

const BuilderInner: React.FC = () => {
  const { config } = useFormBuilder();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'both' | 'builder' | 'preview'>('both');

  return (
    <div className="form-builder-app">
      {/* Top Navbar */}
      <header className="form-builder-topbar">
        <div className="topbar-brand">
          <div className="brand-logo">
            <CodeIcon size={18} />
          </div>
          <div className="brand-info">
            <h1 className="brand-title">ConfigurableFormBuilder</h1>
            <span className="brand-badge">Schema-Driven Dynamic Forms</span>
          </div>
        </div>

        {/* View Switcher for responsive & tablet screens */}
        <div className="view-switcher">
          <button
            type="button"
            className={`view-tab ${activeTab === 'both' ? 'active' : ''}`}
            onClick={() => setActiveTab('both')}
            title="Split view (Builder + Preview)"
          >
            Split View
          </button>
          <button
            type="button"
            className={`view-tab ${activeTab === 'builder' ? 'active' : ''}`}
            onClick={() => setActiveTab('builder')}
            title="Builder only"
          >
            Builder
          </button>
          <button
            type="button"
            className={`view-tab ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
            title="Live Preview only"
          >
            <EyeIcon size={14} />
            <span>Preview</span>
          </button>
        </div>

        {/* Top actions: Export / Import */}
        <div className="topbar-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsImportOpen(true)}
            title="Import configuration JSON"
          >
            <DownloadIcon size={15} />
            <span>Import JSON</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsExportOpen(true)}
            title="Export configuration JSON"
          >
            <UploadIcon size={15} />
            <span>Export JSON</span>
          </button>
        </div>
      </header>

      {/* Main Dual-Pane Workspace */}
      <main className={`workspace-split-container view-mode-${activeTab}`}>
        {(activeTab === 'both' || activeTab === 'builder') && (
          <section className="pane-builder" aria-label="Form Builder Workspace">
            <BuilderPanel />
          </section>
        )}

        {(activeTab === 'both' || activeTab === 'preview') && (
          <section className="pane-preview" aria-label="Live Form Preview Workspace">
            <LivePreviewPanel key={config.id} />
          </section>
        )}
      </main>

      {/* Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        config={config}
      />

      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />
    </div>
  );
};

export const ConfigurableFormBuilder: React.FC<ConfigurableFormBuilderProps> = ({
  initialConfig,
}) => {
  return (
    <FormBuilderProvider initialConfig={initialConfig}>
      <BuilderInner />
    </FormBuilderProvider>
  );
};

export default ConfigurableFormBuilder;
