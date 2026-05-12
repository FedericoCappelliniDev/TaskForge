import { Component, inject, signal, OnInit } from '@angular/core';
import { Project } from '../../shared/models/project.model';
import { Task } from '../../shared/models/task.model';

/** Mock data — replace with ProjectService / TaskService calls. */
const MOCK_PROJECTS: Project[] = [
  {
    id: 1, name: 'TaskForge MVP', description: 'Build the core platform', color: '#4f6ef7',
    ownerId: 1, memberIds: [1,2], taskCount: 12, completedTaskCount: 5,
    status: 'ACTIVE', createdAt: '2026-01-01', updatedAt: '2026-05-01',
  },
  {
    id: 2, name: 'Marketing Site', description: 'Landing page & content', color: '#22c55e',
    ownerId: 1, memberIds: [1], taskCount: 6, completedTaskCount: 6,
    status: 'ARCHIVED', createdAt: '2025-11-01', updatedAt: '2026-02-28',
  },
];

const MOCK_RECENT_TASKS: Task[] = [
  { id: 1, title: 'Design login page', description: '', status: 'DONE', priority: 'HIGH',
    projectId: 1, assigneeId: 1, dueDate: '2026-05-10', createdAt: '2026-04-01', updatedAt: '2026-05-10' },
  { id: 2, title: 'Implement auth guard', description: '', status: 'IN_PROGRESS', priority: 'HIGH',
    projectId: 1, assigneeId: 1, dueDate: '2026-05-15', createdAt: '2026-04-05', updatedAt: '2026-05-14' },
  { id: 3, title: 'Write API service', description: '', status: 'TODO', priority: 'MEDIUM',
    projectId: 1, assigneeId: null, dueDate: null, createdAt: '2026-04-10', updatedAt: '2026-04-10' },
];

@Component({
  selector: 'tf-dashboard',
  standalone: true,
  template: `
    <section class="dashboard">
      <h1 class="dashboard__title">Dashboard</h1>

      <!-- KPI cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-card__value">{{ projects().length }}</span>
          <span class="stat-card__label">Active projects</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__value">{{ recentTasks().length }}</span>
          <span class="stat-card__label">Open tasks</span>
        </div>
        <div class="stat-card stat-card--accent">
          <span class="stat-card__value">2</span>
          <span class="stat-card__label">Due this week</span>
        </div>
      </div>

      <!-- Recent tasks -->
      <div class="section">
        <h2 class="section__title">Recent tasks</h2>
        <ul class="task-list">
          @for (task of recentTasks(); track task.id) {
            <li class="task-item">
              <span class="task-item__status task-item__status--{{ task.status.toLowerCase() }}">
                {{ task.status }}
              </span>
              <span class="task-item__title">{{ task.title }}</span>
              <span class="task-item__priority">{{ task.priority }}</span>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  protected readonly projects    = signal<Project[]>([]);
  protected readonly recentTasks = signal<Task[]>([]);

  ngOnInit(): void {
    // TODO: replace with ProjectService / TaskService calls
    this.projects.set(MOCK_PROJECTS.filter(p => p.status === 'ACTIVE'));
    this.recentTasks.set(MOCK_RECENT_TASKS);
  }
}
