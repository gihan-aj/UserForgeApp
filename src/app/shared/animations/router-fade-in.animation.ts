import {
  animate,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const routerFadeIn = trigger('routerFadeIn', [
  transition('* <=> *', [
    query(
      ':enter',
      [
        style({ opacity: 0 }),
        animate('0.5s ease-in-out', style({ opacity: 1 })),
      ],
      { optional: true }
    ),
  ]),
]);
