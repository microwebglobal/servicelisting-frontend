export default function AnimatedButton({ title, icon: Icon }) {
  return (
    <button className="px-8 py-3 bg-[#5f60b9]/10 font-semibold text-[#5f60b9] rounded-lg flex items-center gap-2 hover:bg-[#5f60b9] hover:text-white transition">
      {title}
      {Icon && <Icon className="w-5 h-5" />}
    </button>
  );
}
