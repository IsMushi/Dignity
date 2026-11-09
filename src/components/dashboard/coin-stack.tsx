import Image from "next/image";

/**
 * Supplied 3D render of the RWF coin stacks and glass ring. The render ships
 * on a plain white backdrop, so `mix-blend-multiply` lets the card gradient
 * show through instead of painting a white box.
 */
export function CoinStack() {
  return (
    <div aria-hidden="true" className="relative h-full w-full">
      <Image
        src="/assets/net-sales-coins.png"
        alt=""
        fill
        priority
        sizes="(min-width: 1280px) 340px, 42vw"
        className="object-contain object-right-bottom mix-blend-multiply"
      />
    </div>
  );
}

