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
    greeting: "Hola,",
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
    create: {
      invalid: "Los datos del pedido no son válidos.",
      notIdentified: "Debes identificarte antes de realizar un pedido.",
      productUnavailable: "Uno de los productos ya no está disponible.",
      insufficientStock: "No hay stock suficiente para uno de los productos.",
      failed: "No se pudo crear el pedido. Intenta de nuevo.",
    },
    receipt: {
      showAtCounter: "Muestra esto en el mostrador",
      orderCode: "Código del pedido",
      qrAlt: "Código QR del pedido",
      summary: "Resumen del pedido",
      total: "Total",
      backToCatalog: "Volver al catálogo",
      notFoundTitle: "Pedido no encontrado",
      notFoundMessage: "El pedido que buscas no existe o el código no es válido.",
    },
    status: {
      pending: "Pendiente",
      processing: "En proceso",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado",
    },
    // Maps OrderStatus enum values to their Spanish label.
    statusLabel: {
      PENDIENTE: "Pendiente",
      PROCESANDO: "En proceso",
      COMPLETADA: "Completada",
      CANCELADA: "Cancelada",
    },
  },

  operator: {
    title: "Operador",
    subtitle: "Recupera un pedido por su código.",
    codeLabel: "Código del pedido",
    codePlaceholder: "FARM-XXXXX",
    searchButton: "Buscar",
    notFound: "No existe ningún pedido con ese código.",
    customer: "Cliente",
    phone: "Teléfono",
    email: "Correo",
    items: "Productos",
    total: "Total",
    status: "Estado",
    complete: "Marcar como completada",
    completeError: "No se pudo actualizar el pedido. Intenta de nuevo.",
    alreadyCompleted: "Este pedido ya fue completado.",
  },

  nav: {
    catalog: "Catálogo",
    cart: "Carrito",
    operator: "Operador",
  },
} as const;
