import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/* ============================================================
   ACCIONES ASÍNCRONAS (CONEXIÓN A MYSQL VÍA PROXY)
   ============================================================ */

// Obtener lista de países
export const obtenerPaisesAsync = createAsyncThunk(
  'caratula/obtenerPaises',
  async () => {
    const respuesta = await fetch('/api/paises');
    return await respuesta.json();
  }
);

// Obtener materias filtradas por país y nivel
export const obtenerMateriasAsync = createAsyncThunk(
  'caratula/obtenerMaterias',
  async ({ idPais, nivel }) => {
    const respuesta = await fetch(`/api/materias/${idPais}/${nivel}`);
    return await respuesta.json();
  }
);

// NUEVA: Obtener la ruta del arte IA para la materia elegida
export const obtenerArteAsync = createAsyncThunk(
  'caratula/obtenerArte',
  async (idMateria) => {
    const respuesta = await fetch(`/api/recurso/${idMateria}`);
    return await respuesta.json();
  }
);

/* ============================================================
   ESTADO INICIAL
   ============================================================ */
const estadoInicial = {
  datosEstudiante: {
    nombre: '',
    grado: '',
    institucion: '' 
  },
  paises: [],        
  materias: [],      
  materiaSeleccionada: 'Matemáticas',
  estiloVisual: 'kawaii', 
  paisSeleccionado: 1,    
  nivelSeleccionado: 'Básica',
  rutaImagen: null,      // Nuevo: Almacena la URL de la imagen IA
  cargando: false,       // General para materias
  cargandoArte: false    // Específico para la imagen
};

export const caratulaSlice = createSlice({
  name: 'caratula',
  initialState: estadoInicial,
  reducers: {
    actualizarDatos: (state, action) => {
      const { campo, valor } = action.payload;
      state.datosEstudiante[campo] = valor;
    },
    cambiarMateria: (state, action) => {
      state.materiaSeleccionada = action.payload;
    },
    cambiarEstilo: (state, action) => {
      state.estiloVisual = action.payload;
    },
    cambiarPais: (state, action) => {
      state.paisSeleccionado = action.payload;
    },
    cambiarNivel: (state, action) => {
      state.nivelSeleccionado = action.payload;
    }
  },
  /* ============================================================
     MANEJO DE RESPUESTAS DE LA BASE DE DATOS
     ============================================================ */
  extraReducers: (builder) => {
    builder
      // Carga de países
      .addCase(obtenerPaisesAsync.fulfilled, (state, action) => {
        state.paises = action.payload;
      })
      // Carga de materias
      .addCase(obtenerMateriasAsync.pending, (state) => {
        state.cargando = true;
      })
      .addCase(obtenerMateriasAsync.fulfilled, (state, action) => {
        state.materias = action.payload;
        state.cargando = false;
        if (action.payload.length > 0) {
          state.materiaSeleccionada = action.payload[0].NOMBRE_MATERIA;
        }
      })
      // Carga de Arte IA
      .addCase(obtenerArteAsync.pending, (state) => {
        state.cargandoArte = true;
      })
      .addCase(obtenerArteAsync.fulfilled, (state, action) => {
        // Guardamos la ruta que viene del campo RUTA_ARCHIVO de MySQL
        state.rutaImagen = action.payload.RUTA_ARCHIVO;
        state.cargandoArte = false;
      });
  }
});

export const { 
  actualizarDatos, 
  cambiarMateria, 
  cambiarEstilo, 
  cambiarPais, 
  cambiarNivel 
} = caratulaSlice.actions;

export default caratulaSlice.reducer;