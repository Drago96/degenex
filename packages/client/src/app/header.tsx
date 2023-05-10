import Image from "next/image";

import Link from "@/components/link";
import ThemeSwitcher from "./theme-switcher";

export default function Header() {
  return (
    <header>
      <nav className="border-gray-200 bg-primary px-4 py-2.5 dark:bg-primary-dark lg:px-6">
        <div className="mx-auto flex flex-wrap items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" alt="Degenex" width={150} height={80} />
          </Link>
          <div className="flex items-center lg:order-2">
            <Link href="/login">Log in</Link>
            <Link href="/register">Register</Link>
            <ThemeSwitcher />
          </div>
        </div>
      </nav>
    </header>
  );
}
