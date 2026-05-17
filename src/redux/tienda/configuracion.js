import { configureStore } from '@reduxjs/toolkit';
// Aquí importaremos los reductores más adelante
import caratulaReductor from './rebanadas/caratulaSlice'; 

export const tienda = configureStore({
  reducer: {
    caratula: caratulaReductor,
  },
});