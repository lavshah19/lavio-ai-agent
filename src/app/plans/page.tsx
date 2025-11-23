"use client";

import { checkIfUserHasSubscription } from "@/action/subscription-action";
import SubscriptionBtn from "@/components/subscription/SubscriptionBtn";
import { useEffect, useState } from "react";

const SubscriptionPlan = () => {
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);

  const plans = [
    {
      name: "Basic",
      price: "Free",
      features: [
        "Limited AI prompts",
        "Basic analytics",
        "Access to essential tools",
        "Community support",
      ],
      highlight: false,
    },
    {
      name: "Pro",
      price: "Rs.999/month",
      features: [
        "Unlimited AI prompts",
        "Advanced analytics dashboard",
        "Premium AI tools",
        "Priority 24/7 support",
        "Early access to new features",
      ],
      highlight: true,
    },
  ];

  useEffect(() => {
    async function loadSubscription() {
      const result = await checkIfUserHasSubscription();
      setHasSubscription(result);
    }

    loadSubscription();
  }, []);

  return (
    <div className="h-[calc(100vh-69px)] bg-gray-900 text-gray-100 px-8 py-12">
      <h2 className="text-3xl font-bold text-center text-purple-400 mb-10">
        Choose Your Plan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`border rounded-2xl p-8 shadow-lg transition bg-gray-800 border-gray-700 hover:border-purple-500 hover:shadow-purple-500/20 ${
              plan.highlight && "border-purple-500 shadow-purple-500/20"
            }`}
          >
            <h3 className="text-2xl font-semibold mb-2 text-purple-300">
              {plan.name}
            </h3>

            <p className="text-xl font-bold text-gray-200 mb-4">
              {plan.price}
            </p>

            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, i) => (
                <li
                  key={i}
                  className="text-gray-300 text-sm flex items-center gap-2"
                >
                  • {feature}
                </li>
              ))}
            </ul>

            {plan.name === "Pro" && !hasSubscription && <SubscriptionBtn />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlan;
