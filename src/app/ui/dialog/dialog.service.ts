import { ApplicationRef, createComponent, EnvironmentInjector, Injectable, Injector } from "@angular/core";
import { DialogComponent } from "./dialog.component";
import { DialogContent } from "./dialog-content.model";
import { DialogBuilder } from "./dialog-builder";
import { ConfirmComponent } from "../dialogs/confirm/confirm.component";

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private envInjector: EnvironmentInjector
  ) {}

  open<T extends DialogContent<R>, R>(builder: DialogBuilder<T, R>): Promise<{ action: 'submit' | 'cancel'; data?: R }> {
    return new Promise(resolve => {
      const dialogRef = createComponent(DialogComponent, {
        environmentInjector: this.envInjector,
        elementInjector: this.injector
      });

      this.appRef.attachView(dialogRef.hostView);
      document.body.appendChild(dialogRef.location.nativeElement);

      const options = builder.build();
      dialogRef.instance.title = options.title ?? '';
      dialogRef.instance.okText = options.okText ?? 'OK';
      dialogRef.instance.cancelText = options.cancelText ?? 'Cancel';

      const contentRef = dialogRef.instance.contentRef.createComponent(options.component);

      if (options.data) {
        contentRef.instance.setData(options.data);
      }

      const cleanup = () => {
        this.appRef.detachView(dialogRef.hostView);
        dialogRef.destroy();
      };

      dialogRef.instance.submit.subscribe(() => {
        const data = contentRef.instance.getData?.();
        resolve({ action: 'submit', data });
        cleanup();
      });

      dialogRef.instance.cancel.subscribe(() => {
        resolve({ action: 'cancel' });
        cleanup();
      });
    });
  }

  async showConfirmation(
    title: string,
    message: string,
    okText: string = 'OK',
    cancelText: string = 'Cancel'): Promise<boolean> {
    const builder = new DialogBuilder<ConfirmComponent, string>(ConfirmComponent)
      .withTitle(title)
      .withData(message)
      .withOkText(okText)
      .withCancelText(cancelText);

    const result = await this.open(builder);
    return result.action === 'submit';
  }
}
