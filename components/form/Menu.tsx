import { cn } from '@/util/cn';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Control, FieldError, useController } from 'react-hook-form';
import { useOnClickOutside } from 'usehooks-ts';

type Props = {
  control: Control<any>;
  errors?: FieldError;
  label?: string;
  isLabelInner?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  name: string;
  options: {
    label: string;
    value: string;
  }[];
};

export const Menu = ({
  errors,
  isLabelInner = false,
  isRequired = false,
  isDisabled = false,
  name,
  options,
  label,
  placeholder,
  control,
}: Props) => {
  const {
    field: { onChange, value },
  } = useController({ name, control });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setIsMenuOpen(false));

  const handleClick = (value: string) => {
    onChange(value);
  };

  const getLabelByValue = (value: string) => {
    return options.find((option) => option.value === value)?.label;
  };

  useEffect(() => {
    if (!options.find((option) => option.value === value)) onChange('');
  }, [options]);

  return (
    <label className={cn(isDisabled && 'opacity-50')}>
      {!isLabelInner && (
        <div className="pt-1 text-sm font-medium">
          {label}
          {isRequired && <span className="text-error">*</span>}
          {errors && <span className="font-normal text-error"> {errors.message}</span>}
        </div>
      )}
      <button
        disabled={isDisabled}
        onClick={() => setIsMenuOpen((prev) => !prev)}
        type="button"
        ref={ref}
        className={cn(
          'relative flex items-center justify-between w-full p-2 text-sm border bg-secondary text-start rounded-xl border-secondary',
          isDisabled && 'cursor-not-allowed'
        )}
      >
        <div>
          {isLabelInner && label && (
            <div className="text-xs text-primaryLight">
              {label}
              {isRequired && <span className="text-error">*</span>}
            </div>
          )}
          {value ? getLabelByValue(value) : placeholder}
        </div>
        <motion.span animate={{ rotateZ: isMenuOpen ? -180 : 0 }} className="icon-[solar--alt-arrow-down-linear]" />
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ ease: 'easeInOut', duration: 0.1 }}
              className="absolute left-0 w-full z-10 overflow-hidden border top-[calc(100%+4px)] rounded-xl bg-secondary border-secondary"
            >
              <div className="flex flex-col">
                {options.map((option, index) => (
                  <div
                    onClick={() => handleClick(option.value)}
                    key={index}
                    className="px-3 py-2 transition-colors hover:bg-secondaryDark text-start"
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </label>
  );
};
