import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ToolbarButton } from '../models/toolbar-button.model';
import { Breadcrumb, BreadcrumbService } from '../services/breadcrumb.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-page-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './page-layout.component.html',
  styleUrl: './page-layout.component.css'
})
export class PageLayoutComponent implements OnInit {
  @Input() title: string = '';
  @Input() buttons: ToolbarButton[] = [];

  crumbs: Breadcrumb[] = [];

  constructor(private router: Router, private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    const currentRoute = this.router.url ?? '';
    const newCrumb = { label: this.title, route: currentRoute };

    const isRoot = currentRoute.split('/').filter(Boolean).length === 1;
    if (isRoot) {
      this.breadcrumbService.setBreadcrumbs([newCrumb]);
    } else {
      this.breadcrumbService.pushCrumb(newCrumb);
    }

    this.breadcrumbService.crumbs$.subscribe(c => (this.crumbs = c));
  }
}
