import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { KarmaProgramsV2Component } from './karma-programs-v2.component'

describe('KarmaProgramsV2Component', () => {
  let component: KarmaProgramsV2Component
  let fixture: ComponentFixture<KarmaProgramsV2Component>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KarmaProgramsV2Component],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(KarmaProgramsV2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
