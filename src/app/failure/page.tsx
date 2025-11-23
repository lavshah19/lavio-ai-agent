"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FailurePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-red-50 text-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-red-700">Payment Failed ❌</h1>
      <p className="mb-6 text-gray-700">
        Unfortunately, your eSewa transaction did not complete successfully.<br />
        This might be due to cancellation, insufficient balance, or network error.
      </p>

      <div className="flex gap-4">
        <Link href="/">
          <Button>Try Again</Button>
        </Link>
        <Link href="/esewa-payment">
          <Button className="bg-red-600 hover:bg-red-700 text-white">Retry Payment</Button>
        </Link>
      </div>
    </div>
  );
}