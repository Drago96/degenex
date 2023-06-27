"use client";

import { MdTrendingDown } from "react-icons/md";

import Typography from "@/components/common/typography";

export default function Error() {
  return (
    <div className="flex flex-col items-center">
      <div className="text-error dark:text-error-dark">
        <MdTrendingDown size={300} />
      </div>
      <Typography className="text-3xl">Oops, something went wrong!</Typography>
    </div>
  );
}
