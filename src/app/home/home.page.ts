import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { imageOutline, location } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, NgIf],
})
export class HomePage {
  imageUrl: string | null = null;

  constructor() {
    addIcons({
      imageOutline,
      location,
    });
  }

  async seleccionarImagen(): Promise<void> {
    try {
      await Camera.requestPermissions({
        permissions: ['camera', 'photos'],
      });

      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
        promptLabelHeader: 'Seleccionar imagen',
        promptLabelPhoto: 'Desde galería',
        promptLabelPicture: 'Tomar foto',
        promptLabelCancel: 'Cancelar',
      });

      this.imageUrl = photo.webPath ?? null;
    } catch (error) {
      console.log('El usuario canceló la acción o ocurrió un error:', error);
    }
  }
}