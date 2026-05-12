import { Component, signal, OnInit } from '@angular/core';
import { Project } from '../../../shared/models/project.model';

const MOCK_PROJECTS: Project[] = [
  {
    id: 1, name: 'TaskForge MVP', description: 'Core platform build', color: '#4f6ef7',
    ownerId: 1, memberIds: [1,2], taskCount: 12, completedTaskCount: 5,
    status: 'ACTIVE', createdAt: '2026-01-01', updatedAt: '2026-05-01',
  },
  {
    id: 2, name: 'Marketing Site', description: 'Landing page & blog', color: '#22c55e',
    ownerId: 1, memberIds: [1], taskCount: 6, completedTaskCount: 6,
    status: 'ARCHIVED', createdAt: '2025-11-01', updatedAt: '2026-02-28',
  },
  {
    id: 3, name: 'API Integration', description: 'Spring Boot REST endpoints', color: '#f59e0b',
    ownerId: 1, memberIds: [1,3], taskCount: 8, completedTaskCount: 1,
    status: 'ACTIVE', createdAt: '2026-03-01', updatedAt: '2026-05-14',
  },
];

@Component({
  selector: 'tf-project-list',
  standalone: true,
  template: `
    <section class="project-list-page">
      <div class="page-header">
        <h1 class="page-title">Projects</h1>
        <button class="btn btn--primary" disabled>+ New project</button>
      </div>

      <div class="project-grid">
        @for (project of projects(); track project.id) {
          <div class="project-card" [style.border-top-color]="project.color">
            <div class="project-card__header">
              <span class="project-card__dot" [style.background]="project.color"></span>
              <h2 class="project-card__name">{{ project.name }}</h2>
              <span class="project-card__status project-card__status--{{ project.status.toLowerCase() }}">
                {{ project.status }}
              </span>
            </div>
            <p class="project-card__desc">{{ project.description }}</p>
            <div class="project-card__footer">
              <span class="project-card__stat">
                {{ project.completedTaskCount }} / {{ project.taskCount }} tasks
              </span>
              <div class="project-card__progress">
                <div
                  class="project-card__progress-bar"
                  [style.width.%]="progress(project)"
                  [style.background]="project.color"
                ></div>
              </div>
            </div>
          </div>
        } @empty {
          <p class="empty-state">No projects found.</p>
        }
      </div>
    </section>
  `,
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent implements OnInit {
  protected readonly projects = signal<Project[]>([]);

  ngOnInit(): void {
    // TODO: replace with ProjectService.getAll()
    this.projects.set(MOCK_PROJECTS);
  }

  protected progress(project: Project): number {
    if (project.taskCount === 0) return 0;
    return Math.round((project.completedTaskCount / project.taskCount) * 100);
  }
}
