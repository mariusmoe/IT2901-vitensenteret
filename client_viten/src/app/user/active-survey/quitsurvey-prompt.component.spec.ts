/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QuitsurveyPromptComponent } from './quitsurvey-prompt.component';

describe('QuitsurveyPromptComponent', () => {
  let component: QuitsurveyPromptComponent;
  let fixture: ComponentFixture<QuitsurveyPromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuitsurveyPromptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuitsurveyPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
