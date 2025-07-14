// Import the apiService
const apiService = require("./api-service")

// Servicio específico para gestión de cursos
const cursoService = {
  // Obtener todos los cursos disponibles
  async obtenerTodosLosCursos() {
    return await apiService.obtenerDatos("/courses")
  },

  // Crear un nuevo curso
  async crearNuevoCurso(datosCurso) {
    return await apiService.crearDatos("/courses", datosCurso)
  },

  // Actualizar información de curso existente
  async actualizarCurso(idCurso, datosCurso) {
    return await apiService.actualizarDatos(`/courses/${idCurso}`, datosCurso)
  },

  // Eliminar curso del sistema
  async eliminarCurso(idCurso) {
    return await apiService.eliminarDatos(`/courses/${idCurso}`)
  },

  // Obtener curso específico por ID
  async obtenerCursoPorId(idCurso) {
    const cursos = await this.obtenerTodosLosCursos()
    return cursos.find((curso) => curso.id === Number.parseInt(idCurso))
  },
}
