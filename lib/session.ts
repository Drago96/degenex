import "server-only";

import { Session, unstable_getServerSession } from "next-auth";

import { authOptions } from "pages/api/auth/[...nextauth]";

export const getSession = async () => {
  return unstable_getServerSession<typeof authOptions, Session>(authOptions);
};
