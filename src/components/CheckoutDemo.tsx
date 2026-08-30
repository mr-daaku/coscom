"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronRight } from "lucide-react";

const coins = [
  { symbol: "BTC", name: "Bitcoin", color: "#F7931A", icon: "₿", rate: 67000, networkFee: 0.85 },
  { symbol: "ETH", name: "Ethereum", color: "#627EEA", icon: "Ξ", rate: 3400, networkFee: 2.50 },
  { symbol: "USDT", name: "Tether USD", color: "#26A17B", icon: "₮", rate: 1, networkFee: 0.50 },
  { symbol: "SOL", name: "Solana", color: "#9945FF", icon: "◎", rate: 180, networkFee: 0.01 },
  { symbol: "USDC", name: "USD Coin", color: "#2775CA", icon: "⃠", rate: 1, networkFee: 0.50 },
  { symbol: "TON", name: "Toncoin", color: "#0098EA", icon: "💎", rate: 6.5, networkFee: 0.02 },
];

const amountUSD = 249.00;
const orderId = "CMP-7842";
const cosmonpayFee = 0.004; // 0.4%

export default function CheckoutDemo() {
  const [selectedCoin, setSelectedCoin] = useState(coins[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate crypto amount
  const cryptoAmount = (amountUSD / selectedCoin.rate).toFixed(selectedCoin.symbol === "BTC" ? 8 : 4);
  const networkFee = selectedCoin.networkFee;
  const cosmonpayFeeAmount = (amountUSD * cosmonpayFee).toFixed(2);
  const totalUSD = (amountUSD + networkFee + parseFloat(cosmonpayFeeAmount)).toFixed(2);

  const handleCoinSelect = (coin: typeof coins[0]) => {
    setIsAnimating(true);
    setSelectedCoin(coin);
    setTimeout(() => setIsAnimating(false), 200);
  };

  return (
    <div className="relative" data-reveal>
      <div className="absolute -inset-8 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl rounded-full" />
      <div className="relative bg-card border border-border rounded-3xl p-6 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground font-mono">cosmonpay://checkout</div>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive" />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#e6b335" }} />
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          </div>
        </div>

        {/* Checkout Content */}
        <div className="bg-background/50 rounded-2xl p-6">
          {/* Order Info */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M9 8h4.5a2.5 2.5 0 0 1 0 5H9m0 0v3m0-3v-3m0 3v3" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Order #{orderId}</div>
              <div className="text-2xl font-bold font-fraunces">${amountUSD.toFixed(2)}</div>
            </div>
          </div>

          {/* Coin Selector */}
          <div className="mb-4">
            <label className="text-sm text-muted-foreground block mb-3">Select payment coin</label>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Select cryptocurrency">
              {coins.map((coin) => (
                <button
                  key={coin.symbol}
                  onClick={() => handleCoinSelect(coin)}
                  role="radio"
                  aria-checked={selectedCoin.symbol === coin.symbol}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    selectedCoin.symbol === coin.symbol
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-background border border-border hover:border-primary/50"
                  }`}
                  style={{
                    transform: isAnimating && selectedCoin.symbol === coin.symbol ? "scale(1.02)" : undefined,
                  }}
                >
                  {coin.symbol}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-background/60 rounded-xl p-4 border border-border mb-6">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground">{selectedCoin.symbol} amount</span>
              <span className="font-mono font-semibold text-lg">{cryptoAmount}</span>
            </div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground">Network fee</span>
              <span className="font-mono">~${networkFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground">CosMonPay fee</span>
              <span className="font-mono text-primary">{cosmonpayFeeAmount}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border mt-2">
              <span>Total</span>
              <span className="font-fraunces">${totalUSD}</span>
            </div>
          </div>

          {/* Pay Button */}
          <button
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:scale-[1.02] transition-transform active:scale-[0.98] text-base"
            disabled={isAnimating}
          >
            Pay now →
          </button>
        </div>
      </div>
    </div>
  );
}