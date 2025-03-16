import { cn } from "@/util/cn";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Control, FieldError, useController } from "react-hook-form";
import { useOnClickOutside } from "usehooks-ts";

type Props = {
  control: Control<any>;
  error?: FieldError;
  label?: string;
  isLabelInner?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  name: string;
  maxHeight?: number;
  options: {
    label: string;
    value: string;
  }[];
};

export const Menu = ({
  error,
  isLabelInner = false,
  isRequired = false,
  isDisabled = false,
  name,
  options,
  label,
  placeholder,
  control,
  maxHeight,
}: Props) => {
  const {
    field: { onChange, value },
  } = useController({ name, control });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const ref = useRef(null as unknown as HTMLButtonElement);
  useOnClickOutside(ref, () => setIsMenuOpen(false));

  const handleClick = (value: string) => {
    onChange(value);
  };

  const getLabelByValue = (value: string) => {
    return options.find((option) => option.value === value)?.label;
  };

  useEffect(() => {
    if (!options.find((option) => option.value === value)) onChange("");
  }, [options]);

  return (
    <label className={cn(isDisabled && "opacity-50")}>
      {!isLabelInner && (
        <div className="pt-1 text-sm font-medium">
          {label}
          {isRequired && <span className="text-error">*</span>}
          {error && <span className="font-normal text-error"> {error.message}</span>}
        </div>
      )}
      <button
        disabled={isDisabled}
        onClick={() => setIsMenuOpen((prev) => !prev)}
        type="button"
        ref={ref}
        className={cn(
          "relative flex items-center justify-between w-full px-3 py-2 border bg-secondary text-start rounded-xl border-secondary",
          isDisabled && "cursor-not-allowed"
        )}
      >
        <div>
          {isLabelInner && label && (
            <div className="text-sm text-primaryLight">
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
              initial={{ maxHeight: 0 }}
              animate={{
                maxHeight: maxHeight ? maxHeight : "auto",
              }}
              exit={{ maxHeight: 0 }}
              transition={{ ease: "easeInOut", duration: 0.1 }}
              className={cn(
                "absolute left-0 w-full z-10 overflow-y-auto border top-[calc(100%+4px)] rounded-xl bg-secondary shadow-lg border-secondary",
                maxHeight && `max-h-[${maxHeight}px]`
              )}
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
