import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NgxsModule } from '@ngxs/store';
import { environment } from '../environments/environment';
import { ExpenseState } from './modules/expense-list/store/expense.state';
import { NgxsActionsExecutingModule } from '@ngxs-labs/actions-executing';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { CleemyInterceptor } from './core/interceptors/http.interceptor';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';

registerLocaleData(en);
const antModules = [NzPageHeaderModule, NzNotificationModule];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule,
    NgxsModule.forRoot([ExpenseState], {
      developmentMode: !environment.production,
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsRouterPluginModule.forRoot(),
    NgxsActionsExecutingModule.forRoot(),
    NgxsSelectSnapshotModule.forRoot(),
    ...antModules,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CleemyInterceptor,
      multi: true,
    },
    NzNotificationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
