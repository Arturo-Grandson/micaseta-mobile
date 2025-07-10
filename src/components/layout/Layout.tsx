import { ReactNode } from "react";
import MobileNavigation from "./MobileNavigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <MobileNavigation />

      <main className="flex-1 p-4 pt-6 lg:p-8 lg:pl-72 pb-20">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
