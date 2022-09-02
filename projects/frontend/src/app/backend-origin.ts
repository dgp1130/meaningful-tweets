import { InjectionToken } from '@angular/core';

/** Token for the host of the backend API service. */
export const backendOriginToken = new InjectionToken<string>('backend-origin');
