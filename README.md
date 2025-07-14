# Jira MCP Server

Un servidor MCP (Model Context Protocol) para integración con Jira que permite interactuar con la API de Jira a través de herramientas estructuradas.

## 📋 Descripción

Este proyecto implementa un servidor MCP que actúa como intermediario entre aplicaciones compatibles con MCP y la API REST de Jira. Permite realizar operaciones comunes de Jira como crear, actualizar, buscar issues y gestionar proyectos de manera programática.

## 🚀 Características

- ✅ **Gestión completa de issues**: Crear, leer, actualizar y buscar issues
- ✅ **Búsqueda avanzada**: Soporte completo para JQL (Jira Query Language)
- ✅ **Gestión de comentarios**: Agregar comentarios a issues existentes
- ✅ **Información de proyectos**: Obtener detalles completos de proyectos
- ✅ **Transiciones de estado**: Consultar y ejecutar transiciones de workflow
- ✅ **TypeScript**: Completamente tipado para mejor desarrollo
- ✅ **Manejo de errores**: Logging detallado y manejo robusto de errores
- ✅ **Autenticación segura**: Soporte para API tokens de Jira

## 🛠️ Tecnologías

- **Node.js** >= 18.0.0
- **TypeScript** 5.3+
- **Axios** para llamadas HTTP
- **@modelcontextprotocol/sdk** para el protocolo MCP

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd jira-mcp-server
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
JIRA_BASE_URL=https://tu-dominio.atlassian.net
JIRA_USERNAME=tu-email@ejemplo.com
JIRA_API_TOKEN=tu-api-token-de-jira
```

#### Generar token de API en Jira:

1. **Ve a tu perfil de Atlassian**

   - Accede a [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
   - O navega desde tu instancia de Jira: Avatar → Manage account

2. **Security → API tokens**

   - En el menú lateral, selecciona "Security"
   - Haz clic en "API tokens"

3. **Crea un nuevo token**

   - Clic en "Create API token"
   - Asigna un nombre descriptivo (ej: "jira-mcp-server")
   - Clic en "Create"

4. **Guárdalo en las variables de entorno**
   - Copia el token generado inmediatamente (no podrás verlo nuevamente)
   - Pégalo en tu archivo `.env` como valor de `JIRA_API_TOKEN`

> ⚠️ **Importante**: El token solo se muestra una vez. Si lo pierdes, deberás generar uno nuevo.

### 4. Compilar el proyecto

```bash
npm run build
```

### 5. Ejecutar el servidor

```bash
npm start
```

## 🔧 Scripts disponibles

```bash
npm run build     # Compilar TypeScript a JavaScript
npm run start     # Ejecutar el servidor compilado
npm run dev       # Modo desarrollo con watch
npm run clean     # Limpiar archivos compilados
npm run type-check # Verificar tipos sin compilar
npx -y @modelcontextprotocol/inspector npx -y tsx src/index.ts # Abre un inspector en el navegador para probar el mcp-server
```

## 🛠️ Herramientas disponibles

El servidor MCP expone las siguientes herramientas:

### 1. `get_issue`

Obtiene información completa de un issue específico.

**Parámetros:**

- `issueKey` (string, requerido): Clave del issue (ej: "PROJ-123")

**Ejemplo de uso:**

```json
{
  "name": "get_issue",
  "arguments": {
    "issueKey": "PROJ-123"
  }
}
```

### 2. `create_issue`

Crea un nuevo issue en Jira.

**Parámetros:**

- `projectKey` (string, requerido): Clave del proyecto
- `summary` (string, requerido): Resumen del issue
- `issueType` (string, requerido): Tipo de issue (Bug, Story, Task, Epic, etc.)
- `description` (string, opcional): Descripción detallada
- `priority` (string, opcional): Prioridad (Highest, High, Medium, Low, Lowest)
- `assignee` (string, opcional): Usuario asignado (username o email)
- `labels` (array, opcional): Etiquetas del issue
- `duedate` (string, opcional): Fecha de vencimiento (YYYY-MM-DD)

**Ejemplo de uso:**

```json
{
  "name": "create_issue",
  "arguments": {
    "projectKey": "PROJ",
    "summary": "Nuevo bug encontrado",
    "issueType": "Bug",
    "description": "Descripción detallada del bug",
    "priority": "High",
    "assignee": "usuario@ejemplo.com"
  }
}
```

### 3. `update_issue`

Actualiza un issue existente.

**Parámetros:**

- `issueKey` (string, requerido): Clave del issue a actualizar
- `summary` (string, opcional): Nuevo resumen
- `description` (string, opcional): Nueva descripción
- `status` (string, opcional): Nuevo estado (usar nombre del estado)
- `assignee` (string, opcional): Nuevo asignado
- `priority` (string, opcional): Nueva prioridad
- `labels` (array, opcional): Nuevas etiquetas
- `duedate` (string, opcional): Nueva fecha de vencimiento

### 4. `search_issues`

Busca issues usando JQL (Jira Query Language).

**Parámetros:**

- `jql` (string, requerido): Query JQL para buscar issues
- `maxResults` (number, opcional): Número máximo de resultados (default: 50)
- `startAt` (number, opcional): Índice del primer resultado (default: 0)

**Ejemplo de uso:**

```json
{
  "name": "search_issues",
  "arguments": {
    "jql": "project = PROJ AND status = 'In Progress'",
    "maxResults": 25
  }
}
```

### 5. `add_comment`

Agrega un comentario a un issue.

**Parámetros:**

- `issueKey` (string, requerido): Clave del issue
- `comment` (string, requerido): Texto del comentario

### 6. `get_project_info`

Obtiene información completa de un proyecto.

**Parámetros:**

- `projectKey` (string, requerido): Clave del proyecto

### 7. `get_transitions`

Obtiene las transiciones disponibles para un issue.

**Parámetros:**

- `issueKey` (string, requerido): Clave del issue

## 📁 Estructura del proyecto

```
jira-mcp-server/
├── src/
│   ├── config/
│   │   └── jira.ts              # Configuración de conexión Jira
│   ├── server/
│   │   └── mcp-server.ts        # Implementación del servidor MCP
│   ├── services/
│   │   └── jira-api.ts          # Servicio de API de Jira
│   ├── types/
│   │   ├── args.ts              # Tipos de argumentos
│   │   └── jira.ts              # Tipos de datos de Jira
│   └── index.ts                 # Punto de entrada
├── build/                       # Archivos compilados
├── package.json
├── tsconfig.json
└── README.md
```

## 🔍 Ejemplos de uso con JQL

### Buscar issues por proyecto y estado

```jql
project = MYPROJECT AND status = "In Progress"
```

### Buscar bugs de alta prioridad

```jql
project = MYPROJECT AND issuetype = Bug AND priority = High
```

### Buscar issues asignados a un usuario

```jql
assignee = "usuario@ejemplo.com" AND status != Done
```

### Buscar issues creados en los últimos 7 días

```jql
project = MYPROJECT AND created >= -7d
```

## 🐛 Solución de problemas

### Error de autenticación

- Verifica que las variables de entorno estén configuradas correctamente
- Asegúrate de que el API token sea válido y no haya expirado
- Confirma que el usuario tenga permisos en el proyecto de Jira

### Error de conexión

- Verifica que la URL base de Jira sea correcta
- Asegúrate de que el servidor Jira esté accesible
- Revisa la conectividad de red

### Issues con JQL

- Valida la sintaxis JQL en la interfaz web de Jira
- Verifica que los nombres de campos y valores sean correctos
- Consulta la [documentación oficial de JQL](https://support.atlassian.com/jira-software-cloud/docs/use-advanced-search-with-jira-query-language-jql/)

## 📄 Licencia

MIT License - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Yasmany Breffpacheco**

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📚 Referencias

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Jira REST API Documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [JQL Documentation](https://support.atlassian.com/jira-software-cloud/docs/use-advanced-search-with-jira-query-language-jql/)
