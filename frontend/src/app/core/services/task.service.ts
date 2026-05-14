import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Page } from '../../shared/models/api.model';
import {
  Task,
  TaskStatus,
  TaskPriority,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
} from '../../shared/models/task.model';

export interface TaskFilters {
  projectId?:  number;
  status?:     TaskStatus;
  priority?:   TaskPriority;
  assigneeId?: number;
  page?:       number;
  size?:       number;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly api = inject(ApiService);
  private readonly base = '/tasks';

  getAll(filters: TaskFilters = {}): Observable<Page<Task>> {
    const params: Record<string, string | number | boolean> = {};
    if (filters.projectId  != null) params['projectId']  = filters.projectId;
    if (filters.status     != null) params['status']     = filters.status;
    if (filters.priority   != null) params['priority']   = filters.priority;
    if (filters.assigneeId != null) params['assigneeId'] = filters.assigneeId;
    if (filters.page       != null) params['page']       = filters.page;
    if (filters.size       != null) params['size']       = filters.size;
    return this.api.getPaged<Task>(this.base, params);
  }

  getById(id: number): Observable<Task> {
    return this.api.get<Task>(`${this.base}/${id}`);
  }

  create(request: CreateTaskRequest): Observable<Task> {
    return this.api.post<Task>(this.base, request);
  }

  update(id: number, request: UpdateTaskRequest): Observable<Task> {
    return this.api.put<Task>(`${this.base}/${id}`, request);
  }

  updateStatus(id: number, request: UpdateTaskStatusRequest): Observable<Task> {
    return this.api.patch<Task>(`${this.base}/${id}/status`, request);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`);
  }
}
