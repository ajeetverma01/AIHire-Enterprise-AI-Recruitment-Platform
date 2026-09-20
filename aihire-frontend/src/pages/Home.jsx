import './AIHireHomePage.css';
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

const handleLogin = () => {
  navigate("/login");
};

const handleRegister = () => {
  navigate("/register");
};

  return (
    <div className="aihire">
      <div className="aihire__glow aihire__glow--red" aria-hidden="true" />
      <div className="aihire__glow aihire__glow--green" aria-hidden="true" />
      <div className="aihire__glow aihire__glow--blue" aria-hidden="true" />
      <div className="aihire__grid" aria-hidden="true" />

      <nav className="aihire__nav">
        <svg
          className="aihire__mark"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          aria-hidden="true"
        >
          <line className="aihire__mark-line" x1="15" y1="15" x2="6" y2="7" />
          <line className="aihire__mark-line" x1="15" y1="15" x2="24" y2="8" />
          <line className="aihire__mark-line" x1="15" y1="15" x2="15" y2="25" />
          <circle className="aihire__mark-node" cx="15" cy="15" r="3.2" fill="#ffc64b" />
          <circle className="aihire__mark-node" cx="6" cy="7" r="2.4" fill="#ff4d6d" />
          <circle className="aihire__mark-node" cx="24" cy="8" r="2.4" fill="#4d8dff" />
          <circle className="aihire__mark-node" cx="15" cy="25" r="2.4" fill="#37f2a0" />
        </svg>
        <span className="aihire__wordmark">
          AI<span>Hire</span>
        </span>
      </nav>

      <main className="aihire__hero">
        <h1 className="aihire__headline">Hiring, matched by intelligence.</h1>
        <p className="aihire__subhead">
          AIHire reads roles and resumes the way a great recruiter would, then
          shows you who's actually worth a conversation.
        </p>
        <div className="aihire__actions">
          <button
            type="button"
            className="aihire__btn aihire__btn--ghost"
            onClick={handleLogin}
          >
            Log in
          </button>
          <button
            type="button"
            className="aihire__btn aihire__btn--primary"
            onClick={handleRegister}
          >
            Create account
          </button>
        </div>
      </main>

      <footer className="aihire__foot">
        <p>For recruiters and candidates.</p>
      </footer>
    </div>
  );
}