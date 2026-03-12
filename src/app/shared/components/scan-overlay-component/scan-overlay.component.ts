import { Component, inject, OnDestroy, Renderer2, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { App } from '@capacitor/app';

import { DocumentStore } from '../../../store/document.store';
import { LexiCameraService } from 'src/app/core/services/camera.service';
import { AIProcessorService } from 'src/app/core/services/ai-processor.service';


@Component({
  selector: 'app-scan-overlay',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './scan-overlay.component.html',
  styleUrls: ['./scan-overlay.component.scss']
})
export class ScanOverlayComponent implements OnDestroy {
  public store: DocumentStore = inject(DocumentStore);
  private cameraService = inject(LexiCameraService);
  private renderer = inject(Renderer2);
  private aiProcessor = inject(AIProcessorService);

  private isHardwareActive = false;

  constructor() {

    // The effect automatically runs on initialization and whenever state changes.
    // It is now the ONLY thing controlling the hardware lifecycle.
    effect(() => {
      const hasResults = this.store.results() !== null;
      const hasError = this.store.error() !== null;

      console.log('Effect evaluated. hasResults:', hasResults, '| hasError:', hasError);

      if (hasResults || hasError) {
        console.log('Effect evaluated with result or an error stopping the camera preview :::');
        this.stopHardware();
      } else {
        this.startHardware();
      }
    });


    // 2. SENIOR FLEX: Native App Lifecycle Listener (Handles OS backgrounding)
    App.addListener('appStateChange', async ({ isActive }) => {
      console.log('App state changed. Is the lexiflow app active?', isActive);
      if (isActive) {
        // App came back to foreground. Only start if we aren't looking at results/errors.
        if (!this.store.results() && !this.store.error()) {
          await this.startHardware();
        }else{}
      } else {
        // App went to background (or is about to be killed). Release the hardware IMMEDIATELY.
        console.log('App is in background mode :::');
        await this.stopHardware();
      }
    });

  }

  ngOnDestroy() {
    // Failsafe: only stop if the user navigates completely away from the tab/app
    console.log('Inside ng On destroy to stop camera preview ::::');
    this.stopHardware();
  }

  private async startHardware() {

    // If it's already running, ignore the duplicate command!
    if (this.isHardwareActive) return;

    this.isHardwareActive = true;
    console.log('Starting native camera for scanning the documents......');
    this.renderer.addClass(document.body, 'scanning-active');
    await this.cameraService.startCameraPreview();
  }

  private async stopHardware() {

    // If it's already stopped, ignore the duplicate command!
    if (!this.isHardwareActive) return;


    console.log('Inside Stopping native camera...');
    this.isHardwareActive = false;
    this.renderer.removeClass(document.body, 'scanning-active');
    await this.cameraService.stopCameraPreview();
  }

  async onCapture() {
    const base64 = await this.cameraService.captureDocument();
    console.log('base64 string obtained:', !!base64);

    if (base64) {
      await this.aiProcessor.processImage(base64);
    }else{}
  }
}
