import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventYoutubePlayerComponent } from './event-youtube-player.component';

describe('EventYoutubePlayerComponent', () => {
  let component: EventYoutubePlayerComponent;
  let fixture: ComponentFixture<EventYoutubePlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventYoutubePlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventYoutubePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
