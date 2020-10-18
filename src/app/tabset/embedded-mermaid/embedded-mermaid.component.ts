import { AfterViewInit, Component, OnInit } from '@angular/core';

import { mermaidAPI } from "mermaid";
import { DOCUMENT } from '@angular/common';
import { Renderer2, Inject } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { GraphBuilderService } from 'src/app/services/graph-builder.service';

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
    private _graphBuilder: GraphBuilderService) { }


  ngOnInit(): void {
    this.graphData = this._graphBuilder.MermaidGraph();

    mermaidAPI.initialize(
      //mermaid config:
      {
          securityLevel: 'loose'
      }
    );

    mermaidAPI.render('generated-mermaid-svg-wrapper',
      this.graphData, (g: any) => {
        this.svgContent = g;
    });

    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(this.svgContent, "image/svg+xml");
    var elements = xmlDoc.getElementsByClassName("node");

    //Manually editing the svg from mermaid before we use it.
    //This allows us to inject anything we want here that can be applied to svg (including css and interactions) rather than relying what's available in mermaid.
    for (var i=0, len=elements.length|0; i<len; i=i+1|0) {
      elements[i].classList.add("myClass"); //TODO: Use this class to style using CSS, and apply classes to other mermaid types
      elements[i].setAttribute("onclick","window.parent.SvgElementClickHandler(this)");
    }
    var markup = xmlDoc.documentElement.outerHTML;
    console.log(markup);
    this.svgContent =markup;

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
