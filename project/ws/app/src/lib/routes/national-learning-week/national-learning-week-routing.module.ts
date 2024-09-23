import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { NationalLearningWeekMicrositeComponent } from './national-learning-week-microsite/national-learning-week-microsite.component'
import { NationalLearningWeekFormService } from './services/national-learning-week-form.service'
import { NationalLearningConfigService } from './services/national-learning-config.service'

const routes: Routes = [   
    {
        path: '',
        component: NationalLearningWeekMicrositeComponent,
        data: {
            module: 'Learn',
        },
        resolve: {
            formData: NationalLearningWeekFormService,
            configData: NationalLearningConfigService,
        },
    },
    {
        path: 'see-all',
        component: NationalLearningWeekMicrositeComponent,
        data: {
            pageId: 'see-all',
            module: 'Learn',
        },
        resolve: {
            formData: NationalLearningWeekFormService,
        },

    } 
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NationalLearningWeekRoutingModule { }
