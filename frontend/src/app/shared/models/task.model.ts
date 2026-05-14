export interface Task {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly status: TaskStatus;
  readonly priority: TaskPriority;
  readonly projectId: number;
  readonly assigneeId: number | null;
  readonly dueDate: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export type TaskStatus   = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type TaskPriority = 'LOW'  | 'MEDIUM'       | 'HIGH'      | 'URGENT';

export interface CreateTaskRequest {
  readonly title: string;
  readonly description?: string;
  readonly priority: TaskPriority;
  readonly projectId: number;
  readonly assigneeId?: number;
  readonly dueDate?: string;
}

export interface UpdateTaskRequest {
  readonly title?: string;
  readonly description?: string;
  readonly status?: TaskStatus;
  readonly priority?: TaskPriority;
  readonly assigneeId?: number | null;
  readonly dueDate?: string | null;
}

export interface UpdateTaskStatusRequest {
  readonly status: TaskStatus;
}
