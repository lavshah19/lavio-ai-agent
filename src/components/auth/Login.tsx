// components/Login.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc"; // optional Google icon

export function Login() {
  const handelLogin = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-900 to-gray-800 px-4 min-w-full">
      <Card className="w-full max-w-sm bg-gray-800 text-gray-100 border border-gray-700 shadow-lg rounded-xl">
        <CardHeader className="px-6 pt-6">
          <CardTitle className="text-2xl text-purple-400 font-bold">
            Login to Your Account
          </CardTitle>
          <CardDescription className="text-gray-300 mt-1">
            Use your Google account to chat with Lavio
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 py-4">
          {/* Optional: Add custom login form fields here */}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 px-6 pb-6">
          <Button
          onClick={handelLogin}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white border-gray-600 hover:border-gray-500 transition rounded-lg"
          >
            <FcGoogle size={20} /> Login with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
