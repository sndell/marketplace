import React, { useEffect, useState } from 'react';
import { Control, useController } from 'react-hook-form';
import { Menu } from './Menu';

type Props = {
  control: Control<any>;
  isRequired?: boolean;
  label?: string;
  first: {
    name: string;
    errors?: any;
    label?: string;
    placeholder?: string;
    options: {
      value: string;
      label: string;
    }[];
  };
  second: {
    name: string;
    errors?: any;
    label?: string;
    placeholder?: string;
    options: {
      value: string;
      label: string;
      parent: string;
    }[];
  };
};

export const DualMenu = ({ control, first, second, label, isRequired = false }: Props) => {
  const {
    field: { value },
  } = useController({ name: first.name, control });

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
          options={first.options}
          label={first.label}
          placeholder={first.placeholder}
          isLabelInner
        />
        <Menu
          control={control}
          name={second.name}
          options={second.options.filter((sub) => sub.parent === value) || []}
          label={second.label}
          placeholder={second.placeholder}
          isDisabled={!value}
          isLabelInner
        />
      </div>
    </div>
  );
};
