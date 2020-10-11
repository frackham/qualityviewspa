import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import * as mermaid from "mermaid";

@Component({
  selector: 'app-mermaid-graph',
  templateUrl: './mermaid-graph.component.html',
  // template:
  // `
  // <pre>
  // <div #mermaid class="mermaid">
  // graph LR
  //     A --- B
  // </div>
  // </pre>

  // `,
  styleUrls: ['./mermaid-graph.component.scss']
})
export class MermaidGraphComponent implements OnInit {
  @ViewChild('mermaid', { static: true }) mermaid: ElementRef | undefined;

  constructor() {

  }

  ngBeforeInit(){
    // mermaid.initialize({
    //   theme: "forest"
    // });

  }

  ngOnInit(): void {
    if(this.mermaid){
      console.log(this.mermaid.nativeElement);

    } else {
      console.log('no mermaid', this)
    }
    var config = {
      startOnLoad:true,
      flowchart:{
          useMaxWidth:true,
          htmlLabels:true
      },
      logLevel: 'debug',
      theme: "default",
      themeVariables: {
        "fontSize": "18px"
      }
  };
  mermaid.initialize(config);
  }

  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.

    // mermaid.initialize({
    // });

  // mermaid.render();
  // const mySVGContainer = document.getElementById('mermaidcontainer');
  // if(mySVGContainer) {
    const allSvg = document.getElementsByTagName('svg');
    console.log(allSvg);


    // for (let index = 0; index < allSvg.length; index++) {
    //   const element = allSvg[index];
    //   console.log(element);
    //   if (element.nodeName.startsWith("mermaid")){

    //     if (!(element instanceof SVGSVGElement || SVGElement)) {
    //       console.log(element);
    //     }
    //     let mySVG: SVGSVGElement = element;
    //     console.log(mySVG);
    //     //mySVG as HTMLElement;
    //     //console.log(mySVG as HTMLElement);
    //     mySVG.setAttribute("width", "1000px");
    //     mySVG.setAttribute("viewBox", "0 0 100 100");
    //     mySVG.setAttribute("border", "blue")

    //   }
    //   else {
    //     console.log('no', element.nodeName);
    //   }

    // }
    const s1 = document.querySelector('#mermaidcontainer')!.firstElementChild;
    console.log(s1);



    const graphDefinition = 'graph TB\na-->b';
    const cb = function(svgGraph: any){
        console.log(svgGraph);
    };
    mermaid.render('mermaidcontainerdirectrender',graphDefinition,cb);


    this.RefreshMermaid();
  }

  RefreshMermaid(){
    let element = document.getElementById('mermaidcontainer') as HTMLElement;
    console.log('svg?',element)
    element.removeAttribute('data-processed');
    element.firstElementChild?.removeAttribute('style');
    console.log('svg?',element.firstElementChild);
    mermaid.init(undefined, element);


    // element = document.getElementById('mermaidcontainerdirectrender') as HTMLElement;
    // console.log(element)
    // element.removeAttribute('data-processed');
    // mermaid.init(undefined, element);
  }


}
