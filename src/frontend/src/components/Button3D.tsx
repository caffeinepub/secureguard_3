import { motion } from "motion/react";
import type { ReactNode } from "react";

interface Button3DProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function Button3D({
  children,
  className,
  onClick,
  disabled,
  style,
}: Button3DProps) {
  return (
    <motion.div
      whileHover={
        disabled ? {} : { scale: 1.04, rotateX: -4, translateZ: 6, y: -1 }
      }
      whileTap={
        disabled ? {} : { scale: 0.96, rotateX: 4, translateZ: -3, y: 1 }
      }
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 400,
        display: "inline-block",
        ...style,
      }}
      className={className}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </motion.div>
  );
}
