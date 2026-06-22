export default function StatCard({ title, value, icon }: any) {
  return (
    <div className="glass p-5 rounded-2xl flex items-center gap-4">
      
      {/* ICON */}
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-400 text-black text-xl">
        {icon}
      </div>

      {/* TEXT */}
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h2 className="text-xl font-bold text-yellow-400">{value}</h2>
      </div>

    </div>
  );
}
