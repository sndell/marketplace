import React, { useEffect, useState } from 'react';
import { Control, useController } from 'react-hook-form';
import { Menu } from './Menu';

type Props = {
  control: Control<any>;
  options: {
    value: string;
    label: string;
    subcategories: {
      value: string;
      label: string;
    }[];
  }[];
  isRequired?: boolean;
  label?: string;
  first: {
    name: string;
    errors?: any;
    label?: string;
    placeholder?: string;
  };
  second: {
    name: string;
    errors?: any;
    label?: string;
    placeholder?: string;
  };
};

export const DualMenu = ({ control, first, options, second, label, isRequired = false }: Props) => {
  const {
    field: { value },
  } = useController({ name: first.name, control });

  const firstOptions = options.map((option) => ({ value: option.value, label: option.label }));
  const [secondOptions, setSecondOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const selectedOption = options.find((option) => option.value === value);
    setSecondOptions(selectedOption ? selectedOption.subcategories : []);
  }, [value, options]);

  const getError = (): string | undefined => {
    if (first.errors) return first.errors.message;
    else if (second.errors) return second.errors.message;
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
          options={firstOptions}
          label={first.label}
          placeholder={first.placeholder}
          isLabelInner
        />
        <Menu
          control={control}
          name={second.name}
          options={secondOptions}
          label={second.label}
          placeholder={second.placeholder}
          isDisabled={!value}
          isLabelInner
        />
      </div>
    </div>
  );
};
