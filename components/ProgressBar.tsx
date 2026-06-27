"use client";

/**
 * Indeterminate progress indicator. We don't fake a percentage — generateObject
 * is a single round-trip — so this honestly signals "the model is working".
 * A future streamObject upgrade can turn this into real, fillable progress.
 */
export function ProgressBar() {
  return (
    <div className="h-[3px] w-full overflow-hidden rounded-full bg-border">
      <div className="indeterminate h-full w-1/3 rounded-full bg-foreground/70" />
      <style jsx>{`
        .indeterminate {
          animation: slide 1.1s ease-in-out infinite;
        }
        @keyframes slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .indeterminate {
            animation-duration: 2.2s;
          }
        }
      `}</style>
    </div>
  );
}
