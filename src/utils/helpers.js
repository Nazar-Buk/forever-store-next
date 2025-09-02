export const scrollToSection = (ref) => {
  if (ref) {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }
};
