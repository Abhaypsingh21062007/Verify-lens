'use client';

import { useState, useRef, useTransition, useEffect } from 'react';
import { 
  Upload, 
  Link as LinkIcon, 
  Sparkles, 
  FileImage, 
  FileVideo, 
  FileAudio, 
  X, 
  AlertCircle, 
  Mic, 
  Square, 
  Volume2,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Radio
} from 'lucide-react';
import Link from 'next/link';

interface InvestigationFormProps {
  onSubmitAction: (formData: FormData) => Promise<void>;
}

export default function InvestigationForm({ onSubmitAction }: InvestigationFormProps) {
  const [inputType, setInputType] = useState<'upload' | 'voice' | 'url'>('upload');
  const [claim, setClaim] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mode, setMode] = useState('quick');
  const [deleteAfter, setDeleteAfter] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }
    };
  }, [audioPreviewUrl]);

  const startRecording = async () => {
    try {
      setError(null);
      setLiveTranscript('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const options = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? { mimeType: 'audio/webm;codecs=opus' }
        : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `voice-note-${Date.now()}.webm`, { type: 'audio/webm' });
        setFile(audioFile);
        
        const previewUrl = URL.createObjectURL(audioBlob);
        setAudioPreviewUrl(previewUrl);
        setMode('voice-scanner');

        // Release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      // Speech recognition for instant transcript feedback
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onresult = (event: any) => {
            let current = '';
            for (let i = 0; i < event.results.length; i++) {
              current += event.results[i][0].transcript + ' ';
            }
            const cleanText = current.trim();
            if (cleanText) {
              setLiveTranscript(cleanText);
              setClaim(cleanText);
            }
          };

          recognition.start();
          speechRecognitionRef.current = recognition;
        } catch (recErr) {
          console.warn('SpeechRecognition fallback active');
        }
      }

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingTime(0);
      
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access error:", err);
      setError("Please allow microphone access in your browser to record audio.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
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
      setError('Please upload an image, video, or audio file.');
      return false;
    }
    
    if (selectedFile.type.startsWith('audio/')) {
      const preview = URL.createObjectURL(selectedFile);
      setAudioPreviewUrl(preview);
      setMode('voice-scanner');
    } else {
      setAudioPreviewUrl(null);
      if (mode === 'voice-scanner') setMode('quick');
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
      setError('Please upload a file, record voice, or enter a claim to investigate.');
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

  const quickPrompts = [
    "Is this photo generated by AI or authentic?",
    "Did this breaking news event actually happen today?",
    "Is this viral quote real or taken out of context?",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-accent-red/30 bg-accent-red-dim p-4 flex items-center gap-3 text-accent-red animate-fade-in">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* ── STEP 1: Input Type Selector ──────────────────────── */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-foreground">
          Step 1: Choose how to provide media
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => setInputType('upload')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
              inputType === 'upload'
                ? 'bg-accent-blue/15 border-accent-blue text-accent-blue font-bold shadow-sm'
                : 'bg-card border-card-border text-muted hover:text-foreground hover:bg-white/[0.02]'
            }`}
          >
            <Upload className="h-5 w-5 mb-1" />
            <span className="text-xs">Upload File</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setInputType('voice');
              setMode('voice-scanner');
            }}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
              inputType === 'voice'
                ? 'bg-accent-blue/15 border-accent-blue text-accent-blue font-bold shadow-sm'
                : 'bg-card border-card-border text-muted hover:text-foreground hover:bg-white/[0.02]'
            }`}
          >
            <Mic className="h-5 w-5 mb-1" />
            <span className="text-xs">Record Voice</span>
          </button>

          <button
            type="button"
            onClick={() => setInputType('url')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
              inputType === 'url'
                ? 'bg-accent-blue/15 border-accent-blue text-accent-blue font-bold shadow-sm'
                : 'bg-card border-card-border text-muted hover:text-foreground hover:bg-white/[0.02]'
            }`}
          >
            <LinkIcon className="h-5 w-5 mb-1" />
            <span className="text-xs">Paste Link</span>
          </button>
        </div>
      </div>

      {/* ── STEP 1 Content Area ──────────────────────── */}
      {inputType === 'upload' && (
        <div
          className={`relative rounded-xl border-2 border-dashed transition-all duration-300 ${
            dragActive
              ? 'border-accent-blue bg-accent-blue/5'
              : file
              ? 'border-accent-green/40 bg-accent-green/5'
              : 'border-card-border hover:border-muted/40 bg-background/50'
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
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-green/10">
                    {getFileIcon()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-[300px]">{file.name}</p>
                    <p className="text-xs text-muted">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for inspection
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setAudioPreviewUrl(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="p-1.5 rounded-lg text-muted hover:text-accent-red hover:bg-accent-red/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {audioPreviewUrl && (
                <div className="pt-2 border-t border-card-border flex items-center gap-3">
                  <Volume2 className="h-4 w-4 text-accent-blue shrink-0" />
                  <audio controls src={audioPreviewUrl} className="w-full h-8" />
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-8 text-center cursor-pointer"
            >
              <Upload className="mx-auto h-8 w-8 text-muted mb-2" />
              <p className="text-sm font-semibold text-foreground">Click to upload or drag & drop</p>
              <p className="text-xs text-muted mt-1">Supports Photos, Videos & Audio Voice notes</p>
            </button>
          )}
        </div>
      )}

      {inputType === 'voice' && (
        <div className="rounded-xl border border-card-border bg-background/50 p-6 text-center">
          {file && audioPreviewUrl ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-card p-3 rounded-xl border border-card-border">
                <div className="flex items-center gap-3">
                  <Volume2 className="h-5 w-5 text-accent-green" />
                  <span className="text-xs font-semibold text-foreground">Voice note recorded</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setAudioPreviewUrl(null);
                    setLiveTranscript('');
                  }}
                  className="text-xs text-accent-red hover:underline"
                >
                  Record Again
                </button>
              </div>
              <audio controls src={audioPreviewUrl} className="w-full h-8" />
            </div>
          ) : !isRecording ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={startRecording}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-accent-blue text-white font-bold shadow-lg shadow-accent-blue/25 hover:shadow-accent-blue/40 hover:-translate-y-0.5 transition-all"
              >
                <Mic className="h-5 w-5" />
                Start Recording Voice
              </button>
              <p className="text-xs text-muted">Speak your claim or statement in any language</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 bg-accent-red/10 border border-accent-red/30 rounded-xl p-5 animate-pulse-soft">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-accent-red animate-ping" />
                <span className="font-mono text-lg text-accent-red font-black">{formatTime(recordingTime)}</span>
                <span className="text-sm text-accent-red font-semibold">Listening to microphone...</span>
              </div>
              {liveTranscript && (
                <div className="text-xs text-foreground bg-card border border-card-border rounded-lg p-2.5 max-w-md italic">
                  &quot;{liveTranscript}&quot;
                </div>
              )}
              <button
                type="button"
                onClick={stopRecording}
                className="inline-flex items-center gap-2 bg-accent-red text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-accent-red/90 transition-colors"
              >
                <Square className="h-4 w-4 fill-current" />
                Finish Recording
              </button>
            </div>
          )}
        </div>
      )}

      {inputType === 'url' && (
        <div className="relative">
          <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="url"
            name="url"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="https://example.com/post-or-image.jpg"
            className="w-full rounded-xl border border-card-border bg-background/50 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30 transition-all"
          />
        </div>
      )}

      {/* ── STEP 2: The Claim / Story ──────────────────────── */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-foreground">
          Step 2: What is the claim or story? <span className="text-xs font-normal text-muted">(Optional)</span>
        </label>
        <textarea
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          placeholder="Example: This photo claims to show a major disaster in Mumbai yesterday."
          rows={3}
          className="w-full rounded-xl border border-card-border bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30 transition-all resize-none"
        />
        
        {/* Quick prompt ideas */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[11px] text-muted self-center mr-1">Quick ideas:</span>
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setClaim(p)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-card border border-card-border text-muted hover:text-foreground hover:border-accent-blue/30 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── STEP 3: Verification Mode ──────────────────────── */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-foreground">
          Step 3: Choose analysis mode
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            { id: 'quick', title: 'Quick Check', desc: 'Fast general verification' },
            { id: 'voice-scanner', title: 'Voice Scanner', desc: 'Speech & claim translation' },
            { id: 'journalist', title: 'Deep OSINT', desc: 'Full provenance & forensics' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                mode === m.id
                  ? 'bg-accent-blue/15 border-accent-blue text-accent-blue shadow-sm'
                  : 'bg-card border-card-border text-muted hover:text-foreground hover:bg-white/[0.02]'
              }`}
            >
              <p className={`text-xs font-bold ${mode === m.id ? 'text-accent-blue' : 'text-foreground'}`}>{m.title}</p>
              <p className="text-[11px] text-muted mt-0.5">{m.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Action Buttons ──────────────────────── */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={isPending}
          className={`flex-1 flex items-center justify-center gap-2.5 rounded-xl px-6 py-4 text-sm font-bold transition-all ${
            !isPending
              ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/25 hover:shadow-accent-blue/40 hover:-translate-y-0.5 active:translate-y-0'
              : 'bg-card border border-card-border text-muted cursor-not-allowed'
          }`}
        >
          {isPending ? (
            <>
              <Sparkles className="h-4 w-4 animate-spin" />
              Starting AI analysis...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Start Investigation
            </>
          )}
        </button>

        <Link
          href="/report/sample-001"
          className="flex items-center justify-center gap-2 rounded-xl border border-card-border bg-card px-5 py-4 text-sm font-semibold text-muted hover:text-foreground hover:border-muted/40 transition-all"
        >
          View Demo Report
        </Link>
      </div>

      {/* Privacy guarantee badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted pt-2">
        <ShieldCheck className="h-4 w-4 text-accent-green" />
        <span>Privacy Protected • Your uploads are deleted after analysis</span>
      </div>
    </form>
  );
}
