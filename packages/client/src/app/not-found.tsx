import { MdError } from "react-icons/md";

import Typography from "@/components/ui/typography";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-error dark:text-error-dark">
        <MdError size={300} />
      </div>
      <Typography className="text-center text-3xl">
        The page you are looking for does not exist.
      </Typography>
    </div>
  );
}
