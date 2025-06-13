/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // pastikan path ini sesuai struktur project-mu
    ],
    theme: {
      extend: {
        colors: {
          primary: "#B8860B",      // contoh warna custom
          secondary: "#ECCA9C",    // contoh warna custom
          brand: {
            light: "#FDE68A",
            DEFAULT: "#F59E42",
            dark: "#B45309",
          },
        },
      },
    },
    plugins: [
      require('@tailwindcss/line-clamp'),
      // ...
    ],
  }