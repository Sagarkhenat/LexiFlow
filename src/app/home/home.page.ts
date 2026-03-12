import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ScanOverlayComponent } from '../shared/components/scan-overlay-component/scan-overlay.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, ScanOverlayComponent],
})
export class HomePage {
  // SENIOR FLEX: This page is now a clean, stateless container.
  // ALL hardware lifecycle and state logic is strictly encapsulated
  // inside the ScanOverlayComponent where it belongs.
  constructor() {}
}
