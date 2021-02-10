import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  commonConfig = {
    positionClass: 'toast-top-right',
  }
  constructor(private toaster: ToastrService) { }

  error(title = 'Something went wrong', message: string, config = {}) {
    this.toaster.error(message, title, {
      ...this.commonConfig,
      ...config
    }); 
  }

  success(title: string, message: string, config = {}) {
    this.toaster.success(message, title, {
      ...this.commonConfig,
      ...config
    }); 
  }
}
