import { cn } from "@/lib/utils";

export default function PageSection({ children, className }) {
  return (
    <section
      className={cn("py-16 md:py-20 px-8 flex justify-center", className)}
    >
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 justify-between items-center max-w-7xl py-2">
        {children}
      </div>
    </section>
  );
}
