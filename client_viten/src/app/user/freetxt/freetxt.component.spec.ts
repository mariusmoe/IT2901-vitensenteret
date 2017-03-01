/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FreetxtComponent } from './freetxt.component';

describe('FreetxtComponent', () => {
  let component: FreetxtComponent;
  let fixture: ComponentFixture<FreetxtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreetxtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreetxtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
