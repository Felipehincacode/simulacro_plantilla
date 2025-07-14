// Import the apiService
const apiService = require("./apiService")

// Servicio específico para gestión de inscripciones
const inscripcionService = {
  // Obtener todas las inscripciones
  async obtenerTodasLasInscripciones() {
    return await apiService.obtenerDatos("/enrollments")
  },

  // Inscribir usuario a un curso
  async inscribirUsuarioEnCurso(idUsuario, idCurso) {
    const datosInscripcion = {
      userId: Number.parseInt(idUsuario),
      courseId: Number.parseInt(idCurso),
      enrollmentDate: new Date().toLocaleDateString("es-ES"),
      status: "active",
    }
    return await apiService.crearDatos("/enrollments", datosInscripcion)
  },

  // Cancelar inscripción de usuario
  async cancelarInscripcion(idInscripcion) {
    return await apiService.eliminarDatos(`/enrollments/${idInscripcion}`)
  },

  // Obtener inscripciones específicas de un usuario
  async obtenerInscripcionesDeUsuario(idUsuario) {
    const inscripciones = await this.obtenerTodasLasInscripciones()
    return inscripciones.filter((inscripcion) => inscripcion.userId === Number.parseInt(idUsuario))
  },

  // Verificar si usuario está inscrito en curso específico
  async verificarInscripcionUsuario(idUsuario, idCurso) {
    const inscripciones = await this.obtenerInscripcionesDeUsuario(idUsuario)
    return inscripciones.some((inscripcion) => inscripcion.courseId === Number.parseInt(idCurso))
  },
}
