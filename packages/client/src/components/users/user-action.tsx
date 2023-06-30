import { ReactNode } from "react";
import { IconType } from "react-icons/lib";

type UserActionProps = {
  icon: IconType;
  children: ReactNode;
};

export default function UserAction({ icon, children }: UserActionProps) {
  const UserActionIcon = icon;

  return (
    <span className="flex flex-row items-center gap-3 p-2">
      <span>
        <UserActionIcon />
      </span>
      <span>{children}</span>
    </span>
  );
}
