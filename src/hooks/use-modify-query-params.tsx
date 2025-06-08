import { useCallback } from "react";
import { useSearchParams } from "react-router";

type ParamsActionType = "append" | "delete" | "set";

const useModifyQueryParams = () => {
  const [searchParams] = useSearchParams();

  const modifyParams = useCallback(
    (action: ParamsActionType, key: string, value: string = "true") => {
      const params = new URLSearchParams(searchParams);

      switch (action) {
        case "append":
          params.append(key, value);
          break;
        case "delete":
          params.delete(key);
          break;
        case "set":
          params.set(key, value);
          break;
      }

      // Return the updated URL as a string
      return params.toString();
    },
    [searchParams]
  );

  return { modifyParams };
};

export default useModifyQueryParams;
