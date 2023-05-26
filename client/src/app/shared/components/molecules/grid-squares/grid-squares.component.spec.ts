import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSquaresComponent } from './grid-squares.component';

describe('GridSquaresComponent', () => {
  let component: GridSquaresComponent;
  let fixture: ComponentFixture<GridSquaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridSquaresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSquaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
