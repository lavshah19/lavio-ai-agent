"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { verifySubscription } from "@/action/subscription-action";
import { useFileUpload } from "@/lib/hooks/useFileUpload";

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();

  // Extract just the UUID (in case the URL includes ?data=... after it)
  const transaction_uuid = params.get("transaction_uuid")?.split("?")[0] ?? null;

  const [status, setStatus] = useState("Waiting for verification...");
  const [verified, setVerified] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();
   const {setConversationId,conversationId} = useFileUpload();

  useEffect(() => {
    if (!transaction_uuid) return;

    startTransition(async () => {
      try {
        const result = await verifySubscription(transaction_uuid);
        if (result.verified) {
          setStatus(`Payment verified successfully `);
          setVerified(true);
        } else {
          router.push("/failure");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("Verification failed due to error ❌");
        setVerified(false);
      }
    });
  }, [transaction_uuid, router]);


  if (isPending || verified === null) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-green-50 text-center p-6">
        <p className="mb-6 text-lg text-gray-700">Verifying your payment …</p>
      </div>
    );
  }

if (verified) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50 text-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-green-700">
        Payment Success
      </h1>

      <p className="mb-6 text-lg text-gray-700">{status}</p>

      {conversationId ? (
        <Link href={`/chat/${conversationId}`}>
          <Button>Go to chat</Button>
        </Link>
      ) : (
        <Link href={`/`}>
          <Button>Go to home</Button>
        </Link>
      )}
    </div>
  );
}


 
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-red-50 text-center p-6">
      <p className="text-lg text-red-700">
        Something went wrong verifying the payment.
      </p>
      <Link href="/failure">
        <Button variant="destructive">Go to Failure Page</Button>
      </Link>
    </div>
  );
}