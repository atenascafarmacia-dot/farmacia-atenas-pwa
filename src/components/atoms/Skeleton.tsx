interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div aria-hidden="true" className={`animate-pulse rounded-lg bg-zinc-200 ${className}`} />
  );
}
