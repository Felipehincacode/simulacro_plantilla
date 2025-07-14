# Sistema de Gestión de Cursos - SPA

Una Single Page Application desarrollada con JavaScript Vanilla para la gestión de usuarios y cursos con autenticación y roles diferenciados.

## 🚀 Características

- **Autenticación completa**: Login, registro y gestión de sesiones
- **Roles diferenciados**: Administrador y Visitante con permisos específicos
- **CRUD completo**: Gestión de usuarios, cursos e inscripciones
- **SPA**: Navegación sin recarga de página
- **Responsive**: Diseño adaptable a diferentes dispositivos
- **Persistencia**: Uso de localStorage y sessionStorage

## 🛠 Tecnologías Utilizadas

- HTML5
- CSS3 (Flexbox/Grid)
- JavaScript Vanilla (ES6+)
- json-server (API simulada)

## 📋 Requisitos Previos

- Node.js instalado
- npm o yarn

## 🔧 Instalación y Configuración

1. **Clonar o descargar el proyecto**

2. **Instalar json-server globalmente**:
   \`\`\`bash
   npm install -g json-server
   \`\`\`

3. **Iniciar el servidor de la API**:
   \`\`\`bash
   json-server --watch db.json --port 3000
   \`\`\`

4. **Abrir el archivo `index.html` en un navegador** o usar un servidor local:
   \`\`\`bash
   # Con Python 3
   python -m http.server 8000
   
   # Con Node.js (si tienes http-server instalado)
   npx http-server
   \`\`\`

## 👥 Usuarios de Prueba

### Administrador
- **Email**: admin@admin.com
- **Contraseña**: admin123

### Visitante
- **Email**: juan@email.com
- **Contraseña**: 123456

## 🎯 Funcionalidades por Rol

### Administrador
- ✅ Acceso al panel administrativo
- ✅ CRUD completo de usuarios
- ✅ CRUD completo de cursos
- ✅ Visualización de estadísticas
- ✅ Gestión de inscripciones

### Visitante
- ✅ Registro e inicio de sesión
- ✅ Visualización de cursos disponibles
- ✅ Inscripción a cursos
- ✅ Gestión de sus inscripciones
- ✅ Dashboard personalizado

## 🗂 Estructura del Proyecto

\`\`\`
/
├── index.html          # Página principal
├── main.js            # Lógica principal de la aplicación
├── styles.css         # Estilos CSS
├── db.json           # Base de datos simulada
└── README.md         # Documentación
\`\`\`

## 🔄 API Endpoints

La aplicación utiliza json-server que proporciona los siguientes endpoints:

- `GET/POST/PUT/DELETE /users` - Gestión de usuarios
- `GET/POST/PUT/DELETE /courses` - Gestión de cursos  
- `GET/POST/PUT/DELETE /enrollments` - Gestión de inscripciones

## 💾 Almacenamiento

### localStorage (Persistente)
- Información del usuario actual
- Preferencias de la aplicación

### sessionStorage (Temporal)
- Estado de autenticación
- Datos de navegación temporal

## 🎨 Características de la Interfaz

- **Diseño responsivo**: Adaptable a móviles y escritorio
- **Navegación intuitiva**: Sidebar colapsible y header fijo
- **Modales**: Para formularios de creación y edición
- **Alertas**: Notificaciones de éxito y error
- **Loading**: Indicadores de carga durante las operaciones

## 🔐 Seguridad

- Validación de formularios en el frontend
- Verificación de roles para acceso a funcionalidades
- Gestión segura de sesiones
- Validación de email y campos requeridos

## 📱 Responsive Design

La aplicación está optimizada para:
- 📱 Móviles (< 768px)
- 💻 Tablets (768px - 1024px)
- 🖥 Escritorio (> 1024px)

## 🚀 Uso de la Aplicación

1. **Iniciar sesión** con las credenciales de prueba
2. **Navegar** por las diferentes secciones usando el sidebar
3. **Crear/Editar/Eliminar** usuarios y cursos (solo admin)
4. **Inscribirse** a cursos (solo visitantes)
5. **Gestionar inscripciones** desde el panel correspondiente

## 🐛 Solución de Problemas

### El servidor no inicia
- Verificar que json-server esté instalado: `npm list -g json-server`
- Verificar que el puerto 3000 esté libre

### Error de CORS
- Asegurarse de servir la aplicación desde un servidor HTTP
- No abrir directamente el archivo HTML en el navegador

### Datos no se cargan
- Verificar que json-server esté ejecutándose en el puerto 3000
- Comprobar la consola del navegador para errores de red
- Verificar que el archivo db.json tenga el formato correcto

### Problemas de autenticación
- Limpiar localStorage y sessionStorage: `localStorage.clear()` y `sessionStorage.clear()`
- Verificar las credenciales de usuario en db.json

## 📝 Notas de Desarrollo

### Nomenclatura
- Todas las variables están en **camelCase**
- Funciones descriptivas y bien nombradas
- Clases CSS semánticas y organizadas

### Modularización
- Código organizado en funciones específicas
- Separación clara de responsabilidades
- Servicios independientes para cada entidad

### Comentarios
- Funciones documentadas con propósito claro
- Explicaciones para lógica compleja
- Comentarios útiles sin redundancia

## 🔄 Flujo de la Aplicación

1. **Carga inicial**: Verificación de autenticación
2. **Routing**: Navegación SPA con history API
3. **Renderizado**: Contenido dinámico según ruta y rol
4. **Interacciones**: CRUD con feedback visual
5. **Persistencia**: Almacenamiento local de sesión

## 🎯 Criterios de Evaluación Cumplidos

- ✅ **Nomenclatura camelCase**: Todas las variables siguen la convención
- ✅ **json-server funcional**: API REST completa en puerto 3000
- ✅ **CRUD con fetch**: Operaciones completas con async/await
- ✅ **SPA**: Navegación sin recarga usando history API
- ✅ **localStorage/sessionStorage**: Uso correcto de ambos
- ✅ **Funcionalidad completa**: Sin errores en consola
- ✅ **Modularización**: Código bien organizado
- ✅ **Comentarios explicativos**: Funciones documentadas

## 🚀 Comandos Rápidos

\`\`\`bash
# Iniciar API
json-server --watch db.json --port 3000

# Servidor local (opcional)
python -m http.server 8000
# o
npx http-server

# Verificar API
curl http://localhost:3000/users
\`\`\`

## 📞 Soporte

Para problemas o dudas sobre la implementación, verificar:
1. Consola del navegador para errores
2. Network tab para problemas de API
3. Formato correcto del archivo db.json
4. Puertos disponibles (3000 para API, 8000 para frontend)

---

**Desarrollado con JavaScript Vanilla - Sin frameworks externos**
