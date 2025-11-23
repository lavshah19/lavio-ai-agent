import { checkIfUserHasSubscription } from "@/action/subscription-action";
import { prisma } from "../prisma";

export async function checkUserSubscriptionAndTrial(userId: string) {
  const hasSubscription = await checkIfUserHasSubscription();

  if (hasSubscription) {
    return { success: true };
  }

  console.log("user has no subscription");

  const trialCount = await prisma.user.findUnique({
    where: { id: userId },
    select: { trialCount: true },
  });

  if (trialCount?.trialCount === 0) {
    console.log("user has no trial count");
    return {
      success: false,
      message: "You have reached your trial limit",
      AIMessage: null,
    };
  }

  return { success: true };
}
