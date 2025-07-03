import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

type Props = {
  registation: Partial<UseFormRegisterReturn>;
  placeholder?: string;
  label?: string | React.ReactNode;
  error?: FieldError;
};

export const Checkbox = ({ registation, error, label }: Props) => {
  return (
    <div className="flex items-center flex-col">
      <label className="flex items-center gap-2 justify-center">
        <div className="relative h-5 w-5 grid place-content-center">
          <input
            type="checkbox"
            {...registation}
            className="peer border border-secondary w-full absolute h-full appearance-none bg-secondary cursor-pointer rounded-[4px] checked:bg-accent"
          />

          <span className="aboslute icon-[clarity--check-line] text-sm hidden peer-checked:block text-white" />
        </div>
        {label}
      </label>
      {error && <div className="text-error text-sm">{error.message}</div>}
    </div>
  );
};
