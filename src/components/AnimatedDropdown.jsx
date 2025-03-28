import { useState, useRef, useEffect, cloneElement } from 'react';
import { Button } from 'react-bootstrap';
import { AnimatePresence, motion as _motion } from 'framer-motion';
import '../css/AnimatedDropdown.css';

const AnimatedDropdown = ({
  trigger,        // custom trigger (JSX o función)
  icon,           // si no hay trigger, usa botón con icono
  variant = "secondary",
  className = "",
  show,
  onToggle,
  onMouseEnter,
  onMouseLeave,
  children
}) => {
  const isControlled = show !== undefined;
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const actualOpen = isControlled ? show : open;

  const toggle = () => {
    const newState = !actualOpen;
    if (!isControlled) setOpen(newState);
    onToggle?.(newState);
  };

  const closeDropdown = () => {
    if (!isControlled) setOpen(false);
    onToggle?.(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !triggerRef.current?.contains(e.target)
      ) {
        if (!isControlled) setOpen(false);
        onToggle?.(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isControlled, onToggle]);

  // Render del trigger (custom o botón)
  const triggerElement = trigger
    ? (typeof trigger === "function"
      ? trigger({ onClick: toggle, ref: triggerRef })
      : cloneElement(trigger, { onClick: toggle, ref: triggerRef }))
    : (
      <Button
        ref={triggerRef}
        variant={variant}
        className={`circle-btn ${className}`}
        onClick={toggle}
      >
        {icon}
      </Button>
    );

  return (
    <div
      className="position-relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {triggerElement}

      <AnimatePresence>
        {actualOpen && (
          <_motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 8, scale: 1 }}  // ← aquí y: 8 (equivale a 0.5rem)
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="custom-dropdown-menu"
          >
            {typeof children === "function" ? children({ closeDropdown }) : children}
          </_motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedDropdown;
