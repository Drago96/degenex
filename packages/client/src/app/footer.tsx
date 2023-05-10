import moment from "moment";

export function Footer() {
  return (
    <div className="flex min-h-[50px] items-center justify-center bg-primary py-2.5 text-center text-xs text-primary-contrastText dark:bg-primary-dark dark:text-primary-contrastText-dark">
      Degenex &copy;{moment().get("year")}
    </div>
  );
}
