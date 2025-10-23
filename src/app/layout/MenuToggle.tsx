/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { motion } from "framer-motion";

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="2"
    // stroke="hsl(233.33333333333334, 87.0967741935484%, 30.392156862745097%)"
    // stroke="#2364aa"
    stroke="#fff"
    strokeLinecap="round"
    {...props}
  />
);
interface Prop {
  toggle: () => void;
}
export const MenuToggle = ({ toggle }: Prop) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={toggle}
    className="absolute top-6 left-5.5 z-[100] grid place-items-center rounded-full bg-primary-900 h-10 w-10"
  >
    <svg width="20" height="20" viewBox="0 0 23 23" className="m-2 mb-1">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </svg>
  </motion.button>
);
