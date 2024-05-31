import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { KarmaProgramsFormService } from './service/karma-programs-form.service'
import { KarmaProgramsComponent } from './karma-programs/karma-programs.component'
import { KarmaProgramsMicrositeComponent } from './karma-programs-microsite/karma-programs-microsite.component'

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'all-programs',
    },
    {
        path: 'all-programs',
        component: KarmaProgramsComponent,
        data: {
            pageId: 'all-programs',
            module: 'Learn',
        },
    },
    {
        path: ':program/:orgId/micro-sites',
        component: KarmaProgramsMicrositeComponent,
        data: {
            pageId: ':program/:orgId/micro-sites',
            module: 'Learn',
        },
        resolve: {
            formData: KarmaProgramsFormService,
        },
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class KarmaProgramsRoutingModule { }
