import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTreeModule} from '@angular/material/tree';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatChipsModule} from '@angular/material/chips';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SandboxComponent } from './sandbox/sandbox/sandbox.component';
import { MoodboardComponent } from './moodboard/moodboard.component';
import { ProgressSpinnerComponent } from './ui-generic/progress-spinner/progress-spinner.component';
import { LoadingComponent } from './loading/loading.component';
import { TabsetComponent } from './tabset/tabset.component';
import { NotesComponent } from './notes/notes.component';
import { EmbeddedMermaidComponent } from './tabset/embedded-mermaid/embedded-mermaid.component';
import { MermaidHeaderControlsComponent } from './tabset/embedded-mermaid/mermaid-header-controls/mermaid-header-controls.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { ApiExplorerComponent } from './apiexplorer/apiexplorer.component';
import { ProjectExplorerComponent } from './projectexplorer/projectexplorer.component';
import { AgGridModule } from 'ag-grid-angular';
import { DatagridComponent } from './apiexplorer/datagrid/datagrid.component';
import { AlertModule } from './ui-generic/alert';

//Alerting from: https://github.com/cornflourblue/angular-10-alert-notifications, https://jasonwatmore.com/post/2020/07/16/angular-10-alert-notifications-example


@NgModule({
  declarations: [
    AppComponent,
    SandboxComponent,
    MoodboardComponent,
    ProgressSpinnerComponent,
    LoadingComponent,
    TabsetComponent,
    NotesComponent,
    EmbeddedMermaidComponent,
    MermaidHeaderControlsComponent,
    ApiExplorerComponent,
    ProjectExplorerComponent,
    DatagridComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AlertModule,
    AgGridModule.withComponents([]),
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatIconModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTreeModule,
    MatCheckboxModule,
    MatFormFieldModule

  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
