type Props = {
  title: string;
  value: number | string;
  subtitle?: string;
};

export function StatCard({ title, value, subtitle }: Props) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
      {subtitle && <div className="mt-2 text-sm text-gray-600">{subtitle}</div>}
    </div>
  );
}