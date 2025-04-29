import Image from "next/image";
import Link from "next/link";

export default function SubCategoryCard({ icon_url, name, url }) {
  return (
    <Link href={url}>
      <div className="w-56 h-56 relative rounded-md overflow-hidden group cursor-pointer group">
        <Image
          src={process.env.NEXT_PUBLIC_API_ENDPOINT + icon_url}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          priority
        />

        {/* Dark overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />

        <div className="absolute bottom-4 left-4 text-white font-medium text-sm z-10">
          {name}
        </div>
      </div>
    </Link>
  );
}
