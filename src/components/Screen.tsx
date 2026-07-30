"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Screen({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#08152F]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.3,
                y: 80,
                rotate: -15,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                rotate: 0,
              }}
              exit={{
                opacity: 0,
                scale: 1.8,
                rotate: 25,
                filter: "blur(15px)",
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
              }}
              className="flex flex-col items-center"
            >
              <Image
                src="/logo-dark.png"
                alt="Velmoor"
                width={250}
                height={250}
                priority
              />

              <motion.h1
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className=" text-4xl tracking-[8px] font-serif text-white"
              >
                VELMOOR
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-2 text-xs tracking-[5px] text-gray-300 uppercase"
              >
                Real estate marketing
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && children}
    </>
  );
}
