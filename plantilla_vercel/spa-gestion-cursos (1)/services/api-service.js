// Servicio centralizado para todas las operaciones de API
const apiService = {
  baseUrl: "http://localhost:3000",

  // Función genérica para realizar peticiones HTTP
  async realizarPeticion(endpoint, opciones = {}) {
    try {
      this.mostrarCargando(true)
      const respuesta = await fetch(`${this.baseUrl}${endpoint}`, opciones)

      if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`)
      }

      return await respuesta.json()
    } catch (error) {
      console.error(`Error en petición ${opciones.method || "GET"}:`, error)
      this.mostrarAlerta("Error en la operación", "error")
      throw error
    } finally {
      this.mostrarCargando(false)
    }
  },

  // Operación GET - Obtener datos del servidor
  async obtenerDatos(endpoint) {
    return await this.realizarPeticion(endpoint)
  },

  // Operación POST - Crear nuevos datos
  async crearDatos(endpoint, datos) {
    return await this.realizarPeticion(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
  },

  // Operación PUT - Actualizar datos existentes
  async actualizarDatos(endpoint, datos) {
    return await this.realizarPeticion(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
  },

  // Operación DELETE - Eliminar datos
  async eliminarDatos(endpoint) {
    return await this.realizarPeticion(endpoint, {
      method: "DELETE",
    })
  },

  // Mostrar indicador de carga
  mostrarCargando(mostrar) {
    const indicadorCarga = document.getElementById("loadingSpinner")
    if (mostrar) {
      indicadorCarga.classList.remove("hidden")
    } else {
      indicadorCarga.classList.add("hidden")
    }
  },

  // Mostrar alertas al usuario
  mostrarAlerta(mensaje, tipo = "success") {
    const alerta = document.createElement("div")
    alerta.className = `alert alert-${tipo}`
    alerta.textContent = mensaje

    const contenidoPrincipal = document.getElementById("mainContent")
    contenidoPrincipal.insertBefore(alerta, contenidoPrincipal.firstChild)

    // Eliminar alerta después de 3 segundos
    setTimeout(() => {
      if (alerta.parentNode) {
        alerta.parentNode.removeChild(alerta)
      }
    }, 3000)
  },
}
