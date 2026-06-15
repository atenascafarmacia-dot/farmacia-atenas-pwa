interface PriceProps {
  amount: number;
  currency?: string;
  className?: string;
}

export function Price({ amount, currency = "$", className = "" }: PriceProps) {
  return (
    <span className={`font-semibold tabular-nums ${className}`}>
      {currency}
      {amount.toFixed(2)}
    </span>
  );
}
