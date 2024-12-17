import "@styles/globals.css";
import { Poppins, Work_Sans } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });
const workSans = Work_Sans({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "",
  description: "",
};

const RootLayout = ({ children }) => (
  <html lang="en">
    <body className={workSans.className}>
      <div className="main">
        <div className="gradient" />
      </div>

      <main className="app">{children}</main>
    </body>
  </html>
);

export default RootLayout;
