import { CreditCard } from "lucide-react";
import { paymentMix, totals } from "@/lib/data";

const RADIUS = 62;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

let cursor = 0;
const segments = paymentMix.map((payment) => {
  const length = (payment.share / 100) * CIRCUMFERENCE;
  const segment = {
    ...payment,
    dash: `${Math.max(length - 5, 0)} ${CIRCUMFERENCE}`,
    offset: -cursor,
  };
  cursor += length;
  return segment;
});

const ariaLabel = paymentMix
  .map((payment) => `${payment.label} ${payment.share}%`)
  .join(", ");

export function PaymentMix() {
  return (
    <section className="card-soft flex h-full flex-col p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[13px] font-semibold text-ink">Payment mix</h2>
        <span className="grid h-7 w-7 place-items-center rounded-lg border border-white/85 bg-white/60 text-brand/70">
          <CreditCard className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
        </span>
      </div>

      <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-5 sm:flex-row">
        <div className="donut-in relative h-[164px] w-[164px] shrink-0">
          <svg
            viewBox="0 0 160 160"
            role="img"
            aria-label={`Payment mix. ${ariaLabel}.`}
            className="h-full w-full -rotate-90"
          >
            <circle
              cx="80"
              cy="80"
              r={RADIUS}
              fill="none"
              stroke="#e8f0fa"
              strokeWidth="20"
            />
            {segments.map((segment) => (
              <circle
                key={segment.label}
                cx="80"
                cy="80"
                r={RADIUS}
                fill="none"
                stroke={segment.color}
                strokeWidth="20"
                strokeLinecap="round"
                strokeDasharray={segment.dash}
                strokeDashoffset={segment.offset}
              />
            ))}
          </svg>

          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="num text-[26px] font-semibold leading-none text-ink">
                {totals.transactions}
              </p>
              <p className="mt-1 text-[10px] text-muted">transactions</p>
            </div>
          </div>
        </div>

        <ul className="w-full min-w-0 space-y-3">
          {paymentMix.map((payment) => (
            <li key={payment.label} className="flex items-center gap-2.5">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: payment.color }}
                aria-hidden="true"
              />
              <span className="truncate text-[11.5px] text-ink/80">
                {payment.label}
              </span>
              <span className="num ml-auto text-[11.5px] font-semibold text-ink">
                {payment.share}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
