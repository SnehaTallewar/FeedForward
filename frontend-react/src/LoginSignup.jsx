import { useState } from "react";

/**
 * FeedForward — Login / Sign Up
 * Converted from static HTML to a controlled React component.
 * Tab switching and form submission are handled via useState instead of
 * direct DOM manipulation (classList.add/remove, getElementById, etc).
 *
 * NOTE: the original file referenced an external "background_img.jpeg".
 * That's been swapped for a gradient-only background here — drop your own
 * image back in via the `.ff-login-root` background rule if you want it.
 *
 * Hook up real auth by replacing handleLoginSubmit / handleSignupSubmit /
 * handleOAuth below.
 */
export default function LoginSignup() {
  const [activeTab, setActiveTab] = useState("login"); // "login" | "signup"

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up real login request (e.g. POST to your auth endpoint)
    console.log("login submit", { loginEmail, loginPassword });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up real signup request
    console.log("signup submit", { signupName, signupEmail, signupPassword });
  };

  const handleOAuth = (provider) => {
    // TODO: wire up real OAuth redirect/flow
    console.log("oauth click:", provider);
  };

  return (
    <div className="ff-login-root">
      <div className="blob b1" />
      <div className="blob b2" />

      <div className="card">
        {/* LEFT PANEL */}
        <div className="panel-left">
          <div className="chevron-back" />
          <div className="chevron-front" />

          <div className="brand">
            <h1>FeedForward</h1>
            <p>Feedback intelligence</p>
          </div>

          <div className="tabs">
            <button
              type="button"
              className={`tab ${activeTab === "login" ? "active" : "inactive"}`}
              onClick={() => setActiveTab("login")}
            >
              LOGIN
            </button>
            <button
              type="button"
              className={`tab ${activeTab === "signup" ? "active" : "inactive"}`}
              onClick={() => setActiveTab("signup")}
            >
              SIGN UP
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="panel-right">
          <div className="avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="#0F1712" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          {/* LOGIN FORM */}
          <div className={`form-block ${activeTab === "login" ? "active" : ""}`}>
            <h2>LOGIN</h2>
            <form onSubmit={handleLoginSubmit}>
              <div className="field">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 6l-10 7L2 6" />
                  <path d="M2 6h20v12H2z" />
                </svg>
                <input
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>

              <div className="field">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>

              <div className="row-action">
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Forgot Password?
                </a>
                <button type="submit" className="btn-pill">
                  LOGIN
                </button>
              </div>
            </form>

            <div className="switch-hint">
              Don&apos;t have an account?{" "}
              <button type="button" onClick={() => setActiveTab("signup")}>
                Sign up
              </button>
            </div>
          </div>

          {/* SIGN UP FORM */}
          <div className={`form-block ${activeTab === "signup" ? "active" : ""}`}>
            <h2>SIGN UP</h2>
            <form onSubmit={handleSignupSubmit}>
              <div className="field">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  placeholder="Full name"
                  autoComplete="name"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                />
              </div>

              <div className="field">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 6l-10 7L2 6" />
                  <path d="M2 6h20v12H2z" />
                </svg>
                <input
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </div>

              <div className="field">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
              </div>

              <div className="row-action" style={{ justifyContent: "flex-end" }}>
                <button type="submit" className="btn-pill">
                  SIGN UP
                </button>
              </div>
            </form>

            <div className="switch-hint">
              Already have an account?{" "}
              <button type="button" onClick={() => setActiveTab("login")}>
                Log in
              </button>
            </div>
          </div>

          {/* OAUTH */}
          <div className="oauth-section">
            <div className="oauth-row">
              <span>Or {activeTab === "signup" ? "Sign Up" : "Login"} With</span>
              <div className="oauth-icons">
                <div className="oauth-circle google" onClick={() => handleOAuth("Google")}>
                  G
                </div>
                <div className="oauth-circle hub" onClick={() => handleOAuth("GitHub")}>
                  H
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ff-login-root {
          --navy: #161B24;
          --teal: #2C5F5F;
          --teal-2: #3A7676;
          --forest: #2E5339;
          --sage: #5C8A5C;
          --sage-2: #7BAE78;
          --ink: #F3F7F5;
          --ink-dim: rgba(243, 247, 245, 0.6);
          --glass-border: rgba(255, 255, 255, 0.22);

          font-family: -apple-system, "Segoe UI", "Inter", system-ui, sans-serif;

          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px 20px;
          background: linear-gradient(160deg, var(--navy) 0%, #10141b 100%);
          color: var(--ink);
          overflow: hidden;
          position: relative;
          box-sizing: border-box;
        }
        .ff-login-root *,
        .ff-login-root *::before,
        .ff-login-root *::after { box-sizing: border-box; }

        .ff-login-root .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.45;
          pointer-events: none;
        }
        .ff-login-root .blob.b1 { width: 420px; height: 420px; background: var(--sage); top: -180px; left: -180px; }
        .ff-login-root .blob.b2 { width: 380px; height: 380px; background: var(--teal-2); right: -160px; bottom: -180px; }

        .ff-login-root .card {
          position: relative;
          z-index: 2;
          width: min(920px, 100%);
          height: 560px;
          display: grid;
          grid-template-columns: 38% 62%;
          overflow: hidden;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.055);
          backdrop-filter: blur(30px) saturate(150%);
          -webkit-backdrop-filter: blur(30px) saturate(150%);
          border: 1px solid var(--glass-border);
          box-shadow: 0 35px 90px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .ff-login-root .panel-left {
          position: relative;
          overflow: hidden;
          background: linear-gradient(145deg, rgba(44, 95, 95, 0.72), rgba(22, 27, 36, 0.72));
        }
        .ff-login-root .panel-left::after {
          content: "";
          position: absolute;
          right: -1px;
          top: 50%;
          width: 58px;
          height: 190px;
          transform: translateY(-50%);
          background: var(--teal);
          border-radius: 55px 0 0 55px;
          z-index: 2;
          opacity: 0.95;
        }
        .ff-login-root .chevron-back {
          position: absolute;
          inset: -5%;
          clip-path: polygon(0 0, 82% 0, 37% 100%, 0 100%);
          background: linear-gradient(145deg, rgba(123, 174, 120, 0.34), rgba(92, 138, 92, 0.12));
          z-index: 0;
        }
        .ff-login-root .chevron-front {
          position: absolute;
          inset: -5%;
          clip-path: polygon(15% 0, 100% 0, 53% 100%, -15% 100%);
          background: linear-gradient(145deg, rgba(46, 83, 57, 0.95), rgba(44, 95, 95, 0.82));
          z-index: 0;
        }
        .ff-login-root .panel-left::before {
          content: "";
          position: absolute;
          inset: -5%;
          clip-path: polygon(0 0, 45% 0, 100% 100%, 68% 100%);
          background: rgba(123, 174, 120, 0.12);
          z-index: 0;
        }

        .ff-login-root .brand { position: absolute; left: 34px; bottom: 30px; z-index: 5; }
        .ff-login-root .brand h1 { font-size: 22px; font-weight: 800; letter-spacing: -0.03em; color: var(--ink); margin: 0; }
        .ff-login-root .brand p { margin-top: 5px; font-size: 11px; color: rgba(243, 247, 245, 0.55); letter-spacing: 0.08em; text-transform: uppercase; }

        .ff-login-root .tabs {
          position: absolute;
          top: 50%;
          right: -1px;
          transform: translateY(-50%);
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }
        .ff-login-root .tab {
          position: relative;
          border: none;
          outline: none;
          cursor: pointer;
          font-family: inherit;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.04em;
          transition: background 0.25s ease, color 0.25s ease, padding 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
        }
        .ff-login-root .tab.active {
          min-width: 120px;
          padding: 15px 32px 15px 28px;
          background: rgba(243, 247, 245, 0.96);
          color: var(--navy);
          border-radius: 32px 0 0 32px;
          box-shadow: -8px 0 24px rgba(0, 0, 0, 0.18);
          z-index: 3;
        }
        .ff-login-root .tab.active::before,
        .ff-login-root .tab.active::after {
          content: "";
          position: absolute;
          right: 0;
          width: 24px;
          height: 24px;
          background: transparent;
          pointer-events: none;
        }
        .ff-login-root .tab.active::before { top: -24px; border-radius: 0 0 24px 0; box-shadow: 10px 10px 0 10px rgba(243, 247, 245, 0.96); }
        .ff-login-root .tab.active::after { bottom: -24px; border-radius: 0 24px 0 0; box-shadow: 10px -10px 0 10px rgba(243, 247, 245, 0.96); }
        .ff-login-root .tab.inactive {
          min-width: 120px;
          padding: 13px 32px 13px 28px;
          background: transparent;
          color: rgba(243, 247, 245, 0.68);
          border-radius: 30px 0 0 30px;
        }
        .ff-login-root .tab.inactive:hover { color: var(--ink); background: rgba(255, 255, 255, 0.05); }

        .ff-login-root .panel-right {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 58px 0;
          background: rgba(22, 27, 36, 0.28);
        }

        .ff-login-root .avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 13px;
          background: linear-gradient(135deg, var(--sage), var(--teal-2));
          box-shadow: 0 12px 30px rgba(44, 95, 95, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.25);
        }
        .ff-login-root .avatar svg { width: 31px; height: 31px; }

        .ff-login-root .form-block { display: none; width: 100%; max-width: 370px; }
        .ff-login-root .form-block.active { display: block; animation: ff-fadeUp 0.3s ease; }
        @keyframes ff-fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .ff-login-root .form-block h2 { text-align: center; font-size: 22px; font-weight: 800; letter-spacing: 0.05em; color: var(--sage-2); margin: 0 0 30px; }

        .ff-login-root .field {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 0 4px 11px;
          margin-bottom: 25px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.25);
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .ff-login-root .field:focus-within { border-color: var(--sage-2); }
        .ff-login-root .field svg { width: 17px; height: 17px; flex-shrink: 0; color: var(--ink-dim); }
        .ff-login-root .field input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--ink);
          font-family: inherit;
          font-size: 14px;
        }
        .ff-login-root .field input::placeholder { color: rgba(243, 247, 245, 0.42); }

        .ff-login-root .row-action { display: flex; align-items: center; justify-content: space-between; margin-top: 6px; }
        .ff-login-root .row-action a { color: var(--ink-dim); text-decoration: none; font-size: 11.5px; }
        .ff-login-root .row-action a:hover { color: var(--sage-2); }

        .ff-login-root .btn-pill {
          border: 0;
          outline: 0;
          cursor: pointer;
          padding: 11px 27px;
          border-radius: 25px;
          background: linear-gradient(120deg, var(--sage-2), var(--sage));
          color: #122015;
          font-family: inherit;
          font-size: 12.5px;
          font-weight: 800;
          box-shadow: 0 6px 18px rgba(92, 138, 92, 0.18);
          transition: transform 0.15s ease, filter 0.2s ease;
        }
        .ff-login-root .btn-pill:hover { filter: brightness(1.08); }
        .ff-login-root .btn-pill:active { transform: scale(0.97); }

        .ff-login-root .switch-hint { text-align: center; margin-top: 25px; font-size: 11.5px; color: var(--ink-dim); }
        .ff-login-root .switch-hint button {
          border: 0;
          background: none;
          cursor: pointer;
          color: var(--sage-2);
          font-family: inherit;
          font-size: 11.5px;
          font-weight: 700;
        }
        .ff-login-root .switch-hint button:hover { text-decoration: underline; }

        .ff-login-root .oauth-section {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          min-height: 82px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-top: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(0, 0, 0, 0.10);
        }
        .ff-login-root .oauth-row {
          width: 100%;
          max-width: 370px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          color: var(--ink-dim);
        }
        .ff-login-root .oauth-icons { display: flex; gap: 12px; }
        .ff-login-root .oauth-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 12px;
          font-weight: 800;
          border: 1px solid var(--glass-border);
          background: rgba(255, 255, 255, 0.055);
          transition: 0.2s ease;
          color: #F3F7F5;
        }
        .ff-login-root .oauth-circle:hover { background: rgba(255, 255, 255, 0.13); transform: translateY(-2px); }

        @media (max-width: 720px) {
          .ff-login-root { padding: 20px 14px; overflow: auto; }
          .ff-login-root .card { height: auto; min-height: 600px; grid-template-columns: 1fr; border-radius: 24px; }
          .ff-login-root .panel-left { min-height: 145px; }
          .ff-login-root .chevron-back { clip-path: polygon(0 0, 75% 0, 40% 100%, 0 100%); }
          .ff-login-root .chevron-front { clip-path: polygon(10% 0, 85% 0, 48% 100%, -10% 100%); }
          .ff-login-root .brand { left: 22px; bottom: 20px; }
          .ff-login-root .brand h1 { font-size: 18px; }
          .ff-login-root .tabs { top: auto; bottom: 20px; right: 0; transform: none; }
          .ff-login-root .tab.active { padding: 12px 28px 12px 20px; }
          .ff-login-root .tab.inactive { padding: 12px 24px; }
          .ff-login-root .panel-right { min-height: 500px; padding: 38px 25px 100px; }
          .ff-login-root .oauth-section { min-height: 76px; }
        }
        @media (max-width: 420px) {
          .ff-login-root .card { min-height: 570px; }
          .ff-login-root .panel-left { min-height: 125px; }
          .ff-login-root .avatar { width: 62px; height: 62px; }
          .ff-login-root .form-block { max-width: 100%; }
          .ff-login-root .oauth-row { padding: 0 25px; }
        }
      `}</style>
    </div>
  );
}
