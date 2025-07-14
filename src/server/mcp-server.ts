import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { JiraApiService } from "../services/jira-api.js";
import {
  GetIssueArgs,
  CreateIssueArgs,
  UpdateIssueArgs,
  SearchIssuesArgs,
  AddCommentArgs,
  GetProjectInfoArgs,
  GetTransitionsArgs,
} from "../types/args.js";

export class JiraMCPServer {
  private server: Server;
  private jiraApiService: JiraApiService;

  constructor() {
    this.server = new Server({
      name: "jira-mcp-server",
      version: "1.0.0",
    });

    this.jiraApiService = new JiraApiService();
    this.setupHandlers();
  }

  private setupHandlers(): void {
    // Listar herramientas disponibles
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "get_issue",
            description:
              "Obtener información completa de un issue específico de Jira",
            inputSchema: {
              type: "object",
              properties: {
                issueKey: {
                  type: "string",
                  description: "La clave del issue (ej: PROJ-123)",
                },
              },
              required: ["issueKey"],
            },
          },
          {
            name: "create_issue",
            description: "Crear un nuevo issue en Jira",
            inputSchema: {
              type: "object",
              properties: {
                projectKey: {
                  type: "string",
                  description: "Clave del proyecto",
                },
                summary: {
                  type: "string",
                  description: "Resumen del issue",
                },
                description: {
                  type: "string",
                  description: "Descripción del issue",
                },
                issueType: {
                  type: "string",
                  description: "Tipo de issue (Bug, Story, Task, Epic, etc.)",
                },
                priority: {
                  type: "string",
                  description: "Prioridad (Highest, High, Medium, Low, Lowest)",
                },
                assignee: {
                  type: "string",
                  description: "Usuario asignado (username o email)",
                },
                labels: {
                  type: "array",
                  items: { type: "string" },
                  description: "Etiquetas del issue",
                },
                duedate: {
                  type: "string",
                  description: "Fecha de vencimiento (YYYY-MM-DD)",
                },
              },
              required: ["projectKey", "summary", "issueType"],
            },
          },
          {
            name: "update_issue",
            description: "Actualizar un issue existente",
            inputSchema: {
              type: "object",
              properties: {
                issueKey: {
                  type: "string",
                  description: "La clave del issue a actualizar",
                },
                summary: {
                  type: "string",
                  description: "Nuevo resumen",
                },
                description: {
                  type: "string",
                  description: "Nueva descripción",
                },
                status: {
                  type: "string",
                  description: "Nuevo estado (usar nombre del estado)",
                },
                assignee: {
                  type: "string",
                  description: "Nuevo asignado (username o email)",
                },
                priority: {
                  type: "string",
                  description: "Nueva prioridad",
                },
                labels: {
                  type: "array",
                  items: { type: "string" },
                  description: "Nuevas etiquetas",
                },
                duedate: {
                  type: "string",
                  description: "Nueva fecha de vencimiento (YYYY-MM-DD)",
                },
              },
              required: ["issueKey"],
            },
          },
          {
            name: "search_issues",
            description: "Buscar issues usando JQL (Jira Query Language)",
            inputSchema: {
              type: "object",
              properties: {
                jql: {
                  type: "string",
                  description: "Query JQL para buscar issues",
                },
                maxResults: {
                  type: "number",
                  description: "Número máximo de resultados",
                  default: 50,
                },
                startAt: {
                  type: "number",
                  description: "Índice del primer resultado",
                  default: 0,
                },
              },
              required: ["jql"],
            },
          },
          {
            name: "add_comment",
            description: "Agregar comentario a un issue",
            inputSchema: {
              type: "object",
              properties: {
                issueKey: {
                  type: "string",
                  description: "La clave del issue",
                },
                comment: {
                  type: "string",
                  description: "Texto del comentario",
                },
              },
              required: ["issueKey", "comment"],
            },
          },
          {
            name: "get_project_info",
            description: "Obtener información completa de un proyecto",
            inputSchema: {
              type: "object",
              properties: {
                projectKey: {
                  type: "string",
                  description: "Clave del proyecto",
                },
              },
              required: ["projectKey"],
            },
          },
          {
            name: "get_transitions",
            description: "Obtener transiciones disponibles para un issue",
            inputSchema: {
              type: "object",
              properties: {
                issueKey: {
                  type: "string",
                  description: "La clave del issue",
                },
              },
              required: ["issueKey"],
            },
          },
        ],
      };
    });

    // Manejar llamadas a herramientas
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        if (!args) {
          throw new Error("Argumentos requeridos");
        }

        switch (name) {
          case "get_issue":
            return await this.jiraApiService.getIssue(
              args as unknown as GetIssueArgs
            );
          case "create_issue":
            return await this.jiraApiService.createIssue(
              args as unknown as CreateIssueArgs
            );
          case "update_issue":
            return await this.jiraApiService.updateIssue(
              args as unknown as UpdateIssueArgs
            );
          case "search_issues":
            return await this.jiraApiService.searchIssues(
              args as unknown as SearchIssuesArgs
            );
          case "add_comment":
            return await this.jiraApiService.addComment(
              args as unknown as AddCommentArgs
            );
          case "get_project_info":
            return await this.jiraApiService.getProjectInfo(
              args as unknown as GetProjectInfoArgs
            );
          case "get_transitions":
            return await this.jiraApiService.getTransitions(
              args as unknown as GetTransitionsArgs
            );
          default:
            throw new Error(`Herramienta desconocida: ${name}`);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";
        return {
          content: [
            {
              type: "text",
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Servidor MCP de Jira iniciado con Axios y TypeScript");
  }
}
