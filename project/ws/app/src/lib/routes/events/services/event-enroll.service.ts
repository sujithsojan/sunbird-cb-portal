import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, Subject } from 'rxjs'
import { environment } from 'src/environments/environment'

const API_END_POINTS = {
  EVENT_READ: `/apis/proxies/v8/event/v4/read`,
  GET_EVENTS: '/apis/proxies/v8/sunbirdigot/search',
  SAVE_EVENT_PROGRESS_UPDATE: 'api/event/v1/state/update'
}

@Injectable({
  providedIn: 'root',
})
export class EventEnrollService {
  eventData:any
  eventEnrollEvent = new Subject()
  constructor(private http: HttpClient) { }

  getEventData(eventId: any): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.EVENT_READ}/${eventId}`)
  }

  getEventsList(req: any) {
    return this.http.post<any>(`${API_END_POINTS.GET_EVENTS}`, req)
  }

  getPublicUrl(url: string): string {
    const mainUrl = url.split('/content').pop() || ''
    return `${environment.contentHost}/${environment.contentBucket}/content${mainUrl}`
  }

  saveEventProgressUpdate(req:any) {
    return this.http.post<any>(`${API_END_POINTS.SAVE_EVENT_PROGRESS_UPDATE}`, req)
  }


}
