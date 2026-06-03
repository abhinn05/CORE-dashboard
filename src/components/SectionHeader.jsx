export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
        {subtitle}
      </p>
      <h1 className="text-4xl font-black text-white">
        {title}
      </h1>
    </div>
  );
}
