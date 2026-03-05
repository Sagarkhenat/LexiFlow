import { Component, inject,OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DocumentStore } from '../../../store/document.store'; // Adjust path as needed
import { LexiCameraService } from 'src/app/core/services/camera.service';
import { AIProcessorService } from 'src/app/core/services/ai-processor.service';

@Component({
  selector: 'app-scan-overlay',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './scan-overlay.component.html',
  styleUrls: ['./scan-overlay.component.scss']
})
export class ScanOverlayComponent {
  //use constructor instead of inject
  public store: DocumentStore = inject(DocumentStore);
  private cameraService = inject(LexiCameraService);

  constructor(private renderer: Renderer2, private aiProcessor: AIProcessorService) {

  }

  ngOnInit() {

    console.log('Inside ng OnInit scan overlay component :::');
    // Add the class to body when the scanner starts
    this.renderer.addClass(document.body, 'scanner-active');


    document.body.classList.add('scanning-active');
  }


  // This would be triggered by the capture button in the template
  async onCapture() {
    const base64 = await this.cameraService.captureDocument();
    console.log('base64 string obtained at onCapture feature :::', base64);
    if (base64) {
      console.log('Image captured successfully at 1024px');
      // Ready for AIProcessorService

      const analysis = await this.aiProcessor.processImage(base64);

      if (analysis) {
        // Navigate to the details page or show results
        console.log('Final Ai Processor Result obtained ::::', analysis);
      } else {

      }

    } else {

    }
  }

  async ngOnDestroy() {

    await this.cameraService.stopCameraPreview();
    console.log('Inside ng OnDestroy scan overlay component :::');
    // Crucial: Remove the class when leaving the page to fix background for future pages
    this.renderer.removeClass(document.body, 'scanner-active');

    // Remove the 'scanning-active' class from the body
    // to bring back the app's background/UI colors.
    document.querySelector('body')?.classList.remove('scanning-active');

  }

}
