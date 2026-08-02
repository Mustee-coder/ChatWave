import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

// ChatWave logo mark — matches SignUpPage
const WaveMark = ({ className = "" }) => (
  <div className={`flex items-end gap-[3px] ${className}`}>
    {[6, 14, 20, 12, 8].map((h, i) => (
      <span
        key={i}
        className="w-[3px] rounded-full bg-cyan-400"
        style={{ height: `${h}px` }}
      />
    ))}
  </div>
);

const AmbientWaves = () => (
  <div className="flex items-end gap-1.5 h-24 justify-center">
    {Array.from({ length: 24 }).map((_, i) => (
      <span
        key={i}
        className="w-1.5 rounded-full bg-gradient-to-t from-cyan-400 to-indigo-400/70 animate-wave"
        style={{ animationDelay: `${i * 0.09}s`, height: "20%" }}
      />
    ))}
  </div>
);

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { isPending, error, loginMutation } = useLogin();

  const handleChange = (field) => (e) => {
    setLoginData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    (error ? "Something went wrong. Please try again." : null);

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-label { font-family: 'JetBrains Mono', monospace; }
        @keyframes wave {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
        .animate-wave { animation: wave 1.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-wave { animation: none; height: 55%; }
        }
      `}</style>

      <div className="flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-[#0F172A] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden border border-white/5">
        {/* LOGIN FORM — LEFT SIDE */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col bg-[#F8FAFC]">
          {/* LOGO */}
          <div className="mb-8 flex items-center gap-2.5">
            <WaveMark />
            <span className="font-display text-2xl font-bold text-slate-900 tracking-tight">
              ChatWave
            </span>
          </div>

          {errorMessage && (
            <div
              className="mb-5 px-4 py-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm font-body break-words"
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleLogin} noValidate>
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-2xl font-bold text-slate-900">
                    Welcome back
                  </h2>
                  <p className="font-body text-sm text-slate-500 mt-1">
                    Sign in to keep the conversation going.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* EMAIL */}
                  <div>
                    <label
                      htmlFor="email"
                      className="font-label text-[11px] uppercase tracking-wide text-slate-500"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="hello@example.com"
                      className="font-body mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
                      value={loginData.email}
                      onChange={handleChange("email")}
                      required
                    />
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label
                      htmlFor="password"
                      className="font-label text-[11px] uppercase tracking-wide text-slate-500"
                    >
                      Password
                    </label>
                    <div className="relative mt-1.5">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="font-body w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
                        value={loginData.password}
                        onChange={handleChange("password")}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="size-4" />
                        ) : (
                          <EyeIcon className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="font-body w-full rounded-lg bg-slate-900 text-white py-2.5 font-medium text-sm hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <span className="size-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>

                <p className="font-body text-center text-sm text-slate-500">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-cyan-600 font-medium hover:underline">
                    Create one
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* LOGIN — RIGHT SIDE */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-[#0F172A] items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-400/10" />
          <div className="relative max-w-sm p-10 text-center space-y-8">
            <AmbientWaves />
            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-white">
                Every conversation, in sync
              </h2>
              <p className="font-body text-slate-400">
                Message, call, and stay connected with your people — wherever they are.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
