import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ws-app-national-learning-week-microsite',
  templateUrl: './national-learning-week-microsite.component.html',
  styleUrls: ['./national-learning-week-microsite.component.scss']
})
export class NationalLearningWeekMicrositeComponent implements OnInit {

  sectionList: any = []

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.route.snapshot.data && this.route.snapshot.data.formData
      && this.route.snapshot.data.formData.data
      && this.route.snapshot.data.formData.data.result
      && this.route.snapshot.data.formData.data.result.form
      && this.route.snapshot.data.formData.data.result.form.data
      && this.route.snapshot.data.formData.data.result.form.data.sectionList
    ) {
      this.sectionList = this.route.snapshot.data.formData.data.result.form.data.sectionList
    }
    console.log(this.sectionList)
  }

}
