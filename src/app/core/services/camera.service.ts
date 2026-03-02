import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DocumentStore } from '../../store/document.store';
import { CameraPreview, CameraPreviewOptions,CameraPreviewPictureOptions } from '@capacitor-community/camera-preview';

@Injectable({
  providedIn: 'root'
})
export class LexiCameraService {

  constructor(private store: DocumentStore) { }


  async startCameraPreview() {
    const cameraPreviewOptions: CameraPreviewOptions = {
      position: 'rear',
      parent: 'cameraPreview', // ID of a container if you use one, otherwise it's fullscreen
      toBack: true,            // This puts the camera BEHIND your HTML
      className: 'camera-active'
    };

    try {
      await CameraPreview.start(cameraPreviewOptions);
      this.store.setScanning(true); // Triggers scan-line animation [cite: 113]
    } catch (e) {
      this.store.setError('Failed to start camera preview.');
    }
  }

  async stopCameraPreview() {
    await CameraPreview.stop();
    this.store.setScanning(false);
  }

  /**
   * Specifically for your portfolio: This ensures the native dialog
   * pops up as soon as the scanner view is active.
   */
  async checkAndRequestPermissions(): Promise<boolean> {
    try {
      const status = await Camera.checkPermissions();

      if (status.camera === 'granted') {
        return true;
      }

      const request = await Camera.requestPermissions();
      return request.camera === 'granted';
    } catch (error) {
      this.store.setError('PERMISSION_ERROR: Unable to request camera access.');
      return false;
    }
  }

  /**
   * Captures a high-quality image and prepares it for AI processing.
   * Handles native permissions and "User Cancelled" error states.
   */
  async captureDocument() {

    console.log('Inside capture Document function :::',);
    // 2. Use 'this.store' instead of the class name 'DocumentStore'
    this.store.setProcessing(true);

    const pictureOptions: CameraPreviewPictureOptions = {
        quality: 90,
        width: 1024, // Optimized for Gemini 1.5 Flash [cite: 52, 60]
        height: 1024
    };

    try {

      const result = await CameraPreview.capture(pictureOptions);
      this.store.setProcessing(false);
      return result.value; // This is your Base64 string

    } catch (error: any) {
      this.store.setError('Capture failed.');
      this.store.setProcessing(false);
      return null;
    }
  }
}
