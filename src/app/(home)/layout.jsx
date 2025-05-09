import Footer from "@/components/layout/Footer";
import HomeNavbar from "@/components/layout/HomeNavbar";

export default function HomeLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeNavbar />
      {children}
      <Footer />
    </div>
  );
}
