/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode, useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'motion/react';
import { X } from 'lucide-react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  key?: string | number;
  onClick?: () => void;
  whileHover?: any;
  whileTap?: any;
}

export function Card({ children, className, title, subtitle, icon, onClick, whileHover, whileTap }: CardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={whileHover}
      whileTap={whileTap}
      onClick={onClick}
      className={cn(
        "bg-white rounded-3xl p-6 shadow-sm border border-emerald-50/50",
        onClick && "cursor-pointer",
        className
      )}
    >
      {(title || icon) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && <h3 className="font-black text-emerald-900 text-lg uppercase tracking-tight">{title}</h3>}
            {subtitle && <p className="text-stone-400 text-xs font-medium">{subtitle}</p>}
          </div>
          {icon && <div className="text-emerald-500 bg-emerald-50 p-2 rounded-xl">{icon}</div>}
        </div>
      )}
      {children}
    </motion.div>
  );
}

export function Button({ children, className, variant = 'primary', ...props }: any) {
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95",
    secondary: "bg-white text-emerald-700 border-2 border-emerald-100 hover:bg-emerald-50 active:scale-95",
    danger: "bg-rose-500 text-white hover:bg-rose-600 active:scale-95",
    ghost: "bg-transparent text-emerald-700 hover:bg-emerald-50"
  };
  
  return (
    <button 
      className={cn(
        "px-6 py-3 rounded-2xl font-black text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant as keyof typeof variants],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({ children, className, variant = 'info' }: any) {
  const variants = {
    info: "bg-blue-50 text-blue-600",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    danger: "bg-rose-50 text-rose-600"
  };

  return (
    <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", variants[variant as keyof typeof variants], className)}>
      {children}
    </span>
  );
}

export function Modal({ isOpen, onClose, title, children }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] p-8 shadow-2xl border border-emerald-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-emerald-950 uppercase tracking-tighter">{title}</h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-stone-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-stone-400" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Counter({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    const controls = animate(count, value, { duration: 2, ease: "easeOut" });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}
