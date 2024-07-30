import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { KarmaProgramsV1Component } from './karma-programs-v1.component'

describe('KarmaProgramsV1Component', () => {
  let component: KarmaProgramsV1Component
  let fixture: ComponentFixture<KarmaProgramsV1Component>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KarmaProgramsV1Component],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(KarmaProgramsV1Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
