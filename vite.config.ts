import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig(() => {
  // const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // server: {
    //   host: '0.0.0.0',
    //   port: 5173, // atau port lain yang Anda gunakan
    // },
    // server: {
    //   proxy: {
    //     "/api": {
    //       target: env.VITE_API_URL,
    //       changeOrigin: true,
    //       secure: false,
    //       rewrite: (path) => path.replace(/^\/api/, ""),
    //     },
    //   }
    // }
  };
});
