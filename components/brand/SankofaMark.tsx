type Props = { size?: number };

export function SankofaMark({ size = 22 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M12 3 C7 3, 3 7, 3 12 C3 17, 7 21, 12 21 C15 21, 18 19, 19.5 16 L17 14.5 C16 16.5, 14 18, 12 18 C8.7 18, 6 15.3, 6 12 C6 8.7, 8.7 6, 12 6 C13.5 6, 14.8 6.5, 15.8 7.4 L13 10 L21 11 L20 3 L17.5 5.5 C16 4.2, 14 3, 12 3 Z"
        fill="var(--orange-500)"
      />
    </svg>
  );
}
