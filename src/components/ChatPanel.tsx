import { useState, useRef, useEffect } from 'react';
import type { BuildStep } from '../engine/projectEngine';
import BuildProgress from './BuildProgress';

interface Attachment {
  name: string;
  size: number;
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  isBuildProgress?: boolean;
  attachments?: Attachment[];
}

interface Props {
  messages: Message[];
  onSendMessage: (text: string, attachments?: {name: string, size: number, type: string, raw: File}[]) => void;
  isProcessing: boolean;
  buildSteps: BuildStep[];
}

// Typewriter streaming effect for AI messages
function TypewriterText({ text }: { text: string }) {
  const [charIndex, setCharIndex] = useState(0);
  
  useEffect(() => {
    setCharIndex(0);
    const timer = setInterval(() => {
      setCharIndex(prev => {
        const next = prev + 1;
        if (next >= text.length) clearInterval(timer);
        return next;
      });
    }, 12);
    return () => clearInterval(timer);
  }, [text]);

  const displayed = text.substring(0, charIndex);

  const formattedHtml = displayed
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');

  return <div className="msg-content" dangerouslySetInnerHTML={{ __html: formattedHtml }} />;
}

export default function ChatPanel({ messages, onSendMessage, isProcessing, buildSteps }: Props) {
  const [input, setInput] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<{name: string, size: number, type: string, raw: File}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages, buildSteps]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((input.trim() === '' && pendingAttachments.length === 0) || isProcessing) return;
    onSendMessage(input.trim(), pendingAttachments.length > 0 ? pendingAttachments : undefined);
    setInput('');
    setPendingAttachments([]);
  };

  const handleSuggestionClick = (text: string) => {
    if (isProcessing) return;
    onSendMessage(text);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: f.size,
        type: f.type,
        raw: f
      }));
      setPendingAttachments(prev => [...prev, ...newFiles]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removePendingAttachment = (index: number) => {
    setPendingAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={'chat-msg ' + msg.role}>
            <div className="msg-avatar">
              {msg.role === 'ai' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                </svg>
              ) : (
                <div className="user-avatar-text">U</div>
              )}
            </div>
            <div className="msg-bubble">
              {msg.role === 'ai' ? (
                <TypewriterText text={msg.content} />
              ) : (
                <div className="msg-content">
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="chat-msg-attachments">
                      {msg.attachments.map((att, idx) => (
                        <div key={idx} className="chat-msg-attachment-pill">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                          <span>{att.name}</span>
                          <span className="att-size">{formatSize(att.size)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {msg.content && <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }} />}
                </div>
              )}
              
              {msg.isBuildProgress && buildSteps.length > 0 && (
                <BuildProgress steps={buildSteps} />
              )}
            </div>
          </div>
        ))}
        {isProcessing && !messages[messages.length - 1]?.isBuildProgress && (
          <div className="chat-msg ai">
            <div className="msg-avatar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
              </svg>
            </div>
            <div className="msg-bubble typing-bubble">
              <div className="typing-indicator"><span/><span/><span/></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} style={{ height: 1 }} />
      </div>

      <div className="chat-suggestions">
        <button onClick={() => handleSuggestionClick('Halo, kamu bisa apa aja?')}>Tanya Kemampuan</button>
        <button onClick={() => handleSuggestionClick('Bikinkan toko sepatu online')}>Bikin Toko Sepatu</button>
        <button onClick={() => handleSuggestionClick('Buat dashboard analitik')}>Buat Dashboard</button>
      </div>

      <div className="chat-input-area">
        {pendingAttachments.length > 0 && (
          <div className="pending-attachments-list">
            {pendingAttachments.map((file, idx) => (
              <div key={idx} className="pending-attachment">
                <div className="pa-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                </div>
                <div className="pa-info">
                  <span className="pa-name">{file.name}</span>
                  <span className="pa-size">{formatSize(file.size)}</span>
                </div>
                <button type="button" className="pa-remove" onClick={() => removePendingAttachment(idx)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
        <form className="chat-input-wrapper" onSubmit={handleSubmit}>
          <button type="button" className="chat-attach-btn" title="Lampirkan file" onClick={() => fileInputRef.current?.click()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} multiple />
          <textarea
            className="chat-textarea"
            placeholder="Apa yang ingin Anda bangun?"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button type="submit" className="chat-send-btn" disabled={(input.trim() === '' && pendingAttachments.length === 0) || isProcessing}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
          </button>
        </form>
        <div className="chat-disclaimer">AppForge AI bisa membuat kesalahan. Cek kembali kode sebelum deploy.</div>
      </div>
    </div>
  );
}
