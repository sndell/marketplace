"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/util/cn";

type MenuOption = {
  label: string;
  values: {
    label: string;
    value: string;
  }[];
  state: string;
};

type Props = {
  options: MenuOption[];
  selections: string[];
  onChange: (option: { value: string; state: string }) => void;
};

export const DynamicMenu = ({ options, selections, onChange }: Props) => {
  const [step, setStep] = useState<"main" | "sub">("main");

  const handleSelect = (state: string, value: string) => {
    onChange({ value, state });
    if (state === "primary") setStep("sub");
  };

  const handleBack = () => setStep("main");

  return (
    <AnimatePresence mode="wait">
      {step === "main" && (
        <motion.div
          key="main"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col gap-1"
        >
          {options[0].values.map((item) => (
            <button
              key={item.value}
              onClick={() => handleSelect(options[0].state, item.value)}
              className={cn(
                "flex items-center justify-between px-3 py-2 text-left rounded-md hover:bg-zinc-200 transition",
                selections[0] === item.value && "bg-zinc-200 font-medium"
              )}
            >
              {item.label}
              <span className="icon-[solar--alt-arrow-right-linear]" />
            </button>
          ))}
        </motion.div>
      )}

      {step === "sub" && (
        <motion.div
          key="sub"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col gap-1"
        >
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-sm text-primary-light hover:underline"
          >
            <span className="icon-[solar--arrow-left-linear]" />
            Tillbaka
          </button>

          {options[1].values.map((item) => (
            <button
              key={item.value}
              onClick={() => handleSelect(options[1].state, item.value)}
              className={cn(
                "flex items-center justify-between px-3 py-2 text-left rounded-md hover:bg-zinc-200 transition",
                selections[1] === item.value && "bg-zinc-200 font-medium"
              )}
            >
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
