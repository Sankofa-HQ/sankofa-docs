type Props = { size?: number };

export function SankofaMark({ size = 22 }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-icon.png"
      width={size}
      height={size}
      alt=""
      aria-hidden
      style={{
        display: "block",
        width: size,
        height: size,
        objectFit: "contain",
      }}
    />
  );
}
