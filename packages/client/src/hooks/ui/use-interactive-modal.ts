import { useEffect } from "react";

export const useInteractiveModal = () => {
  useEffect(() => {
    const element = document.getElementById("headlessui-portal-root");

    if (element?.parentElement) {
      element.parentElement.inert = false;
    }
  }, []);
};
