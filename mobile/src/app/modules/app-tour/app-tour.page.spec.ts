import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppTourPage } from './app-tour.page';

describe('AppTourPage', () => {
  let component: AppTourPage;
  let fixture: ComponentFixture<AppTourPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AppTourPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
