export const strings = {
  common: {
    loading: "Cargando...",
    error: "Algo salió mal. Por favor intenta de nuevo.",
    empty: "No hay resultados.",
    retry: "Reintentar",
    cancel: "Cancelar",
    confirm: "Confirmar",
    save: "Guardar",
    delete: "Eliminar",
    edit: "Editar",
    back: "Volver",
    search: "Buscar",
    close: "Cerrar",
  },

  validation: {
    required: "Este campo es obligatorio.",
    invalidEmail: "Correo electrónico inválido.",
    invalidPhone: "Número de teléfono inválido.",
    minLength: (n: number) => `Mínimo ${n} caracteres.`,
    maxLength: (n: number) => `Máximo ${n} caracteres.`,
  },

  auth: {
    signIn: "Iniciar sesión",
    signOut: "Cerrar sesión",
    signUp: "Registrarse",
    email: "Correo electrónico",
    password: "Contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?",
    invalidCredentials: "Credenciales inválidas.",
  },

  cart: {
    title: "Carrito",
    empty: "Tu carrito está vacío.",
    addItem: "Agregar al carrito",
    removeItem: "Eliminar del carrito",
    checkout: "Proceder al pago",
    total: "Total",
    quantity: "Cantidad",
  },

  products: {
    title: "Productos",
    empty: "No se encontraron productos.",
    outOfStock: "Sin stock",
    addToCart: "Agregar",
    prescription: "Requiere receta médica",
    price: "Precio",
  },

  orders: {
    title: "Mis pedidos",
    empty: "No tienes pedidos aún.",
    status: {
      pending: "Pendiente",
      processing: "En proceso",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado",
    },
  },
} as const;
