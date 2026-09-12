import { useState, useRef, useEffect, useCallback } from "react";

/**
 * FeedForward — Cloud Upload Modal (glassmorphic drag & drop)
 * Converted from static HTML/vanilla JS to React.
 *
 * Original used getElementById + setInterval + innerHTML rewrites for the
 * upload simulation. Here that's replaced with:
 *   - `files` state (array of {id, name, sizeMB, pct})
 *   - a single useEffect-driven interval that advances progress
 *   - derived values (done count, overall %, sizes) computed on render
 *     instead of manually recalculated and pushed into the DOM
 *
 * NOTE: progress here is SIMULATED (matches original behavior) — swap the
 * interval logic in the effect below for real upload progress events
 * (e.g. axios onUploadProgress) when wiring this to a real backend.
 *
 * The original also referenced an external stock background image
 * (magnific.com). That's replaced with the gradient/line background only.
 */

let idSeq = 0;

export default function CloudUploadModal({ onClose }) {
  const [screen, setScreen] = useState("drop"); // "drop" | "list"
  const [files, setFiles] = useState([]); // {id, name, sizeMB, pct}
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef(null);
  const intervalRef = useRef(null);

  const addFiles = useCallback((fileList) => {
    const newEntries = Array.from(fileList).map((f) => ({
      id: `f${idSeq++}`,
      name: f.name,
      sizeMB:
        Math.max(1, Math.round((f.size / (1024 * 1024)) * 10) / 10) ||
        Math.round(10 + Math.random() * 150),
      pct: 0,
    }));
    setFiles((prev) => [...prev, ...newEntries]);
    setScreen("list");
  }, []);

  // Upload progress simulation — runs while there's at least one incomplete
  // file and paused is false. Stops itself once everything hits 100%.
  useEffect(() => {
    if (paused) return;
    const anyIncomplete = files.some((f) => f.pct < 100);
    if (!anyIncomplete) return;

    intervalRef.current = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) =>
          f.pct < 100
            ? { ...f, pct: Math.min(100, f.pct + (4 + Math.random() * 9)) }
            : f
        )
      );
    }, 220);

    return () => clearInterval(intervalRef.current);
  }, [files, paused]);

  const removeFile = (id) => {
    setFiles((prev) => {
      const next = prev.filter((f) => f.id !== id);
      if (next.length === 0) setScreen("drop");
      return next;
    });
  };

  const resetAll = () => {
    clearInterval(intervalRef.current);
    setFiles([]);
    setPaused(false);
    setScreen("drop");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const togglePause = () => setPaused((p) => !p);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  // ---- derived status values (replaces the old updateStatus() DOM writes) ----
  const total = files.length;
  const done = files.filter((f) => f.pct >= 100).length;
  const totalSize = files.reduce((s, f) => s + f.sizeMB, 0);
  const uploadedSize = files.reduce((s, f) => s + (f.sizeMB * f.pct) / 100, 0);
  const overallPct = total ? Math.floor((uploadedSize / totalSize) * 100) : 0;
  const isDone = total > 0 && done === total;
  const statusVisible = total > 0;

  return (
    <div className="ff-upload-root">
      <div className="bg-glow" />
      <svg className="bg-lines" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="ff-lg1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3ECF8E" stopOpacity="0.5" />
            <stop offset="1" stopColor="#3ECF8E" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ff-lg2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5EEAD4" stopOpacity="0.35" />
            <stop offset="1" stopColor="#5EEAD4" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ff-folderGrad" x1="2" y1="4" x2="44" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6BD3FF" />
            <stop offset="1" stopColor="#2B9FE0" />
          </linearGradient>
        </defs>
        <path d="M-100 700 C 250 600, 450 800, 800 650 S 1350 500, 1700 620" stroke="url(#ff-lg1)" strokeWidth="1.4" fill="none" />
        <path d="M-100 760 C 280 660, 480 860, 830 700 S 1380 560, 1700 680" stroke="url(#ff-lg1)" strokeWidth="1" fill="none" />
        <path d="M-100 120 C 300 260, 520 40, 900 180 S 1400 320, 1700 160" stroke="url(#ff-lg2)" strokeWidth="1.2" fill="none" />
        <path d="M-100 60 C 320 210, 540 -20, 930 130 S 1420 260, 1700 100" stroke="url(#ff-lg2)" strokeWidth="0.8" fill="none" />
      </svg>
      <div className="bg-vignette" />
      <div className="frame" />

      <div className="stack">
        <div className="modal">
          <div className="modal-head">
            <button
              className="icon-btn"
              title="Back"
              disabled={screen === "drop"}
              onClick={() => setScreen("drop")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="modal-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M7 18a4.5 4.5 0 01-.6-8.96A5.5 5.5 0 0117 8.06 4 4 0 0117.5 16H7z" stroke="currentColor" strokeWidth="1.6" fill="rgba(243,246,247,0.15)" />
              </svg>
              FeedForward
            </div>
            <button className="icon-btn" title="Close" onClick={() => (onClose ? onClose() : resetAll())}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {screen === "drop" && (
            <div className="drop-screen">
              <div
                className={`drop-area ${dragging ? "drag" : ""}`}
                onClick={(e) => {
                  if (e.target === e.currentTarget) fileInputRef.current?.click();
                }}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
                onDrop={handleDrop}
              >
                <div className="drop-title">Drop File here</div>
                <div className="drop-sub">to upload file in Cloud</div>

                <div className="icon-row">
                  <svg width="46" height="38" viewBox="0 0 46 38" fill="none">
                    <path d="M2 8a4 4 0 014-4h9l4 5h21a4 4 0 014 4v17a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" fill="url(#ff-folderGrad)" />
                  </svg>
                  <svg width="42" height="34" viewBox="0 0 42 34" fill="none">
                    <path d="M11 26a7 7 0 01-1-13.9A8.5 8.5 0 0126 9.2 6 6 0 0126.8 21" stroke="rgba(243,246,247,0.65)" strokeWidth="1.7" strokeLinecap="round" />
                    <path d="M21 15v13m0 0l-4.5-4.5M21 28l4.5-4.5" stroke="rgba(243,246,247,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div className="or-text">or</div>
                <button
                  className="pill-btn"
                  type="button"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  Select from your computer
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => e.target.files.length && addFiles(e.target.files)}
                />
              </div>
            </div>
          )}

          {screen === "list" && (
            <div className="list-screen">
              <div className="file-list">
                {files.map((f) => (
                  <div className="file-row" key={f.id}>
                    <svg width="30" height="24" viewBox="0 0 46 38" fill="none">
                      <path d="M2 8a4 4 0 014-4h9l4 5h21a4 4 0 014 4v17a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" fill="url(#ff-folderGrad)" />
                    </svg>
                    <div className="file-info">
                      <p className="file-name">{f.name}</p>
                      <p className="file-meta">{f.sizeMB.toFixed(0)}MB</p>
                    </div>
                    <div className="pct-pill">{Math.floor(f.pct)}</div>
                    <button className="row-x" onClick={() => removeFile(f.id)}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <div className="modal-actions">
                <button className="action-btn" onClick={resetAll}>Cancel</button>
                <button className="action-btn primary" disabled={isDone} onClick={togglePause}>
                  {paused ? "Resume" : "Pause"}
                </button>
              </div>
            </div>
          )}
        </div>

        {statusVisible && (
          <div className="status-bar">
            <div className="status-top">
              <div className="status-left">
                <div className={`spinner ${paused ? "paused" : ""} ${isDone ? "done" : ""}`} />
                <span>{isDone ? `Uploaded ${done}/${total}` : `Uploading ${done}/${total}`}</span>
              </div>
              <span>{overallPct}%</span>
            </div>
            <div className="status-track">
              <div className="status-fill" style={{ width: `${overallPct}%` }} />
            </div>
            <div className="status-bottom">
              <span>{Math.round(uploadedSize)}MB of {Math.round(totalSize)}MB</span>
              <span>{isDone ? "0 sec" : `${Math.max(1, Math.round((100 - overallPct) / 8))} sec`}</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .ff-upload-root {
          --teal: #2dd6c4;
          --glass-bg: rgba(24, 30, 38, 0.34);
          --glass-bg-soft: rgba(24, 30, 38, 0.22);
          --glass-border: rgba(255,255,255,0.22);
          --text: #F3F6F7;
          --text-dim: rgba(243,246,247,0.62);
          --text-faint: rgba(243,246,247,0.4);
          font-family: 'Inter', system-ui, sans-serif;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: linear-gradient(160deg, #0d1310 0%, #10201b 100%);
        }
        .ff-upload-root *, .ff-upload-root *::before, .ff-upload-root *::after { box-sizing: border-box; }

        .ff-upload-root .bg-glow {
          position: absolute; inset: 0; z-index: 0;
          background:
            radial-gradient(700px 500px at 12% 15%, rgba(62,207,142,0.16), transparent 60%),
            radial-gradient(600px 480px at 88% 82%, rgba(30,122,92,0.22), transparent 60%),
            radial-gradient(900px 700px at 50% 100%, rgba(13,59,51,0.35), transparent 70%);
        }
        .ff-upload-root .bg-lines { position: absolute; inset: 0; z-index: 0; opacity: 0.55; width: 100%; height: 100%; }
        .ff-upload-root .bg-vignette {
          position: absolute; inset: 0; z-index: 0;
          background: radial-gradient(ellipse 1200px 800px at 50% 40%, transparent 40%, rgba(5,10,15,0.75) 100%);
        }
        .ff-upload-root .frame {
          position: absolute; inset: 14px;
          border: 1.5px solid rgba(45,214,196,0.55);
          border-radius: 26px;
          pointer-events: none;
          z-index: 1;
        }

        .ff-upload-root .stack {
          position: relative; z-index: 2;
          display: flex; flex-direction: column; align-items: center;
          gap: 16px;
          width: 100%;
          max-width: 460px;
          padding: 0 20px;
        }

        .ff-upload-root .modal {
          width: 100%;
          background: var(--glass-bg);
          backdrop-filter: blur(22px) saturate(160%);
          -webkit-backdrop-filter: blur(22px) saturate(160%);
          border: 1px solid var(--glass-border);
          border-radius: 26px;
          box-shadow: 0 25px 60px -20px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.15);
          overflow: hidden;
          color: var(--text);
        }
        .ff-upload-root .modal-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 18px 14px;
        }
        .ff-upload-root .icon-btn {
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.08);
          border: none; cursor: pointer;
          color: var(--text);
          transition: background .15s ease;
        }
        .ff-upload-root .icon-btn:hover { background: rgba(255,255,255,0.18); }
        .ff-upload-root .icon-btn:disabled { opacity: .35; cursor: default; }
        .ff-upload-root .icon-btn:disabled:hover { background: rgba(255,255,255,0.08); }
        .ff-upload-root .modal-title {
          display: flex; align-items: center; gap: 8px;
          font-size: 15px; font-weight: 600; color: var(--text-dim);
        }

        .ff-upload-root .drop-screen { padding: 10px 22px 26px; }
        .ff-upload-root .drop-area {
          border-radius: 18px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 46px 20px 34px;
          display: flex; flex-direction: column; align-items: center;
          text-align: center;
          transition: background .2s ease, border-color .2s ease;
          cursor: pointer;
        }
        .ff-upload-root .drop-area.drag {
          background: rgba(45,214,196,0.08);
          border-color: rgba(45,214,196,0.5);
        }
        .ff-upload-root .drop-title { font-size: 17px; font-weight: 600; margin: 0 0 4px; }
        .ff-upload-root .drop-sub { font-size: 13px; color: var(--text-dim); margin: 0 0 26px; }
        .ff-upload-root .icon-row { display: flex; align-items: center; gap: 18px; margin-bottom: 26px; }
        .ff-upload-root .or-text { font-size: 12.5px; color: var(--text-faint); margin-bottom: 18px; }
        .ff-upload-root .pill-btn {
          font-family: 'Inter', sans-serif;
          font-size: 13.5px; font-weight: 500;
          color: var(--text);
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          padding: 11px 22px;
          border-radius: 999px;
          cursor: pointer;
          transition: background .15s ease, transform .1s ease;
        }
        .ff-upload-root .pill-btn:hover { background: rgba(255,255,255,0.2); }
        .ff-upload-root .pill-btn:active { transform: scale(0.97); }

        .ff-upload-root .file-list {
          max-height: 300px;
          overflow-y: auto;
          padding: 0 18px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .ff-upload-root .file-row {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 6px;
          animation: ff-rowIn .3s ease both;
        }
        @keyframes ff-rowIn { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: none; } }
        .ff-upload-root .file-name { font-size: 14.5px; font-weight: 600; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ff-upload-root .file-meta { font-size: 12px; color: var(--text-faint); margin: 1px 0 0; }
        .ff-upload-root .file-info { flex: 1; min-width: 0; }
        .ff-upload-root .pct-pill {
          font-size: 12.5px; font-weight: 600; color: var(--text);
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.18);
          padding: 6px 14px; border-radius: 999px;
          min-width: 46px; text-align: center;
          flex-shrink: 0;
        }
        .ff-upload-root .row-x {
          width: 26px; height: 26px; border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: none; color: var(--text-dim); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background .15s ease;
        }
        .ff-upload-root .row-x:hover { background: rgba(255,255,255,0.18); }

        .ff-upload-root .modal-actions { display: flex; gap: 12px; padding: 18px 18px 20px; }
        .ff-upload-root .action-btn {
          flex: 1;
          font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 600;
          padding: 12px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.08);
          color: var(--text);
          cursor: pointer;
          transition: background .15s ease;
        }
        .ff-upload-root .action-btn:hover { background: rgba(255,255,255,0.16); }
        .ff-upload-root .action-btn.primary { background: rgba(45,214,196,0.18); border-color: rgba(45,214,196,0.4); }
        .ff-upload-root .action-btn.primary:hover { background: rgba(45,214,196,0.28); }
        .ff-upload-root .action-btn:disabled { opacity: 0.45; cursor: default; }

        .ff-upload-root .status-bar {
          width: 100%;
          background: var(--glass-bg-soft);
          backdrop-filter: blur(18px) saturate(150%);
          -webkit-backdrop-filter: blur(18px) saturate(150%);
          border: 1px solid var(--glass-border);
          border-radius: 18px;
          padding: 14px 18px 16px;
          color: var(--text);
        }
        .ff-upload-root .status-top {
          display: flex; align-items: center; justify-content: space-between;
          font-size: 13px; font-weight: 500; margin-bottom: 10px;
        }
        .ff-upload-root .status-left { display: flex; align-items: center; gap: 8px; color: var(--text-dim); }
        .ff-upload-root .spinner {
          width: 14px; height: 14px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: var(--teal);
          animation: ff-spin .8s linear infinite;
          flex-shrink: 0;
          position: relative;
        }
        .ff-upload-root .spinner.paused { animation-play-state: paused; }
        .ff-upload-root .spinner.done { animation: none; border-color: var(--teal); background: var(--teal); }
        @keyframes ff-spin { to { transform: rotate(360deg); } }
        .ff-upload-root .status-track {
          height: 5px; border-radius: 3px; background: rgba(255,255,255,0.12);
          overflow: hidden; margin-bottom: 8px;
        }
        .ff-upload-root .status-fill {
          height: 100%; border-radius: 3px;
          background: linear-gradient(90deg, var(--teal), #7ef2e4);
          transition: width .25s ease;
        }
        .ff-upload-root .status-bottom {
          display: flex; justify-content: space-between;
          font-size: 11.5px; color: var(--text-faint);
        }
      `}</style>
    </div>
  );
}
