import { FieldValues, UseFormSetError, UseFormTrigger } from "react-hook-form";

type CreateFormServerActionArgs<FormDataT> = {
  serverAction: (args: FormDataT) => Promise<unknown>;
  onSuccess?: (args: FormDataT) => Promise<unknown>;
  validateForm?: UseFormTrigger<FieldValues>;
  setError?: UseFormSetError<FieldValues>;
};

export function createFormServerAction<FormDataT>({
  serverAction,
  onSuccess,
  validateForm,
  setError,
}: CreateFormServerActionArgs<FormDataT>) {
  return async (rawFormData: FormData) => {
    if (validateForm) {
      const isFormValid = await validateForm();

      if (!isFormValid) {
        return;
      }
    }

    const formData = Object.fromEntries(rawFormData.entries()) as FormDataT;

    try {
      await serverAction(formData);

      if (onSuccess) {
        await onSuccess(formData);
      }
    } catch (error) {
      if (error instanceof Error && setError) {
        setError("root", { message: "Internal server error" });
      }

      throw error;
    }
  };
}
