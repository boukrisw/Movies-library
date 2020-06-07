import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsfilmComponent } from './detailsfilm.component';

describe('DetailsfilmComponent', () => {
  let component: DetailsfilmComponent;
  let fixture: ComponentFixture<DetailsfilmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsfilmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsfilmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
