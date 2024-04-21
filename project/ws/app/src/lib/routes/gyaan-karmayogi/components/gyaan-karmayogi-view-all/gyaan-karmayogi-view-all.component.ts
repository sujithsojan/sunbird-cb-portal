import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { GyaanKarmayogiService } from '../../services/gyaan-karmayogi.service'
import { NsContent } from '@sunbird-cb/utils/src/public-api'
import * as _ from 'lodash'
import { gyaanConstants } from '../../models/gyaan-contants.model'
import { TitleCasePipe } from '@angular/common'
import { FormControl } from '@angular/forms'

import { MatBottomSheet } from '@angular/material'
import { GyaanFilterComponent } from '../gyaan-filter/gyaan-filter.component'

@Component({
  selector: 'ws-app-gyaan-karmayogi-view-all',
  templateUrl: './gyaan-karmayogi-view-all.component.html',
  styleUrls: ['./gyaan-karmayogi-view-all.component.scss'],
})
export class GyaanKarmayogiViewAllComponent implements OnInit {
  sectorsList = []
  keyData: any
  filterDataLoading = false
  searchControl = new FormControl('')
  contentDataList: any = []
  seeAllPageConfig: any
  facetsData: any
  facetsDataCopy: any
  titles: any = []
  selectedFilter: any = {}
  constructor(private bottomSheet: MatBottomSheet,
              private route: ActivatedRoute,
              private seeAllSvc: GyaanKarmayogiService,
              public titleCasePipe: TitleCasePipe) { }

  async ngOnInit() {
    this.route.queryParams.subscribe((res: any) => {
      this.keyData = (res.key) ? res.key : ''
      this.titles = [
        { title: 'Gyaan Karmayogi', url: '/app/gyaan-karmayogi/all', disableTranslate: true, icon: 'school' },
        { title: this.titleCasePipe.transform(this.keyData), url: `none`, icon: '' },
      ]
      this.getFacetsData()
  })

    this.seeAllPageConfig = this.route.snapshot.data.pageData &&
    this.route.snapshot.data.pageData.data &&
    this.route.snapshot.data.pageData.data.stripConfig &&
    this.route.snapshot.data.pageData.data.stripConfig.strips &&
    this.route.snapshot.data.pageData.data.stripConfig.strips[0]

    this.contentDataList = this.transformSkeletonToWidgets(this.seeAllPageConfig)
    if (this.seeAllPageConfig.request && this.seeAllPageConfig.request.searchV6) {
      this.fetchFromSearchV6(this.seeAllPageConfig)
      this.seeAllPageConfig.request.searchV6.request.filters = {
        ...this.seeAllPageConfig.request.searchV6.request.filters,
      }
    }
  }
  // the below method is used to convert cards to skeleton loader
  private transformSkeletonToWidgets(
    strip: any
  ) {
    return gyaanConstants.emptyArray.map(_content => ({
      widgetType: 'card',
      widgetSubType: 'cardContent',
      widgetHostClass: 'mb-2',
      widgetData: {
        cardSubType: strip.viewMoreUrl &&  strip.viewMoreUrl.loaderConfig
        && strip.viewMoreUrl.loaderConfig.cardSubType || 'card-portrait-skeleton',
        cardCustomeClass: strip.customeClass ? strip.customeClass : 'card-resource-container-small',
      },
    }))
  }

  // the below method is used to convert contents to widgetcard data
  private transformContentsToWidgets(
        contents: NsContent.IContent[],
        strip: any,
      ) {
        return (contents || []).map((content, idx) => ({
          widgetType: 'card',
          widgetSubType: 'cardContent',
          widgetHostClass: 'mb-2',
          widgetData: {
            content,
            ...(content.batch && {
              batch: content.batch,
            }),
            cardSubType: strip.viewMoreUrl &&  strip.viewMoreUrl.stripConfig
            && strip.viewMoreUrl.stripConfig.cardSubType,
            context: {
              pageSection: strip.key,
              position: idx,
            },
            cardCustomeClass: strip.customeClass ? strip.customeClass : 'card-resource-container-small',
            intranetMode: strip.stripConfig && strip.stripConfig.intranetMode,
            deletedMode: strip.stripConfig && strip.stripConfig.deletedMode,
            contentTags: strip.stripConfig && strip.stripConfig.contentTags,
          },
        }))
      }

  // the below method is used to fetch data search api as promise
  async fetchFromSearchV6(strip: any, calculateParentStatus = true) {
    const factes = {
      'facets': [
        'resourceCategory',
        'subSectorName',
        'sectorName',
    ],
    }
    const addFilter = {
      'resourceCategory': this.keyData,
    }
    if (strip.request && strip.request.searchV6 && Object.keys(strip.request.searchV6).length) {
      if (strip.request &&
        strip.request.searchV6 &&
        strip.request.searchV6.request &&
        strip.request.searchV6.request.filters) {
        strip.request.searchV6.request.filters = {
          ...strip.request.searchV6.request.filters,
          ...addFilter,
          ...this.selectedFilter,
        }
        strip.request.searchV6.request = {
          ...strip.request.searchV6.request,
          ...factes,
        }
        strip.request.searchV6.request.query = this.searchControl && this.searchControl.value
      }

      try {
        const response = await this.searchV6Request(strip, strip.request, calculateParentStatus)
        if (response && response.results) {
          if (this.contentDataList.length && this.contentDataList[0].widgetData.content) {
            this.contentDataList =
            _.concat(this.contentDataList, this.transformContentsToWidgets(response.results.result.content, strip))
          } else {
            this.contentDataList = this.transformContentsToWidgets(response.results.result.content, strip)
          }
          // this.totalCount = response.results.result.count
          // this.totalPages = Math.ceil(response.results.result.count / strip.request.searchV6.request.limit)
        }
      } catch (error) {}

    }
  }

  async searchV6Request(strip: any,
                        request: any,
                        _calculateParentStatus: boolean
  ): Promise <any> {
    const originalFilters: any = []
    // console.log('calling -- ')
    return new Promise <any>((resolve, reject) => {
      if (request && request.searchV6) {
        this.seeAllSvc.searchV6(request.searchV6).subscribe(results => {
          const showViewMore = Boolean(
            results.result.content && results.result.content.length > 5 && strip.stripConfig && strip.stripConfig.postCardForSearch,
          )
          const viewMoreUrl = showViewMore ?
            {
              path: strip.viewMoreUrl && strip.viewMoreUrl.path || '',
              queryParams: {
                tab: 'Learn',
                q: strip.viewMoreUrl && strip.viewMoreUrl.queryParams,
                f: request &&
                  request.searchV6 &&
                  request.searchV6.request &&
                  request.searchV6.request.filters ?
                  JSON.stringify(
                    this.transformSearchV6FiltersV2(
                      originalFilters,
                    )
                  ) :
                  {},
              },
            } :
            null
          resolve({
            results,
            viewMoreUrl,
          })
        },                                                  (error: any) => {
          reject(error)
        })
      }
    })
  }
  // search request filter form
  private transformSearchV6FiltersV2(v6filters: any) {
    const filters: any = {}
    if (v6filters.constructor === Array) {
      v6filters.forEach(((f: any) => {
        Object.keys(f).forEach(key => {
          filters[key] = f[key]
        })
      }))
      return filters
    }
    return v6filters
  }

  // the bellow method is used to get initial facet data to filters
  getFacetsData() {
    this.filterDataLoading = true
    const request = this.route.snapshot.data.pageData &&
    this.route.snapshot.data.pageData.data &&
    this.route.snapshot.data.pageData.data.facetReqData &&
    this.route.snapshot.data.pageData.data.facetReqData
    this.seeAllSvc.searchV6(request).subscribe((response: any) => {
      if (response &&  response.result &&
         response.result.facets) {
          const localFacetData: any = {
            sectorName: {
              name: 'Sector',
              values: 'values',
            },
            subSectorName: {
              name: 'Sub sector',
              values: 'values',
            },
            resourceCategory: {
              name: 'Category',
              values: 'values',
            },
          }
          response.result.facets.forEach((facet: any) => {
            if (localFacetData[facet.name]) {
              facet.values.forEach((item: any) => {
                if (item.name === this.keyData.toLowerCase()) {
                  item['checked'] = true
                  this.selectedFilter['resourceCategory'] = item.name
                }
              })
              localFacetData[facet.name].values = facet.values
            }
          })

          this.facetsDataCopy = { ...localFacetData }
          this.facetsData = localFacetData

         }
         this.filterDataLoading = false
    },                                         (_error: any) => {

    })
  }

  // the below method is used to get emitted value from filter component
  filterChange(event: any) {
    this.changeSelection(event.event, event.key, event.keyData)
  }

  // the below method used to form the filters and call api
  changeSelection(event: any, key: any, keyData: any) {
    keyData['checked'] = event
    if (key === 'resourceCategory' &&  this.selectedFilter[key]) {
      this.selectedFilter[key] = keyData.name
      this.titles = [
        { title: 'Gyaan Karmayogi', url: '/app/gyaan-karmayogi/all', disableTranslate: true, icon: 'school' },
        { title: this.titleCasePipe.transform(keyData.name), url: `none`, icon: '' },
      ]
    } else {
      if (this.selectedFilter && this.selectedFilter[key] && this.selectedFilter[key].includes(keyData.name)) {
        const index = this.selectedFilter[key].findIndex((x: any) => x === keyData.name)
        this.selectedFilter[key].splice(index, 1)
      } else {
        if (this.selectedFilter[key] && this.selectedFilter[key].length) {
          this.selectedFilter[key].push(keyData.name)
        } else {
          this.selectedFilter[key] = [keyData.name]
        }
      }
    }

    this.contentDataList = this.transformSkeletonToWidgets(this.seeAllPageConfig)
    if (this.seeAllPageConfig.request && this.seeAllPageConfig.request.searchV6) {
      this.fetchFromSearchV6(this.seeAllPageConfig)
    }
  }

  // Bottom sheet open only in mobileview
  openBottomSheet(): void {
    const bottomSheetRef = this.bottomSheet.open(GyaanFilterComponent, {
      data: {
        filterDataLoading: this.filterDataLoading,
        facetsDataCopy: this.facetsDataCopy,
        facetsData: this.facetsData,
        selectedFilter: this.selectedFilter,
    }, panelClass: 'filter-bottomsheet',
  })
  bottomSheetRef.afterDismissed().subscribe((result: any) => {
   if (result) {
      this.titles = [
        { title: 'Gyaan Karmayogi', url: '/app/gyaan-karmayogi/all', disableTranslate: true, icon: 'school' },
        { title: this.titleCasePipe.transform(result.resourceCategory), url: `none`, icon: '' },
      ]
      this.selectedFilter = result
      this.contentDataList = this.transformSkeletonToWidgets(this.seeAllPageConfig)
      if (this.seeAllPageConfig.request && this.seeAllPageConfig.request.searchV6) {
        this.fetchFromSearchV6(this.seeAllPageConfig)
      }
   }
  })
  }

  globalSearch() {
    this.contentDataList = this.transformSkeletonToWidgets(this.seeAllPageConfig)
    if (this.seeAllPageConfig.request && this.seeAllPageConfig.request.searchV6) {
      this.fetchFromSearchV6(this.seeAllPageConfig)
    }
  }
}
