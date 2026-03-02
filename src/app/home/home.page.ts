import { Component,OnInit, OnDestroy, Renderer2  } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ScanOverlayComponent } from '../shared/components/scan-overlay-component/scan-overlay.component';
import { LexiCameraService } from '../core/services/camera.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, ScanOverlayComponent], // Add it here
})
export class HomePage {
  constructor(private cameraService: LexiCameraService,private renderer: Renderer2) { }


  async ngOnInit() {
    // Request permission immediately on load
    const granted = await this.cameraService.checkAndRequestPermissions();
    console.log('Inside ng OnInit camera request permission status ::::', granted);

    if (granted) {
      this.renderer.addClass(document.body, 'scanning-active');
      console.log('Camera access ready');
      await this.cameraService.startCameraPreview(); // Live feed starts here
    } else {

    }
  }

}
