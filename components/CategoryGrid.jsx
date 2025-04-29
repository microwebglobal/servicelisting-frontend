"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { useOutsideClick } from "@hooks/use-outside-click";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import Image from "next/image";

export function ExpandableCategory({ categories, cityName }) {
  const [active, setActive] = useState(null);
  const id = useId();
  const ref = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const handleSubCategoryClick = (subCategory) => {
    setActive(null);
    router.push(`/services/${cityName}/${active.slug}/${subCategory.slug}`);
  };

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.div
              layoutId={`card-${active.name}-${id}`}
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-lg overflow-hidden"
            >
              <div className="relative">
                <motion.button
                  key={`button-${active.name}-${id}`}
                  layout
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                    transition: {
                      duration: 0.05,
                    },
                  }}
                  className="flex absolute top-2 right-2 items-center justify-center bg-white rounded-full h-6 w-6 z-50 p-1"
                  onClick={() => setActive(null)}
                >
                  <X />
                </motion.button>

                <motion.div layoutId={`image-${active.title}-${id}`}>
                  {/* darkened overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                  <Image
                    src={process.env.NEXT_PUBLIC_API_ENDPOINT + active.icon_url}
                    alt={active.name}
                    width={500}
                    height={224}
                    className="w-full h-56 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                  />
                </motion.div>

                <motion.h3
                  layoutId={`title-${active.name}-${id}`}
                  className="font-semibold text-white text-2xl absolute bottom-0 p-4 z-20"
                >
                  {active.name}
                </motion.h3>
              </div>

              <div className="p-4">
                {active.SubCategories?.length ? (
                  <motion.div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                    {active.SubCategories?.map((sub, idx) => (
                      <motion.div
                        key={idx}
                        onClick={() => handleSubCategoryClick(sub)}
                        className="flex flex-col items-center cursor-pointer gap-2 text-center p-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 rounded-lg"
                      >
                        <div className="rounded-md w-12 h-12 sm:w-16 sm:h-16 overflow-hidden">
                          <img
                            src={
                              process.env.NEXT_PUBLIC_API_ENDPOINT +
                              sub.icon_url
                            }
                            alt={sub.name}
                            className=" object-cover object-center w-full h-full"
                            crossOrigin="anonymous"
                          />
                        </div>

                        <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          {sub.name}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <span className="block text-center w-full px-5 py-10 text-sm text-muted-foreground">
                    No services available for {active.name}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <ul className="max-w-2xl w-full grid grid-cols-3 gap-y-5 gap-x-3 py-4">
        {categories.map((card) => (
          <li key={card.name} className="list-none">
            <motion.div
              layoutId={`card-${card.name}-${id}`}
              onClick={() => setActive(card)}
            >
              <div className="w-full cursor-pointer text-xs flex flex-col items-center gap-3 text-center">
                <div className="bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 rounded-lg p-3 w-full flex justify-center">
                  <img
                    crossOrigin="anonymous"
                    src={`${process.env.NEXT_PUBLIC_API_ENDPOINT}${card.icon_url}`}
                    alt={card.title}
                    className="object-cover object-center aspect-square w-[54px] h-[54px] rounded-md"
                  />
                </div>

                {card.name}
              </div>
            </motion.div>
          </li>
        ))}
      </ul>
    </>
  );
}
