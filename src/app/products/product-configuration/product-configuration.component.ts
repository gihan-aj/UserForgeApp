import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-product-configuration',
  standalone: true,
  imports: [MatTableModule, CommonModule],
  templateUrl: './product-configuration.component.html',
  styleUrl: './product-configuration.component.scss',
})
export class ProductConfigurationComponent {}
