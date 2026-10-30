// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///D:/work/ui-smart/model-3d/chehl-digital-twin/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/work/ui-smart/model-3d/chehl-digital-twin/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/work/ui-smart/model-3d/chehl-digital-twin/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import stylelintPlugin from "file:///D:/work/ui-smart/model-3d/chehl-digital-twin/node_modules/vite-plugin-stylelint/dist/index.mjs";
import { visualizer } from "file:///D:/work/ui-smart/model-3d/chehl-digital-twin/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var __vite_injected_original_import_meta_url = "file:///D:/work/ui-smart/model-3d/chehl-digital-twin/vite.config.ts";
var vite_config_default = defineConfig({
  base: "./",
  build: {
    outDir: "./docs",
    rollupOptions: {
      output: {
        chunkFileNames: "js/[name]-[hash].js",
        // 引入文件名的名称
        entryFileNames: "js/[name]-[hash].js",
        // 包的入口文件名称
        assetFileNames: "[ext]/[name]-[hash].[ext]",
        // 资源文件像 字体，图片等
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        }
      }
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    stylelintPlugin({ fix: true }),
    visualizer({ open: true })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          // 'primary-6': '#009cdc',
          "border-radius-small": "0px",
          "border-radius-medium": "0px",
          "border-radius-large": "0px"
        },
        javascriptEnabled: true
      }
    }
  },
  server: {
    host: "0.0.0.0",
    port: 8090,
    open: true,
    proxy: {
      "/bridge": {
        // target: 'http://192.168.1.123:9990',
        // target: 'http://192.168.1.21:9990',
        target: "http://192.168.100.125:8081",
        changeOrigin: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx3b3JrXFxcXHVpLXNtYXJ0XFxcXG1vZGVsLTNkXFxcXGNoZWhsLWRpZ2l0YWwtdHdpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcd29ya1xcXFx1aS1zbWFydFxcXFxtb2RlbC0zZFxcXFxjaGVobC1kaWdpdGFsLXR3aW5cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L3dvcmsvdWktc21hcnQvbW9kZWwtM2QvY2hlaGwtZGlnaXRhbC10d2luL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXHJcbmltcG9ydCBzdHlsZWxpbnRQbHVnaW4gZnJvbSAndml0ZS1wbHVnaW4tc3R5bGVsaW50J1xyXG5cclxuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcidcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgYmFzZTogJy4vJyxcclxuICBidWlsZDoge1xyXG4gICAgb3V0RGlyOiAnLi9kb2NzJyxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdqcy9bbmFtZV0tW2hhc2hdLmpzJywgLy8gXHU1RjE1XHU1MTY1XHU2NTg3XHU0RUY2XHU1NDBEXHU3Njg0XHU1NDBEXHU3OUYwXHJcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdqcy9bbmFtZV0tW2hhc2hdLmpzJywgLy8gXHU1MzA1XHU3Njg0XHU1MTY1XHU1M0UzXHU2NTg3XHU0RUY2XHU1NDBEXHU3OUYwXHJcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdbZXh0XS9bbmFtZV0tW2hhc2hdLltleHRdJywgLy8gXHU4RDQ0XHU2RTkwXHU2NTg3XHU0RUY2XHU1MENGIFx1NUI1N1x1NEY1M1x1RkYwQ1x1NTZGRVx1NzI0N1x1N0I0OVxyXG4gICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xyXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3ZlbmRvcidcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZ1ZSgpLFxyXG4gICAgdnVlSnN4KCksXHJcbiAgICBzdHlsZWxpbnRQbHVnaW4oeyBmaXg6IHRydWUgfSksXHJcbiAgICB2aXN1YWxpemVyKHsgb3BlbjogdHJ1ZSB9KSxcclxuXHJcbiAgXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBjc3M6IHtcclxuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgbGVzczoge1xyXG4gICAgICAgIG1vZGlmeVZhcnM6IHtcclxuICAgICAgICAgIC8vICdwcmltYXJ5LTYnOiAnIzAwOWNkYycsXHJcbiAgICAgICAgICAnYm9yZGVyLXJhZGl1cy1zbWFsbCc6ICcwcHgnLFxyXG4gICAgICAgICAgJ2JvcmRlci1yYWRpdXMtbWVkaXVtJzogJzBweCcsXHJcbiAgICAgICAgICAnYm9yZGVyLXJhZGl1cy1sYXJnZSc6ICcwcHgnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiAnMC4wLjAuMCcsXHJcbiAgICBwb3J0OiA4MDkwLFxyXG4gICAgb3BlbjogdHJ1ZSxcclxuICAgIHByb3h5OiB7XHJcbiAgICAgICcvYnJpZGdlJzoge1xyXG4gICAgICAgIC8vIHRhcmdldDogJ2h0dHA6Ly8xOTIuMTY4LjEuMTIzOjk5OTAnLFxyXG4gICAgICAgIC8vIHRhcmdldDogJ2h0dHA6Ly8xOTIuMTY4LjEuMjE6OTk5MCcsXHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzE5Mi4xNjguMTAwLjEyNTo4MDgxJyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBZ1UsU0FBUyxlQUFlLFdBQVc7QUFDblcsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLHFCQUFxQjtBQUU1QixTQUFTLGtCQUFrQjtBQU44SyxJQUFNLDJDQUEyQztBQVMxUCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsRUFDTixPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixnQkFBZ0I7QUFBQTtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUE7QUFBQSxRQUNoQixhQUFhLElBQUk7QUFDZixjQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0IsbUJBQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsZ0JBQWdCLEVBQUUsS0FBSyxLQUFLLENBQUM7QUFBQSxJQUM3QixXQUFXLEVBQUUsTUFBTSxLQUFLLENBQUM7QUFBQSxFQUUzQjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUN0RDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILHFCQUFxQjtBQUFBLE1BQ25CLE1BQU07QUFBQSxRQUNKLFlBQVk7QUFBQTtBQUFBLFVBRVYsdUJBQXVCO0FBQUEsVUFDdkIsd0JBQXdCO0FBQUEsVUFDeEIsdUJBQXVCO0FBQUEsUUFDekI7QUFBQSxRQUNBLG1CQUFtQjtBQUFBLE1BQ3JCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFdBQVc7QUFBQTtBQUFBO0FBQUEsUUFHVCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsTUFDaEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
