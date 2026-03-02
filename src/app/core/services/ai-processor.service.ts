import { Injectable } from '@angular/core';
import { DocumentStore } from '../../store/document.store';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AIProcessorService {

  constructor(private http: HttpClient, private store: DocumentStore) {}

  async processImage(base64Image: string) {
    this.store.setProcessing(true);

    const payload = {
      contents: [{
        parts: [
          { text: "Extract text from this document and summarize the key points into JSON format." },
          { inline_data: { mime_type: "image/jpeg", data: base64Image } }
        ]
      }]
    };

    console.log('Payload to be passed for processing image :::', payload);

    try {
      const response: any = await firstValueFrom(
        this.http.post(`${environment.geminiUrl}?key=${environment.geminiApiKey}`, payload)
      );

      // Senior Flex: Sophisticated parsing of the AI response
      const rawText = response.candidates[0].content.parts[0].text;

      // Senior Flex: Clean up Markdown code blocks if the AI included them
      const jsonString = rawText.replace(/```json|```/g, '').trim();
      const parsedData = JSON.parse(jsonString);

      console.log('Parsed AI Result:', parsedData);

      console.log('AI Analysis Complete result obtained as :::', rawText);

      // Store the result in our Signal-based state
      this.store.setProcessing(false);

      return parsedData;

    } catch (error) {
      this.store.setError('AI_PROCESSING_FAILED: Check your connection or API key.');
      this.store.setProcessing(false);
      return null;
    }
  }
}
