import "@styles/globals.css";
import { Work_Sans } from "next/font/google";
import { ToastProvider } from "@components/ui/toast";
import { Toaster } from "@components/ui/toaster";
import { AuthProvider } from "@src/context/AuthContext";

const workSans = Work_Sans({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "",
  description: "",
};

const RootLayout = ({ children }) => (
  <html lang="en">
    <body className={workSans.className}>
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
