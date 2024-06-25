'use client';

import { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

type Props = PropsWithChildren & {
  close: () => void;
  className?: string;
};

export const Modal = ({ close, className, children }: Props) => {
  return createPortal(
    <motion.div
      initial={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
      animate={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      exit={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
      onMouseDown={close}
      className="fixed inset-0 z-10 grid p-2 bg-black/30 place-items-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.1 }}
        onMouseDown={(e) => e.stopPropagation()}
        className={className}
      >
        {children}
      </motion.div>
    </motion.div>,
    document.body
  );
};
