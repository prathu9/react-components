import { useState } from "react";

export const useModifiedUseState = () => {
  const [modified, setModified] = useState(false);

  const useModifiedState = <T>(initialValue: T) => {
    const [v, setV] = useState(initialValue);

    const newSetV = (newV: T) => {
      setModified(true);
      setV(newV);
    };

    return [v, newSetV] as const;
  };

  return { useModifiedState, modified, setModified };
};
