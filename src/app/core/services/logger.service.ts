import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class LoggerService {
    log(message: string, data?: any) {
    if (!environment.production) {
      console.log('[APP]', message, data || '');
    }
  }

  warn(message: string, data?: any) {
    console.warn('[APP WARN]', message, data || '');
  }

  error(message: string, data?: any) {
    console.error('[APP ERROR]', message, data || '');
  }
}