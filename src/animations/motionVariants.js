const itemVariants = {
  hidden: { x: -40, opacity: 0 },
  visible: (index) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: index * 0.02,
    },
  }),
}

export { itemVariants }
