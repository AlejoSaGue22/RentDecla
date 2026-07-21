import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state">
      <div class="empty-icon">
        <span class="material-icons-round">{{ icon }}</span>
      </div>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .empty-icon {
      width: 80px;
      height: 80px;
      background: #f1f5f9;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
    }

    .empty-icon .material-icons-round {
      font-size: 40px;
      color: #94a3b8;
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: #334155;
      margin: 0 0 8px 0;
    }

    p {
      font-size: 14px;
      color: #64748b;
      margin: 0 0 24px 0;
      max-width: 320px;
    }
  `],
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title = 'No hay datos';
  @Input() message = 'Aquí aparecerá la información cuando esté disponible.';
}