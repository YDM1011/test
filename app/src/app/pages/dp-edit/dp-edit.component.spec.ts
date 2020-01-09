import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DpEditComponent } from './dp-edit.component';

describe('DpEditComponent', () => {
  let component: DpEditComponent;
  let fixture: ComponentFixture<DpEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
