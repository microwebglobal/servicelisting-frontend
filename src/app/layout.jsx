import "@styles/globals.css";
import { Poppins } from "next/font/google";
import { ToastProvider } from "@components/ui/toast";
import { Toaster } from "@components/ui/toaster";
import { AuthProvider } from "@src/context/AuthContext";
import "react-datepicker/dist/react-datepicker.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "",
  description: "",
};

const RootLayout = ({ children }) => (
  <html lang="en">
    <body className={`${poppins.className} antialiased`}>
      <ToastProvider>
        <AuthProvider>
          <div className="main">
            <div className="gradient" />
          </div>

          <main className="app">
            {children}
            <Toaster />
          </main>
        </AuthProvider>
      </ToastProvider>
    </body>
  </html>
);

export default RootLayout;
