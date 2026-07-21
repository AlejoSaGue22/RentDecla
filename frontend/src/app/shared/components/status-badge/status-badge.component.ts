import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="'status-badge ' + statusClass">
      <span class="status-dot"></span>
      <span class="status-label">{{ label }}</span>
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }
    .status-pending .status-dot { background: #f59e0b; }

    .status-in-progress {
      background: #dbeafe;
      color: #1e40af;
    }
    .status-in-progress .status-dot { background: #3b82f6; }

    .status-completed {
      background: #dcfce7;
      color: #166534;
    }
    .status-completed .status-dot { background: #22c55e; }

    .status-error {
      background: #fee2e2;
      color: #991b1b;
    }
    .status-error .status-dot { background: #ef4444; }

    .status-neutral {
      background: #f1f5f9;
      color: #475569;
    }
    .status-neutral .status-dot { background: #94a3b8; }
  `],
})
export class StatusBadgeComponent {
  @Input() status!: string;
  @Input() label!: string;

  get statusClass(): string {
    const map: Record<string, string> = {
      pending_invitation: 'status-pending',
      pending_profile: 'status-in-progress',
      pending_documents: 'status-pending',
      in_review: 'status-in-progress',
      requires_correction: 'status-error',
      completed: 'status-completed',
      archived: 'status-neutral',
      not_started: 'status-neutral',
      in_progress: 'status-in-progress',
      awaiting_documents: 'status-pending',
    };
    return map[this.status] || 'status-neutral';
  }
}