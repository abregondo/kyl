import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

export default function Landing() {
  const navigate = useNavigate();

  // Handle click anywhere on screen
  const handleClick = () => {
    navigate("/students");
  };

  // Optional: allow pressing Enter key to continue
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Enter") navigate("/students");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigate]);

  return (
    <div
      onClick={handleClick}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white cursor-pointer select-none px-4"
    >
      <motion.img
  src="/image.jpg"
  alt="Your Profile"
  className="w-40 h-40 rounded-full shadow-2xl border-4 border-white mb-6 object-cover"
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 1.2, ease: "easeOut" }}
/>


      {/* Name */}
      <motion.h1
        className="text-4xl font-extrabold mb-3"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Jazee Kyl Abregondo
      </motion.h1>

      {/* Journey */}
      <motion.p
        className="text-lg text-emerald-100 max-w-lg text-center mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
      >
        My journey from <b>1st Year</b> to <b>3rd Year</b> has been filled with
        challenges, learning, and growth in Information Technology — each year
        pushing me closer to becoming a true IT professional.
      </motion.p>

      {/* Continue Button */}
      <motion.button
        onClick={handleClick}
        className="bg-white text-emerald-600 font-semibold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-all"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        Continue →
      </motion.button>

      <p className="text-sm mt-6 text-emerald-100 italic">
        or click anywhere to proceed
      </p>
    </div>
  );
}
