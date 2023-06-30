import Image from "next/image";

import { getCurrentUser } from "@/services/users.service";
import ThemeSwitcher from "./theme-switcher";
import Link from "./ui/link";
import UserActions from "./users/user-actions";

export default async function Header() {
  const currentUser = await getCurrentUser();

  return (
    <header>
      <nav className="bg-primary px-4 py-4 dark:bg-primary-dark lg:px-8">
        <div className="mx-auto flex flex-wrap items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" alt="Degenex" width={150} height={80} />
          </Link>
          <div className="flex items-center gap-5">
            {!currentUser && (
              <>
                <Link href="/login">Log in</Link>
                <Link href="/register">Register</Link>
              </>
            )}
            {currentUser && (
              <>
                <UserActions />
              </>
            )}
            <ThemeSwitcher />
          </div>
        </div>
      </nav>
    </header>
  );
}
