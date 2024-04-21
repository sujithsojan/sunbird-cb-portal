
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import * as _ from 'lodash'
import { gyaanConstants } from '../../models/gyaan-contants.model'
import { GyaanKarmayogiService } from '../../services/gyaan-karmayogi.service'

@Component({
  selector: 'ws-app-gyaan-karmayogi-home',
  templateUrl: './gyaan-karmayogi-home.component.html',
  styleUrls: ['./gyaan-karmayogi-home.component.scss'],
})
export class GyaanKarmayogiHomeComponent implements OnInit {
  stripData: any
  pageConfig: any
  facetsdata: any
  hideAllStrip = false
  searchControl = new FormControl('')
  selectedSector: any = gyaanConstants.allSectors
  categories: any = [{
    name: gyaanConstants.allCategories,
  }]
  subSector: any = [{
    name: gyaanConstants.allSubSector,
  }]
  subSectorDefault: any = [{
    name: gyaanConstants.allSubSector,
  }]
  sectorsList = [
  {
    name: gyaanConstants.allSectors,
  }]

  gyaanForm: FormGroup | undefined

  constructor(public translate: TranslateService, private route: ActivatedRoute, private seeAllSvc: GyaanKarmayogiService) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  ngOnInit() {
    this.gyaanForm = new FormGroup({
      sectors: new FormControl(''),
      subSectors: new FormControl(''),
      category: new FormControl(''),
    })
    this.pageConfig = (this.route.parent && this.route.parent.snapshot.data)
    this.stripData = (this.route.parent && this.route.parent.snapshot.data.pageData.data.stripConfig) || []
    this.facetsdata = this.pageConfig.gyaanData.facets.data
    if (this.facetsdata && this.facetsdata.length) {
      this.factesAssign(this.facetsdata)
    }
    this.callStrips()
  }

  // this method is used for multi-lingual
  translateLetMenuName(menuName: string): string {
    // tslint:disable-next-line: prefer-template
    const translationKey = 'gyaanKarmayogi.' + menuName.replace(/\s/g, '')
    return this.translate.instant(translationKey)
  }

  // the below method is uded to hide strips and show strips
  hideAndCallStrip() {
    this.hideAllStrip = true
    setTimeout(() => {
      this.hideAllStrip = false
    },         gyaanConstants.timeOutDuration)
  }

  // this method is called when user clicks on apply button and if particular category is not selected
  // and it is called on selection of sectors
  callStrips(addFilters?: any) {
    const localStripData: any = []
    this.categories.forEach((cat: any) => {
      if (!cat.name.includes('All')) {
        const data = JSON.parse(JSON.stringify(this.route.parent &&
          this.route.parent.snapshot.data.pageData.data.stripConfig))
        if (data.strips.length) {
          data.strips[0].title = cat.name
          data.strips[0].key = cat.name
          data.strips[0].viewMoreUrl.queryParams.key = cat.name
          data.strips[0].titleDescription = cat.name
          data.strips[0].request.searchV6.request.filters = {
              ...data.strips[0].request.searchV6.request.filters,
              resourceCategory: cat.name,

          }
          if (addFilters) {
            data.strips[0].request.searchV6.request.filters = {
              ...data.strips[0].request.searchV6.request.filters,
              ...addFilters,
            }
          }
          if (this.searchControl && this.searchControl.value) {
            data.strips[0].request.searchV6.request.query = this.searchControl.value
          }
        }

        localStripData.push(data)
      }
    })
    this.hideAndCallStrip()
    this.stripData = localStripData
  }

  // this method is called when user clicks on apply button from ui
  applyFilter(form: FormGroup) {
    const addFilters: any = {}

    if (form.value.sectors && form.value.sectors.name !== gyaanConstants.allSectors) {
      addFilters['sectorName'] = form.value.sectors.name
    }
    if (form.value.subSectors && form.value.subSectors !== gyaanConstants.allSubSector) {
      addFilters['subSectorName'] = form.value.subSectors
    }
    if (form.value.category && form.value.category !== gyaanConstants.allCategories) {
      addFilters['resourceCategory'] = form.value.category
    }
    if (form.value.sectors && form.value.subSectors && form.value.category) {
      this.callPaticualrStrip(addFilters)
    } else {
      if (form.value.sectors || form.value.subSectors || form.value.category) {
        if (!form.value.category) {
          this.callStrips(addFilters)
        } else {
          this.callPaticualrStrip(addFilters)
        }
      }

    }
  }

  // this method is called on selection of category to call particular strip into the ui
  callPaticualrStrip(addFilters: any) {
      if (addFilters.resourceCategory) {
        const data = JSON.parse(JSON.stringify(this.route.parent && this.route.parent.snapshot.data.pageData.data.stripConfig))
        if (data.strips.length) {
          data.strips[0].title = addFilters.resourceCategory
          data.strips[0].key = addFilters.resourceCategory
          data.strips[0].viewMoreUrl.queryParams.key = addFilters.resourceCategory
          data.strips[0].titleDescription = addFilters.resourceCategory
          data.strips[0].request.searchV6.request.filters = {
              ...data.strips[0].request.searchV6.request.filters,
              resourceCategory: addFilters.resourceCategory,
          }
          if (addFilters) {
              data.strips[0].request.searchV6.request.filters = {
                ...data.strips[0].request.searchV6.request.filters,
                ...addFilters,
            }
          }
        }
        this.hideAllStrip = true

        this.stripData = [data]
    setTimeout(() => {
      this.hideAllStrip = false
    },         gyaanConstants.timeOutDuration)
      }
  }

  // this method is used for getting random color for the sector options
  getRandomColor() {
    const items = gyaanConstants.colorConstants
    const item = items[Math.floor(Math.random() * items.length)]
    return item
  }

  // this method is triggered on selection of sectors
  sectorFilter(sectorData: any, type?: string) {
    this.searchControl.setValue('')
    const addFilters: any = {}
    if (sectorData && !type) {
      addFilters['sectorName'] = sectorData.name
    }
    this.selectedSector = sectorData.name
    this.callStrips(addFilters)
  }

  // global search method
  searchFilter() {
    const addFilters: any = {}
    this.callStrips(addFilters)
    this.selectedSector = gyaanConstants.allSectors
  }

  // on change of sector dropdown will call this method
  sectorChange(event: any) {
    const addFilter: any = {}
    if (event.value && event.value.name === gyaanConstants.allSectors) {
      this.subSector = this.subSectorDefault
      this.selectedSector = gyaanConstants.allSectors
    } else {
      addFilter['sectorName'] = event.value.name
      this.selectedSector = event.value.name
    }
    this.callFacetApi(addFilter)
  }

  // on change of subsector dropdown will call this method
  subSectorChange(event: any) {
    const addFilter: any = {}
    if (event && event.value === gyaanConstants.allSubSector) {
      this.categories = this.categories
    } else {
      if (this.gyaanForm) {
        if (this.gyaanForm.value.sectors.name !== gyaanConstants.allSectors) {
          addFilter['sectorName'] = this.gyaanForm.value.sectors.name
        }
      }
      addFilter['subSectorName'] = event.value
    }
    this.callFacetApi(addFilter)
  }

  // method is usd for call api and get all facets having data in system
  callFacetApi(addFilter: any) {
    const request: any = {
      'request': {
        'filters': {
            'status': [
                'Live',
            ],
            ...addFilter,
        },
        'fields': [
            'identifier',
            'courseCategory',
            'status',
        ],
        'offset': 0,
        'limit': 0,
        'sort_by': {
            'lastUpdatedOn': 'desc',
        },
        'facets': [
            'resourceCategory',
            'subSectorName',
        ],
    },
    }
    this.seeAllSvc.searchV6(request).subscribe((res: any) => {
        if (res.result.facets && res.result.facets.length) {
          this.factesAssign(res.result.facets)
        }
      },                                       (_error: any) => {
    })
  }

  // the below method is used for alligen the values to sector , subsector, aand category
  factesAssign(factesData: any) {
    if (factesData && factesData.length) {
      factesData.forEach((ele: any) => {
        if (ele.name === 'subSectorName') {
          this.subSector = ele.values
        }
        if (ele.name === 'sectorName') {
          ele.values.forEach((sec: any) => {
            sec['identifier'] = sec.name
          })
          const data: any = _.intersectionBy(this.pageConfig.gyaanData.sector.data, ele.values, (item: any) => _.toLower(item.name))
          data.forEach((sector: any) => {
            sector['bgColor'] = this.getRandomColor()
          })
          this.sectorsList = [...this.sectorsList, ...data]
        }
        if (ele.name === 'resourceCategory')  {
          this.categories = [...ele.values]
        }
      })

    }
  }
}
