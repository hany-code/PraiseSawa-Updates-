module.exports = {
  mode: "jit", // Just-in-Time compiler mode for faster builds in development and production
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"], // Purge unused styles in production
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      scrollbar: {
        width: '8px',
        track: 'bg-gray-200',
        thumb: 'bg-gray-500',
        hover: 'bg-gray-700',
      },
    },
  },
  plugins: [
    // Add any additional plugins here
  ],
};
