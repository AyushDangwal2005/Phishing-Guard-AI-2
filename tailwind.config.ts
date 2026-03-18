import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        pg: {
          blue: {
            50: "hsl(var(--blue-50))",
            100: "hsl(var(--blue-100))",
            600: "hsl(var(--blue-600))",
            700: "hsl(var(--blue-700))",
          },
          green: {
            50: "hsl(var(--green-50))",
            500: "hsl(var(--green-500))",
          },
          amber: {
            50: "hsl(var(--amber-50))",
            500: "hsl(var(--amber-500))",
          },
          red: {
            50: "hsl(var(--red-50))",
            500: "hsl(var(--red-500))",
          },
          gray: {
            50: "hsl(var(--gray-50))",
            100: "hsl(var(--gray-100))",
            200: "hsl(var(--gray-200))",
            500: "hsl(var(--gray-500))",
            700: "hsl(var(--gray-700))",
            900: "hsl(var(--gray-900))",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        "pg-card": "0 1px 3px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.07), 0 20px 48px rgba(0,0,0,0.04)",
        "pg-card-hover": "0 4px 8px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.1), 0 24px 56px rgba(0,0,0,0.06)",
        "pg-btn": "0 4px 14px rgba(37,99,235,0.35)",
        "pg-btn-hover": "0 6px 20px rgba(37,99,235,0.45)",
        "pg-nav": "0 1px 12px rgba(0,0,0,0.08)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
