"use client";

import { useState, useRef, useCallback } from "react";
import { useScroll, useMotionValueEvent, motion } from "framer-motion";
import { FilterDropdown } from "./FilterDropdown";
import { cn } from "@/util/cn";

export const FilterBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { scrollY } = useScroll();
  const scrollDistance = useRef(0);

  const VISIBILITY_THRESHOLD = 220;
  const SHOW_AGAIN_THRESHOLD = 300;

  const [selectedFilters, setSelectedFilters] = useState({
    search: "",
    category: { primary: "", secondary: "" },
    location: { region: "", municipality: "" },
    price: { min: 0, max: 0 },
  });

  // Scroll visibility toggle logic
  useMotionValueEvent(scrollY, "change", useCallback((latest) => {
    const prev = scrollY.getPrevious() || 0;
    const scrollingUp = prev > latest;

    if (scrollingUp) {
      scrollDistance.current += prev - latest;
      if (scrollDistance.current >= SHOW_AGAIN_THRESHOLD) setIsVisible(true);
    } else {
      scrollDistance.current = 0;
      if (latest > VISIBILITY_THRESHOLD) setIsVisible(false);
    }

    if (latest < VISIBILITY_THRESHOLD) setIsVisible(true);
  }, []));

  // Handle category change from dropdown
  const handleCategoryChange = (option: { value: string; state: string }) => {
    setSelectedFilters((prev) => ({
      ...prev,
      category: {
        ...prev.category,
        [option.state]: option.value,
      },
    }));
  };

  return (
    <div className="sticky right-0 z-50 mb-3 top-3 rounded-xl max-xs:hidden">
      {/* Header Bar */}
      <motion.div
        initial={{ borderRadius: "12px 12px 0 0" }}
        animate={{
          borderRadius: isVisible ? "12px 12px 0 0" : "12px",
        }}
        transition={{ delay: isVisible ? 0 : 0.25 }}
        className={cn("p-3 bg-primary-dark overflow-hidden", !isVisible && "bg-primary-dark/80 backdrop-blur-xl")}
      >
        Allting <span className="text-sm text-primary-light">20 Resultat</span>
      </motion.div>

      {/* Expandable Filter Content */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isVisible ? "auto" : 0 }}
        transition={{ duration: 0.25 }}
        className="absolute w-full overflow-hidden bg-primary/80 backdrop-blur-xl rounded-b-xl"
      >
        <div className="p-3 space-y-3">
          {/* Search and Category Filters */}
          <FilterSection title="Filter">
            <div className="flex gap-1">
              <SearchInput placeholder="Vad letar du efter?" />
              <FilterDropdown
                label="Kategori"
                selectedCategory={selectedFilters.category}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </FilterSection>

          {/* Active Filters */}
          <FilterSection title="Aktiva filter" count={3}>
            <div className="flex gap-1">
              <FilterTag label="Rensa" variant="accent" />
              <FilterTag label="Stationär Dator" />
              <FilterTag label="Södertälje" />
              <FilterTag label="250-600" />
            </div>
          </FilterSection>
        </div>
      </motion.div>
    </div>
  );
};

// Helper Components
const FilterSection = ({ title, children, count }: { title: string; children: React.ReactNode; count?: number }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-1 text-sm">
      {title} {count && <span className="text-sm text-primary-light">{count}</span>}
    </div>
    {children}
  </div>
);

const SearchInput = ({ placeholder }: { placeholder: string }) => (
  <div className="flex items-center px-3 rounded-xl bg-background">
    <input className="flex-1 w-full h-full text-sm outline-none" placeholder={placeholder} />
    <span className="icon-[solar--magnifer-linear]" />
  </div>
);

const FilterTag = ({ label, variant = "default" }: { label: string; variant?: "accent" | "default" }) => (
  <button
    className={cn(
      "flex items-center gap-1 px-3 py-1 text-sm border rounded-full cursor-pointer",
      variant === "accent" ? "bg-accent text-secondary border-accent" : "bg-background text-primary border-secondary"
    )}
  >
    {label} <span className="icon-[clarity--close-line]" />
  </button>
);
