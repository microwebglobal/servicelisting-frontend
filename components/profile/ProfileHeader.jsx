import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CalendarPlus,
  SquareArrowOutUpRight,
  ChevronLeft,
  GalleryVerticalEnd,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function ProfileHeader() {
  const path = usePathname();
  const router = useRouter();

  const currentPage = path.split("/").pop();

  const pageTitle =
    currentPage === "customer"
      ? "Overview"
      : currentPage === "bookings"
      ? "Bookings"
      : currentPage === "notifications"
      ? "Notifications"
      : "";

  const showBackButton = currentPage !== "customer";

  return (
    <div className="w-full max-w-5xl flex items-center justify-between">
      <div className="flex items-center">
        {showBackButton && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="mr-2 [&_svg]:size-6"
          >
            <ChevronLeft />
          </Button>
        )}

        {pageTitle === "Overview" && (
          <GalleryVerticalEnd className="size-6 mr-3 ml-2" />
        )}
        <span className="text-2xl font-bold">{pageTitle}</span>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/services">
          <Button type="button" className="bg-[#5f60b9] hover:bg-[#5f60b9]/90">
            <CalendarPlus className="h-4 w-4" />
            Add new booking
          </Button>
        </Link>

        <Link href="/">
          <Button type="button" variant="outline">
            <SquareArrowOutUpRight className="h-4 w-4" />
            Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
