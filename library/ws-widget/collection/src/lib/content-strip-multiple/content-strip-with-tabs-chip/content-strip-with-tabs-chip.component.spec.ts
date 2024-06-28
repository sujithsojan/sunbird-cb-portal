import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentStripWithTabsChipComponent } from './content-strip-with-tabs-chip.component';

describe('ContentStripWithTabsChipComponent', () => {
  let component: ContentStripWithTabsChipComponent;
  let fixture: ComponentFixture<ContentStripWithTabsChipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentStripWithTabsChipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentStripWithTabsChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
