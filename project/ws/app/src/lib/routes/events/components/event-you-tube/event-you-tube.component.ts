import { Component, ElementRef, OnInit, Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import videoJs from 'video.js'
/* tslint:disable */
import  'videojs-youtube'
/* tslint:enable */
// videoJsInitializer
import { fireRealTimeProgressFunction, saveContinueLearningFunction, telemetryEventDispatcherFunction,  youtubeInitializer } from '../../../../../../../../../library/ws-widget/collection/src/lib/_services/videojs-util'
import { NsContent, ConfigurationsService } from '@sunbird-cb/utils-v2'
import { EventService } from './../../services/events.service'
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
  constructor(private route: ActivatedRoute, private eventService: EventService, private configSvc: ConfigurationsService) {
  }

  ngOnInit(): void {
    /* tslint:disable */
    console.log('eventData', this.route.snapshot.data.content.data)
    /* tslint:enabel */
    this.eventData = this.route.snapshot.data['content'].data
    this.route.params.subscribe(params => {
      this.videoId = params.videoId

      // if (this.fetchNewData) {
      //   this.getTIDData()
      // }
      // this.data = this.route.snapshot.data.topic.data
    })
    this.eventStateRead() 

    
  }

  eventStateRead() {
    
    let req = {
      eventId:  this.eventData.identifier,
      batchId: this.getBatchId()
    }
    this.eventService.eventStateRead(req).subscribe((data)=>{
      if(data && data.result && data.result.events && data.result.events.length) {
        let resumeFrom = JSON.parse(data.result.events[0]['progressdetails'])['stateMetaData']
        resumeFrom = resumeFrom ? Number(resumeFrom) : 0
        this.initializePlayer(resumeFrom)
      } else {
        this.initializePlayer('')

      }
      /* tslint:disable */
      console.log('req event state read', data )
      /* tslint:enable */

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

    // this.initializePlayer('')
    // this.player = new (<any>window).YT.Player
    /* tslint:disable */
    console.log('initObj', this.dispose)
    /* tslint:enable */
  }

  initializePlayer(resumeFrom: any) {
    let timeSpent = resumeFrom ? resumeFrom : 0
    let playerDuration = 0
    const dispatcher: telemetryEventDispatcherFunction = (event: any) => {
      /* tslint:disable */
      console.log(event['data'])
      if(event['data']['passThroughData'] && event['data']['passThroughData']['timeSpent']) {
        timeSpent = event['data']['passThroughData'] && event['data']['passThroughData']['timeSpent']
      }
      if(event['data']['passThroughData'] && event['data']['passThroughData']['playerDuration']) {
        playerDuration =  event['data']['passThroughData']['playerDuration']
      }
      /* tslint:enable */
      // if (this.widgetData.identifier) {
      //   this.eventSvc.dispatchEvent(event)
      // }
    }
    const saveCLearning: saveContinueLearningFunction = data => {
      /* tslint:disable */
      console.log(data)
      const dataobj: any = JSON.parse(data.data)
      let batchId = this.getBatchId()
      let completionPercentage:any = 0
      let timeStamp  = ''
      let timeStampString:any  = ''
      let lastTimeAccessed = ''
      let userId = ''
      if (this.configSvc.userProfile) {
        userId = this.configSvc.userProfile.userId || ''
      }
      if(dataobj && dataobj.progress) {
        completionPercentage = (dataobj.progress / playerDuration) * 100
      }
      if(dataobj && dataobj.timeStamp) {
          timeStamp = dataobj.timestamp
          timeStampString = new Date(timeStamp).toISOString().replace('T',' ').replace('Z',' ').split('.')
          lastTimeAccessed  = timeStampString[0]+':00+0000'
      }
      
      
    
      if (this.eventData) {
        const req  = {
          "request": {
          'userId': userId,
          'events': [
              {
                  'eventId': this.eventData.identifier,
                  'batchId': batchId,
                  'status':  completionPercentage > 50 ? 1 : 1,
                  'lastAccessTime': lastTimeAccessed, //data.dateAccessed
                  'progressdetails': {
                      'max_size': playerDuration, //complete video duration
                      'current': [ // current state
                        dataobj.progress.toString(),
                      ],
                      'duration': timeSpent, //watch time
                      'mimeType': 'application/html',
                      "stateMetaData": dataobj.progress.toString() //last state
                  },
                  'completionPercentage': parseFloat(completionPercentage).toFixed(2),
              },
          ],
        }
      }
      console.log('req',req)
      this.eventService.saveEventProgressUpdate(req).subscribe(()=>{})
      }

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
      { resumeFrom }, // passThrough Data,
      '',
      true, // enable telemetry,
      {}, // widget data
      NsContent.EMimeTypes.YOUTUBE, // type
      '600px', // height
    )
    this.dispose = initObj.dispose
  }

  getBatchId() {
    let batchId = ''
      if (this.eventData && typeof this.eventData.batches === 'string') {
        this.eventData.batches = JSON.parse(this.eventData.batches)
      }
      if (Array.isArray(this.eventData.batches) && this.eventData.batches.length > 0) {
        batchId = this.eventData.batches[0].batchId || ''
      }
    return batchId
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
