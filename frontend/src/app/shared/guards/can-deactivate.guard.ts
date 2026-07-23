import { CanDeactivateFn } from '@angular/router';

export interface CanDeactivateComponent {
  canDeactivate: () => boolean;
}

export const canDeactivateGuard: CanDeactivateFn<CanDeactivateComponent> = (component) => {
  return component.canDeactivate();
};
