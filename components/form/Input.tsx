import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

type Props = {
  registration: UseFormRegisterReturn;
  errors?: FieldError;
  type?: 'text' | 'password' | 'number' | 'email';
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
};

export const Input = ({
  registration,
  errors,
  type = 'text',
  isRequired = false,
  label,
  placeholder,
}: Props) => {
  return (
    <label className="space-y-1">
      <div className="text-sm font-medium">
        {label}
        {isRequired && <span className="text-error">*</span>}
        {errors && (
          <span className="font-normal text-error"> {errors.message}</span>
        )}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        {...registration}
        className="w-full px-3 py-2 border bg-secondary rounded-xl border-secondary"
      />
    </label>
  );
};
