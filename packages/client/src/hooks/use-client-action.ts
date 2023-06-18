import { useEffect, useState } from "react";

export const useClientAction = (action: () => void) => {
  const [shouldTriggerAction, setShouldTriggerAction] = useState(false);

  useEffect(() => {
    if (shouldTriggerAction) {
      action();

      setShouldTriggerAction(false);
    }
  }, [shouldTriggerAction, action]);

  return () => setShouldTriggerAction(true);
};
