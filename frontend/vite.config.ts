import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default defineConfig({
    // plugins: [vue()],
    plugins: [react()],
    server: {
      host: true,
      // port: 5173
    },
    // preview: {
    //     host: true,
    //     port: 8000
    // }
})