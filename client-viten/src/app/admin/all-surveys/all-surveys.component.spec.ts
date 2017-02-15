/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AllSurveysComponent } from './all-surveys.component';

describe('AllSurveysComponent', () => {
  let component: AllSurveysComponent;
  let fixture: ComponentFixture<AllSurveysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllSurveysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllSurveysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
