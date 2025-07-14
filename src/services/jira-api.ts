import { AxiosInstance } from "axios";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import {
  JiraIssue,
  JiraSearchResult,
  JiraProject,
  JiraComment,
  JiraCreateIssueRequest,
  JiraCreateIssueResponse,
  JiraUpdateIssueRequest,
  JiraTransitionsResponse,
} from "../types/jira.js";
import {
  GetIssueArgs,
  CreateIssueArgs,
  UpdateIssueArgs,
  SearchIssuesArgs,
  AddCommentArgs,
  GetProjectInfoArgs,
  GetTransitionsArgs,
} from "../types/args.js";
import { createJiraClient } from "../config/jira.js";

export class JiraApiService {
  private jiraClient: AxiosInstance;

  constructor() {
    this.jiraClient = createJiraClient();
  }

  async getIssue(args: GetIssueArgs): Promise<CallToolResult> {
    const response = await this.jiraClient.get<JiraIssue>(
      `/issue/${args.issueKey}`
    );
    const issue = response.data;

    const issueInfo = {
      key: issue.key,
      id: issue.id,
      summary: issue.fields.summary,
      status: issue.fields.status.name,
      assignee: issue.fields.assignee?.displayName || "No asignado",
      reporter: issue.fields.reporter?.displayName || "No especificado",
      priority: issue.fields.priority?.name || "No especificada",
      issueType: issue.fields.issuetype.name,
      project: {
        key: issue.fields.project.key,
        name: issue.fields.project.name,
      },
      description: issue.fields.description || "Sin descripción",
      created: issue.fields.created,
      updated: issue.fields.updated,
      resolutiondate: issue.fields.resolutiondate || null,
      duedate: issue.fields.duedate || null,
      labels: issue.fields.labels,
      components: issue.fields.components.map((c) => ({
        name: c.name,
        description: c.description,
      })),
      fixVersions: issue.fields.fixVersions.map((v) => ({
        name: v.name,
        description: v.description,
        released: v.released,
        releaseDate: v.releaseDate,
      })),
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(issueInfo, null, 2),
        },
      ],
      isError: false,
    };
  }

  async createIssue(args: CreateIssueArgs): Promise<CallToolResult> {
    const issueData: JiraCreateIssueRequest = {
      fields: {
        project: {
          key: args.projectKey,
        },
        summary: args.summary,
        description: args.description || "",
        issuetype: {
          name: args.issueType,
        },
      },
    };

    if (args.priority) {
      issueData.fields.priority = { name: args.priority };
    }

    if (args.assignee) {
      issueData.fields.assignee = { name: args.assignee };
    }

    if (args.labels && args.labels.length > 0) {
      issueData.fields.labels = args.labels;
    }

    if (args.duedate) {
      issueData.fields.duedate = args.duedate;
    }

    const response = await this.jiraClient.post<JiraCreateIssueResponse>(
      "/issue",
      issueData
    );
    const result = response.data;

    return {
      content: [
        {
          type: "text",
          text: `Issue creado exitosamente: ${result.key} (ID: ${result.id})`,
        },
      ],
      isError: false,
    };
  }

  async updateIssue(args: UpdateIssueArgs): Promise<CallToolResult> {
    const updateData: JiraUpdateIssueRequest = { fields: {} };

    if (args.summary) updateData.fields!.summary = args.summary;
    if (args.description) updateData.fields!.description = args.description;
    if (args.assignee) updateData.fields!.assignee = { name: args.assignee };
    if (args.priority) updateData.fields!.priority = { name: args.priority };
    if (args.labels) updateData.fields!.labels = args.labels;
    if (args.duedate) updateData.fields!.duedate = args.duedate;

    // Actualizar campos
    if (Object.keys(updateData.fields!).length > 0) {
      await this.jiraClient.put(`/issue/${args.issueKey}`, updateData);
    }

    // Manejar transición de estado si se especifica
    if (args.status) {
      const transitionsResponse =
        await this.jiraClient.get<JiraTransitionsResponse>(
          `/issue/${args.issueKey}/transitions`
        );
      const transition = transitionsResponse.data.transitions.find(
        (t) => t.name === args.status
      );

      if (transition) {
        await this.jiraClient.post(`/issue/${args.issueKey}/transitions`, {
          transition: {
            id: transition.id,
          },
        });
      } else {
        throw new Error(
          `Estado "${args.status}" no encontrado o no disponible para este issue`
        );
      }
    }

    return {
      content: [
        {
          type: "text",
          text: `Issue ${args.issueKey} actualizado exitosamente`,
        },
      ],
      isError: false,
    };
  }

  async searchIssues(args: SearchIssuesArgs): Promise<CallToolResult> {
    const searchParams = {
      jql: args.jql,
      maxResults: args.maxResults || 50,
      startAt: args.startAt || 0,
      fields: [
        "key",
        "summary",
        "status",
        "assignee",
        "priority",
        "created",
        "updated",
        "issuetype",
        "project",
      ],
    };

    const response = await this.jiraClient.post<JiraSearchResult>(
      "/search",
      searchParams
    );
    const result = response.data;

    const issues = result.issues.map((issue: JiraIssue) => ({
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status.name,
      assignee: issue.fields.assignee?.displayName || "No asignado",
      priority: issue.fields.priority?.name || "No especificada",
      issueType: issue.fields.issuetype.name,
      project: {
        key: issue.fields.project.key,
        name: issue.fields.project.name,
      },
      created: issue.fields.created,
      updated: issue.fields.updated,
    }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              total: result.total,
              startAt: result.startAt,
              maxResults: result.maxResults,
              issues: issues,
            },
            null,
            2
          ),
        },
      ],
      isError: false,
    };
  }

  async addComment(args: AddCommentArgs): Promise<CallToolResult> {
    const commentData = {
      body: args.comment,
    };

    const response = await this.jiraClient.post<JiraComment>(
      `/issue/${args.issueKey}/comment`,
      commentData
    );
    const comment = response.data;

    return {
      content: [
        {
          type: "text",
          text: `Comentario agregado al issue ${args.issueKey} (ID: ${comment.id})`,
        },
      ],
      isError: false,
    };
  }

  async getProjectInfo(args: GetProjectInfoArgs): Promise<CallToolResult> {
    const response = await this.jiraClient.get<JiraProject>(
      `/project/${args.projectKey}`
    );
    const project = response.data;

    const projectInfo = {
      key: project.key,
      id: project.id,
      name: project.name,
      projectTypeKey: project.projectTypeKey,
      simplified: project.simplified,
      lead: project.lead
        ? {
            name: project.lead.name,
            displayName: project.lead.displayName,
            emailAddress: project.lead.emailAddress,
          }
        : null,
      description: project.description || "Sin descripción",
      projectCategory: project.projectCategory
        ? {
            name: project.projectCategory.name,
            description: project.projectCategory.description,
          }
        : null,
      avatarUrls: project.avatarUrls,
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(projectInfo, null, 2),
        },
      ],
      isError: false,
    };
  }

  async getTransitions(args: GetTransitionsArgs): Promise<CallToolResult> {
    const response = await this.jiraClient.get<JiraTransitionsResponse>(
      `/issue/${args.issueKey}/transitions`
    );
    const transitions = response.data.transitions;

    const transitionInfo = transitions.map((transition) => ({
      id: transition.id,
      name: transition.name,
      to: {
        name: transition.to.name,
        description: transition.to.description,
        statusCategory: transition.to.statusCategory.name,
      },
    }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              issueKey: args.issueKey,
              availableTransitions: transitionInfo,
            },
            null,
            2
          ),
        },
      ],
      isError: false,
    };
  }
}
