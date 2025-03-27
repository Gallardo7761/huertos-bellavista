import { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { AnimatePresence, motion as _motion } from 'framer-motion';
import '../css/AnimatedDropdown.css';

const AnimatedDropdown = ({ icon, variant = "secondary", className = "", children }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="position-relative">
      <Button
        ref={btnRef}
        variant={variant}
        className={`circle-btn ${className}`}
        onClick={() => setOpen(prev => !prev)}
      >
        {icon}
      </Button>

      <AnimatePresence>
        {open && (
          <_motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="custom-dropdown-menu"
          >
            {children}
          </_motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedDropdown;
