export interface Project {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly color: string;
  readonly ownerId: number;
  readonly memberIds: number[];
  readonly taskCount: number;
  readonly completedTaskCount: number;
  readonly status: ProjectStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export type ProjectStatus = 'ACTIVE' | 'ARCHIVED' | 'ON_HOLD';

export interface CreateProjectRequest {
  readonly name: string;
  readonly description: string;
  readonly color: string;
}
