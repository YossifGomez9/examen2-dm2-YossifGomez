import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsLoaderService {
  private apiLoaded = false;
  private loadingPromise?: Promise<void>;

  load(): Promise<void> {
    const win = window as any;

    if (this.apiLoaded || win.google?.maps) {
      this.apiLoaded = true;
      return Promise.resolve();
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = new Promise((resolve, reject) => {
      const existingScript = document.getElementById('google-maps-script') as HTMLScriptElement | null;

      if (existingScript) {
        existingScript.addEventListener('load', () => {
          this.apiLoaded = true;
          resolve();
        });
        existingScript.addEventListener('error', () => {
          reject(new Error('No se pudo cargar Google Maps.'));
        });
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyAQOEnpMZo51o4OC8IfGmYMT6jXOxlYqfs&v=weekly&libraries=marker';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.apiLoaded = true;
        resolve();
      };

      script.onerror = () => {
        reject(new Error('No se pudo cargar Google Maps.'));
      };

      document.head.appendChild(script);
    });

    return this.loadingPromise;
  }
}