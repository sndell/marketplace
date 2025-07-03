"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DynamicMenu } from "@/components/form/DynamicMenu";
import { mainCategories, subcategories } from "@/features/listing/data/categoriesAndLocations";

type FilterDropdownProps = {
  label: string;
  selectedCategory: { primary: string; secondary: string };
  onCategoryChange: (option: { value: string; state: string }) => void;
};

export const FilterDropdown = ({ label, selectedCategory, onCategoryChange }: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleIsOpen = () => setIsOpen((prev) => !prev);

  // Handle clicks outside dropdown
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current?.contains(event.target as Node) ||
        dropdownRef.current?.contains(event.target as Node)
      ) return;
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Position dropdown relative to the button
  useEffect(() => {
    if (dropdownRef.current && buttonRef.current) {
      const { top, left, width } = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = dropdownRef.current.offsetWidth;
      dropdownRef.current.style.top = `${top + window.scrollY + 4}px`;
      dropdownRef.current.style.left = `${left + width / 2 - dropdownWidth / 2}px`;
    }
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleIsOpen}
        className="relative flex items-center gap-1 px-4 py-2 text-sm border cursor-pointer rounded-xl bg-background text-primary border-secondary"
      >
        {label}
        <motion.span
          className="icon-[solar--alt-arrow-down-linear]"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.15 }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <ContentPortal buttonRef={buttonRef} dropdownRef={dropdownRef}>
            <DynamicMenu
              options={[
                {
                  label: "Huvudkategori",
                  values: mainCategories.map((category) => ({
                    label: category.label,
                    value: category.value,
                  })),
                  state: "primary",
                },
                {
                  label: "Underkategori",
                  values: subcategories
                    .filter((category) => category.parent === selectedCategory.primary)
                    .map((category) => ({
                      label: category.label,
                      value: category.value,
                    })),
                  state: "secondary",
                },
              ]}
              selections={[selectedCategory.primary, selectedCategory.secondary]}
              onChange={(option) => {
                onCategoryChange(option); // Pass the option object as it is
              }}
            />
          </ContentPortal>
        )}
      </AnimatePresence>
    </>
  );
};

const ContentPortal = ({ buttonRef, dropdownRef, children }: any) =>
  createPortal(
    <motion.div
      ref={dropdownRef}
      className="absolute z-50 overflow-hidden border shadow-lg rounded-xl w-60 bg-background border-secondary"
      initial={{ height: 0 }}
      animate={{ height: "auto" }}
      exit={{ height: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className="p-3 space-y-3">{children}</div>
    </motion.div>,
    document.body
  );
