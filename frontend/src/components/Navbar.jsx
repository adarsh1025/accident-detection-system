import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="relative border-b border-white/10 bg-[#0a0512]/80 backdrop-blur-xl">
      {/* Navbar Glow */}
      <div className="absolute top-0 left-1/4 h-20 w-40 rounded-full bg-pink-500/10 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-400 text-lg shadow-[0_0_20px_rgba(236,72,153,0.20)]">
            🚑
          </div>

          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white">
              SafeRide AI
            </h1>

            <div className="h-[2px] w-16 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400"></div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logoutHandler}
          className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition-all duration-300 hover:border-red-400/60 hover:bg-red-500/20 hover:shadow-[0_0_25px_rgba(248,113,113,0.12)] active:scale-[0.98]"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
