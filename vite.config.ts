import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import { analyzer } from "vite-bundle-analyzer"
import Terminal from "vite-plugin-terminal"

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      jsxImportSource: mode === "development" ? "@welldone-software/why-did-you-render" : "react",
    }),
    tailwindcss(),
    analyzer(),
    Terminal(),
  ],
}))
