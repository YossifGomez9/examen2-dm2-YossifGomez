import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Geolocation, PermissionStatus } from '@capacitor/geolocation';
import { GoogleMapsLoaderService } from '../services/google-maps-loader.service';

declare const google: any;

@Component({
  selector: 'app-map-page',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonSpinner,
  ],
})
export class MapPage implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef<HTMLDivElement>;

  latitude: number | null = null;
  longitude: number | null = null;
  loading = true;
  errorMessage = '';
  permissionDenied = false;

  private map: any;
  private marker: any;

  constructor(private mapsLoader: GoogleMapsLoaderService) {}

  async ngAfterViewInit(): Promise<void> {
    await this.initMapFlow();
  }

  private async initMapFlow(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    this.permissionDenied = false;

    try {
      await this.mapsLoader.load();

      const granted = await this.ensureLocationPermission();

      if (!granted) {
        this.permissionDenied = true;
        this.errorMessage = 'Permiso de ubicación no concedido.';
        this.loading = false;
        return;
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      });

      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;

      this.renderMap(this.latitude, this.longitude);
    } catch (error) {
      console.error(error);
      this.errorMessage = 'No se pudo obtener la ubicación o cargar el mapa.';
    } finally {
      this.loading = false;
    }
  }

  private async ensureLocationPermission(): Promise<boolean> {
    let status: PermissionStatus = await Geolocation.checkPermissions();

    if (this.isGranted(status)) {
      return true;
    }

    status = await Geolocation.requestPermissions();

    return this.isGranted(status);
  }

  private isGranted(status: PermissionStatus): boolean {
    return status.location === 'granted' || status.coarseLocation === 'granted';
  }

  private renderMap(lat: number, lng: number): void {
    const center = { lat, lng };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      center,
      zoom: 18,
      mapId: 'DEMO_MAP_ID',
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    });

    const markerImage = document.createElement('img');
    markerImage.src = 'assets/gas.pns';
    markerImage.alt = 'gas';
    markerImage.style.width = '64px';
    markerImage.style.height = '64px';
    markerImage.style.objectFit = 'contain';

    this.marker = new google.maps.marker.AdvancedMarkerElement({
      map: this.map,
      position: center,
      title: 'Mi ubicación actual',
      anchorLeft: '-50%',
      anchorTop: '-100%',
    });

    this.marker.append(markerImage);

    this.map.setCenter(center);
    this.map.setZoom(18);
  }
}