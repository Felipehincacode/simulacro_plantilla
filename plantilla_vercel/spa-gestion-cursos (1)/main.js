// Configuración de la API
const API_BASE_URL = "http://localhost:3000"

// Estado global de la aplicación
const estadoAplicacion = {
  usuarioActual: null,
  rutaActual: "/",
  estaAutenticado: false,
}

// Estado de la aplicación para SPA
const appState = {
  currentRoute: "/",
  isAuthenticated: false,
  currentUser: null,
}

// Utilidades para localStorage y sessionStorage
const storage = {
  // Guardar datos en localStorage (persistente)
  setLocal: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
  },

  // Obtener datos de localStorage
  getLocal: (key) => {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  },

  // Eliminar datos de localStorage
  removeLocal: (key) => {
    localStorage.removeItem(key)
  },

  // Guardar datos en sessionStorage (temporal)
  setSession: (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value))
  },

  // Obtener datos de sessionStorage
  getSession: (key) => {
    const item = sessionStorage.getItem(key)
    return item ? JSON.parse(item) : null
  },

  // Eliminar datos de sessionStorage
  removeSession: (key) => {
    sessionStorage.removeItem(key)
  },
}

// Servicios de API
const apiService = {
  // Realizar petición GET
  async get(endpoint) {
    try {
      showLoading(true)
      const response = await fetch(`${API_BASE_URL}${endpoint}`)
      if (!response.ok) throw new Error(`Error ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error("Error en GET:", error)
      showAlert("Error al cargar los datos", "error")
      throw error
    } finally {
      showLoading(false)
    }
  },

  // Realizar petición POST
  async post(endpoint, data) {
    try {
      showLoading(true)
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`Error ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error("Error en POST:", error)
      showAlert("Error al guardar los datos", "error")
      throw error
    } finally {
      showLoading(false)
    }
  },

  // Realizar petición PUT
  async put(endpoint, data) {
    try {
      showLoading(true)
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`Error ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error("Error en PUT:", error)
      showAlert("Error al actualizar los datos", "error")
      throw error
    } finally {
      showLoading(false)
    }
  },

  // Realizar petición DELETE
  async delete(endpoint) {
    try {
      showLoading(true)
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error(`Error ${response.status}`)
      return true
    } catch (error) {
      console.error("Error en DELETE:", error)
      showAlert("Error al eliminar los datos", "error")
      throw error
    } finally {
      showLoading(false)
    }
  },

  mostrarAlerta(message, type = "success") {
    // Crear elemento de alerta
    const alert = document.createElement("div")
    alert.className = `alert alert-${type}`
    alert.textContent = message

    // Insertar al inicio del contenido principal
    const mainContent = document.getElementById("mainContent")
    mainContent.insertBefore(alert, mainContent.firstChild)

    // Eliminar después de 3 segundos
    setTimeout(() => {
      if (alert.parentNode) {
        alert.parentNode.removeChild(alert)
      }
    }, 3000)
  },
}

// Servicios específicos
const autenticacionService = {
  // Autenticar usuario
  async iniciarSesion(email, password) {
    const users = await apiService.get("/users")
    const user = users.find((u) => u.email === email && u.password === password)

    if (user) {
      // Guardar usuario en localStorage (persistente)
      storage.setLocal("currentUser", user)
      // Guardar sesión activa en sessionStorage (temporal)
      storage.setSession("isAuthenticated", true)

      estadoAplicacion.usuarioActual = user
      estadoAplicacion.estaAutenticado = true
      appState.isAuthenticated = true
      appState.currentUser = user

      apiService.mostrarAlerta("Inicio de sesión exitoso", "success")
      return user
    } else {
      throw new Error("Credenciales inválidas")
    }
  },

  // Registrar nuevo usuario
  async registrarUsuario(userData) {
    // Verificar si el email ya existe
    const users = await apiService.get("/users")
    const existingUser = users.find((u) => u.email === userData.email)

    if (existingUser) {
      throw new Error("El email ya está registrado")
    }

    // Crear nuevo usuario con rol de visitante
    const newUser = {
      ...userData,
      role: "visitor",
      dateOfAdmission: new Date().toLocaleDateString("es-ES"),
    }

    const createdUser = await apiService.post("/users", newUser)
    apiService.mostrarAlerta("Usuario registrado exitosamente", "success")
    return createdUser
  },

  // Cerrar sesión
  cerrarSesion() {
    storage.removeLocal("currentUser")
    storage.removeSession("isAuthenticated")
    estadoAplicacion.usuarioActual = null
    estadoAplicacion.estaAutenticado = false
    appState.isAuthenticated = false
    appState.currentUser = null
    navegacionService.navegarA("/login")
    apiService.mostrarAlerta("Sesión cerrada", "success")
  },

  // Verificar si hay sesión activa
  verificarAutenticacion() {
    const user = storage.getLocal("currentUser")
    const isAuth = storage.getSession("isAuthenticated")

    if (user && isAuth) {
      estadoAplicacion.usuarioActual = user
      estadoAplicacion.estaAutenticado = true
      appState.isAuthenticated = true
      appState.currentUser = user
      return true
    }
    return false
  },
}

const usuarioService = {
  // Obtener todos los usuarios
  async obtenerTodosLosUsuarios() {
    return await apiService.get("/users")
  },

  // Crear nuevo usuario
  async crearNuevoUsuario(userData) {
    return await apiService.post("/users", userData)
  },

  // Actualizar usuario
  async actualizarUsuario(id, userData) {
    return await apiService.put(`/users/${id}`, userData)
  },

  // Eliminar usuario
  async eliminarUsuario(id) {
    return await apiService.delete(`/users/${id}`)
  },

  async obtenerUsuarioPorId(idUsuario) {
    const usuarios = await this.obtenerTodosLosUsuarios()
    return usuarios.find((usuario) => usuario.id === Number(idUsuario))
  },
}

const cursoService = {
  // Obtener todos los cursos
  async obtenerTodosLosCursos() {
    return await apiService.get("/courses")
  },

  // Crear nuevo curso
  async crearNuevoCurso(courseData) {
    return await apiService.post("/courses", courseData)
  },

  // Actualizar curso
  async actualizarCurso(id, courseData) {
    return await apiService.put(`/courses/${id}`, courseData)
  },

  // Eliminar curso
  async eliminarCurso(id) {
    return await apiService.delete(`/courses/${id}`)
  },

  async obtenerCursoPorId(idCurso) {
    const cursos = await this.obtenerTodosLosCursos()
    return cursos.find((curso) => curso.id === Number(idCurso))
  },
}

const inscripcionService = {
  // Obtener todas las inscripciones
  async obtenerTodasLasInscripciones() {
    return await apiService.get("/enrollments")
  },

  // Inscribir usuario a curso
  async inscribirUsuarioEnCurso(userId, courseId) {
    const enrollmentData = {
      userId: Number.parseInt(userId),
      courseId: Number.parseInt(courseId),
      enrollmentDate: new Date().toLocaleDateString("es-ES"),
      status: "active",
    }
    return await apiService.post("/enrollments", enrollmentData)
  },

  // Cancelar inscripción
  async cancelarInscripcion(enrollmentId) {
    return await apiService.delete(`/enrollments/${enrollmentId}`)
  },

  // Obtener inscripciones de un usuario
  async obtenerInscripcionesDeUsuario(userId) {
    const enrollments = await this.obtenerTodasLasInscripciones()
    return enrollments.filter((e) => e.userId === Number.parseInt(userId))
  },
}

// Funciones de utilidad
function showLoading(show) {
  const spinner = document.getElementById("loadingSpinner")
  if (show) {
    spinner.classList.remove("hidden")
  } else {
    spinner.classList.add("hidden")
  }
}

function showAlert(message, type = "success") {
  // Crear elemento de alerta
  const alert = document.createElement("div")
  alert.className = `alert alert-${type}`
  alert.textContent = message

  // Insertar al inicio del contenido principal
  const mainContent = document.getElementById("mainContent")
  mainContent.insertBefore(alert, mainContent.firstChild)

  // Eliminar después de 3 segundos
  setTimeout(() => {
    if (alert.parentNode) {
      alert.parentNode.removeChild(alert)
    }
  }, 3000)
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateForm(formData, requiredFields) {
  const errors = []

  requiredFields.forEach((field) => {
    if (!formData[field] || formData[field].trim() === "") {
      errors.push(`El campo ${field} es requerido`)
    }
  })

  if (formData.email && !validateEmail(formData.email)) {
    errors.push("El email no tiene un formato válido")
  }

  return errors
}

// Funciones de navegación SPA
function navigateTo(path) {
  // Actualizar la URL sin recargar la página
  history.pushState(null, null, path)
  appState.currentRoute = path
  renderContent()
}

function renderContent() {
  const path = appState.currentRoute
  const mainContent = document.getElementById("mainContent")

  // Verificar autenticación para rutas protegidas
  if (path !== "/login" && path !== "/register" && !appState.isAuthenticated) {
    navigateTo("/login")
    return
  }

  // Mostrar/ocultar elementos de navegación
  updateNavigation()

  // Renderizar contenido según la ruta
  switch (path) {
    case "/login":
      renderizadorPaginas.renderizarPaginaLogin()
      break
    case "/register":
      renderizadorPaginas.renderizarPaginaRegistro()
      break
    case "/":
    case "/dashboard":
      renderizadorPaginas.renderizarDashboard()
      break
    case "/users":
      if (appState.currentUser?.role === "admin") {
        renderizadorPaginas.renderizarPaginaUsuarios()
      } else {
        navigateTo("/")
      }
      break
    case "/courses":
      renderizadorPaginas.renderizarPaginaCursos()
      break
    case "/enrollments":
      if (appState.currentUser?.role === "visitor") {
        renderizadorPaginas.renderizarPaginaInscripciones()
      } else {
        navigateTo("/")
      }
      break
    default:
      renderizadorPaginas.renderizarPagina404()
  }
}

function updateNavigation() {
  const header = document.getElementById("header")
  const sidebar = document.getElementById("sidebar")
  const mainContent = document.getElementById("mainContent")
  const userWelcome = document.getElementById("userWelcome")
  const usersNavItem = document.getElementById("usersNavItem")
  const enrollmentsNavItem = document.getElementById("enrollmentsNavItem")

  if (appState.isAuthenticated) {
    header.classList.remove("hidden")
    sidebar.classList.remove("hidden")
    mainContent.classList.remove("full-width")

    // Mostrar nombre del usuario
    userWelcome.textContent = `Bienvenido, ${appState.currentUser.name}`

    // Mostrar/ocultar elementos según el rol
    if (appState.currentUser.role === "admin") {
      usersNavItem.classList.remove("hidden")
      enrollmentsNavItem.classList.add("hidden")
    } else {
      usersNavItem.classList.add("hidden")
      enrollmentsNavItem.classList.remove("hidden")
    }

    // Actualizar enlaces activos
    updateActiveNavLink()
  } else {
    header.classList.add("hidden")
    sidebar.classList.add("hidden")
    mainContent.classList.add("full-width")
  }
}

function updateActiveNavLink() {
  const navLinks = document.querySelectorAll(".nav-menu a")
  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === appState.currentRoute) {
      link.classList.add("active")
    }
  })
}

// Renderizador de páginas principales
const renderizadorPaginas = {
  // Renderizar página de inicio de sesión
  renderizarPaginaLogin() {
    const contenidoPrincipal = document.getElementById("mainContent")
    contenidoPrincipal.innerHTML = `
      <div class="auth-container">
        <div class="auth-card">
          <h2 class="auth-title">Iniciar Sesión</h2>
          <form id="formularioLogin">
            <div class="form-group">
              <label for="correoElectronico">Correo Electrónico:</label>
              <input type="email" id="correoElectronico" name="email" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="contrasenaLogin">Contraseña:</label>
              <input type="password" id="contrasenaLogin" name="password" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Iniciar Sesión</button>
          </form>
          <div class="auth-link">
            <p>¿No tienes cuenta? <a href="/register" data-link>Regístrate aquí</a></p>
          </div>
        </div>
      </div>
    `

    // Agregar manejador de eventos al formulario
    document.getElementById("formularioLogin").addEventListener("submit", manejadorEventos.manejarInicioSesion)
  },

  // Renderizar página de registro
  renderizarPaginaRegistro() {
    const contenidoPrincipal = document.getElementById("mainContent")
    contenidoPrincipal.innerHTML = `
      <div class="auth-container">
        <div class="auth-card">
          <h2 class="auth-title">Registro de Usuario</h2>
          <form id="formularioRegistro">
            <div class="form-group">
              <label for="nombreCompleto">Nombre Completo:</label>
              <input type="text" id="nombreCompleto" name="name" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="correoRegistro">Correo Electrónico:</label>
              <input type="email" id="correoRegistro" name="email" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="contrasenaRegistro">Contraseña:</label>
              <input type="password" id="contrasenaRegistro" name="password" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="numeroTelefono">Número de Teléfono:</label>
              <input type="tel" id="numeroTelefono" name="phone" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="numeroMatricula">Número de Matrícula:</label>
              <input type="text" id="numeroMatricula" name="enrollNumber" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Registrarse</button>
          </form>
          <div class="auth-link">
            <p>¿Ya tienes cuenta? <a href="/login" data-link>Inicia sesión aquí</a></p>
          </div>
        </div>
      </div>
    `

    // Agregar manejador de eventos al formulario
    document.getElementById("formularioRegistro").addEventListener("submit", manejadorEventos.manejarRegistro)
  },

  // Renderizar dashboard principal
  renderizarDashboard() {
    const contenidoPrincipal = document.getElementById("mainContent")
    const esAdministrador = navegacionService.esUsuarioAdministrador()

    contenidoPrincipal.innerHTML = `
      <div class="container">
        <h1>Panel de Control</h1>
        <div class="grid grid-3" id="estadisticasDashboard">
          <!-- Las estadísticas se cargarán dinámicamente -->
        </div>
        
        ${
          esAdministrador
            ? `
          <div class="card mt-20">
            <div class="card-header">
              <h3 class="card-title">Acciones Rápidas de Administrador</h3>
            </div>
            <div class="flex gap-10">
              <button class="btn btn-primary" onclick="gestorModales.mostrarModalUsuario()">Crear Usuario</button>
              <button class="btn btn-success" onclick="gestorModales.mostrarModalCurso()">Crear Curso</button>
            </div>
          </div>
        `
            : `
          <div class="card mt-20">
            <div class="card-header">
              <h3 class="card-title">Mis Cursos Inscritos</h3>
            </div>
            <div id="cursosUsuario">
              <!-- Los cursos del usuario se cargarán aquí -->
            </div>
          </div>
        `
        }
      </div>
    `

    this.cargarDatosDashboard()
  },

  // Cargar datos estadísticos del dashboard
  async cargarDatosDashboard() {
    try {
      const [usuarios, cursos, inscripciones] = await Promise.all([
        usuarioService.obtenerTodosLosUsuarios(),
        cursoService.obtenerTodosLosCursos(),
        inscripcionService.obtenerTodasLasInscripciones(),
      ])

      const contenedorEstadisticas = document.getElementById("estadisticasDashboard")
      const esAdministrador = navegacionService.esUsuarioAdministrador()

      if (esAdministrador) {
        contenedorEstadisticas.innerHTML = `
          <div class="card">
            <h3>Total de Usuarios</h3>
            <p style="font-size: 2rem; font-weight: bold; color: var(--primary-color);">${usuarios.length}</p>
          </div>
          <div class="card">
            <h3>Total de Cursos</h3>
            <p style="font-size: 2rem; font-weight: bold; color: var(--success-color);">${cursos.length}</p>
          </div>
          <div class="card">
            <h3>Total de Inscripciones</h3>
            <p style="font-size: 2rem; font-weight: bold; color: var(--warning-color);">${inscripciones.length}</p>
          </div>
        `
      } else {
        const inscripcionesUsuario = inscripciones.filter(
          (inscripcion) => inscripcion.userId === estadoAplicacion.usuarioActual.id,
        )

        contenedorEstadisticas.innerHTML = `
          <div class="card">
            <h3>Mis Inscripciones</h3>
            <p style="font-size: 2rem; font-weight: bold; color: var(--primary-color);">${inscripcionesUsuario.length}</p>
          </div>
          <div class="card">
            <h3>Cursos Disponibles</h3>
            <p style="font-size: 2rem; font-weight: bold; color: var(--success-color);">${cursos.length}</p>
          </div>
        `

        await this.cargarCursosUsuario(inscripcionesUsuario, cursos)
      }
    } catch (error) {
      console.error("Error cargando datos del dashboard:", error)
    }
  },

  // Cargar cursos específicos del usuario
  async cargarCursosUsuario(inscripcionesUsuario, cursos) {
    const contenedorCursosUsuario = document.getElementById("cursosUsuario")

    if (inscripcionesUsuario.length > 0) {
      const listaCursosUsuario = inscripcionesUsuario
        .map((inscripcion) => {
          const curso = cursos.find((c) => c.id === inscripcion.courseId)
          return curso
            ? `
            <div class="card">
              <h4>${curso.title}</h4>
              <p>${curso.description}</p>
              <p><strong>Fecha de Inicio:</strong> ${curso.startDate}</p>
              <p><strong>Duración:</strong> ${curso.duration}</p>
              <p><strong>Instructor:</strong> ${curso.instructor}</p>
            </div>
          `
            : ""
        })
        .join("")

      contenedorCursosUsuario.innerHTML = listaCursosUsuario
    } else {
      contenedorCursosUsuario.innerHTML = "<p>No estás inscrito en ningún curso actualmente.</p>"
    }
  },

  // Renderizar página de gestión de usuarios (solo admin)
  renderizarPaginaUsuarios() {
    const contenidoPrincipal = document.getElementById("mainContent")
    contenidoPrincipal.innerHTML = `
      <div class="container">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Gestión de Usuarios</h2>
            <button class="btn btn-primary" onclick="gestorModales.mostrarModalUsuario()">Crear Nuevo Usuario</button>
          </div>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre Completo</th>
                  <th>Correo Electrónico</th>
                  <th>Rol de Usuario</th>
                  <th>Número de Teléfono</th>
                  <th>Acciones Disponibles</th>
                </tr>
              </thead>
              <tbody id="cuerpoTablaUsuarios">
                <!-- Los usuarios se cargarán dinámicamente aquí -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `

    this.cargarListaUsuarios()
  },

  // Cargar lista de usuarios en la tabla
  async cargarListaUsuarios() {
    try {
      const usuarios = await usuarioService.obtenerTodosLosUsuarios()
      const cuerpoTabla = document.getElementById("cuerpoTablaUsuarios")

      cuerpoTabla.innerHTML = usuarios
        .map(
          (usuario) => `
          <tr>
            <td>${usuario.id}</td>
            <td>${usuario.name}</td>
            <td>${usuario.email}</td>
            <td>${usuario.role === "admin" ? "Administrador" : "Visitante"}</td>
            <td>${usuario.phone}</td>
            <td>
              <button class="btn btn-small btn-secondary" onclick="gestorCrud.editarUsuario(${usuario.id})">Editar</button>
              <button class="btn btn-small btn-danger" onclick="gestorCrud.eliminarUsuario(${usuario.id})">Eliminar</button>
            </td>
          </tr>
        `,
        )
        .join("")
    } catch (error) {
      console.error("Error cargando lista de usuarios:", error)
    }
  },

  // Renderizar página de cursos
  renderizarPaginaCursos() {
    const contenidoPrincipal = document.getElementById("mainContent")
    const esAdministrador = navegacionService.esUsuarioAdministrador()

    contenidoPrincipal.innerHTML = `
      <div class="container">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Gestión de Cursos</h2>
            ${esAdministrador ? '<button class="btn btn-primary" onclick="gestorModales.mostrarModalCurso()">Crear Nuevo Curso</button>' : ""}
          </div>
          <div id="contenedorCursos">
            <!-- Los cursos se cargarán dinámicamente aquí -->
          </div>
        </div>
      </div>
    `

    this.cargarListaCursos()
  },

  // Cargar lista de cursos
  async cargarListaCursos() {
    try {
      const [cursos, inscripciones] = await Promise.all([
        cursoService.obtenerTodosLosCursos(),
        inscripcionService.obtenerTodasLasInscripciones(),
      ])

      const contenedor = document.getElementById("contenedorCursos")
      const esAdministrador = navegacionService.esUsuarioAdministrador()

      if (esAdministrador) {
        // Vista de administrador - tabla de gestión
        contenedor.innerHTML = `
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título del Curso</th>
                  <th>Instructor</th>
                  <th>Fecha de Inicio</th>
                  <th>Duración</th>
                  <th>Capacidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${cursos
                  .map(
                    (curso) => `
                  <tr>
                    <td>${curso.id}</td>
                    <td>${curso.title}</td>
                    <td>${curso.instructor}</td>
                    <td>${curso.startDate}</td>
                    <td>${curso.duration}</td>
                    <td>${curso.capacity}</td>
                    <td>
                      <button class="btn btn-small btn-secondary" onclick="gestorCrud.editarCurso(${curso.id})">Editar</button>
                      <button class="btn btn-small btn-danger" onclick="gestorCrud.eliminarCurso(${curso.id})">Eliminar</button>
                    </td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        `
      } else {
        // Vista de visitante - cards de cursos
        const inscripcionesUsuario = inscripciones.filter(
          (inscripcion) => inscripcion.userId === estadoAplicacion.usuarioActual.id,
        )

        contenedor.innerHTML = `
          <div class="grid grid-2">
            ${cursos
              .map((curso) => {
                const estaInscrito = inscripcionesUsuario.some((inscripcion) => inscripcion.courseId === curso.id)
                return `
                <div class="card">
                  <h3>${curso.title}</h3>
                  <p>${curso.description}</p>
                  <p><strong>Instructor:</strong> ${curso.instructor}</p>
                  <p><strong>Fecha de Inicio:</strong> ${curso.startDate}</p>
                  <p><strong>Duración:</strong> ${curso.duration}</p>
                  <p><strong>Capacidad:</strong> ${curso.capacity} estudiantes</p>
                  ${
                    estaInscrito
                      ? '<span class="btn btn-success disabled">Ya Inscrito</span>'
                      : `<button class="btn btn-primary" onclick="gestorCrud.inscribirEnCurso(${curso.id})">Inscribirse</button>`
                  }
                </div>
              `
              })
              .join("")}
          </div>
        `
      }
    } catch (error) {
      console.error("Error cargando lista de cursos:", error)
    }
  },

  // Renderizar página de inscripciones (solo visitantes)
  renderizarPaginaInscripciones() {
    const contenidoPrincipal = document.getElementById("mainContent")
    contenidoPrincipal.innerHTML = `
      <div class="container">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Mis Inscripciones Activas</h2>
          </div>
          <div id="contenedorInscripciones">
            <!-- Las inscripciones se cargarán dinámicamente aquí -->
          </div>
        </div>
      </div>
    `

    this.cargarInscripcionesUsuario()
  },

  // Cargar inscripciones específicas del usuario
  async cargarInscripcionesUsuario() {
    try {
      const [inscripciones, cursos] = await Promise.all([
        inscripcionService.obtenerInscripcionesDeUsuario(estadoAplicacion.usuarioActual.id),
        cursoService.obtenerTodosLosCursos(),
      ])

      const contenedor = document.getElementById("contenedorInscripciones")

      if (inscripciones.length === 0) {
        contenedor.innerHTML = "<p>No tienes inscripciones activas en este momento.</p>"
        return
      }

      contenedor.innerHTML = `
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Nombre del Curso</th>
                <th>Instructor</th>
                <th>Fecha de Inscripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${inscripciones
                .map((inscripcion) => {
                  const curso = cursos.find((c) => c.id === inscripcion.courseId)
                  return curso
                    ? `
                  <tr>
                    <td>${curso.title}</td>
                    <td>${curso.instructor}</td>
                    <td>${inscripcion.enrollmentDate}</td>
                    <td>${inscripcion.status === "active" ? "Activo" : "Inactivo"}</td>
                    <td>
                      <button class="btn btn-small btn-danger" onclick="gestorCrud.cancelarInscripcion(${inscripcion.id})">Cancelar Inscripción</button>
                    </td>
                  </tr>
                `
                    : ""
                })
                .join("")}
            </tbody>
          </table>
        </div>
      `
    } catch (error) {
      console.error("Error cargando inscripciones del usuario:", error)
    }
  },

  // Renderizar página 404
  renderizarPagina404() {
    const contenidoPrincipal = document.getElementById("mainContent")
    contenidoPrincipal.innerHTML = `
      <div class="container text-center">
        <h1>404 - Página No Encontrada</h1>
        <p>La página que estás buscando no existe en el sistema.</p>
        <button class="btn btn-primary" onclick="navegacionService.navegarA('/')">Volver al Inicio</button>
      </div>
    `
  },
}

// Manejador centralizado de eventos
const manejadorEventos = {
  // Manejar inicio de sesión
  async manejarInicioSesion(evento) {
    evento.preventDefault()

    const datosFormulario = new FormData(evento.target)
    const correoElectronico = datosFormulario.get("email")
    const contrasena = datosFormulario.get("password")

    try {
      await autenticacionService.iniciarSesion(correoElectronico, contrasena)
      navegacionService.navegarA("/")
    } catch (error) {
      console.error("Error en inicio de sesión:", error)
    }
  },

  // Manejar registro de usuario
  async manejarRegistro(evento) {
    evento.preventDefault()

    const datosFormulario = new FormData(evento.target)
    const datosUsuario = {
      name: datosFormulario.get("name"),
      email: datosFormulario.get("email"),
      password: datosFormulario.get("password"),
      phone: datosFormulario.get("phone"),
      enrollNumber: datosFormulario.get("enrollNumber"),
    }

    // Validar datos antes de enviar
    const erroresValidacion = validacionUtils.validarFormularioCompleto(datosUsuario, [
      "name",
      "email",
      "password",
      "phone",
      "enrollNumber",
    ])

    if (erroresValidacion.length > 0) {
      apiService.mostrarAlerta(erroresValidacion.join(", "), "error")
      return
    }

    try {
      await autenticacionService.registrarUsuario(datosUsuario)
      navegacionService.navegarA("/login")
    } catch (error) {
      console.error("Error en registro:", error)
    }
  },
}

// Gestor de operaciones CRUD
const gestorCrud = {
  // Editar usuario existente
  async editarUsuario(idUsuario) {
    gestorModales.mostrarModalUsuario(idUsuario)
  },

  // Eliminar usuario del sistema
  async eliminarUsuario(idUsuario) {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await usuarioService.eliminarUsuario(idUsuario)
        apiService.mostrarAlerta("Usuario eliminado exitosamente", "success")
        renderizadorPaginas.cargarListaUsuarios()
      } catch (error) {
        console.error("Error eliminando usuario:", error)
      }
    }
  },

  // Editar curso existente
  async editarCurso(idCurso) {
    gestorModales.mostrarModalCurso(idCurso)
  },

  // Eliminar curso del sistema
  async eliminarCurso(idCurso) {
    if (confirm("¿Estás seguro de que deseas eliminar este curso?")) {
      try {
        await cursoService.eliminarCurso(idCurso)
        apiService.mostrarAlerta("Curso eliminado exitosamente", "success")
        renderizadorPaginas.cargarListaCursos()
      } catch (error) {
        console.error("Error eliminando curso:", error)
      }
    }
  },

  // Inscribir usuario en curso
  async inscribirEnCurso(idCurso) {
    try {
      await inscripcionService.inscribirUsuarioEnCurso(estadoAplicacion.usuarioActual.id, idCurso)
      apiService.mostrarAlerta("Inscripción realizada exitosamente", "success")
      renderizadorPaginas.cargarListaCursos()
    } catch (error) {
      console.error("Error en inscripción:", error)
    }
  },

  // Cancelar inscripción de usuario
  async cancelarInscripcion(idInscripcion) {
    if (confirm("¿Estás seguro de que deseas cancelar esta inscripción?")) {
      try {
        await inscripcionService.cancelarInscripcion(idInscripcion)
        apiService.mostrarAlerta("Inscripción cancelada exitosamente", "success")
        renderizadorPaginas.cargarInscripcionesUsuario()
      } catch (error) {
        console.error("Error cancelando inscripción:", error)
      }
    }
  },
}

// Gestor de modales
const gestorModales = {
  // Mostrar modal para crear/editar usuario
  mostrarModalUsuario(idUsuario = null) {
    const esEdicion = idUsuario !== null
    const tituloModal = esEdicion ? "Editar Usuario" : "Crear Nuevo Usuario"

    const contenidoModal = `
      <h3>${tituloModal}</h3>
      <form id="formularioUsuario">
        <div class="form-group">
          <label for="nombreUsuario">Nombre Completo:</label>
          <input type="text" id="nombreUsuario" name="name" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="correoUsuario">Correo Electrónico:</label>
          <input type="email" id="correoUsuario" name="email" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="contrasenaUsuario">Contraseña:</label>
          <input type="password" id="contrasenaUsuario" name="password" class="form-control" ${esEdicion ? "" : "required"}>
          ${esEdicion ? "<small>Dejar vacío para mantener la contraseña actual</small>" : ""}
        </div>
        <div class="form-group">
          <label for="rolUsuario">Rol del Usuario:</label>
          <select id="rolUsuario" name="role" class="form-control" required>
            <option value="visitor">Visitante</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <div class="form-group">
          <label for="telefonoUsuario">Número de Teléfono:</label>
          <input type="tel" id="telefonoUsuario" name="phone" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="matriculaUsuario">Número de Matrícula:</label>
          <input type="text" id="matriculaUsuario" name="enrollNumber" class="form-control" required>
        </div>
        <div class="flex gap-10">
          <button type="submit" class="btn btn-primary">${esEdicion ? "Actualizar Usuario" : "Crear Usuario"}</button>
          <button type="button" class="btn btn-secondary" onclick="gestorModales.ocultarModal()">Cancelar</button>
        </div>
      </form>
    `

    this.mostrarModal(contenidoModal)

    // Cargar datos si es edición
    if (esEdicion) {
      this.cargarDatosUsuario(idUsuario)
    }

    // Agregar manejador de eventos
    document
      .getElementById("formularioUsuario")
      .addEventListener("submit", (evento) => this.manejarEnvioUsuario(evento, idUsuario))
  },

  // Cargar datos de usuario para edición
  async cargarDatosUsuario(idUsuario) {
    try {
      const usuario = await usuarioService.obtenerUsuarioPorId(idUsuario)
      if (usuario) {
        document.getElementById("nombreUsuario").value = usuario.name
        document.getElementById("correoUsuario").value = usuario.email
        document.getElementById("rolUsuario").value = usuario.role
        document.getElementById("telefonoUsuario").value = usuario.phone
        document.getElementById("matriculaUsuario").value = usuario.enrollNumber
      }
    } catch (error) {
      console.error("Error cargando datos del usuario:", error)
    }
  },

  // Manejar envío de formulario de usuario
  async manejarEnvioUsuario(evento, idUsuario = null) {
    evento.preventDefault()

    const datosFormulario = new FormData(evento.target)
    const datosUsuario = {
      name: datosFormulario.get("name"),
      email: datosFormulario.get("email"),
      role: datosFormulario.get("role"),
      phone: datosFormulario.get("phone"),
      enrollNumber: datosFormulario.get("enrollNumber"),
    }

    // Incluir contraseña solo si se proporcionó
    const contrasena = datosFormulario.get("password")
    if (contrasena) {
      datosUsuario.password = contrasena
    }

    try {
      if (idUsuario) {
        await usuarioService.actualizarUsuario(idUsuario, datosUsuario)
        apiService.mostrarAlerta("Usuario actualizado exitosamente", "success")
      } else {
        await usuarioService.crearNuevoUsuario(datosUsuario)
        apiService.mostrarAlerta("Usuario creado exitosamente", "success")
      }

      this.ocultarModal()
      renderizadorPaginas.cargarListaUsuarios()
    } catch (error) {
      console.error("Error procesando usuario:", error)
    }
  },

  // Mostrar modal para crear/editar curso
  mostrarModalCurso(idCurso = null) {
    const esEdicion = idCurso !== null
    const tituloModal = esEdicion ? "Editar Curso" : "Crear Nuevo Curso"

    const contenidoModal = `
      <h3>${tituloModal}</h3>
      <form id="formularioCurso">
        <div class="form-group">
          <label for="tituloCurso">Título del Curso:</label>
          <input type="text" id="tituloCurso" name="title" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="descripcionCurso">Descripción:</label>
          <textarea id="descripcionCurso" name="description" class="form-control" rows="3" required></textarea>
        </div>
        <div class="form-group">
          <label for="instructorCurso">Instructor:</label>
          <input type="text" id="instructorCurso" name="instructor" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="fechaInicioCurso">Fecha de Inicio:</label>
          <input type="text" id="fechaInicioCurso" name="startDate" class="form-control" placeholder="DD-MMM-YYYY" required>
        </div>
        <div class="form-group">
          <label for="duracionCurso">Duración:</label>
          <input type="text" id="duracionCurso" name="duration" class="form-control" placeholder="ej: 4 semanas" required>
        </div>
        <div class="form-group">
          <label for="capacidadCurso">Capacidad:</label>
          <input type="number" id="capacidadCurso" name="capacity" class="form-control" min="1" required>
        </div>
        <div class="flex gap-10">
          <button type="submit" class="btn btn-primary">${esEdicion ? "Actualizar Curso" : "Crear Curso"}</button>
          <button type="button" class="btn btn-secondary" onclick="gestorModales.ocultarModal()">Cancelar</button>
        </div>
      </form>
    `

    this.mostrarModal(contenidoModal)

    // Cargar datos si es edición
    if (esEdicion) {
      this.cargarDatosCurso(idCurso)
    }

    // Agregar manejador de eventos
    document
      .getElementById("formularioCurso")
      .addEventListener("submit", (evento) => this.manejarEnvioCurso(evento, idCurso))
  },

  // Cargar datos de curso para edición
  async cargarDatosCurso(idCurso) {
    try {
      const curso = await cursoService.obtenerCursoPorId(idCurso)
      if (curso) {
        document.getElementById("tituloCurso").value = curso.title
        document.getElementById("descripcionCurso").value = curso.description
        document.getElementById("instructorCurso").value = curso.instructor
        document.getElementById("fechaInicioCurso").value = curso.startDate
        document.getElementById("duracionCurso").value = curso.duration
        document.getElementById("capacidadCurso").value = curso.capacity
      }
    } catch (error) {
      console.error("Error cargando datos del curso:", error)
    }
  },

  // Manejar envío de formulario de curso
  async manejarEnvioCurso(evento, idCurso = null) {
    evento.preventDefault()

    const datosFormulario = new FormData(evento.target)
    const datosCurso = {
      title: datosFormulario.get("title"),
      description: datosFormulario.get("description"),
      instructor: datosFormulario.get("instructor"),
      startDate: datosFormulario.get("startDate"),
      duration: datosFormulario.get("duration"),
      capacity: Number.parseInt(datosFormulario.get("capacity")),
    }

    try {
      if (idCurso) {
        await cursoService.actualizarCurso(idCurso, datosCurso)
        apiService.mostrarAlerta("Curso actualizado exitosamente", "success")
      } else {
        await cursoService.crearNuevoCurso(datosCurso)
        apiService.mostrarAlerta("Curso creado exitosamente", "success")
      }

      this.ocultarModal()
      renderizadorPaginas.cargarListaCursos()
    } catch (error) {
      console.error("Error procesando curso:", error)
    }
  },

  // Mostrar modal genérico
  mostrarModal(contenido) {
    const modal = document.getElementById("modal")
    const cuerpoModal = document.getElementById("modalBody")

    cuerpoModal.innerHTML = contenido
    modal.classList.remove("hidden")
  },

  // Ocultar modal
  ocultarModal() {
    const modal = document.getElementById("modal")
    modal.classList.add("hidden")
  },
}

// Funciones de navegación SPA
const navegacionService = {
  // Navegar a una ruta específica
  navegarA(ruta) {
    history.pushState(null, null, ruta)
    appState.currentRoute = ruta
    this.renderizarContenido()
  },

  // Renderizar el contenido basado en la ruta actual
  renderizarContenido() {
    const ruta = appState.currentRoute
    const esAutenticado = appState.isAuthenticated

    // Redirigir si no está autenticado y la ruta requiere autenticación
    if (!esAutenticado && ruta !== "/login" && ruta !== "/register") {
      this.navegarA("/login")
      return
    }

    // Actualizar la interfaz de usuario (ej: mostrar/ocultar elementos)
    this.actualizarInterfazUsuario()

    // Renderizar la página correspondiente
    switch (ruta) {
      case "/login":
        renderizadorPaginas.renderizarPaginaLogin()
        break
      case "/register":
        renderizadorPaginas.renderizarPaginaRegistro()
        break
      case "/":
      case "/dashboard":
        renderizadorPaginas.renderizarDashboard()
        break
      case "/users":
        if (this.esUsuarioAdministrador()) {
          renderizadorPaginas.renderizarPaginaUsuarios()
        } else {
          this.navegarA("/") // Redirigir si no es administrador
        }
        break
      case "/courses":
        renderizadorPaginas.renderizarPaginaCursos()
        break
      case "/enrollments":
        if (!this.esUsuarioAdministrador()) {
          renderizadorPaginas.renderizarPaginaInscripciones()
        } else {
          this.navegarA("/") // Redirigir si es administrador
        }
        break
      default:
        renderizadorPaginas.renderizarPagina404()
    }
  },

  // Actualizar la interfaz de usuario (ej: mostrar/ocultar elementos)
  actualizarInterfazUsuario() {
    const encabezado = document.getElementById("header")
    const barraLateral = document.getElementById("sidebar")
    const contenidoPrincipal = document.getElementById("mainContent")
    const bienvenidaUsuario = document.getElementById("userWelcome")
    const itemUsuarios = document.getElementById("usersNavItem")
    const itemInscripciones = document.getElementById("enrollmentsNavItem")

    if (estadoAplicacion.estaAutenticado) {
      encabezado.classList.remove("hidden")
      barraLateral.classList.remove("hidden")
      contenidoPrincipal.classList.remove("full-width")

      // Mostrar nombre del usuario
      bienvenidaUsuario.textContent = `Bienvenido, ${estadoAplicacion.usuarioActual.name}`

      // Mostrar/ocultar elementos según el rol
      if (this.esUsuarioAdministrador()) {
        itemUsuarios.classList.remove("hidden")
        itemInscripciones.classList.add("hidden")
      } else {
        itemUsuarios.classList.add("hidden")
        itemInscripciones.classList.remove("hidden")
      }

      // Actualizar enlaces activos
      this.actualizarEnlaceActivo()
    } else {
      encabezado.classList.add("hidden")
      barraLateral.classList.add("hidden")
      contenidoPrincipal.classList.add("full-width")
    }
  },

  // Actualizar la clase 'active' en los enlaces de navegación
  actualizarEnlaceActivo() {
    const enlaces = document.querySelectorAll(".nav-menu a")
    enlaces.forEach((enlace) => {
      enlace.classList.remove("active")
      if (enlace.getAttribute("href") === estadoAplicacion.rutaActual) {
        enlace.classList.add("active")
      }
    })
  },

  // Determinar si el usuario actual es administrador
  esUsuarioAdministrador() {
    return estadoAplicacion.usuarioActual && estadoAplicacion.usuarioActual.role === "admin"
  },
}

// Funciones de validación
const validacionUtils = {
  // Validar formato de correo electrónico
  validarCorreoElectronico(email) {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regexCorreo.test(email)
  },

  // Validar si un campo está vacío
  validarCampoRequerido(valor) {
    return valor && valor.trim() !== ""
  },

  // Validar formulario completo
  validarFormularioCompleto(datos, camposRequeridos) {
    const errores = []

    camposRequeridos.forEach((campo) => {
      if (!this.validarCampoRequerido(datos[campo])) {
        errores.push(`El campo ${campo} es requerido`)
      }
    })

    if (datos.email && !this.validarCorreoElectronico(datos.email)) {
      errores.push("El email no tiene un formato válido")
    }

    return errores
  },
}

// Inicialización de la aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Verificar autenticación al cargar la aplicación
  autenticacionService.verificarAutenticacion()

  // Configurar navegación SPA interceptando clicks en enlaces
  document.addEventListener("click", (evento) => {
    if (evento.target.matches("[data-link]")) {
      evento.preventDefault()
      const rutaDestino = evento.target.getAttribute("href")
      navegacionService.navegarA(rutaDestino)
    }
  })

  // Manejar navegación del navegador (botones atrás/adelante)
  window.addEventListener("popstate", () => {
    appState.currentRoute = location.pathname
    navegacionService.renderizarContenido()
  })

  // Configurar botón de cerrar sesión
  document.getElementById("logoutBtn").addEventListener("click", () => {
    autenticacionService.cerrarSesion()
  })

  // Configurar cierre de modal
  document.querySelector(".close").addEventListener("click", () => {
    gestorModales.ocultarModal()
  })

  // Cerrar modal al hacer click fuera de él
  document.getElementById("modal").addEventListener("click", function (evento) {
    if (evento.target === this) {
      gestorModales.ocultarModal()
    }
  })

  // Establecer ruta inicial y renderizar contenido
  appState.currentRoute = location.pathname
  navegacionService.renderizarContenido()
})
