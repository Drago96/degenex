import { useState } from "react";

export const useToggle = (
  defaultValue: boolean = false
): [toggleValue: boolean, toggle: () => void] => {
  const [toggleValue, setToggle] = useState(defaultValue);

  const toggle = () => setToggle((prevToggleValue) => !prevToggleValue);

  return [toggleValue, toggle];
};
