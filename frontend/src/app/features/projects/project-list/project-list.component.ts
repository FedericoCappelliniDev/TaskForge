import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Project } from '../../../shared/models/project.model';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'tf-project-list',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="project-list-page">
      <div class="page-header">
        <h1 class="page-title">Projects</h1>
        <button class="btn btn--primary" (click)="openCreate()">+ New project</button>
      </div>

      @if (loading()) {
        <p class="loading-text">Loading projects…</p>
      } @else {
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
              <button
                class="btn-icon btn-icon--danger"
                title="Delete project"
                (click)="deleteProject(project)"
                [disabled]="deletingId() === project.id"
              >✕</button>
            </div>
          </div>
        } @empty {
          <p class="empty-state">No projects found.</p>
        }
      </div>
      }
    </section>

    <!-- ── Create Project Modal ───────────────────────────────────────────── -->
    @if (showCreateModal()) {
      <div class="modal-backdrop" (click)="closeCreate()">
        <div class="modal" (click)="$event.stopPropagation()" role="dialog" aria-modal="true"
             aria-labelledby="modal-title">
          <h2 class="modal__title" id="modal-title">New project</h2>

          @if (createError()) {
            <p class="modal__error" role="alert">{{ createError() }}</p>
          }

          <form [formGroup]="createForm" (ngSubmit)="submitCreate()" class="modal__form" novalidate>

            <div class="form-group">
              <label class="form-label" for="cp-name">Name *</label>
              <input id="cp-name" class="form-input" type="text"
                     formControlName="name" placeholder="Project name" />
              @if (createForm.controls.name.invalid && createForm.controls.name.touched) {
                <span class="form-error">Name is required.</span>
              }
            </div>

            <div class="form-group">
              <label class="form-label" for="cp-description">Description</label>
              <textarea id="cp-description" class="form-input form-input--textarea"
                        formControlName="description" rows="3"
                        placeholder="Optional description"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label" for="cp-color">Color</label>
              <input id="cp-color" class="form-input form-input--color" type="color"
                     formControlName="color" />
            </div>

            <div class="modal__actions">
              <button type="button" class="btn btn--ghost" (click)="closeCreate()">Cancel</button>
              <button type="submit" class="btn btn--primary" [disabled]="creating()">
                {{ creating() ? 'Creating…' : 'Create project' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly fb             = inject(FormBuilder);

  protected readonly projects   = signal<Project[]>([]);
  protected readonly loading    = signal(true);
  protected readonly deletingId = signal<number | null>(null);

  // Modal state
  protected readonly showCreateModal = signal(false);
  protected readonly creating        = signal(false);
  protected readonly createError     = signal<string | null>(null);

  protected readonly createForm = this.fb.nonNullable.group({
    name:        ['', Validators.required],
    description: [''],
    color:       ['#4f6ef7'],
  });

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.loading.set(true);
    this.projectService.getAll({ size: 100 }).subscribe({
      next:  page => { this.projects.set(page.content); this.loading.set(false); },
      error: ()   => this.loading.set(false),
    });
  }

  protected progress(project: Project): number {
    if (project.taskCount === 0) return 0;
    return Math.round((project.completedTaskCount / project.taskCount) * 100);
  }

  protected deleteProject(project: Project): void {
    if (!confirm(`Delete "${project.name}"? All its tasks will also be removed.`)) return;
    this.deletingId.set(project.id);
    this.projectService.delete(project.id).subscribe({
      next:  () => { this.projects.update(l => l.filter(p => p.id !== project.id)); this.deletingId.set(null); },
      error: () => this.deletingId.set(null),
    });
  }

  protected openCreate(): void {
    this.createForm.reset({ name: '', description: '', color: '#4f6ef7' });
    this.createError.set(null);
    this.showCreateModal.set(true);
  }

  protected closeCreate(): void { this.showCreateModal.set(false); }

  protected submitCreate(): void {
    if (this.createForm.invalid) { this.createForm.markAllAsTouched(); return; }
    this.creating.set(true);
    this.createError.set(null);

    const v = this.createForm.getRawValue();
    this.projectService.create({
      name:        v.name,
      description: v.description || undefined,
      color:       v.color,
    }).subscribe({
      next: project => {
        this.projects.update(l => [project, ...l]);
        this.creating.set(false);
        this.closeCreate();
      },
      error: () => {
        this.createError.set('Failed to create project. Please try again.');
        this.creating.set(false);
      },
    });
  }
}

