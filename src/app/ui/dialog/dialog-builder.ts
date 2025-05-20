import { DialogOptions } from "./dialog-options.model";
import { DialogContent } from "./dialog-content.model";
import { Type } from "@angular/core";

export class DialogBuilder<T extends DialogContent<R>, R> {
  private options: DialogOptions<T, R> = {} as DialogOptions<T, R>;

  constructor(component: Type<T>) {
    this.options = {
      component: component
    };
  }

  withData(data: R): this {
    this.options.data = data
    return this;
  }

  withTitle(title: string): this {
    this.options.title = title;
    return this;
  }

  withOkText(okText: string): this {
    this.options.okText = okText;
    return this;
  }

  withCancelText(cancelText: string): this {
    this.options.cancelText = cancelText;
    return this;
  }

  build(): DialogOptions<T, R> {
    if (!this.options.component) {
      throw new Error('Component must be set before building dialog options.');
    }
    return this.options as DialogOptions<T, R>;
  }
}
