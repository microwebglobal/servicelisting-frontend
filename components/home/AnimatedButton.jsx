export default function AnimatedButton({ title, icon: Icon }) {
  return (
    <button className="px-3 py-2 sm:px-5 sm:py-3 md:px-8 md:py-3 bg-[#5f60b9]/10 font-semibold text-[#5f60b9] text-sm sm:text-base rounded-lg flex items-center gap-2 hover:bg-[#5f60b9] hover:text-white transition">
      {title}
      {Icon && <Icon className="w-5 h-5" />}
    </button>
  );
}
