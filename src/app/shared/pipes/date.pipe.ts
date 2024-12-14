import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date',
  standalone: true,
})
export class DatePipe implements PipeTransform {
  transform(
    value: Date | string | null | undefined,
    format: string = 'mediumDate',
    locale: string = 'en-US'
  ): string {
    if (!value) {
      return 'Not provided';
    }

    try {
      return formatDate(value, format, locale);
    } catch (error) {
      console.error('Invalid date format or value:', value);
      return 'Invalid date';
    }
  }
}
