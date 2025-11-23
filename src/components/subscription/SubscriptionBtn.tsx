"use client";
import { subscriptionAction } from '@/action/subscription-action';
import React from 'react'
import { Button } from '../ui/button';

const SubscriptionBtn = () => {

     async function handlePurchase(e: React.FormEvent) {
    e.preventDefault();

    const { esewaConfig } = await subscriptionAction();
    if (!esewaConfig) return;

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    for (const [k, v] of Object.entries(esewaConfig)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = k;
      input.value = String(v);
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  }
  return (
    <form onSubmit={handlePurchase}>
      <Button type="submit" className="w-full bg-black text-white h-12">
        Purchase Now
      </Button>
    </form>
  )
}

export default SubscriptionBtn