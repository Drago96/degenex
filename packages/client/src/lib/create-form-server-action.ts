import { FieldValues, UseFormSetError, UseFormTrigger } from "react-hook-form";

import { FetchResponse } from "./app-fetch";

type CreateFormServerActionArgs<ActionInputT, ActionResponseT = unknown> = {
  serverAction: (args: ActionInputT) => Promise<FetchResponse<ActionResponseT>>;
  onSuccess?: (
    response: ActionResponseT,
    args: ActionInputT
  ) => Promise<unknown>;
  onError?: (error: string, args: ActionInputT) => Promise<unknown>;
  validateForm?: UseFormTrigger<FieldValues>;
  setFormError?: UseFormSetError<FieldValues>;
};

export function createFormServerAction<
  ActionInputT,
  ActionResponseT = unknown
>({
  serverAction,
  onSuccess,
  onError,
  validateForm,
  setFormError,
}: CreateFormServerActionArgs<ActionInputT, ActionResponseT>) {
  return async (rawActionInput: FormData | ActionInputT) => {
    if (validateForm) {
      const isFormValid = await validateForm();

      if (!isFormValid) {
        return;
      }
    }

    let actionInput: ActionInputT;

    if (rawActionInput instanceof FormData) {
      actionInput = Object.fromEntries(
        rawActionInput.entries()
      ) as ActionInputT;
    } else {
      actionInput = rawActionInput;
    }

    const result = await serverAction(actionInput);

    if (result.isSuccess) {
      if (onSuccess) {
        await onSuccess(result.data, actionInput);
      }
    } else {
      if (onError) {
        await onError(result.error, actionInput);
      }

      if (setFormError) {
        setFormError("root", { message: result.error });
      }
    }
  };
}
