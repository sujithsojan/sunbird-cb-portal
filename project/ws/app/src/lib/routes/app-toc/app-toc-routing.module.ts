import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PageResolve } from '@sunbird-cb/utils-v2'
import { GeneralGuard } from '../../../../../../../src/app/guards/general.guard'
// import { AppTocCohortsComponent } from './components/app-toc-cohorts/app-toc-cohorts.component'
import { AppTocDiscussionComponent } from './components/app-toc-discussion/app-toc-discussion.component'
import { KnowledgeArtifactDetailsComponent } from './components/knowledge-artifact-details/knowledge-artifact-details.component'
import { AppTocResolverService } from './resolvers/app-toc-resolver.service'
import { AppTocAnalyticsComponent } from './routes/app-toc-analytics/app-toc-analytics.component'
import { CertificationMetaResolver } from './routes/app-toc-certification/resolvers/certification-meta.resolver'
import { ContentCertificationResolver } from './routes/app-toc-certification/resolvers/content-certification.resolver'
import { AppTocContentsComponent } from './routes/app-toc-contents/app-toc-contents.component'
import { AppTocHomeComponent } from './routes/app-toc-home/app-toc-home.component'
// import { AppTocOverviewComponent as AppTocOverviewRootComponent } from './routes/app-toc-overview/app-toc-overview.component'
import { AppTocSinglePageComponent as AppTocSinglePageRootComponent } from './routes/app-toc-single-page/app-toc-single-page.component'
import { AppTocCiosHomeComponent } from './components/app-toc-cios-home/app-toc-cios-home.component'
import { AppTocCiosResolverService } from './resolvers/app-toc-cios-resolver.service'
import { AppTocCiosUserEnrollResolverService } from './resolvers/app-toc-cios-user-enroll-resolver.service'

const routes: Routes = [
  {
    path: ':id',
    component: AppTocHomeComponent,
    data: {
      pageType: 'feature',
      pageKey: 'toc',
      pageId: ':do_ID',
      module: 'Learn',
    },
    resolve: {
      pageData: PageResolve,
      content: AppTocResolverService,
    },
    runGuardsAndResolvers: 'paramsChange',
    children: [
      {
        path: 'analytics',
        component: AppTocAnalyticsComponent,
        data: {
          pageType: 'feature',
          pageKey: 'toc',
          requiredFeatures: ['tocAnalytics'],
        },
        resolve: {
          pageData: PageResolve,
        },
        canActivate: [GeneralGuard],
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'contents',
        component: AppTocContentsComponent,
      },
      {
        path: 'overview',
        component: AppTocSinglePageRootComponent,
        data: {
          pageId: 'overview',
          module: 'Learn',
        },
      },
      {
        path: 'discussion',
        component: AppTocDiscussionComponent,
      },
      // {
      //   path: 'single-page-view',
      //   component: AppTocSinglePageRootComponent,
      //   data: {
      //     pageId: 'overview',
      //     module: 'Learn',
      //   },
      // },
      {
        path: 'certification',
        loadChildren: () =>
          import('./routes/app-toc-certification/app-toc-certification.module').then(
            u => u.AppTocCertificationModule,
          ),
        canActivate: [GeneralGuard],
        resolve: {
          certificationMetaResolve: CertificationMetaResolver,
          contentMetaResolve: ContentCertificationResolver,
        },
        runGuardsAndResolvers: 'always',
        data: {
          requiredFeatures: ['certificationLHub'],
        },
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'single-page-view',
      },
    ],
  },
  {
    path: 'knowledge-artifact/:id',
    component: KnowledgeArtifactDetailsComponent,
  },
  {
    path: 'ext/:id',
    component: AppTocCiosHomeComponent,
    resolve: {
      extContent: AppTocCiosResolverService,
      userEnrollContent: AppTocCiosUserEnrollResolverService,
    },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppTocRoutingModule { }
