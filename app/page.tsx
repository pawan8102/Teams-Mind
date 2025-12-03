"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/login"); // Redirect to login page
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-xl rounded-lg w-[350px]">
        <h1 className="text-2xl font-semibold mb-4">Welcome!</h1>
        <p className="text-gray-600">
          This is a Team-Mind Application.
        </p>
        <button
          onClick={handleClick}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Click Me to Login
        </button>
      </div>
    </main>
  );
}
