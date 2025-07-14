// Utilidades para validación de datos
const validacionUtils = {
  // Validar formato de correo electrónico
  validarCorreoElectronico(correo) {
    const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return patronCorreo.test(correo)
  },

  // Validar que los campos requeridos no estén vacíos
  validarCamposRequeridos(datosFormulario, camposRequeridos) {
    const erroresEncontrados = []

    camposRequeridos.forEach((campo) => {
      if (!datosFormulario[campo] || datosFormulario[campo].trim() === "") {
        erroresEncontrados.push(`El campo ${campo} es requerido`)
      }
    })

    return erroresEncontrados
  },

  // Validar formulario completo
  validarFormularioCompleto(datosFormulario, camposRequeridos) {
    const errores = this.validarCamposRequeridos(datosFormulario, camposRequeridos)

    // Validar correo si está presente
    if (datosFormulario.email && !this.validarCorreoElectronico(datosFormulario.email)) {
      errores.push("El formato del correo electrónico no es válido")
    }

    // Validar longitud de contraseña
    if (datosFormulario.password && datosFormulario.password.length < 6) {
      errores.push("La contraseña debe tener al menos 6 caracteres")
    }

    return errores
  },

  // Limpiar datos de entrada
  limpiarDatosEntrada(datos) {
    const datosLimpios = {}
    for (const [clave, valor] of Object.entries(datos)) {
      if (typeof valor === "string") {
        datosLimpios[clave] = valor.trim()
      } else {
        datosLimpios[clave] = valor
      }
    }
    return datosLimpios
  },
}
