"use server";
import { auth } from "@/lib/auth";
import { generateEsewaSignature } from "@/lib/generateEsewaSignature";
import { prisma } from "@/lib/prisma";
import { error } from "console";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

interface EsewaConfig {
  amount: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
}

export async function subscriptionAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/auth");
  }
  try {
    const transactionUuid = `${Date.now()}-${uuidv4()}`;
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        plan: "pro",
        status: "pending",
        paymentId: transactionUuid,
        amount: 999,
        provider: "esewa",
      },
    });
    const esewaConfig: EsewaConfig = {
      amount: order.amount.toString(),
      tax_amount: "0",
      total_amount: order.amount.toString(),
      transaction_uuid: order.paymentId as string,
      product_code: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE!,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?transaction_uuid=${transactionUuid}`,
      failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/failure?transaction_uuid=${transactionUuid}`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };
    const signatureString = `total_amount=${esewaConfig.total_amount},transaction_uuid=${esewaConfig.transaction_uuid},product_code=${esewaConfig.product_code}`;
    const signature = generateEsewaSignature(
      process.env.ESEWA_SECRET_KEY!,
      signatureString
    );
    return {
      esewaConfig: {
        ...esewaConfig,
        signature,
      },
    };
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }
}

export async function verifySubscription(transaction_uuid: string) {
  if (!transaction_uuid) {
    return {
      message: "No transaction uuid",
      verified: false,
    };
  }
  try {
    const order = await prisma.order.findFirst({
      where: {
        paymentId: transaction_uuid,
      },
    });
    const statusUrl = `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE}&total_amount=${order?.amount}&transaction_uuid=${order?.paymentId}`;

    const res = await fetch(statusUrl);
    if (!res.ok) {
      return { message: "Failed to reach eSewa API", verified: false };
    }
    const data = await res.json();
    if (data.status === "COMPLETE") {
      await prisma.order.update({
        where: {
          id: order?.id,
        },
        data: {
          status: "completed",
        },
      });
      await prisma.subscription.create({
        data: {
          userId: order?.userId as string,
          plan: "pro",
          status: "active",
          startedAt: new Date(),
          expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
      });
      return { message: "Payment verified successfully", verified: true };
    }

    return { message: "Payment verification failed", verified: false };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      message: "Something went wrong",
      verified: false,
    };
  }
}



export async function checkIfUserHasSubscription() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return false;
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "active",
      },
    });

    if (!subscription) return false;

    
    if (subscription.expiresAt && subscription.expiresAt < new Date()) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false;
  }
}

