import LocationInitializer from "@/components/LocationInitializer";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";

export default async function HomeLayout({ children }) {
  const cookieStore = cookies();
  const city = cookieStore.get("current-location")?.value;

  return (
    <div>
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
