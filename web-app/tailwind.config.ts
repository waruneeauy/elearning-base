import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        primary: "#02A998",
        secondary: "#f7f9fa",
        accent: "#3D3D3D",
      },
    },
  },
};
