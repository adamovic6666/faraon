import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Piši nam ili nas pozovi za sve informacije",
  description:
    "Treba ti pomoć oko online porudžbine ili te zanimaju cene? Faraon je tu za sva tvoja pitanja.",
};

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
