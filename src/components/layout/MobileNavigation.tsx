import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiHome,
  FiDroplet,
  FiAlertCircle,
  FiDollarSign,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <FiHome className="w-5 h-5" />,
    },
    {
      href: "/consumptions",
      label: "Consumos",
      icon: <FiDroplet className="w-5 h-5" />,
    },
    {
      href: "/penalties",
      label: "Multas",
      icon: <FiAlertCircle className="w-5 h-5" />,
    },
    {
      href: "/expenses",
      label: "Gastos Comunes",
      icon: <FiDollarSign className="w-5 h-5" />,
    },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <div className="bg-primary-600 text-white p-4 flex justify-between items-center lg:hidden">
        <Link href="/dashboard" className="font-bold text-xl">
          MiCaseta
        </Link>
        <button
          onClick={toggleMenu}
          className="p-2 focus:outline-none focus:ring-2 focus:ring-white rounded-md"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          {isOpen ? (
            <FiX className="w-6 h-6" />
          ) : (
            <FiMenu className="w-6 h-6" />
          )}
        </button>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      />

      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-white transform transition-transform lg:translate-x-0 lg:static lg:w-64 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center space-x-2 mb-8">
            <span className="text-2xl font-bold text-primary-600">
              MiCaseta
            </span>
          </Link>

          {user && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-sm text-gray-500">Bienvenido</p>
              <p className="font-medium">{`${user.name} ${user.lastname}`}</p>
            </div>
          )}

          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  isActive(link.href)
                    ? "bg-primary-50 text-primary-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={closeMenu}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}

            <button
              onClick={() => {
                closeMenu();
                logout();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Cerrar sesión</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Bottom mobile navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 lg:hidden z-40">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center p-2 ${
              isActive(link.href) ? "text-primary-600" : "text-gray-500"
            }`}
          >
            {link.icon}
            <span className="text-xs mt-1">{link.label}</span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default MobileNavigation;
