import Image from "next/image";

import AppLink from "./components/link";
import ThemeSwitcher from "./theme-switcher";

export default function Header() {
  return (
    <header>
      <nav className="border-gray-200 bg-white px-4 py-2.5 dark:bg-gray-800 lg:px-6">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between">
          <AppLink href="/">
            <Image src="/logo.png" alt="Degenex" width="150" height="80" />
          </AppLink>
          <div className="flex items-center lg:order-2">
            <AppLink href="/login">Log in</AppLink>
            <AppLink href="/register">Register</AppLink>
            <ThemeSwitcher />
          </div>
        </div>
      </nav>
    </header>
  );
}
