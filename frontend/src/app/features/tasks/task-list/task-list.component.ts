import { Component, signal, OnInit } from '@angular/core';
import { Task, TaskStatus, TaskPriority } from '../../../shared/models/task.model';

const MOCK_TASKS: Task[] = [
  { id: 1, title: 'Design login page', description: 'Figma mockup + Angular implementation',
    status: 'DONE', priority: 'HIGH', projectId: 1, assigneeId: 1,
    dueDate: '2026-05-10', createdAt: '2026-04-01', updatedAt: '2026-05-10' },
  { id: 2, title: 'Implement auth guard', description: 'Functional guard with redirect',
    status: 'IN_PROGRESS', priority: 'HIGH', projectId: 1, assigneeId: 1,
    dueDate: '2026-05-15', createdAt: '2026-04-05', updatedAt: '2026-05-14' },
  { id: 3, title: 'Write API service', description: 'Generic HttpClient wrapper',
    status: 'TODO', priority: 'MEDIUM', projectId: 1, assigneeId: null,
    dueDate: null, createdAt: '2026-04-10', updatedAt: '2026-04-10' },
  { id: 4, title: 'Set up CI/CD pipeline', description: 'GitHub Actions for Angular + Spring',
    status: 'TODO', priority: 'LOW', projectId: 3, assigneeId: null,
    dueDate: '2026-06-01', createdAt: '2026-05-01', updatedAt: '2026-05-01' },
  { id: 5, title: 'Database schema design', description: 'ERD for tasks, projects, users',
    status: 'IN_REVIEW', priority: 'URGENT', projectId: 3, assigneeId: 1,
    dueDate: '2026-05-20', createdAt: '2026-04-20', updatedAt: '2026-05-13' },
];

@Component({
  selector: 'tf-task-list',
  standalone: true,
  template: `
    <section class="task-list-page">
      <div class="page-header">
        <h1 class="page-title">Tasks</h1>
        <button class="btn btn--primary" disabled>+ New task</button>
      </div>

      <div class="task-table-wrapper">
        <table class="task-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due date</th>
            </tr>
          </thead>
          <tbody>
            @for (task of tasks(); track task.id) {
              <tr class="task-row">
                <td class="task-row__title">{{ task.title }}</td>
                <td>
                  <span class="badge badge--{{ task.status.toLowerCase() }}">
                    {{ task.status.replace('_', ' ') }}
                  </span>
                </td>
                <td>
                  <span class="badge badge--priority-{{ task.priority.toLowerCase() }}">
                    {{ task.priority }}
                  </span>
                </td>
                <td class="task-row__due">
                  {{ task.dueDate ?? '—' }}
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="empty-state">No tasks found.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `,
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  protected readonly tasks = signal<Task[]>([]);

  ngOnInit(): void {
    // TODO: replace with TaskService.getAll()
    this.tasks.set(MOCK_TASKS);
  }
}
