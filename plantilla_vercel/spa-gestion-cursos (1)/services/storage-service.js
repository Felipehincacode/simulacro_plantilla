// Servicio para manejo de almacenamiento local y de sesión
const almacenamientoService = {
  // Funciones para localStorage (datos persistentes)
  guardarEnLocal(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor))
    } catch (error) {
      console.error("Error guardando en localStorage:", error)
    }
  },

  obtenerDeLocal(clave) {
    try {
      const elemento = localStorage.getItem(clave)
      return elemento ? JSON.parse(elemento) : null
    } catch (error) {
      console.error("Error obteniendo de localStorage:", error)
      return null
    }
  },

  eliminarDeLocal(clave) {
    try {
      localStorage.removeItem(clave)
    } catch (error) {
      console.error("Error eliminando de localStorage:", error)
    }
  },

  // Funciones para sessionStorage (datos temporales)
  guardarEnSesion(clave, valor) {
    try {
      sessionStorage.setItem(clave, JSON.stringify(valor))
    } catch (error) {
      console.error("Error guardando en sessionStorage:", error)
    }
  },

  obtenerDeSesion(clave) {
    try {
      const elemento = sessionStorage.getItem(clave)
      return elemento ? JSON.parse(elemento) : null
    } catch (error) {
      console.error("Error obteniendo de sessionStorage:", error)
      return null
    }
  },

  eliminarDeSesion(clave) {
    try {
      sessionStorage.removeItem(clave)
    } catch (error) {
      console.error("Error eliminando de sessionStorage:", error)
    }
  },

  // Limpiar todo el almacenamiento
  limpiarTodoElAlmacenamiento() {
    localStorage.clear()
    sessionStorage.clear()
  },
}
