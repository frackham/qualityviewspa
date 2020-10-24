import { AfterViewInit, Component, OnInit } from '@angular/core';

import { mermaidAPI } from "mermaid";
import { DOCUMENT } from '@angular/common';
import { Renderer2, Inject } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { GraphBuilderService } from 'src/app/services/graph-builder.service';
import { GraphPostProcessingService } from 'src/app/services/graph-post-processing.service';

@Component({
  selector: 'app-embedded-mermaid',
  templateUrl: './embedded-mermaid.component.html',
  styleUrls: ['./embedded-mermaid.component.scss']
})
export class EmbeddedMermaidComponent implements OnInit, AfterViewInit {
  @ViewChild('#result2', { static: false }) myDiv: ElementRef | undefined;

  graphData= "";
  svgContent:string = "";

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _graphBuilder: GraphBuilderService,
    private _graphPostProcessing : GraphPostProcessingService
    ) { }


  ngOnInit(): void {
    this.graphData = this._graphBuilder.MermaidGraph();

    mermaidAPI.initialize(
      //mermaid config:
      {
          securityLevel: 'loose',
          flowchart: {
            curve: 'basis' //See https://github.com/mermaid-js/mermaid/issues/580 and https://github.com/d3/d3-shape/blob/master/README.md#curves
                              //known working values: monotoneY, basis, linear, stepAfter, stepBefore
                              //basis seems best so far, in principle steps are what I want but they overlap too much in practice.
          }
      }
    );

    mermaidAPI.render('generated-mermaid-svg-wrapper',
      this.graphData, (g: any) => {
        this.svgContent = g;
    });

    this.svgContent = this._graphPostProcessing.PostProcess(this.svgContent)


  }



  ngAfterContentInit():void{
    // console.log('ngAfterContentInit');

  }
  ngAfterViewInit(): void {
    // console.log('ngAfterViewInit');
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    this.updateSvgInDiv();
  }

  updateSvgInDiv() {
    //console.log('svgContent', this.svgContent)//works
    let mermaidcontentWrapper = document.querySelector("#embedded-mermaid-content");
    mermaidcontentWrapper!.innerHTML = this.svgContent

  }


}
