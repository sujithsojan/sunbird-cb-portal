import { Component, ElementRef, OnInit, Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import videoJs from 'video.js'
/* tslint:disable */
import  'videojs-youtube'
/* tslint:enable */
// videoJsInitializer
import { fireRealTimeProgressFunction, saveContinueLearningFunction, telemetryEventDispatcherFunction,  youtubeInitializer } from '../../../../../../../../../library/ws-widget/collection/src/lib/_services/videojs-util'
import { NsContent } from '@sunbird-cb/utils-v2'
import { EventEnrollService } from './../../services/event-enroll.service'
// interface IYTOptions extends videoJs.PlayerOptions {
//   youtube: {
//     ytControls: 0 | 1 | 2
//     customVars?: {
//       wmode: 'transparent'
//     }
//   }
// }
// const videoJsOptions: IYTOptions = {
//   controls: true,
//   autoplay: false,
//   preload: 'auto',
//   fluid: true,
//   techOrder: ['youtube'],
//   playbackRates: [0.75, 0.85, 1, 1.25, 2, 3],
//   poster: '',
//   html5: {
//     hls: {
//       overrideNative: true,
//     },
//     nativeVideoTracks: false,
//     nativeAudioTracks: false,
//     nativeTextTracks: false,
//   },
//   nativeControlsForTouch: false,
//   youtube: {
//     ytControls: 0,
//     customVars: {
//       wmode: 'transparent',
//     },
//   },
// };

@Component({
  selector: 'app-event-you-tube',
  templateUrl: './event-you-tube.component.html',
  styleUrls: ['./event-you-tube.component.scss'],
})
export class EventYouTubeComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() eventData: any
  @Input() videoId: any
  @ViewChild('youtubeTag', { static: false }) youtubeTag!: ElementRef
  private player: videoJs.Player | null = null
  private dispose: (() => void) | null = null
  constructor(private route: ActivatedRoute, private eventEnrollService: EventEnrollService) {
  }

  ngOnInit(): void {
    /* tslint:disable */
    console.log('eventData', this.eventEnrollService.eventData)
    /* tslint:enabel */
    this.eventData = this.eventEnrollService.eventData
    this.route.params.subscribe(params => {
      this.videoId = params.videoId

      // if (this.fetchNewData) {
      //   this.getTIDData()
      // }
      // this.data = this.route.snapshot.data.topic.data
    })
  }

  ngAfterViewInit() {
    // let playerOptions = {
    //         autoplay: false,
    //         controls: true,
    //         preload: 'auto',
    //         techOrder: ['youtube'],
    //         youtube: {ytControls: 2,rel:0,fs:0,modestbranding: 1},
    //         sources: [{type: 'video/youtube',src: 'https://www.youtube.com/watch?v=OqfyN7c71HE'}]
    //     }
    //     videoJs(`youtubeTag`, playerOptions, () => {console.log('pronto')});
    const dispatcher: telemetryEventDispatcherFunction = event => {
      /* tslint:disable */
      console.log(event)
      /* tslint:enable */
      // if (this.widgetData.identifier) {
      //   this.eventSvc.dispatchEvent(event)
      // }
    }
    const saveCLearning: saveContinueLearningFunction = data => {
      /* tslint:disable */
      console.log(data)
      /* tslint:enable */
      // if (this.widgetData.identifier) {
      //   if (this.activatedRoute.snapshot.queryParams.collectionType &&
      //     this.activatedRoute.snapshot.queryParams.collectionType.toLowerCase() === 'playlist') {
      //     const continueLearningData = {
      //       contextPathId: this.activatedRoute.snapshot.queryParams.collectionId ?
      //         this.activatedRoute.snapshot.queryParams.collectionId : this.widgetData.identifier,
      //       resourceId: data.resourceId,
      //       contextType: 'playlist',
      //       dateAccessed: Date.now(),
      //       data: JSON.stringify({
      //         progress: data.progress,
      //         timestamp: Date.now(),
      //         contextFullPath: [this.activatedRoute.snapshot.queryParams.collectionId, data.resourceId],
      //       }),
      //     }
      //     this.contentSvc
      //       .saveContinueLearning(continueLearningData)
      //       .toPromise()
      //       .catch()
      //   } else {
      //     const continueLearningData = {
      //       contextPathId: this.activatedRoute.snapshot.queryParams.collectionId ?
      //         this.activatedRoute.snapshot.queryParams.collectionId : this.widgetData.identifier,
      //       resourceId: data.resourceId,
      //       dateAccessed: Date.now(),
      //       data: JSON.stringify({
      //         progress: data.progress,
      //         timestamp: Date.now(),
      //       }),
      //     }
      //     this.contentSvc
      //       .saveContinueLearning(continueLearningData)
      //       .toPromise()
      //       .catch()
      //   }
      // }
      const dataobj: any = JSON.parse(data.data)
      const completionPercentage: any = (dataobj.progress / data.dateAccessed) * 100
      const req  = {
        'userId': '',
        'events': [
            {
                'eventId': this.eventData.identifier,
                'batchId': '',
                'status': completionPercentage > 50 ? 2 : 1,
                'lastAccessTime': data.dateAccessed,
                'progressdetails': {
                    'max_size': this.eventData.duration,
                    'current': [
                      dataobj.progress,
                    ],
                    'timeSpent': '',
                    'mimeType': 'application/html',
                },
                'completionPercentage': completionPercentage,
            },
        ],
    }
      this.eventEnrollService.saveEventProgressUpdate(req).toPromise().catch()
    }
    const fireRProgress: fireRealTimeProgressFunction = (identifier, data) => {
      /* tslint:disable */
      console.log(identifier, data)
      /* tslint:enable */
      // if (this.widgetData.identifier && identifier && data) {
      //   this.viewerSvc
      //     .realTimeProgressUpdate(identifier, data)
      // }
    }
    const initObj = youtubeInitializer(
      this.youtubeTag.nativeElement,
      this.videoId,
      dispatcher,
      saveCLearning,
      fireRProgress,
      {}, // passThrough Data,
      '',
      true, // enable telemetry,
      {}, // widget data
      NsContent.EMimeTypes.YOUTUBE, // type
      '600px', // height
    )
    this.dispose = initObj.dispose
    // this.player = new (<any>window).YT.Player
    /* tslint:disable */
    console.log('initObj', this.dispose)
    /* tslint:enable */
  }

  ngOnDestroy() {
    /* tslint:disable */
    console.log(this.player)
    /* tslint:enable */
    if (this.player) {
      this.player.dispose()
    }
    if (this.dispose) {
      this.dispose()
    }

  }

}
