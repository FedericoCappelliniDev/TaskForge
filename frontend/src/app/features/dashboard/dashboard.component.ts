import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Project } from '../../shared/models/project.model';
import { Task } from '../../shared/models/task.model';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';

@Component({
  selector: 'tf-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="dashboard">
      <h1 class="dashboard__title">Dashboard</h1>

      @if (loading()) {
        <p class="loading-text">Loading…</p>
      } @else {

      <!-- KPI cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-card__value">{{ activeProjects().length }}</span>
          <span class="stat-card__label">Active projects</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__value">{{ openTasks().length }}</span>
          <span class="stat-card__label">Open tasks</span>
        </div>
        <div class="stat-card stat-card--accent">
          <span class="stat-card__value">{{ dueThisWeek().length }}</span>
          <span class="stat-card__label">Due this week</span>
        </div>
      </div>

      <!-- Recent tasks -->
      <div class="section">
        <h2 class="section__title">Recent tasks</h2>
        @if (recentTasks().length === 0) {
          <p class="empty-hint">No tasks yet. <a routerLink="/tasks" class="link">Create one</a></p>
        } @else {
          <ul class="task-list">
            @for (task of recentTasks(); track task.id) {
              <li class="task-item">
                <span class="task-item__status task-item__status--{{ task.status.toLowerCase() }}">
                  {{ task.status.replace('_', ' ') }}
                </span>
                <span class="task-item__title">{{ task.title }}</span>
                <span class="task-item__priority">{{ task.priority }}</span>
              </li>
            }
          </ul>
        }
      </div>

      <!-- Active projects -->
      <div class="section">
        <h2 class="section__title">Active projects</h2>
        @if (activeProjects().length === 0) {
          <p class="empty-hint">No active projects. <a routerLink="/projects" class="link">Create one</a></p>
        } @else {
          <ul class="project-list">
            @for (project of activeProjects(); track project.id) {
              <li class="project-item" [style.border-left-color]="project.color">
                <span class="project-item__name">{{ project.name }}</span>
                <span class="project-item__stat">
                  {{ project.completedTaskCount }} / {{ project.taskCount }} done
                </span>
              </li>
            }
          </ul>
        }
      </div>

      }
    </section>
  `,
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly taskService    = inject(TaskService);

  protected readonly loading  = signal(true);
  private readonly _projects  = signal<Project[]>([]);
  private readonly _tasks     = signal<Task[]>([]);

  protected readonly activeProjects = computed(() =>
    this._projects().filter(p => p.status === 'ACTIVE'));

  protected readonly openTasks = computed(() =>
    this._tasks().filter(t => t.status !== 'DONE'));

  protected readonly dueThisWeek = computed(() => {
    const now    = new Date();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() + (7 - now.getDay()));
    return this._tasks().filter(t => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return d >= now && d <= sunday;
    });
  });

  protected readonly recentTasks = computed(() =>
    [...this._tasks()].slice(0, 5));

  ngOnInit(): void {
    forkJoin({
      projects: this.projectService.getAll({ size: 50 }),
      tasks:    this.taskService.getAll({ size: 50 }),
    }).subscribe({
      next: ({ projects, tasks }) => {
        this._projects.set(projects.content);
        this._tasks.set(tasks.content);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}

