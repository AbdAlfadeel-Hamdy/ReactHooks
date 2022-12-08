import { useCallback, useReducer } from "react";
const initialState = {
  isLoading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};
const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        isLoading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case "RESPONSE":
      return {
        ...curHttpState,
        isLoading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case "ERROR":
      return { isLoading: false, error: action.errorMessage };
    case "CLEAR":
      return initialState;
    default:
      throw new Error(`Should not reach here!`);
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);
  const clear = useCallback(() => dispatchHttp({ type: "CLEAR" }), []);
  const sendRequest = useCallback(
    async (url, method, body, reqExtra, identifier) => {
      try {
        dispatchHttp({ type: "SEND", identifier });
        const response = await fetch(url, {
          method,
          body,
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        dispatchHttp({ type: "RESPONSE", responseData: data, extra: reqExtra });
      } catch (error) {
        dispatchHttp({ type: "ERROR", errorMessage: `Something went wrong!` });
      }
    },
    []
  );

  return {
    isLoading: httpState.isLoading,
    error: httpState.error,
    data: httpState.data,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    sendRequest,
    clear,
  };
};
export default useHttp;
