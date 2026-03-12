import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, ViewWillEnter } from '@ionic/angular';
import { DocumentStore } from '../../store/document.store';
import { ErrorDisplayComponent } from 'src/app/shared/components/error-display-component/error-display-component.component';
import { LexiCameraService } from 'src/app/core/services/camera.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ErrorDisplayComponent]
})
export class DetailsPage implements ViewWillEnter {
  private store = inject(DocumentStore);
  private navCtrl = inject(NavController);
  private cameraService = inject(LexiCameraService);

  public results = this.store.results;
  public error = this.store.error;

  ionViewWillEnter() {
    document.body.classList.remove('scanning-active');
    this.cameraService.stopCameraPreview();
  }

  public discardAndScanAgain(): void {
    this.store.resetState();
    this.navCtrl.navigateBack('/scanner');
  }

  public saveDocument(): void {
    const currentData = this.results();
    console.log('Saving to database...', currentData);
    this.navCtrl.navigateRoot('/dashboard');
  }

  // --- SENIOR FLEX: UI FORMATTING HELPERS ---

  /** Cleans up snake_case keys (e.g., 'company_name' -> 'Company Name') */
  public formatKey(key: any): string {
    if (!key) return '';
    const str = key.toString().replace(/_/g, ' ');
    return str.replace(/\b\w/g, (l: string) => l.toUpperCase());
  }

  /** Type Guard: Checks if the value is a nested JSON object */
  public isObject(value: any): boolean {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  /** Type Guard: Checks if the value is an array (like invoice items) */
  public isArray(value: any): boolean {
    return Array.isArray(value);
  }
}
