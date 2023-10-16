import { useMemo, useState as useStateGlobal } from "react";

export const useJsonString = (
  initialValue: any,
  {
    useState = useStateGlobal,
  }: { useState: <T>(initialV: T) => readonly [T, (v: T) => void] } = {
    useState: useStateGlobal,
  },
) => {
  const parseValue = (v: any) => {
    try {
      return { valid: true, value: JSON.parse(v) };
    } catch {
      return { valid: false };
    }
  };

  const [string, setString] = useState(JSON.stringify(initialValue));
  const valueInfo = useMemo(() => parseValue(string), [string]);
  const setValue = (newValue: any) => setString(JSON.stringify(newValue));
  return {
    string,
    setString,
    value: valueInfo.value ?? null,
    valid: valueInfo.valid,
    setValue,
  };
};
