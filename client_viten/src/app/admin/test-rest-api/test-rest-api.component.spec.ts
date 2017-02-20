/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TestRestAPIComponent } from './test-rest-api.component';

describe('TestRestAPIComponent', () => {
  let component: TestRestAPIComponent;
  let fixture: ComponentFixture<TestRestAPIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestRestAPIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestRestAPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
