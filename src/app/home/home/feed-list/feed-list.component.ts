import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'ws-feed-list',
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.scss'],
})
export class FeedListComponent implements OnInit {
  contentStripData = {}
  @Input() widgetData: any
  @Input() widgetDataSubTab: any
  subTabdata: any = []
  
  constructor(private activatedRoute: ActivatedRoute) { }
  

  ngOnInit() {
    if (this.activatedRoute.snapshot.data.pageData && this.activatedRoute.snapshot.data.pageData.data) {
      this.contentStripData = this.activatedRoute.snapshot.data.pageData.data || []
      const strpsdata1 = this.activatedRoute.snapshot.data.pageData.data.homeStrips[0].strips[0].tabs
      for (let i = 0; i < strpsdata1.length; i += 1) {
        if (strpsdata1[i].name === 'My iGOT Plans') {
            this.subTabdata = strpsdata1
          this.activatedRoute.snapshot.data.pageData.data.homeStrips[i].strips[i].tabs = strpsdata1[i].data
        }
        

      }
    }
  }
}
