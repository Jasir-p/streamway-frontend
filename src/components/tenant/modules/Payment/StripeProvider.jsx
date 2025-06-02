import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripepromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripeProvider = ({children}) =>{
    return(
        <Elements stripe={stripepromise}>
            {children}
            </Elements>
            );
}

export default StripeProvider;