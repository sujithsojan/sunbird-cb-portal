import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { MultilingualTranslationsService, NsContent } from '@sunbird-cb/utils/src/public-api'
import { NSPractice } from '../../practice.model'
import { ActivatedRoute } from '@angular/router'
import { ViewerHeaderSideBarToggleService } from './../../../../viewer-header-side-bar-toggle.service'
import { PracticeService } from '../../practice.service'
@Component({
  selector: 'viewer-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit, OnDestroy {
  @Input() learningObjective = ''
  @Input() complexityLevel = ''
  @Input() primaryCategory = NsContent.EPrimaryCategory.PRACTICE_RESOURCE
  @Input() duration = 0
  @Input() timeLimit = 0
  @Input() noOfQuestions = 0
  @Input() canAttempt!: NSPractice.IRetakeAssessment
  @Input() coursePrimaryCategory: any
  @Input() instructionAssessment: any
  @Input() selectedAssessmentCompatibilityLevel: any
  @Output() userSelection = new EventEmitter<NSPractice.TUserSelectionType>()
  questionTYP = NsContent.EPrimaryCategory
  // staticImage = '/assets/images/exam/practice-test.png'
  staticImage = '/assets/images/exam/practice-result.png'
  loading = false
  points = [
    { icon: 'info', text: 'No negative marking' },
    { icon: 'info', text: 'Assessment will have time duration' },
    { icon: 'info', text: 'Skipped question can be attempted again before submitting' },
  ]
  isretakeAllowed = false
  dataSubscription: any
  consentGiven = false
  constructor(
    private route: ActivatedRoute,
    public viewerHeaderSideBarToggleService: ViewerHeaderSideBarToggleService,
    private quizSvc: PracticeService,
    private langtranslations: MultilingualTranslationsService,
  ) { }

  ngOnInit() {
    this.dataSubscription = this.route.data.subscribe(data => {
      if (data && data.pageData) {
        if (data && data.content && data.content.data && data.content.data.identifier) {
          const identifier =  data.content.data.identifier
          if (identifier) {
            this.checkForAssessmentSubmitAlready(identifier)
          }
        }
        this.isretakeAllowed = data.pageData.data.isretakeAllowed
      }
    })
  }

  checkForAssessmentSubmitAlready(identifier: any) {
    this.quizSvc.canAttend(identifier).subscribe(response => {
      if (response && response.attemptsMade > 0) {
        this.quizSvc.checkAlreadySubmitAssessment.next(true)
      }
    })
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe()
    }
  }

  overviewed(event: NSPractice.TUserSelectionType) {
    this.loading = true
    this.userSelection.emit(event)
    this.viewerHeaderSideBarToggleService.visibilityStatus.next(false)
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }

  startTestEnable(event: any) {
    // tslint:disable-next-line
    console.log('event', event)
    this.consentGiven = !this.consentGiven
  }
}
