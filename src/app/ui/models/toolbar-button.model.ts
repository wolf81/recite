export interface ToolbarButton {
  /**
   * Tabler icon class, e.g. 'ti ti-plus'
   */
  icon: string;

  /**
   * A tooltip to be displayed when mouse hovers over.
   */
  tooltip: string;

  /**
   * A function to invoke on a click.
   */
  action: () => void;

  // variant?: 'primary' | 'contrast' | 'secondary';
  // disabled?: boolean;
}
