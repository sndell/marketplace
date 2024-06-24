import { Control, useController } from 'react-hook-form';
import { Menu } from './Menu';

type Props = {
  control: Control<any>;
  isRequired?: boolean;
  label?: string;
  maxHeight?: number;
  first: {
    name: string;
    error?: any;
    label?: string;
    placeholder?: string;
    options: {
      value: string;
      label: string;
    }[];
  };
  second: {
    name: string;
    error?: any;
    label?: string;
    placeholder?: string;
    options: {
      value: string;
      label: string;
      parent: string;
    }[];
  };
};

export const DualMenu = ({ control, first, second, label, isRequired = false, maxHeight }: Props) => {
  const {
    field: { value },
  } = useController({ name: first.name, control });

  const getError = (): string | undefined => {
    if (first.error) return first.error.message;
    else if (second.error) return second.error.message;
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="text-sm font-medium">
        {label}
        {isRequired && <span className="text-error">*</span>}
        {getError() && <span className="font-normal text-error"> {getError()}</span>}
      </div>
      <div className="flex flex-col gap-2">
        <Menu
          control={control}
          name={first.name}
          options={first.options}
          label={first.label}
          placeholder={first.placeholder}
          isLabelInner
          maxHeight={maxHeight}
        />
        <Menu
          control={control}
          name={second.name}
          options={second.options.filter((sub) => sub.parent === value) || []}
          label={second.label}
          placeholder={second.placeholder}
          isDisabled={!value}
          isLabelInner
          maxHeight={maxHeight}
        />
      </div>
    </div>
  );
};
