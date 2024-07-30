import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { KarmaProgramsFormV1Service } from './service/karma-programs-form-v1.service'
import { KarmaProgramsV1Component } from './karma-programs-v1/karma-programs-v1.component'
import { KarmaProgramsMicrositeV1Component } from './karma-programs-microsite-v1/karma-programs-microsite-v1.component'
import { KarmaProgramDataService } from './service/karma-program-data.service'
import { KarmaProgramsV2Component } from './karma-programs-v2/karma-programs-v2.component'
import { KarmaProgramsMicrositeV2Component } from './karma-programs-microsite-v2/karma-programs-microsite-v2.component'
import { KarmaProgramsFormV2Service } from './service/karma-programs-form-v2.service.'

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'all-programs',
    },
    {
        path: 'all-programs',
        component: KarmaProgramsV1Component,
        data: {
            pageId: 'all-programs',
            module: 'Learn',
        },
        resolve: {
            programData: KarmaProgramDataService,
        },
    },
    {
        path: ':programName/:playListKey/:orgId/micro-sites',
        component: KarmaProgramsMicrositeV1Component,
        data: {
            pageId: ':programName/:playListKey/:orgId/micro-sites',
            module: 'Learn',
        },
        resolve: {
            formData: KarmaProgramsFormV1Service,
        },
    },
    {
        path: 'all-programs/v2',
        component: KarmaProgramsV2Component,
        data: {
            pageId: 'all-programs',
            module: 'Learn',
        },
        resolve: {
            programData: KarmaProgramDataService,
        },
    },
    {
        path: ':programName/:playListKey/:orgId/micro-sites/v2',
        component: KarmaProgramsMicrositeV2Component,
        data: {
            pageId: ':programName/:playListKey/:orgId/micro-sites',
            module: 'Learn',
        },
        resolve: {
            formData: KarmaProgramsFormV2Service,
        },
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class KarmaProgramsRoutingModule { }
