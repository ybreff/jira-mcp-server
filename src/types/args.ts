// Tipos para argumentos de las herramientas
export interface GetIssueArgs {
  issueKey: string;
}

export interface CreateIssueArgs {
  projectKey: string;
  summary: string;
  description?: string;
  issueType: string;
  priority?: string;
  assignee?: string;
  labels?: string[];
  duedate?: string;
}

export interface UpdateIssueArgs {
  issueKey: string;
  summary?: string;
  description?: string;
  status?: string;
  assignee?: string;
  priority?: string;
  labels?: string[];
  duedate?: string;
}

export interface SearchIssuesArgs {
  jql: string;
  maxResults?: number;
  startAt?: number;
}

export interface AddCommentArgs {
  issueKey: string;
  comment: string;
}

export interface GetProjectInfoArgs {
  projectKey: string;
}

export interface GetTransitionsArgs {
  issueKey: string;
}
