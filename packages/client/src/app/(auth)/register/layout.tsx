import { ReactNode } from "react";

import RegisterCredentialsProvider from "./register-credentials-provider";

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return <RegisterCredentialsProvider>{children}</RegisterCredentialsProvider>;
}
