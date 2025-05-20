import { Type } from "@angular/core";
import { DialogContent } from "./dialog-content.model";

export interface DialogOptions<T extends DialogContent<R>, R> {
  component: Type<T>;
  data?: R;
  title?: string;
  okText?: string;
  cancelText?: string;
}
