import LocationInitializer from "@/components/LocationInitializer";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { cookies } from "next/headers";

export default async function HomeLayout({ children }) {
  const cookieStore = await cookies();
  const city = cookieStore.get("current-location")?.value;

  return (
    <div className="min-h-screen flex flex-col">
      {!city ? (
        <LocationInitializer />
      ) : (
        <>
          <Navbar />
          {children}
          <Footer />
        </>
      )}
    </div>
  );
}
