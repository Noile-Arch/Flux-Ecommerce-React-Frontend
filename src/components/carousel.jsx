import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    title: "Welcome to FLux",
    subtitle: "Your one-stop shop for everything!",
    image: "/headphone.jpg",
  },
  {
    id: 2,
    title: "Exclusive Deals",
    subtitle: "Shop now and save big!",
    image: "/phone.jpg",
  },
  {
    id: 3,
    title: "Quality Products",
    subtitle: "Top-rated items just for you!",
    image: "/shoes.jpg",
  },
];

const ProductCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[80vh] bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {slides.map((slide, index) =>
          index === currentIndex ? (
            <motion.div
              key={slide.id}
              className="absolute inset-0 flex items-center justify-center bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7 }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70 z-10"></div>
              <motion.div 
                className="text-white flex-col flex justify-center items-center absolute inset-0 z-20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-6xl font-bold tracking-tight">{slide.title}</h1>
                <p className="mt-4 text-xl font-light">{slide.subtitle}</p>
                <button className="mt-8 px-8 py-3 bg-white text-black rounded-full hover:bg-opacity-90 transition-all">
                  Shop Now
                </button>
              </motion.div>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>
      
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-white scale-100" : "bg-white/50 scale-75"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
