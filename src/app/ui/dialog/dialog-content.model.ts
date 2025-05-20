export interface DialogContent<T> {
  getData(): T;
  setData(data: T) : void;
}
