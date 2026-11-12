import Image from "next/image";

/**
 * 3D render of the glass wallet with the Bank of Kigali note and the
 * 100 FRW coin, knocked out to true transparency so the KPI glass
 * shows through at every Glass level.
 *
 * `unoptimized`: the optimizer re-encodes to WebP and flattens the alpha
 * channel onto white, which paints an opaque box over the glass.
 */
export function CreditArt() {
  return (
    <div aria-hidden="true" className="relative h-full w-full">
      <Image
        src="/assets/customer-credit-wallet.png"
        alt=""
        fill
        priority
        unoptimized
        sizes="(min-width: 1280px) 340px, 42vw"
        className="object-contain object-right-bottom"
      />
    </div>
  );
}

