import { FieldValues, UseFormSetError, UseFormTrigger } from "react-hook-form";

import { FetchResponse } from "./app-fetch";

type CreateFormServerActionArgs<FormDataT, ActionResponseT = unknown> = {
  serverAction: (args: FormDataT) => Promise<FetchResponse<ActionResponseT>>;
  onSuccess?: (response: ActionResponseT, args: FormDataT) => Promise<unknown>;
  onError?: (error: string, args: FormDataT) => Promise<unknown>;
  validateForm?: UseFormTrigger<FieldValues>;
  setFormError?: UseFormSetError<FieldValues>;
};

export function createFormServerAction<FormDataT, ActionResponseT = unknown>({
  serverAction,
  onSuccess,
  onError,
  validateForm,
  setFormError,
}: CreateFormServerActionArgs<FormDataT, ActionResponseT>) {
  return async (rawFormData: FormData) => {
    if (validateForm) {
      const isFormValid = await validateForm();

      if (!isFormValid) {
        return;
      }
    }

    const formData = Object.fromEntries(rawFormData.entries()) as FormDataT;

    const result = await serverAction(formData);

    if (result.isSuccess) {
      if (onSuccess) {
        await onSuccess(result.data, formData);
      }
    } else {
      if (setFormError) {
        setFormError("root", { message: result.error });
      }

      if (onError) {
        await onError(result.error, formData);
      }
    }
  };
}
