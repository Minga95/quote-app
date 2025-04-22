import { Component } from '@angular/core';
import { ErrorService } from 'src/app/service/Error.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  toasts: { id: string; message: string }[] = [];

  constructor(private errorService: ErrorService) {
    this.errorService.toasts$.subscribe(data => {
      this.toasts = data;
    });
  }

  closeToast(id: string) {
    this.errorService.removeError(id);
  }
}
