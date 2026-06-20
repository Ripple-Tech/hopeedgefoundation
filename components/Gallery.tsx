"use client";

import { motion, useInView, cubicBezier } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.05, ease: cubicBezier(0.22, 1, 0.36, 1) },
  }),
};

function useScrollIn() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return { ref, inView };
}

// Just add or remove entries here, drop matching files in /public
const GALLERY_PHOTOS = [
  { src: "/rig1.jpg", alt: "RKGEF visitation" },
  { src: "/rig2.jpg", alt: "RKGEF visitation" },
  { src: "/rig3.jpg", alt: "RKGEF visitation" },
  { src: "/rig4.jpg", alt: "RKGEF visitation" },
  { src: "/rig5.jpg", alt: "RKGEF visitation" },
  { src: "/rig6.jpg", alt: "RKGEF visitation" },
  { src: "/rig7.jpg", alt: "RKGEF visitation" },
  { src: "/rig8.jpg", alt: "RKGEF visitation" },
  { src: "/rig9.jpg", alt: "RKGEF visitation" },
  { src: "/rig10.jpg", alt: "RKGEF visitation" },
  { src: "/rig11.jpg", alt: "RKGEF visitation" },
  { src: "/rig12.jpg", alt: "RKGEF visitation" },
  { src: "/rig13.jpg", alt: "RKGEF visitation" },
  { src: "/rig14.jpg", alt: "RKGEF visitation" },
  { src: "/rig15.jpg", alt: "RKGEF visitation" },
   { src: "/rig16.jpg", alt: "RKGEF visitation" },
  { src: "/rig17.jpg", alt: "RKGEF visitation" },
  { src: "/rig18.jpg", alt: "RKGEF visitation" },
  { src: "/rig19.jpg", alt: "RKGEF visitation" },
  { src: "/rig20.jpg", alt: "RKGEF visitation" },
];

export default function VisitationsGallery() {
  const { ref, inView } = useScrollIn();

  return (
    <section id="gallery" className="py-24 theme-section-alt">
      <div ref={ref} className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          custom={0}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          {GALLERY_PHOTOS.map((photo, i) => (
            <motion.div
              key={photo.src}
              variants={fadeUp}
              custom={i}
              className="relative aspect-square overflow-hidden rounded-2xl theme-card-border"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}