import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SupportService } from '../../core/services/support.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class SupportComponent {
  supportForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(private fb: FormBuilder, private supportService: SupportService) {
    this.supportForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  async onSubmit() {
    if (this.supportForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      try {
        await this.supportService.createTicket(this.supportForm.value);
        this.success =
          'Support ticket created successfully! We will get back to you soon.';
        this.supportForm.reset();
      } catch (error: any) {
        this.error =
          error.error?.message ||
          'Failed to create support ticket. Please try again.';
      } finally {
        this.loading = false;
      }
    }
  }
}
