import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTabsModule} from '@angular/material/tabs';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MermaidGraphComponent } from './mermaid-graph/mermaid-graph.component';
import { SandboxComponent } from './sandbox/sandbox/sandbox.component';
import { MoodboardComponent } from './moodboard/moodboard.component';
import { ProgressSpinnerComponent } from './ui-generic/progress-spinner/progress-spinner.component';
import { LoadingComponent } from './loading/loading.component';
import { TabsetComponent } from './tabset/tabset.component';
import { NotesComponent } from './notes/notes.component';
import { EmbeddedMermaidComponent } from './tabset/embedded-mermaid/embedded-mermaid.component';

@NgModule({
  declarations: [
    AppComponent,
    MermaidGraphComponent,
    SandboxComponent,
    MoodboardComponent,
    ProgressSpinnerComponent,
    LoadingComponent,
    TabsetComponent,
    NotesComponent,
    EmbeddedMermaidComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatTabsModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
