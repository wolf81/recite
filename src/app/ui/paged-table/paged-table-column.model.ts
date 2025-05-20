export type PagedTableColumnValueMapper<T> = (keyof T) | ((item: T) => string | boolean);

export interface PagedTableColumn<T> {
  /**
   * A label to display in the column header.
   */
  label: string;

  /**
   * A value mapper, which can be either the name of a field in T or a function that takes T and returns a string or boolean.
   */
  mapper: PagedTableColumnValueMapper<T>;
}

export function createColumns<T>(columns: PagedTableColumn<T>[]): PagedTableColumn<T>[] {
  return columns;
}
