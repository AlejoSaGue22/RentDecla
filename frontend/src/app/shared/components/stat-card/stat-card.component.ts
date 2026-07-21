import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card" [class.animate-scale-in]="animate">
      <div class="stat-icon" [style.background]="iconBg">
        <span class="material-icons-round" [style.color]="iconColor">{{ icon }}</span>
      </div>
      <div class="stat-content">
        <p class="stat-label">{{ label }}</p>
        <p class="stat-value">{{ value }}</p>
        <p *ngIf="sublabel" class="stat-sublabel">{{ sublabel }}</p>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: flex-start;
      gap: 20px;
      transition: all 0.2s ease;
      border: 1px solid #e2e8f0;
    }

    .stat-card:hover {
      border-color: #cbd5e1;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon .material-icons-round {
      font-size: 28px;
    }

    .stat-content {
      flex: 1;
      min-width: 0;
    }

    .stat-label {
      font-size: 13px;
      color: #64748b;
      margin: 0 0 4px 0;
      font-weight: 500;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      line-height: 1.2;
      letter-spacing: -0.02em;
    }

    .stat-sublabel {
      font-size: 12px;
      color: #94a3b8;
      margin: 4px 0 0 0;
    }
  `],
})
export class StatCardComponent {
  @Input() icon = 'analytics';
  @Input() iconBg = '#eff6ff';
  @Input() iconColor = '#2563eb';
  @Input() label = '';
  @Input() value: number | string = 0;
  @Input() sublabel = '';
  @Input() animate = false;
}