import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
  // useNavigate()
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  //   handleChange
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  // handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await registerUser(formData);

      alert(response.message);

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  // return (
  //   <div className="min-h-screen flex items-center justify-center bg-gray-100">
  //     <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
  //       <h1 className="text-3xl font-bold text-center mb-2">SafeRide AI 🚑</h1>

  //       <p className="text-center text-gray-500 mb-6">Create your account</p>

  //       <form className="space-y-4" onSubmit={handleSubmit}>
  //         <div>
  //           <label className="block mb-1 font-medium">Name</label>

  //           <input
  //             type="text"
  //             name="name"
  //             value={formData.name}
  //             onChange={handleChange}
  //             placeholder="Enter your name"
  //             className="w-full border p-3 rounded"
  //           />
  //         </div>

  //         <div>
  //           <label className="block mb-1 font-medium">Email</label>

  //           <input
  //             type="email"
  //             name="email"
  //             value={formData.email}
  //             onChange={handleChange}
  //             placeholder="Enter your email"
  //             className="w-full border p-3 rounded"
  //           />
  //         </div>

  //         <div>
  //           <label className="block mb-1 font-medium">Password</label>

  //           <input
  //             type="password"
  //             name="password"
  //             value={formData.password}
  //             onChange={handleChange}
  //             placeholder="Enter your password"
  //             className="w-full border p-3 rounded"
  //           />
  //         </div>

  //         <button
  //           type="submit"
  //           className="w-full bg-green-600 text-white p-3 rounded"
  //         >
  //           Register
  //         </button>
  //       </form>

  //       <p className="text-center mt-4">
  //         Already have an account?{" "}
  //         <Link to="/" className="text-blue-600 font-semibold">
  //           Login
  //         </Link>
  //       </p>
  //     </div>
  //   </div>
  // );

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#090014] flex items-center justify-center px-4 sm:px-6 py-8 sm:py-10">
      {/* Background Glow */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b from-pink-500/40 via-purple-500/20 to-transparent rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-150px] right-[-100px] w-[350px] h-[350px] bg-cyan-400/10 rounded-full blur-3xl"></div>

      {/* Top Route Visual */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[320px] h-[180px] z-10 pointer-events-none">
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <defs>
            <linearGradient
              id="routeGradientRegister"
              x1="50"
              y1="150"
              x2="260"
              y2="20"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#ec4899" />
              <stop offset="0.5" stopColor="#a855f7" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
          </defs>

          {/* Route Line */}
          <path
            d="M65 145
             C110 140, 125 115, 115 90
             C100 55, 150 45, 185 40
             C220 35, 235 25, 265 20"
            stroke="url(#routeGradientRegister)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="10 10"
            className="drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
          />

          {/* Start Point */}
          <circle
            cx="65"
            cy="145"
            r="8"
            fill="#ec4899"
            className="drop-shadow-[0_0_10px_rgba(236,72,153,1)]"
          />

          {/* End Point */}
          <circle
            cx="265"
            cy="20"
            r="7"
            fill="#22d3ee"
            className="drop-shadow-[0_0_10px_rgba(34,211,238,1)]"
          />
        </svg>

        <div className="absolute left-[49px] bottom-[21px] w-8 h-8 bg-pink-500/30 rounded-full blur-lg animate-pulse"></div>

        <div className="absolute right-[39px] top-[3px] w-7 h-7 bg-cyan-400/30 rounded-full blur-lg animate-pulse"></div>
      </div>

      {/* Main Register Section */}
      <div className="relative z-10 w-full max-w-md mt-36 sm:mt-40">
        {/* Top Branding */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center mb-3">
            <span className="text-pink-400 tracking-[0.35em] text-xs sm:text-sm font-bold uppercase">
              SafeRide AI
            </span>

            <span className="ml-2 text-xl">🚑</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Register
          </h1>

          <p className="text-gray-400 text-sm sm:text-base mt-3">
            Create your account
          </p>
        </div>

        {/* Register Card */}
        <div className="relative overflow-hidden bg-[#12051f]/80 border border-white/10 backdrop-blur-2xl rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 md:p-9 shadow-[0_25px_80px_rgba(0,0,0,0.55)]">
          {/* Cyber Glow Layers */}
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-pink-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="absolute -bottom-20 -left-16 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="absolute inset-0 rounded-[28px] border border-purple-300/10 pointer-events-none"></div>

          <form className="relative z-10 space-y-6" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="block mb-2 text-gray-300 text-sm font-medium">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 p-4 rounded-2xl outline-none transition-all duration-300 focus:border-pink-400/70 focus:bg-white/[0.06] focus:ring-4 focus:ring-pink-500/10 hover:border-white/20"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-gray-300 text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 p-4 rounded-2xl outline-none transition-all duration-300 focus:border-purple-400/70 focus:bg-white/[0.06] focus:ring-4 focus:ring-purple-500/10 hover:border-white/20"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-gray-300 text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 p-4 rounded-2xl outline-none transition-all duration-300 focus:border-cyan-400/70 focus:bg-white/[0.06] focus:ring-4 focus:ring-cyan-400/10 hover:border-white/20"
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="relative overflow-hidden w-full bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 text-[#100318] font-bold text-lg p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(236,72,153,0.25)] active:scale-[0.99]"
            >
              Register
            </button>
          </form>

          {/* Login Link */}
          <p className="relative z-10 text-center mt-6 sm:mt-7 text-sm sm:text-base text-gray-400">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-cyan-400 font-semibold hover:text-cyan-300 transition"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
