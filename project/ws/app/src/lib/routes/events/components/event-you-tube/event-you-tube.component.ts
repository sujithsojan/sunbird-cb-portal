import { Component, ElementRef, OnInit, Input, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import videoJs from 'video.js'
import 'videojs-youtube';
//videoJsInitializer
import { fireRealTimeProgressFunction, saveContinueLearningFunction, telemetryEventDispatcherFunction,  youtubeInitializer } from '../../../../../../../../../library/ws-widget/collection/src/lib/_services/videojs-util'
import { NsContent } from '@sunbird-cb/utils-v2';
interface IYTOptions extends videoJs.PlayerOptions {
  youtube: {
    ytControls: 0 | 1 | 2
    customVars?: {
      wmode: 'transparent'
    }
  }
}
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
export class EventYouTubeComponent implements OnInit {
  @Input() eventData: any
  @Input() videoId:any
  @ViewChild('youtubeTag', { static: false }) youtubeTag!: ElementRef
  constructor(private router: Router) {
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(){
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
      console.log(event)
      // if (this.widgetData.identifier) {
      //   this.eventSvc.dispatchEvent(event)
      // }
    }
    const saveCLearning: saveContinueLearningFunction = data => {
      console.log(data)
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
    }
    const fireRProgress: fireRealTimeProgressFunction = (identifier, data) => {
      console.log(identifier, data)
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
      {},//passThrough Data,
      '',
      false, //enable telemetry,
      {}, //widget data
      NsContent.EMimeTypes.YOUTUBE, //type
      '600px', //height
    )
    console.log('initObj', initObj)
  }

  

}
