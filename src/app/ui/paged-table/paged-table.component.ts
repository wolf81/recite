import { CommonModule, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { PagedTableColumn, PagedTableColumnValueMapper } from './paged-table-column.model';
import { ToolbarButton } from '../models/toolbar-button.model';

@Component({
  selector: 'app-paged-table',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './paged-table.component.html',
  styleUrl: './paged-table.component.css'
})
export class PagedTableComponent<T> {
  // ─── Inputs ───────────────────────────────────────────────────────────────────
  @Input() set items(value: T[]) {
    this.itemsInternal = value || [];
    this.detectColumnValueTypes();
    this.updateView();
  }

  @Input() set columns(value: PagedTableColumn<T>[]) {
    this.columnsInternal = value || [];
    this.detectColumnValueTypes();
  }

  @Input() placeholder = 'No items to display';
  @Input() pageSize = 10;
  @Input() actionsTemplate!: TemplateRef<any>;
  @Input() buttons: ToolbarButton[] = [];

  // ─── Outputs ──────────────────────────────────────────────────────────────────
  @Output() rowClicked = new EventEmitter<T>();

  // ─── Public API ───────────────────────────────────────────────────────────────
  get items(): T[] {
    return this.itemsInternal;
  }

  get columns(): PagedTableColumn<T>[] {
    return this.columnsInternal;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.sortedItems.length / this.pageSize));
  }

  getColumnValue(item: T, column: PagedTableColumn<T>): string | boolean {
    return this.resolveColumnValue(item, column.mapper);
  }

  getColumnValueType(column: PagedTableColumn<T>): string {
    return this.columnValueTypes.get(column) ?? 'string';
  }

  // ─── Highlight / Hover ────────────────────────────────────────────────────────
  highlightedItems = new Set<T>();
  hoveredItem: T | null = null;

  highlightRow(item: T) {
    this.highlightedItems.delete(item);
    void document.body.offsetHeight; // Force reflow
    this.highlightedItems.add(item);
    setTimeout(() => this.highlightedItems.delete(item), 1000);
  }

  onRowClick(item: T, index: number, event?: MouseEvent) {
    const target = event?.target as HTMLElement;

    if (target?.closest('button, a, input, textarea, [data-ignore-row-click]')) {
      return;
    }

    if (item) {
      this.rowClicked.emit(item);
    }
  }

  // ─── Paging ───────────────────────────────────────────────────────────────────
  page = 1;
  pagedItems: T[] = [];

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.updateView();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.updateView();
    }
  }

  // ─── Sorting ──────────────────────────────────────────────────────────────────
  sortedItems: T[] = [];
  sortColumn: PagedTableColumn<T> | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  onSort(column: PagedTableColumn<T>) {
    if (!column.mapper) return;

    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.page = 1;
    this.updateView();
  }

  // ─── Internal State ───────────────────────────────────────────────────────────
  private itemsInternal: T[] = [];
  private columnsInternal: PagedTableColumn<T>[] = [];
  private columnValueTypes = new Map<PagedTableColumn<T>, string>();

  // ─── Helpers ──────────────────────────────────────────────────────────────────
  private resolveColumnValue(item: T, mapper: PagedTableColumnValueMapper<T>): string | boolean {
    return typeof mapper === 'function' ? mapper(item) : (item[mapper] as string | boolean);
  }

  private detectColumnValueTypes() {
    this.columnValueTypes.clear();

    if (!this.itemsInternal.length || !this.columnsInternal.length) return;

    for (const column of this.columnsInternal) {
      const sample = this.itemsInternal.find(i => this.getColumnValue(i, column) !== undefined);
      const value = sample ? this.getColumnValue(sample, column) : undefined;
      this.columnValueTypes.set(column, typeof value);
    }
  }

  private updateView() {
    this.sortedItems = [...this.itemsInternal];

    if (this.sortColumn?.mapper) {
      const mapper = this.sortColumn.mapper;

      this.sortedItems.sort((a, b) => {
        const aVal = this.resolveColumnValue(a, mapper);
        const bVal = this.resolveColumnValue(b, mapper);

        if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
          return this.sortDirection === 'asc'
            ? Number(aVal) - Number(bVal)
            : Number(bVal) - Number(aVal);
        }

        return this.sortDirection === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    const start = (this.page - 1) * this.pageSize;
    this.pagedItems = this.sortedItems.slice(start, start + this.pageSize);
  }
}
