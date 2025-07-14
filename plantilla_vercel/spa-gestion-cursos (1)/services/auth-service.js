// Servicio de autenticación y manejo de usuarios
const autenticacionService = {
  apiService: null,
  almacenamientoService: null,
  estadoAplicacion: null,
  navegacionService: null,

  // Iniciar sesión de usuario
  async iniciarSesion(correoElectronico, contrasena) {
    try {
      const usuarios = await this.apiService.obtenerDatos("/users")
      const usuarioEncontrado = usuarios.find(
        (usuario) => usuario.email === correoElectronico && usuario.password === contrasena,
      )

      if (usuarioEncontrado) {
        // Guardar usuario en localStorage (persistente)
        this.almacenamientoService.guardarEnLocal("usuarioActual", usuarioEncontrado)
        // Guardar estado de sesión en sessionStorage (temporal)
        this.almacenamientoService.guardarEnSesion("estaAutenticado", true)

        this.estadoAplicacion.usuarioActual = usuarioEncontrado
        this.estadoAplicacion.estaAutenticado = true

        this.apiService.mostrarAlerta("Inicio de sesión exitoso", "success")
        return usuarioEncontrado
      } else {
        throw new Error("Credenciales inválidas")
      }
    } catch (error) {
      this.apiService.mostrarAlerta(error.message, "error")
      throw error
    }
  },

  // Registrar nuevo usuario
  async registrarUsuario(datosUsuario) {
    try {
      const usuarios = await this.apiService.obtenerDatos("/users")
      const usuarioExistente = usuarios.find((usuario) => usuario.email === datosUsuario.email)

      if (usuarioExistente) {
        throw new Error("El correo electrónico ya está registrado")
      }

      const nuevoUsuario = {
        ...datosUsuario,
        role: "visitor",
        dateOfAdmission: new Date().toLocaleDateString("es-ES"),
      }

      const usuarioCreado = await this.apiService.crearDatos("/users", nuevoUsuario)
      this.apiService.mostrarAlerta("Usuario registrado exitosamente", "success")
      return usuarioCreado
    } catch (error) {
      this.apiService.mostrarAlerta(error.message, "error")
      throw error
    }
  },

  // Cerrar sesión
  cerrarSesion() {
    this.almacenamientoService.eliminarDeLocal("usuarioActual")
    this.almacenamientoService.eliminarDeSesion("estaAutenticado")
    this.estadoAplicacion.usuarioActual = null
    this.estadoAplicacion.estaAutenticado = false
    this.navegacionService.navegarA("/login")
    this.apiService.mostrarAlerta("Sesión cerrada exitosamente", "success")
  },

  // Verificar si hay una sesión activa
  verificarAutenticacion() {
    const usuario = this.almacenamientoService.obtenerDeLocal("usuarioActual")
    const estaAutenticado = this.almacenamientoService.obtenerDeSesion("estaAutenticado")

    if (usuario && estaAutenticado) {
      this.estadoAplicacion.usuarioActual = usuario
      this.estadoAplicacion.estaAutenticado = true
      return true
    }
    return false
  },
}

// Assuming these services are imported or defined elsewhere
// autenticacionService.apiService = apiService;
// autenticacionService.almacenamientoService = almacenamientoService;
// autenticacionService.estadoAplicacion = estadoAplicacion;
// autenticacionService.navegacionService = navegacionService;
