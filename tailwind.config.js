/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
      },
      keyframes: {
        'slide-in': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        'primary-blue': '#1E3A8A', // Deep blue
        'electric-blue': '#00AEEF', // Bright/electric blue
        'cyber-cyan': '#7DD3FC', // Light cyan
        'pearl-white': '#F8FAFC', // Off-white
        'navy-900': '#1E3A8A',
        'navy-800': '#1E40AF',
        'navy-700': '#1D4ED8',
        'navy-600': '#2563EB',
        'navy-500': '#3B82F6',
        BiruTerang: "#00AEEF",
        AbuAbu: "#F5F5F5",
        Cyan: "#C4EFFF",
        Biru: "#00AEEF",
        Gray: "#EBF1FF",
        GrayGelap: "#BDC4DE",
        Abu: "#F8F8F8",
      },
      boxShadow: {
        'super': '0 10px 20px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}

