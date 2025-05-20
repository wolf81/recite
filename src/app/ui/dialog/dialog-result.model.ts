export interface DialogResult<T> {
  action: 'submit' | 'cancel';
  data?: T;
}
