export interface JiraConfig {
  baseURL: string;
  username: string;
  apiToken: string;
}

export interface JiraUser {
  self: string;
  key: string;
  name: string;
  emailAddress: string;
  displayName: string;
  active: boolean;
  timeZone: string;
  accountId: string;
}

export interface JiraStatus {
  self: string;
  description: string;
  iconUrl: string;
  name: string;
  id: string;
  statusCategory: {
    self: string;
    id: number;
    key: string;
    colorName: string;
    name: string;
  };
}

export interface JiraPriority {
  self: string;
  iconUrl: string;
  name: string;
  id: string;
}

export interface JiraIssueType {
  self: string;
  id: string;
  description: string;
  iconUrl: string;
  name: string;
  subtask: boolean;
  avatarId: number;
}

export interface JiraProject {
  self: string;
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  simplified: boolean;
  avatarUrls: {
    "48x48": string;
    "24x24": string;
    "16x16": string;
    "32x32": string;
  };
  projectCategory?: {
    self: string;
    id: string;
    name: string;
    description: string;
  };
  lead?: JiraUser;
  description?: string;
}

export interface JiraIssueFields {
  summary: string;
  status: JiraStatus;
  assignee?: JiraUser;
  reporter?: JiraUser;
  priority?: JiraPriority;
  issuetype: JiraIssueType;
  project: JiraProject;
  description?: string;
  created: string;
  updated: string;
  resolutiondate?: string;
  duedate?: string;
  labels: string[];
  components: Array<{
    self: string;
    id: string;
    name: string;
    description?: string;
  }>;
  fixVersions: Array<{
    self: string;
    id: string;
    name: string;
    description?: string;
    archived: boolean;
    released: boolean;
    releaseDate?: string;
  }>;
  customfield_10000?: string; // Story Points (ejemplo)
}

export interface JiraIssue {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: JiraIssueFields;
}

export interface JiraSearchResult {
  expand: string;
  startAt: number;
  maxResults: number;
  total: number;
  issues: JiraIssue[];
}

export interface JiraComment {
  self: string;
  id: string;
  author: JiraUser;
  body: string;
  updateAuthor: JiraUser;
  created: string;
  updated: string;
  visibility?: {
    type: string;
    value: string;
  };
}

export interface JiraCreateIssueRequest {
  fields: {
    project: {
      key: string;
    };
    summary: string;
    description?: string;
    issuetype: {
      name: string;
    };
    priority?: {
      name: string;
    };
    assignee?: {
      name: string;
    };
    labels?: string[];
    components?: Array<{
      name: string;
    }>;
    duedate?: string;
  };
}

export interface JiraCreateIssueResponse {
  id: string;
  key: string;
  self: string;
}

export interface JiraUpdateIssueRequest {
  fields?: {
    summary?: string;
    description?: string;
    assignee?: {
      name: string;
    };
    priority?: {
      name: string;
    };
    labels?: string[];
    duedate?: string;
  };
  transition?: {
    id: string;
  };
}

export interface JiraTransition {
  id: string;
  name: string;
  to: {
    self: string;
    description: string;
    iconUrl: string;
    name: string;
    id: string;
    statusCategory: {
      self: string;
      id: number;
      key: string;
      colorName: string;
      name: string;
    };
  };
}

export interface JiraTransitionsResponse {
  expand: string;
  transitions: JiraTransition[];
}
