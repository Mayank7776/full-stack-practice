import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //  adding server proxy for smooth conneection between server and frontend
  server:{
   proxy: {
    '/api': 'http://localhost:4000',
   }
  },
})
