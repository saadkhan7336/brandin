import React from 'react';
import { motion } from "framer-motion";
import { Star } from 'lucide-react';

const testimonials = [
  {
    text: "Brandly revolutionized our campaign operations, streamlining creator discovery and contract management. The platform keeps our team productive and scalable.",
    image: "/images/landing/Img_margin-1.png",
    name: "Briana Patton",
    role: "Operations Director at Acme",
  },
  {
    text: "Implementing Brandly was smooth and fast. The AI matching and intuitive interface made launching our creator campaigns completely effortless.",
    image: "/images/landing/img_margin-2.png",
    name: "Bilal Ahmed",
    role: "Head of Marketing",
  },
  {
    text: "The escrow payment security and instant messaging are exceptional. It gives both our brand and creator partners 100% peace of mind.",
    image: "/images/landing/Img_margin.png",
    name: "Saman Malik",
    role: "Influencer Lead",
  },
  {
    text: "Brandly's synergy score algorithm enhanced our conversion rates significantly. Highly recommended for high-growth DTC brands.",
    image: "/images/landing/Img_margin-1.png",
    name: "Omar Raza",
    role: "CEO at Pulse Brands",
  },
  {
    text: "Its robust analytics and real-time tracking have transformed our workflow, making our influencer ROI crystal clear.",
    image: "/images/landing/img_margin-2.png",
    name: "Zainab Hussain",
    role: "Campaign Manager",
  },
  {
    text: "The smooth platform experience exceeded our expectations. It streamlined negotiations and improved overall business performance.",
    image: "/images/landing/Img_margin.png",
    name: "Aliza Khan",
    role: "Digital Strategist",
  },
  {
    text: "Our creator partnerships expanded by 3x within two months of using Brandly. The automated workflows save us dozens of hours weekly.",
    image: "/images/landing/Img_margin-1.png",
    name: "Farhan Siddiqui",
    role: "Growth Lead",
  },
  {
    text: "They delivered an ecosystem that truly understands creator commerce, enhancing our reach across fashion and lifestyle markets.",
    image: "/images/landing/img_margin-2.png",
    name: "Sana Sheikh",
    role: "Brand Director",
  },
  {
    text: "Using Brandly, our campaign conversions improved by 140%. A must-have platform for modern e-commerce growth.",
    image: "/images/landing/Img_margin.png",
    name: "Hassan Ali",
    role: "E-commerce Manager",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn = ({ className = "", testimonials, duration = 15 }) => {
  return (
    <div className={className}>
      <motion.ul
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent list-none m-0 p-0"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {testimonials.map(({ text, image, name, role }, i) => (
                <motion.li
                  key={`${index}-${i}`}
                  aria-hidden={index === 1 ? "true" : "false"}
                  tabIndex={index === 1 ? -1 : 0}
                  whileHover={{
                    scale: 1.03,
                    y: -8,
                    boxShadow: "0 25px 50px -12px rgba(37, 99, 235, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  className="p-8 rounded-3xl border border-slate-200/80 shadow-md shadow-slate-900/5 w-full bg-white transition-all duration-300 cursor-default select-none group focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  <blockquote className="m-0 p-0">
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal m-0">
                      "{text}"
                    </p>
                    <footer className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-3">
                        <img
                          width={40}
                          height={40}
                          src={image}
                          alt={`Avatar of ${name}`}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-blue-500/30 transition-all duration-300 ease-in-out"
                        />
                        <div className="flex flex-col">
                          <cite className="font-bold text-xs sm:text-sm not-italic tracking-tight text-slate-900">
                            {name}
                          </cite>
                          <span className="text-xs text-slate-500 mt-0.5 font-medium">
                            {role}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-200/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        <span className="font-bold text-[11px] text-slate-800 tracking-tight">Brandly</span>
                      </div>
                    </footer>
                  </blockquote>
                </motion.li>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.ul>
    </div>
  );
};

export default function TestimonialV2() {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="bg-[#f8fafc] py-20 relative overflow-hidden border-t border-slate-200"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="max-w-[1440px] mx-auto px-6 sm:px-8 z-10"
      >
        <div className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-12 text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 mb-4">
            <Star className="w-3.5 h-3.5 fill-blue-600" /> Testimonials
          </div>

          <h2 id="testimonials-heading" className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Loved by Creators & Brands
          </h2>
          <p className="text-center mt-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-md">
            Discover how thousands of teams and creators streamline their commerce with Brandly.
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full mt-8 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[640px] overflow-hidden"
          role="region"
          aria-label="Scrolling Testimonials"
        >
          <TestimonialsColumn testimonials={firstColumn} duration={18} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={22} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={20} />
        </div>
      </motion.div>
    </section>
  );
}
