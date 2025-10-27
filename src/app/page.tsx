import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

// app/page.tsx
export default async function Home() {
    const session = await auth.api.getSession(
    {
        headers: await headers()
    }
    );
  return (
    <div className="h-[calc(100vh-72px)] flex flex-col justify-center items-center bg-linear-to-b from-gray-900 to-gray-800 text-gray-100 px-4">
      {/* Header */}
      <h1 className="text-5xl font-bold mb-4 text-center text-purple-400">Welcome to Lavio</h1>
      <p className="text-xl mb-8 text-center max-w-xl text-gray-300">
        Chat with an AI smarter than any other. Experience seamless, real-time conversations.
      </p>

      {/* Call-to-Action Buttons */}
      <div className="flex gap-4">
        <Link
          href="/chat"
          className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-purple-500 transition"
        >
          Get Started
        </Link>
     {
      !session && (
           <Link
          href="/auth"
          className="border border-gray-300 text-gray-300 font-semibold px-6 py-3 rounded-lg hover:bg-gray-700 hover:text-white transition"
        >
          Login
        </Link>
      )
     }
        
      </div>

      {/* Footer Note */}
      <p className="mt-16 text-sm text-gray-400 text-center max-w-md">
        Lavio is powered by modern AI technology. Your conversations are private and secure.
      </p>
    </div>
  );
}
