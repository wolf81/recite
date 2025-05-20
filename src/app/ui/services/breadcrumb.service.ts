import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Breadcrumb {
  label: string;
  route: string;
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private crumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
  readonly crumbs$ = this.crumbsSubject.asObservable();

  // Replace stack when a new page layout is initialized
  setBreadcrumbs(crumbs: Breadcrumb[]) {
    this.crumbsSubject.next(crumbs);
  }

  // Push a new level to the stack
  pushCrumb(crumb: Breadcrumb) {
    const current = this.crumbsSubject.value;
    this.crumbsSubject.next([...current, crumb]);
  }

  reset() {
    this.crumbsSubject.next([]);
  }
}
