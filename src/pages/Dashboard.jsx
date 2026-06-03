// Dashboard.jsx is deprecated in favor of the primary Command Center and AI Summary views.
// The MarketSummary page now serves as the active overview destination for intelligence-driven summary output.

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#05070d] p-8 text-gray-300">
      <div className="max-w-3xl rounded-[28px] bg-[#0a0f18] border border-white/[0.05] p-10">
        <h1 className="text-3xl font-black text-white">Deprecated Page</h1>
        <p className="mt-4 text-gray-400 leading-relaxed">
          The legacy Dashboard page has been deprecated. Use the Command Center or AI Summary tabs for the primary overview experience.
        </p>
      </div>
    </div>
  );
}
