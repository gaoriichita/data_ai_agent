import { useState, useRef } from 'react';
import type { Project, ProjectFile } from './engine/projectEngine';
import { buildFileTree } from './engine/projectEngine';
import { parseIntent, generateCreateResponse } from './engine/intentParser';
import { generateTodoFiles } from './engine/templates/todoApp';
import { generateEcommerceFiles } from './engine/templates/ecommerce';
import { generateLMSFiles } from './engine/templates/lms';
import { generateDashboardFiles } from './engine/templates/dashboard';
import { generateUniversalFiles } from './engine/templates/universal';
import { askGemini, hasApiKey, searchPublicKnowledge } from './services/geminiService';
import { searchLocalBrain } from './engine/localBrain';
import { getChatHistory, saveChatSession, deleteChatSession, generateTitle } from './services/chatHistoryService';
import { addLibraryFile } from './services/libraryService';
import { processWithReasoning } from './engine/reasoningEngine';
import type { ChatSession, ChatMessage } from './services/chatHistoryService';

import ChatPanel from './components/ChatPanel';
import Workspace from './components/Workspace';
import SettingsModal from './components/SettingsModal';
import Sidebar from './components/Sidebar';
import type { AppView } from './components/Sidebar';
import ProjectsView from './components/ProjectsView';
import LibraryView from './components/LibraryView';
import PluginsView from './components/PluginsView';
import './index.css';

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'ai' as const,
    content: 'Halo! 👋 Saya **AppForge AI**, asisten kecerdasan buatan Anda.\n\nSaya memiliki dua kemampuan utama:\n- 🧠 **Menjawab pertanyaan** seputar teknologi, sains, sejarah, dan berbagai topik lainnya secara mendalam.\n- 🏗️ **Membangun aplikasi web** secara langsung berdasarkan instruksi yang Anda berikan.\n\nBeberapa contoh perintah yang bisa Anda coba:\n- _"Apa itu machine learning dan bagaimana cara kerjanya?"_\n- _"Jelaskan perbedaan antara React dan Angular"_\n- _"Buatkan toko sepatu online dengan tema warna merah"_\n\nSilakan ajukan pertanyaan apa pun, atau instruksikan saya untuk membangun sesuatu. Saya siap membantu. 🚀',
  }
];

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(DEFAULT_MESSAGES);
  const [isProcessing, setIsProcessing] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const sessionRef = useRef(Date.now().toString());
  const [sessionKey, setSessionKey] = useState(sessionRef.current);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>(getChatHistory());
  const [activeView, setActiveView] = useState<AppView>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ── Build Simulation ──────────────────────────────────
  const simulateBuild = async (type: any, description: string, files: ProjectFile[], context: any, session: string) => {
    const steps = [
      { id: '1', label: `Menganalisis arsitektur untuk ${context.topic}...`, status: 'pending' as const },
      { id: '2', label: `Menyintesis tema CSS warna ${context.themeColor}...`, status: 'pending' as const },
      { id: '3', label: 'Merancang Mock Database Schema...', status: 'pending' as const },
      { id: '4', label: 'Menulis komponen React.js...', status: 'pending' as const },
      { id: '5', label: 'Kompilasi build assets...', status: 'pending' as const }
    ];
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(), role: 'ai', content: 'Memulai proses sintesis aplikasi...', isBuildProgress: true
    }]);

    setProject({
      id: 'proj-' + Date.now(),
      name: type,
      type,
      description,
      context,
      files: [],
      buildStatus: 'analyzing',
      buildSteps: steps,
      createdAt: new Date(),
      features: []
    });

    for (let i = 0; i < steps.length; i++) {
      if (sessionRef.current !== session) return;
      setProject(p => p ? {
        ...p,
        buildSteps: p.buildSteps.map((s, idx) => 
          idx === i ? { ...s, status: 'active' } : 
          idx < i ? { ...s, status: 'complete' } : s
        )
      } : null);
      await new Promise(r => setTimeout(r, 1200));
    }

    if (sessionRef.current !== session) return;

    setProject(p => p ? {
      ...p,
      files: buildFileTree(files),
      buildStatus: 'complete',
      buildSteps: p.buildSteps.map(s => ({ ...s, status: 'complete' }))
    } : null);
    
    setIsProcessing(false);
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(), role: 'ai', 
      content: `Selesai! 🎉 **${context.topic}** berhasil dibangun.\n\nCek hasilnya di tab **Preview** atau pelajari kode di tab **Code**.`
    }]);

    setTimeout(() => saveCurrentSession(), 500);
  };

  // ── Handle Send (called from ChatPanel) ───────────────
  const handleSendFromChat = (text: string, attachments?: {name: string, size: number, type: string, raw: File}[]) => {
    // Build the user message
    const userMessage: ChatMessage = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: text,
      attachments: attachments ? attachments.map(a => ({ name: a.name, size: a.size })) : undefined
    };
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    // Auto-save attachments to Perpustakaan (Library)
    if (attachments && attachments.length > 0) {
      attachments.forEach(file => {
        addLibraryFile({
          id: Date.now().toString() + Math.random().toString(36).substring(2),
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.includes('pdf') || file.type.includes('text') || file.type.includes('document') ? 'document' : 'other',
          size: file.size,
          updatedAt: Date.now()
        });
      });
    }

    // Process the message through the AI layers
    processMessage(text);
  };

  // ── AI Processing Pipeline ────────────────────────────
  const processMessage = async (text: string) => {
    try {
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }));
        
      const result = await processWithReasoning(text, history);

      if (result.source === 'create' && result.intent?.template && result.intent?.context) {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), role: 'ai', 
          content: result.response 
        }]);
        
        let files: ProjectFile[] = [];
        if (result.intent.template === 'todo') files = generateTodoFiles();
        if (result.intent.template === 'ecommerce') files = generateEcommerceFiles(result.intent.context);
        if (result.intent.template === 'lms') files = generateLMSFiles();
        if (result.intent.template === 'dashboard') files = generateDashboardFiles();
        if (result.intent.template === 'universal') files = generateUniversalFiles(result.intent.context);
        
        const currentSession = sessionRef.current;
        setTimeout(() => {
          if (currentSession !== sessionRef.current) return;
          simulateBuild(result.intent!.template as any, result.intent!.details, files, result.intent!.context, currentSession);
        }, 3500);
      } else {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), role: 'ai', 
          content: result.response 
        }]);
        setIsProcessing(false);
      }
    } catch (err) {
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), role: 'ai', 
        content: `Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi.` 
      }]);
      setIsProcessing(false);
    }
    
    setTimeout(() => saveCurrentSession(), 500);
  };

  // ── Session Management ────────────────────────────────
  const saveCurrentSession = (customMessages?: any[], customProject?: any) => {
    const sessionToSave = sessionRef.current;
    
    setMessages(currentMessages => {
      const msgs = customMessages || currentMessages;
      if (msgs.length <= 1) return msgs;
      
      const title = generateTitle(msgs[1].content);
      setProject(currentProj => {
        const proj = customProject !== undefined ? customProject : currentProj;
        
        const newSession: ChatSession = {
          id: sessionToSave,
          title,
          updatedAt: Date.now(),
          messages: msgs,
          project: proj
        };
        
        saveChatSession(newSession);
        setChatHistory(getChatHistory());
        
        return currentProj;
      });
      return msgs;
    });
  };

  const handleNewChat = () => {
    saveCurrentSession();
    setMessages(DEFAULT_MESSAGES);
    setProject(null);
    setIsProcessing(false);
    const newSession = Date.now().toString();
    sessionRef.current = newSession;
    setSessionKey(newSession);
    setActiveView('chat');
  };

  const handleSelectSession = (session: ChatSession) => {
    saveCurrentSession();
    
    sessionRef.current = session.id;
    setSessionKey(session.id);
    setMessages(session.messages);
    setProject(session.project);
    setIsProcessing(false);
    setActiveView('chat');
  };

  return (
    <div className="app-container">
      {isSidebarOpen ? (
        <Sidebar 
          activeView={activeView}
          onNavClick={setActiveView}
          history={chatHistory} 
          currentSessionId={sessionKey} 
          onNewChat={handleNewChat} 
          onSelectSession={handleSelectSession}
          onOpenSettings={() => setShowSettings(true)}
          onCloseSidebar={() => setIsSidebarOpen(false)}
        />
      ) : (
        <button 
          className="sidebar-toggle-btn floating" 
          onClick={() => setIsSidebarOpen(true)}
          title="Buka Sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
        </button>
      )}

      {activeView === 'chat' && (
        <>
          <div className="chat-panel-container">
            <ChatPanel 
              key={sessionKey}
              messages={messages} 
              onSendMessage={handleSendFromChat} 
              isProcessing={isProcessing}
              buildSteps={project?.buildStatus !== 'complete' ? project?.buildSteps || [] : []}
            />
          </div>

          <div className="right-panel">
            <Workspace 
              projectType={project?.type || null}
              buildStatus={project?.buildStatus || 'idle'}
              description={project?.description || ''}
              files={project?.files || []}
            />
          </div>
        </>
      )}

      {activeView === 'proyek' && <ProjectsView history={chatHistory} onSelectProject={handleSelectSession} />}
      {activeView === 'pustaka' && <LibraryView />}
      {activeView === 'plugin' && <PluginsView />}

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
