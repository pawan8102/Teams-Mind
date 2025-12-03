"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [team, setTeam] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return alert("Please select a team");

    // Generate a fake email for Supabase
    // Generate a valid fake email
    const email = `${username.replace(/\s+/g, "").toLowerCase()}@supabase.com`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return alert(error.message);

    const userId = data.user?.id;
    if (!userId) return alert("Signup failed");

    // 2️⃣ Save username + team in profiles table
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      username,
      team,
    });

    if (profileError) return alert(profileError.message);

    // 3️⃣ Auto login
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) return alert(loginError.message);

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md p-10 rounded-3xl bg-gray-900 border-4 border-pink-500/60 shadow-[0_0_30px_rgba(255,20,147,0.8)]">
        <h2 className="text-4xl font-bold text-white text-center mb-8 tracking-wider neon-text">
          Create Account
        </h2>

        <form className="space-y-6" onSubmit={handleSignup}>
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
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-[0_0_10px_rgba(255,20,147,0.5)] transition"
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
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-[0_0_10px_rgba(255,20,147,0.5)] transition"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300 font-medium">Team</label>
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-[0_0_10px_rgba(255,20,147,0.5)] transition"
            >
              <option value="">Select a team</option>
              <option value="A">Team A</option>
              <option value="B">Team B</option>
              <option value="C">Team C</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-xl font-semibold text-white shadow-lg hover:shadow-[0_0_40px_rgba(255,20,147,0.9)] transition duration-300 neon-button"
          >
            Sign Up & Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-pink-400 font-semibold hover:text-pink-500"
          >
            Login
          </a>
        </p>
      </div>

      <style jsx>{`
        .neon-text {
          text-shadow: 0 0 5px #ff1493, 0 0 10px #ff1493, 0 0 20px #ff1493,
            0 0 40px #ff1493;
        }
        .neon-button {
          text-shadow: 0 0 5px #ff1493, 0 0 10px #ff1493;
        }
      `}</style>
    </div>
  );
}
