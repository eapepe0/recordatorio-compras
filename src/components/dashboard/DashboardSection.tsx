import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export function DashboardSection({ title, children }: Props) {
  return (
    <section className="rounded-xl bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}