"use client";

import { MdTrendingDown } from "react-icons/md";

import Typography from "@/components/ui/typography";
import Button from "@/components/ui/button";

type ErrorProps = {
  reset: () => void;
};

export default function Error({ reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-error dark:text-error-dark">
        <MdTrendingDown size={300} />
      </div>
      <Typography className="text-center text-3xl">
        Oops, something went wrong!
      </Typography>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
