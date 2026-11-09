import Image from "next/image";

/**
 * 3D render of the RWF coin stacks and glass ring, knocked out to true
 * transparency so the KPI glass (blur + tint + ambient) shows through
 * behind the art at every Glass level.
 *
 * `unoptimized`: the optimizer re-encodes to WebP and flattens the alpha
 * channel onto white, which paints an opaque box over the glass.
 */
export function CoinStack() {
  return (
    <div aria-hidden="true" className="relative h-full w-full">
      <Image
        src="/assets/net-sales-coins.png"
        alt=""
        fill
        priority
        unoptimized
        sizes="(min-width: 1280px) 340px, 42vw"
        className="object-contain object-right-bottom drop-shadow-[0_10px_18px_rgba(20,55,104,0.18)]"
      />
    </div>
  );
}

