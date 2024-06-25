'use client';

import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

type Props = {
  error?: FieldError;
  register: Partial<UseFormRegisterReturn>;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
};

export const Textarea = ({ error, register, label, placeholder, isRequired = false }: Props) => {
  return (
    <label className="flex flex-col gap-1">
      <div className="text-sm font-medium">
        {label}
        {isRequired && <span className="text-error">*</span>}
        {error && <span className="font-normal text-error"> {error.message}</span>}
      </div>
      <textarea
        {...register}
        rows={10}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-lg resize-none bg-secondary border-secondary placeholder:text-placeholder"
      />
    </label>
  );
};
