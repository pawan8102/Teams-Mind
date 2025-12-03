"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) router.push("/dashboard");
    }
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = `${username}@supabase.local`;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return alert(error.message);

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md p-10 rounded-3xl bg-gray-900 border-4 border-blue-500/60 shadow-[0_0_30px_rgba(0,150,255,0.8)]">
        <h2 className="text-4xl font-bold text-white text-center mb-8 tracking-wider neon-text">
          Login
        </h2>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block mb-2 text-gray-300 font-medium">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300 font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl font-semibold text-white shadow-lg hover:shadow-[0_0_40px_rgba(0,150,255,0.9)] transition duration-300 neon-button"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-blue-400 font-semibold hover:text-blue-500"
          >
            Signup
          </a>
        </p>
      </div>

      <style jsx>{`
        .neon-text {
          text-shadow: 0 0 5px #0090ff, 0 0 10px #0090ff, 0 0 20px #0090ff,
            0 0 40px #0090ff;
        }
        .neon-button {
          text-shadow: 0 0 5px #0090ff, 0 0 10px #0090ff;
        }
      `}</style>
    </div>
  );
}
