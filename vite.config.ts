import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      jsxImportSource: mode === "development" ? "@welldone-software/why-did-you-render" : "react",
    }),
    tailwindcss(),
  ],
}))
