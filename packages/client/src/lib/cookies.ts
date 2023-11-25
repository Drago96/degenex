import { NextResponse } from "next/server";

export const cloneCookies = (from: NextResponse, to: NextResponse) => {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set({
      ...cookie,
    });
  });
};
