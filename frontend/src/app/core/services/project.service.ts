import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Page } from '../../shared/models/api.model';
import {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from '../../shared/models/project.model';

export interface ProjectFilters {
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly api  = inject(ApiService);
  private readonly base = '/projects';

  getAll(filters: ProjectFilters = {}): Observable<Page<Project>> {
    const params: Record<string, string | number | boolean> = {};
    if (filters.page != null) params['page'] = filters.page;
    if (filters.size != null) params['size'] = filters.size;
    return this.api.getPaged<Project>(this.base, params);
  }

  getById(id: number): Observable<Project> {
    return this.api.get<Project>(`${this.base}/${id}`);
  }

  create(request: CreateProjectRequest): Observable<Project> {
    return this.api.post<Project>(this.base, request);
  }

  update(id: number, request: UpdateProjectRequest): Observable<Project> {
    return this.api.put<Project>(`${this.base}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`);
  }
}
