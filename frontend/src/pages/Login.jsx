import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
function Login() {
  // navigate
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // handleChange
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
      const response = await loginUser(formData);

      localStorage.setItem("token", response.token);

      alert("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);

      alert(error.response?.data?.message || error.message || "Login Failed");
    }
  };

  // return (
  //   <div className="min-h-screen flex items-center justify-center bg-gray-100">
  //     <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
  //       <h1 className="text-3xl font-bold text-center mb-2">SafeRide AI 🚑</h1>

  //       <p className="text-center text-gray-500 mb-6">Login to your account</p>

  //       <form className="space-y-4" onSubmit={handleSubmit}>
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
  //           className="w-full bg-blue-600 text-white p-3 rounded"
  //         >
  //           Login
  //         </button>
  //       </form>

  //       <p className="text-center mt-4">
  //         Don't have an account?{" "}
  //         <Link to="/register" className="text-blue-600 font-semibold">
  //           Register
  //         </Link>
  //       </p>
  //     </div>
  //   </div>
  // );

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#090014] flex items-center justify-center px-4 py-10">
      {/* Background Glow */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b from-pink-500/40 via-purple-500/20 to-transparent rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-150px] right-[-100px] w-[350px] h-[350px] bg-cyan-400/10 rounded-full blur-3xl"></div>

      {/* Top Route Visual */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[320px] h-[180px] z-10 pointer-events-none">
        <svg viewBox="0 0 320 180" className="w-full h-full" fill="none">
          <defs>
            <linearGradient
              id="routeGradient"
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
            stroke="url(#routeGradient)"
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

        {/* Pink Glow */}
        <div className="absolute left-[49px] bottom-[21px] w-8 h-8 bg-pink-500/30 rounded-full blur-lg animate-pulse"></div>

        {/* Cyan Glow */}
        <div className="absolute right-[39px] top-[3px] w-7 h-7 bg-cyan-400/30 rounded-full blur-lg animate-pulse"></div>
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md mt-40">
        {/* Top Branding */}
        <div className="text-center mb-8">
          <p className="text-pink-400 tracking-[0.35em] text-sm font-semibold uppercase mb-3">
            SafeRide AI 🚑
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-white">Login</h1>

          <p className="text-gray-400 mt-3">Login to your account</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-[#13051f]/90 border border-purple-400/20 backdrop-blur-xl rounded-3xl shadow-2xl p-7 md:p-9">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block mb-2 text-gray-300 font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full bg-[#1d1029] border border-purple-300/20 text-white placeholder-gray-500 p-4 rounded-xl outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-gray-300 font-medium">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full bg-[#1d1029] border border-purple-300/20 text-white placeholder-gray-500 p-4 rounded-xl outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 text-[#100318] font-bold text-lg p-4 rounded-xl transition duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-pink-500/20"
            >
              Login
            </button>
          </form>

          {/* Register */}
          <p className="text-center mt-7 text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-cyan-400 font-semibold hover:text-cyan-300 transition"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
