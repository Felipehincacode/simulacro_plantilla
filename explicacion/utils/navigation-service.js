// Servicio de navegación SPA
const navegacionService = {
  estadoAplicacion: {},
  renderizadorPaginas: {},

  // Navegar a una ruta específica sin recargar la página
  navegarA(rutaDestino) {
    history.pushState(null, null, rutaDestino)
    this.estadoAplicacion.rutaActual = rutaDestino
    this.renderizarContenido()
  },

  // Renderizar contenido según la ruta actual
  renderizarContenido() {
    const rutaActual = this.estadoAplicacion.rutaActual

    // Verificar autenticación para rutas protegidas
    if (!this.esRutaPublica(rutaActual) && !this.estadoAplicacion.estaAutenticado) {
      this.navegarA("/login")
      return
    }

    // Actualizar elementos de navegación
    this.actualizarNavegacion()

    // Renderizar contenido específico según la ruta
    switch (rutaActual) {
      case "/login":
        this.renderizadorPaginas.renderizarPaginaLogin()
        break
      case "/register":
        this.renderizadorPaginas.renderizarPaginaRegistro()
        break
      case "/":
      case "/dashboard":
        this.renderizadorPaginas.renderizarDashboard()
        break
      case "/users":
        if (this.esUsuarioAdministrador()) {
          this.renderizadorPaginas.renderizarPaginaUsuarios()
        } else {
          this.navegarA("/")
        }
        break
      case "/courses":
        this.renderizadorPaginas.renderizarPaginaCursos()
        break
      case "/enrollments":
        if (this.esUsuarioVisitante()) {
          this.renderizadorPaginas.renderizarPaginaInscripciones()
        } else {
          this.navegarA("/")
        }
        break
      default:
        this.renderizadorPaginas.renderizarPagina404()
    }
  },

  // Verificar si la ruta es pública (no requiere autenticación)
  esRutaPublica(ruta) {
    const rutasPublicas = ["/login", "/register"]
    return rutasPublicas.includes(ruta)
  },

  // Verificar si el usuario actual es administrador
  esUsuarioAdministrador() {
    return this.estadoAplicacion.usuarioActual?.role === "admin"
  },

  // Verificar si el usuario actual es visitante
  esUsuarioVisitante() {
    return this.estadoAplicacion.usuarioActual?.role === "visitor"
  },

  // Actualizar elementos de navegación según el estado de autenticación
  actualizarNavegacion() {
    const encabezado = document.getElementById("header")
    const barraLateral = document.getElementById("sidebar")
    const contenidoPrincipal = document.getElementById("mainContent")
    const bienvenidaUsuario = document.getElementById("userWelcome")
    const elementoNavUsuarios = document.getElementById("usersNavItem")
    const elementoNavInscripciones = document.getElementById("enrollmentsNavItem")

    if (this.estadoAplicacion.estaAutenticado) {
      encabezado.classList.remove("hidden")
      barraLateral.classList.remove("hidden")
      contenidoPrincipal.classList.remove("full-width")

      // Mostrar saludo personalizado
      bienvenidaUsuario.textContent = `Bienvenido, ${this.estadoAplicacion.usuarioActual.name}`

      // Mostrar/ocultar elementos según el rol del usuario
      if (this.esUsuarioAdministrador()) {
        elementoNavUsuarios.classList.remove("hidden")
        elementoNavInscripciones.classList.add("hidden")
      } else {
        elementoNavUsuarios.classList.add("hidden")
        elementoNavInscripciones.classList.remove("hidden")
      }

      this.actualizarEnlaceActivo()
    } else {
      encabezado.classList.add("hidden")
      barraLateral.classList.add("hidden")
      contenidoPrincipal.classList.add("full-width")
    }
  },

  // Actualizar el enlace activo en la navegación
  actualizarEnlaceActivo() {
    const enlacesNavegacion = document.querySelectorAll(".nav-menu a")
    enlacesNavegacion.forEach((enlace) => {
      enlace.classList.remove("active")
      if (enlace.getAttribute("href") === this.estadoAplicacion.rutaActual) {
        enlace.classList.add("active")
      }
    })
  },
}
