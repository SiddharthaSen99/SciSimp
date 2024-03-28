"use client";
import React from "react";
import { Button } from "./ui/button";
import axios from "axios";

type Props = { isPro: boolean };

const SubscriptionButton = (props: Props) => {
  const [loading, setLoading] = React.useState(false);
  const handleSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
  disabled={loading}
  onClick={handleSubscription}
  className={`${loading ? 'bg-yellow-400' : 'bg-yellow-400 hover:bg-yellow-500'} text-black`}
>
  {props.isPro ? "Manage Subscriptions" : "Take my money!"}
</Button>

  );
};

export default SubscriptionButton;
