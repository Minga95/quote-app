import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ToastMessage {
  id: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  showError(message: string, timeoutMs = 5000) {
    const id = crypto.randomUUID();
    const newToast: ToastMessage = { id, message };
    const current = this.toastsSubject.value;
    this.toastsSubject.next([...current, newToast]);
    setTimeout(() => this.removeError(id), timeoutMs);
  }

  removeError(id: string) {
    const current = this.toastsSubject.value.filter(t => t.id !== id);
    this.toastsSubject.next(current);
  }

  clearAll() {
    this.toastsSubject.next([]);
  }
}
