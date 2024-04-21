import { Component, OnInit } from '@angular/core'
import { ConfigurationsService } from '@sunbird-cb/utils/src/public-api'
import { ViewerDataService } from '@ws/viewer/src/public-api'

@Component({
  selector: 'ws-app-gyaan-player',
  templateUrl: './gyaan-player.component.html',
  styleUrls: ['./gyaan-player.component.scss'],
})
export class GyaanPlayerComponent implements OnInit {
  resourceData: any
  titles: any = []
  enableShare = false
  rootOrgId: any
  resourceLink: any = ''

  constructor(private viewerDataSvc: ViewerDataService,
              private configSvc: ConfigurationsService,
  ) {
    if (this.configSvc.userProfile) {
      this.rootOrgId = this.configSvc.userProfile.rootOrgId
    }
    this.resourceLink = `${window.location.pathname.substring(1)}${window.location.search}`
  }

  ngOnInit() {
    this.resourceData = this.viewerDataSvc.resource
    this.titles = [
      { title: 'Gyaan Karmayogi', url: '/app/gyaan-karmayogi/all', icon: 'school' },
      { title: this.resourceData.resourceCategory, disableTranslate: true,
        queryParams: { key: this.resourceData.resourceCategory }, url: `/app/gyaan-karmayogi/view-all`, icon: '' },
      { title: this.resourceData.name, url: `none`, icon: '' },
    ]
  }
  // this method is used to close the share popup
  resetEnableShare() {
    this.enableShare = false
  }
}
