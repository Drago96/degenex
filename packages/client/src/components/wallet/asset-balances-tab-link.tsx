import { ReactNode } from "react";

import { AssetType } from "@prisma/client";
import Link from "../ui/link";
import classNames from "classnames";

type AssetBalancesTabProps = {
  active: boolean;
  assetType: AssetType;
  children: ReactNode;
};

export default function AssetBalancesTabLink({
  active,
  assetType,
  children,
}: AssetBalancesTabProps) {
  return (
    <li className="mr-2 min-w-[100px]">
      <Link
        href={`?assetType=${assetType}`}
        replace
        className={classNames(
          {
            "bg-primary": active,
            "dark:bg-primary-dark": active,
          },
          "inline-block w-full rounded-t-lg p-4 hover:bg-accent hover:dark:bg-accent-dark"
        )}
      >
        {children}
      </Link>
    </li>
  );
}
