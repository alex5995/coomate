import Image from "next/image";

export function Logo() {
  return (
    <div className="brand" aria-label="CooMate">
      <span className="brand-mark" aria-hidden="true">
        <Image
          className="brand-logo-image"
          src="/coomate-logo.png"
          alt=""
          width={92}
          height={92}
          priority
        />
      </span>
      <span className="brand-name"><span>Coo</span>Mate</span>
    </div>
  );
}
