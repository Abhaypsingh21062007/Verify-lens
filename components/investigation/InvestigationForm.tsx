'use client';

import { useState, useRef, useTransition, useEffect } from 'react';
import { Upload, Link as LinkIcon, Sparkles, FileImage, FileVideo, FileAudio, X, AlertCircle, Mic, Square } from 'lucide-react';
import Link from 'next/link';

interface InvestigationFormProps {
  onSubmitAction: (formData: FormData) => Promise<void>;
}

export default function InvestigationForm({ onSubmitAction }: InvestigationFormProps) {
  const [claim, setClaim] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mode, setMode] = useState('quick');
  const [deleteAfter, setDeleteAfter] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `voice-note-${Date.now()}.webm`, { type: 'audio/webm' });
        setFile(audioFile);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Could not access the microphone. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const validateFile = (selectedFile: File) => {
    setError(null);
    const validTypes = ['image/', 'video/', 'audio/'];
    const isValidType = validTypes.some(type => selectedFile.type.startsWith(type));
    
    if (!isValidType) {
      setError('Unsupported file type. Please upload an image, video, or audio file.');
      return false;
    }
    
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (selectedFile.size > maxSize) {
      setError('File is too large. Maximum size is 100 MB.');
      return false;
    }
    
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const getFileIcon = () => {
    if (!file) return null;
    if (file.type.startsWith('video/')) return <FileVideo className="h-5 w-5 text-accent-green" />;
    if (file.type.startsWith('audio/')) return <FileAudio className="h-5 w-5 text-accent-green" />;
    return <FileImage className="h-5 w-5 text-accent-green" />;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!claim.trim() && !file && !mediaUrl.trim()) {
      setError('Please provide at least a file, a URL, or a claim to investigate.');
      return;
    }

    const formData = new FormData();
    if (claim.trim()) formData.append('claim', claim.trim());
    if (mediaUrl.trim()) formData.append('url', mediaUrl.trim());
    formData.append('mode', mode);
    formData.append('deleteAfter', deleteAfter.toString());
    if (file) formData.append('file', file);
    
    startTransition(async () => {
      await onSubmitAction(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-accent-red/20 bg-accent-red-dim p-4 flex gap-3 animate-fade-in text-accent-red">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* File Upload Area */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Upload Media
        </label>
        <div
          className={`relative rounded-xl border-2 border-dashed transition-all duration-300 ${
            dragActive
              ? 'border-accent-blue bg-accent-blue/5 scale-[1.01]'
              : file
              ? 'border-accent-green/40 bg-accent-green/5'
              : 'border-card-border hover:border-muted/40 hover:bg-white/[0.02]'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,video/*,audio/*"
            onChange={handleFileChange}
          />
          {file ? (
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-green/10">
                  {getFileIcon()}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-[300px]">{file.name}</p>
                  <p className="text-xs text-muted">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="p-1.5 rounded-lg text-muted hover:text-accent-red hover:bg-accent-red/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 text-center cursor-pointer"
              >
                <Upload className="mx-auto h-8 w-8 text-muted mb-3" />
                <p className="text-sm text-foreground font-medium">
                  Drop your image, video, or audio here
                </p>
                <p className="text-xs text-muted mt-1">
                  or click to browse · Max 100 MB
                </p>
              </button>
          )}
        </div>
        
        {/* Live Audio Recording Action (only in voice-scanner mode) */}
        {mode === 'voice-scanner' && !file && (
          <div className="mt-4 flex flex-col items-center">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-blue/10 text-accent-blue font-semibold hover:bg-accent-blue/20 transition-all border border-accent-blue/20"
              >
                <Mic className="h-5 w-5" />
                Record Live Audio
              </button>
            ) : (
              <div className="flex items-center gap-4 bg-accent-red/10 border border-accent-red/20 rounded-xl px-6 py-3 w-full justify-between animate-pulse-soft">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-accent-red animate-pulse" />
                  <span className="font-mono text-accent-red font-semibold">
                    {formatTime(recordingTime)}
                  </span>
                  <span className="text-sm text-accent-red/80 font-medium">Recording...</span>
                </div>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center gap-2 bg-accent-red text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-accent-red/90 transition-colors"
                >
                  <Square className="h-4 w-4 fill-current" />
                  Stop
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Claim input */}
      {mode !== 'voice-scanner' && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            What claim came with this media?
          </label>
          <textarea
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            placeholder="Example: This video shows today’s Mumbai flood."
            rows={3}
            className="w-full rounded-xl border border-card-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20 transition-all resize-none"
          />
        </div>
      )}

      {/* URL input */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Source URL, if available
        </label>
        <div className="relative">
          <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="url"
            name="url"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="https://"
            className="w-full rounded-xl border border-card-border bg-card pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20 transition-all"
          />
        </div>
      </div>

      {/* Mode selector */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Investigation Mode
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'quick', label: 'Quick check' },
            { id: 'journalist', label: 'Journalist' },
            { id: 'classroom', label: 'Classroom' },
            { id: 'voice-scanner', label: 'Voice Claim Scanner' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                mode === m.id
                  ? 'bg-accent-blue/15 text-accent-blue border-accent-blue/30'
                  : 'bg-card text-muted hover:text-foreground border-card-border hover:border-muted/30'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={isPending}
          className={`flex-1 flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-300 ${
             !isPending
              ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/25 hover:shadow-accent-blue/40 hover:-translate-y-0.5 active:translate-y-0'
              : 'bg-card border border-card-border text-muted cursor-not-allowed'
          }`}
        >
          {isPending ? (
            <>
              <Sparkles className="h-4 w-4 animate-spin" />
              Starting...
            </>
          ) : (
            'Investigate this claim'
          )}
        </button>
        <Link
          href="/report/sample-001"
          className="flex-1 flex items-center justify-center gap-2.5 rounded-xl border border-card-border bg-card/60 px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-card hover:border-muted/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
        >
          Try sample case
        </Link>
      </div>

      {/* Privacy Notice & Options */}
      <div className="space-y-4 pt-4 border-t border-card-border/50">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative flex items-start">
            <input
              type="checkbox"
              checked={deleteAfter}
              onChange={(e) => setDeleteAfter(e.target.checked)}
              className="peer sr-only"
            />
            <div className="h-5 w-5 rounded border border-card-border bg-card peer-checked:bg-accent-blue peer-checked:border-accent-blue transition-colors flex items-center justify-center">
              <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground group-hover:text-accent-blue transition-colors">Delete after analysis</span>
            <span className="text-xs text-muted mt-0.5">Automatically wipe all data from our servers after report generation.</span>
          </div>
        </label>

        <div className="rounded-lg bg-background/50 border border-card-border p-3 text-xs text-muted/80 leading-relaxed space-y-1.5">
          <p>
            <strong className="text-foreground/80">Privacy Guarantee:</strong> Your media will not be used to train our AI models.
          </p>
          <p>
            We do not perform identity recognition on private individuals. Your upload is used only for this investigation in demo mode. Do not upload sensitive personal media.
          </p>
        </div>
      </div>
    </form>
  );
}
