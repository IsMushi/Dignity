import Image from "next/image";

/**
 * Supplied 3D render of the glass wallet with the Bank of Kigali note and a
 * 100 FRW coin. White backdrop is knocked out visually with multiply.
 */
export function CreditArt() {
  return (
    <div aria-hidden="true" className="relative h-full w-full">
      <Image
        src="/assets/customer-credit-wallet.png"
        alt=""
        fill
        sizes="(min-width: 1280px) 340px, 42vw"
        className="object-contain object-right-bottom mix-blend-multiply"
      />
    </div>
  );
}

