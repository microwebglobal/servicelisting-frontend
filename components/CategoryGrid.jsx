"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@hooks/use-outside-click";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";

export function ExpandableCategory({ categories, cityName }) {
  const [active, setActive] = useState(null);
  const id = useId();
  const ref = useRef(null);
  const router = useRouter();

  console.log(categories);

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

  const handleSubCategoryClick = (categorySlug, subCategorySlug) => {
    router.push(`/services/${cityName}/${categorySlug}/${subCategorySlug}`);
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
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            ></motion.button>

            <motion.div
              layoutId={`card-${active.name}-${id}`}
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-lg overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  crossOrigin="anonymous"
                  src={process.env.NEXT_PUBLIC_API_ENDPOINT + active.icon_url}
                  alt={active.name}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.name}-${id}`}
                      className="font-semibold text-neutral-700 dark:text-neutral-200 text-base"
                    >
                      {active.name}
                    </motion.h3>

                    <motion.div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                      {active.SubCategories?.map((sub, idx) => (
                        <motion.div
                          key={idx}
                          className="flex flex-col items-center cursor-pointer gap-2 text-center p-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 rounded-lg"
                          onClick={() =>
                            handleSubCategoryClick(active.slug, sub.slug)
                          }
                        >
                          <img
                            src={
                              process.env.NEXT_PUBLIC_API_ENDPOINT +
                              sub.icon_url
                            }
                            alt={sub.name}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                            crossOrigin="anonymous"
                          />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                            {sub.name}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <ul className="max-w-2xl mx-auto w-full items-start gap-4 flex">
        {categories.map((card, index) => (
          <motion.div
            layoutId={`card-${card.name}-${id}`}
            key={card.name}
            onClick={() => setActive(card)}
            className="py-4"
          >
            {/* <div className="flex gap-4 h-14 border text-center items-center w-full rounded-md overflow-hidden hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer">
              <motion.div
                layoutId={`image-${card.name}-${id}`}
                className="w-1/3"
              >
                <img
                  crossOrigin="anonymous"
                  src={process.env.NEXT_PUBLIC_API_ENDPOINT + card.icon_url}
                  alt={card.title}
                  className="object-cover object-center w-full h-full aspect-square border-r"
                />
              </motion.div>

              <div className="flex justify-center items-center flex-col">
                <motion.h3
                  layoutId={`title-${card.name}-${id}`}
                  className="text-sm font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                >
                  {card.name}
                </motion.h3>
              </div>
            </div> */}

            <Badge
              variant="secondary"
              className="cursor-pointer h-10 gap-2 pr-4"
            >
              <img
                crossOrigin="anonymous"
                src={process.env.NEXT_PUBLIC_API_ENDPOINT + card.icon_url}
                alt={card.title}
                className="object-cover object-center aspect-square w-7 h-7 rounded-full"
              />

              {card.name}
            </Badge>
          </motion.div>
        ))}
      </ul>
    </>
  );
}
