import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DpCreateComponent } from './dp-create.component';

describe('DpCreateComponent', () => {
  let component: DpCreateComponent;
  let fixture: ComponentFixture<DpCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
