import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCenterComponent } from './new-center.component';

describe('NewCenterComponent', () => {
  let component: NewCenterComponent;
  let fixture: ComponentFixture<NewCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
