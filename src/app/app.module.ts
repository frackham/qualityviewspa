import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { mermaid } from "mermaid";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MermaidGraphComponent } from './mermaid-graph/mermaid-graph.component';

@NgModule({
  declarations: [
    AppComponent,
    MermaidGraphComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
