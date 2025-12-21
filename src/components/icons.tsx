import type { SVGProps } from "react";

export function WandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M13 19l-1-5-5-1 19-13-13 19" />
      <path d="M12.1 12.1l-1.4-1.4" />
      <path d="M3 21l3-3" />
      <path d="M16 3l3 3" />
      <path d="M20 16l1.5 1.5" />
      <path d="M20 20l2 2" />
      <path d="M2.5 7.5l1 1" />
      <path d="M4.5 13.5l1 1" />
    </svg>
  );
}

export function MagicBookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 3H7A2 2 0 0 0 5 5v14a2 2 0 0 0 2 2h13" />
      <path d="M17 3v18" />
      <path d="M12 12.5a2.5 2.5 0 0 0 0-5" />
      <path d="M12 7.5a2.5 2.5 0 0 1 0 5" />
      <path d="m10 8 2 4 2-4" />
    </svg>
  );
}
