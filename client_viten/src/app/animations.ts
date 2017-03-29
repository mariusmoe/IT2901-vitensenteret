import { trigger, state, style, transition, animate } from '@angular/animations';

// Component transition animations
export const slideInDownAnimation =
  trigger('routeAnimation', [
    state('*',
      style({
        opacity: 1,
      })
    ),
    transition(':enter', [
      style({
        offset: 0.2,
        opacity: 0,
        transform: 'translateX(-100%)'
      }),
      animate('0.3s ease-in')
    ])
  ]);

  export const slideDownFadeInAnimation =
    trigger('routeAnimation', [
      state('*',
        style({
          opacity: 1,
        })
      ),
      transition(':enter', [
        style({
          offset: 0,
          opacity: 0,
          transform: 'translateY(-25%)'
        }),
        animate('0.3s ease-out')
      ])
    ]);

  export const slideOutAnimation =
    trigger('routeAnimation', [
      state('*',
        style({
          opacity: 1,
          transform: 'translateX(0)'
        })
      ),
      transition(':enter', [
        style({
          opacity: 0,
        }),
        animate('0.2s ease-in')
      ]),
      transition(':leave', [
        animate('0.5s ease-out', style({
          opacity: 0,
          transform: 'translateX(100%)'
        }))
      ])
    ]);
