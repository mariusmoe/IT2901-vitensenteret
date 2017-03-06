import { animate, AnimationEntryMetadata, state, style, transition, trigger } from '@angular/core';

// Component transition animations
export const slideInDownAnimation: AnimationEntryMetadata =
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

  export const slideDownFadeInAnimation: AnimationEntryMetadata =
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

  export const slideOutAnimation: AnimationEntryMetadata =
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
