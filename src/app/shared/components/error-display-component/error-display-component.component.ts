import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-error-display',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './error-display.component.html',
  styleUrls: ['./error-display.component.scss']
})
export class ErrorDisplayComponent {
  @Input() message: string | null = null;

  // Helper to determine the visual style based on the error type
  get errorType() {
    if (!this.message) return null;
    if (this.message.toLowerCase().includes('blurry')) return 'warning';
    if (this.message.toLowerCase().includes('offline')) return 'danger';
    return 'info';
  }
}
