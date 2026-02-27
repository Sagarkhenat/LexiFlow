import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DocumentStore } from '../../store/document.store';

@Injectable({
  providedIn: 'root'
})
export class LexiCameraService {

  constructor() { }

  /**
   * Captures a high-quality image and prepares it for AI processing.
   * Handles native permissions and "User Cancelled" error states.
   */
  async captureDocument() {
    DocumentStore.setScanning(true);

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt, // Allows user to choose between Camera or Gallery
        width: 1024, // Optimized size for Gemini/OpenAI Vision APIs
      });

      if (image && image.base64String) {
        DocumentStore.setScanning(false);
        DocumentStore.setProcessing(true);

        // This base64 string will be sent to your AI Processor Service next
        return image.base64String;
      }

      throw new Error('IMAGE_CAPTURE_FAILED');

    } catch (error: any) {
      // Senior Flex: Distinguishing between a "User Cancel" and a real "System Error"
      if (error.message === 'User cancelled photos app') {
        DocumentStore.setError(null); // No need to show an error if they just clicked 'back'
      } else {
        DocumentStore.setError('Failed to access camera. Please check permissions.');
      }
      DocumentStore.setScanning(false);
      return null;
    }
  }
}
