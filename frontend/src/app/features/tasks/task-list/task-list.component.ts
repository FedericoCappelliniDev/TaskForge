import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskStatus, TaskPriority } from '../../../shared/models/task.model';
import { Project } from '../../../shared/models/project.model';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'tf-task-list',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="task-list-page">
      <div class="page-header">
        <h1 class="page-title">Tasks</h1>
        <button class="btn btn--primary" (click)="openCreate()">+ New task</button>
      </div>

      @if (loading()) {
        <p class="loading-text">Loading tasks…</p>
      } @else {
      <div class="task-table-wrapper">
        <table class="task-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            @for (task of tasks(); track task.id) {
              <tr class="task-row">
                <td class="task-row__title">{{ task.title }}</td>
                <td>
                  <select
                    class="status-select badge badge--{{ task.status.toLowerCase() }}"
                    [value]="task.status"
                    (change)="changeStatus(task, $any($event.target).value)"
                    [disabled]="savingId() === task.id"
                  >
                    @for (s of allStatuses; track s) {
                      <option [value]="s">{{ s.replace('_', ' ') }}</option>
                    }
                  </select>
                </td>
                <td>
                  <span class="badge badge--priority-{{ task.priority.toLowerCase() }}">
                    {{ task.priority }}
                  </span>
                </td>
                <td class="task-row__due">{{ task.dueDate ?? '—' }}</td>
                <td class="task-row__actions">
                  <button
                    class="btn-icon btn-icon--danger"
                    title="Delete task"
                    (click)="deleteTask(task)"
                    [disabled]="savingId() === task.id"
                  >✕</button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5" class="empty-state">No tasks found.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      }
    </section>

    <!-- ── Create Task Modal ──────────────────────────────────────────────── -->
    @if (showCreateModal()) {
      <div class="modal-backdrop" (click)="closeCreate()">
        <div class="modal" (click)="$event.stopPropagation()" role="dialog" aria-modal="true"
             aria-labelledby="modal-title">
          <h2 class="modal__title" id="modal-title">New task</h2>

          @if (createError()) {
            <p class="modal__error" role="alert">{{ createError() }}</p>
          }

          <form [formGroup]="createForm" (ngSubmit)="submitCreate()" class="modal__form" novalidate>

            <div class="form-group">
              <label class="form-label" for="ct-title">Title *</label>
              <input id="ct-title" class="form-input" type="text"
                     formControlName="title" placeholder="Task title" />
              @if (createForm.controls.title.invalid && createForm.controls.title.touched) {
                <span class="form-error">Title is required.</span>
              }
            </div>

            <div class="form-group">
              <label class="form-label" for="ct-description">Description</label>
              <textarea id="ct-description" class="form-input form-input--textarea"
                        formControlName="description" rows="3"
                        placeholder="Optional description"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="ct-priority">Priority *</label>
                <select id="ct-priority" class="form-input" formControlName="priority">
                  @for (p of allPriorities; track p) {
                    <option [value]="p">{{ p }}</option>
                  }
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="ct-project">Project *</label>
                <select id="ct-project" class="form-input" formControlName="projectId">
                  <option value="">— select —</option>
                  @for (proj of projects(); track proj.id) {
                    <option [value]="proj.id">{{ proj.name }}</option>
                  }
                </select>
                @if (createForm.controls.projectId.invalid && createForm.controls.projectId.touched) {
                  <span class="form-error">Project is required.</span>
                }
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="ct-due">Due date</label>
              <input id="ct-due" class="form-input" type="date" formControlName="dueDate" />
            </div>

            <div class="modal__actions">
              <button type="button" class="btn btn--ghost" (click)="closeCreate()">Cancel</button>
              <button type="submit" class="btn btn--primary" [disabled]="creating()">
                {{ creating() ? 'Creating…' : 'Create task' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  private readonly taskService    = inject(TaskService);
  private readonly projectService = inject(ProjectService);
  private readonly fb             = inject(FormBuilder);

  protected readonly tasks    = signal<Task[]>([]);
  protected readonly projects = signal<Project[]>([]);
  protected readonly loading  = signal(true);
  protected readonly savingId = signal<number | null>(null);

  // Modal state
  protected readonly showCreateModal = signal(false);
  protected readonly creating        = signal(false);
  protected readonly createError     = signal<string | null>(null);

  protected readonly allStatuses:   TaskStatus[]   = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
  protected readonly allPriorities: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  protected readonly createForm = this.fb.nonNullable.group({
    title:       ['', Validators.required],
    description: [''],
    priority:    ['HIGH' as TaskPriority, Validators.required],
    projectId:   ['', Validators.required],
    dueDate:     [''],
  });

  ngOnInit(): void {
    this.loadTasks();
    this.projectService.getAll({ size: 100 }).subscribe(p => this.projects.set(p.content));
  }

  private loadTasks(): void {
    this.loading.set(true);
    this.taskService.getAll({ size: 100 }).subscribe({
      next:  page  => { this.tasks.set(page.content); this.loading.set(false); },
      error: ()    => this.loading.set(false),
    });
  }

  protected changeStatus(task: Task, status: TaskStatus): void {
    this.savingId.set(task.id);
    this.taskService.updateStatus(task.id, { status }).subscribe({
      next: updated => {
        this.tasks.update(list => list.map(t => t.id === task.id ? updated : t));
        this.savingId.set(null);
      },
      error: () => this.savingId.set(null),
    });
  }

  protected deleteTask(task: Task): void {
    if (!confirm(`Delete "${task.title}"?`)) return;
    this.savingId.set(task.id);
    this.taskService.delete(task.id).subscribe({
      next:  () => { this.tasks.update(l => l.filter(t => t.id !== task.id)); this.savingId.set(null); },
      error: () => this.savingId.set(null),
    });
  }

  protected openCreate(): void {
    this.createForm.reset({ priority: 'HIGH', title: '', description: '', projectId: '', dueDate: '' });
    this.createError.set(null);
    this.showCreateModal.set(true);
  }

  protected closeCreate(): void { this.showCreateModal.set(false); }

  protected submitCreate(): void {
    if (this.createForm.invalid) { this.createForm.markAllAsTouched(); return; }
    this.creating.set(true);
    this.createError.set(null);

    const v = this.createForm.getRawValue();
    this.taskService.create({
      title:       v.title,
      description: v.description || undefined,
      priority:    v.priority,
      projectId:   Number(v.projectId),
      dueDate:     v.dueDate || undefined,
    }).subscribe({
      next: task => {
        this.tasks.update(l => [task, ...l]);
        this.creating.set(false);
        this.closeCreate();
      },
      error: () => {
        this.createError.set('Failed to create task. Please try again.');
        this.creating.set(false);
      },
    });
  }
}

