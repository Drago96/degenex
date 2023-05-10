import { FieldValues, UseFormSetError, UseFormTrigger } from 'react-hook-form';

type CreateFormServerActionArgs<FormDataT> = {
  action: (args: FormDataT) => Promise<any>;
  validateForm?: UseFormTrigger<FieldValues>;
  setError?: UseFormSetError<FieldValues>;
};

export function createFormServerAction<FormDataT>({
  action,
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

    const formData = Object.entries(rawFormData.entries()) as FormDataT;

    try {
      await action(formData);
    } catch (error) {
      if (error instanceof Error && setError) {
        setError('root', { message: 'Internal server error' });
      }
    }
  };
}
