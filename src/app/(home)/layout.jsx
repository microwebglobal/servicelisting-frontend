import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function HomeLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
