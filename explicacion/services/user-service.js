// Import the apiService
const apiService = require("./apiService") // Assuming apiService is in the same directory

// Servicio específico para gestión de usuarios
const usuarioService = {
  // Obtener todos los usuarios del servidor
  async obtenerTodosLosUsuarios() {
    return await apiService.obtenerDatos("/users")
  },

  // Crear un nuevo usuario
  async crearNuevoUsuario(datosUsuario) {
    const usuarioConFecha = {
      ...datosUsuario,
      dateOfAdmission: new Date().toLocaleDateString("es-ES"),
    }
    return await apiService.crearDatos("/users", usuarioConFecha)
  },

  // Actualizar datos de usuario existente
  async actualizarUsuario(idUsuario, datosUsuario) {
    return await apiService.actualizarDatos(`/users/${idUsuario}`, datosUsuario)
  },

  // Eliminar usuario del sistema
  async eliminarUsuario(idUsuario) {
    return await apiService.eliminarDatos(`/users/${idUsuario}`)
  },

  // Obtener usuario específico por ID
  async obtenerUsuarioPorId(idUsuario) {
    const usuarios = await this.obtenerTodosLosUsuarios()
    return usuarios.find((usuario) => usuario.id === Number.parseInt(idUsuario))
  },
}
