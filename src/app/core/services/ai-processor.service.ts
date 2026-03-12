import { Injectable } from '@angular/core';
import { DocumentStore } from '../../store/document.store';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AIProcessorService {

  constructor(private http: HttpClient, private store: DocumentStore, private navCtrl: NavController) {}


  async processImage(base64Image: string) {

    try {

      // 1. Trigger the "Optimizing/Processing" loader in the UI
      this.store.setProcessing(true);

      // 2. Construct the payload for Gemini
      const payload = {
        contents: [{
          parts: [
            { text: "Extract the key information from this document and return it as a clean JSON object." },
            { inlineData: { mimeType: "image/jpeg", data: base64Image } }
          ]
        }]
      };

      console.log('Payload to be passed for processing image :::', payload);

      // 3. Make the API Call
      const response = await fetch(`${environment.geminiUrl}?key=${environment.geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('API Request Failed');

      const result = await response.json();
      const rawText = result.candidates[0].content.parts[0].text;

      // 4. Senior Flex: Safely parse the markdown string into a true JSON object
      // Gemini often wraps JSON in ```json ... ``` markdown blocks
      const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanedText);

      console.log('parsedData obtained after gemini call ::::', parsedData);

      // 5. Push the data into the reactive store
      this.store.setResults(parsedData);

      // 6. Navigate to the Details view to show the results
      this.navCtrl.navigateForward('/details');

    } catch (err) {

      console.error('AI Processing Error:', err);
      // Fallback to the robust Error State logic if the document is unreadable or offline
      this.store.setError('Unreadable document or offline state. Please try again.');

    }finally {
      // Always turn off the processing loader
      this.store.setProcessing(false);
    }
    this.store.setProcessing(true);

  }
}
