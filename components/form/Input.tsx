import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

type Props = {
  registration: UseFormRegisterReturn;
  errors?: FieldError;
  type?: 'text' | 'password' | 'number' | 'email';
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
};

export const Input = ({ registration, errors, type = 'text', isRequired = false, label, placeholder }: Props) => {
  return (
    <label className="space-y-1 text-sm h-fit">
      <div className="font-medium">
        {label}
        {isRequired && <span className="text-error">*</span>}
        {errors && <span className="text-error font-normal"> {errors.message}</span>}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        {...registration}
        className="w-full h-10 px-4 bg-secondary rounded-xl border border-secondary"
      />
    </label>
  );
};
