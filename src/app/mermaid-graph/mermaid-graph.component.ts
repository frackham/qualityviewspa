import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import * as mermaid from "mermaid";
import { ProjectDataService } from '../services/project-data.service';
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const { mermaidAPI } = mermaid;
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
  styleUrls: ['./mermaid-graph.component.scss', '../../../src/assets/styles/mermaid.min.css']
})
export class MermaidGraphComponent implements OnInit {
  @ViewChild('mermaid', { static: true }) mermaid: ElementRef | undefined;
  loading:boolean = true;
  mermaidWrapperCssClass:string = "hidden"
  graphData:string = "";

  constructor(
    private projectDataService: ProjectDataService,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document) {


    this.loadGraphData();

    console.warn('Here', mermaid);

  }

  ngOnInit(): void {
    console.log(this.projectDataService.elementScore("DB"));

    // mermaidAPI.render('the-id', `graph TD
    // A[Christmas] -->|Get money| B(Go shopping)
    // B --> C{Let me think}
    // C -->|One| D[Laptop]
    // C -->|Two| E[iPhone]
    // C -->|Three| F[fa:fa-car Car]`, (g: any) => {
    //   var el:HTMLElement | null = document!.querySelector('#result');
    //   if(el) {
    //     el.innerHTML = g;
    //   }
    // });
    // // if(this.mermaid){
    //   console.log(this.mermaid.nativeElement);

    // } else {
    //   console.log('no mermaid', this)
    // }
  //   var config = {
  //     startOnLoad:true,
  //     securityLevel:'loose',
  //     flowchart:{
  //         useMaxWidth:true,
  //         htmlLabels:true
  //     },
  //     logLevel: 'error',
  //     theme: "default",
  //     themeVariables: {
  //       "fontSize": "18px"
  //     }
  // };
  // mermaid.initialize(config);
  // if(this.mermaid){
  //   console.log(this.mermaid.nativeElement);

  // } else {
  //   console.log('no mermaid', this)
  // }

  }
  loadGraphData() {
    this.graphData = `
    graph LR


    subgraph Website

        DB(Database)
        BE-API[Back End API]
        FE-API[Front End API]
        Web[Website]


        DB --- BE-API
        BE-API --- FE-API
        FE-API --- Web
      end

    subgraph Inspiration
      DB2(Database)
    end

    subgraph Experience
      DB3(Database)
    end

    %% This needs generating from a template
    classDef default fill:#f9f,stroke:#333,stroke-width:4px;
    classDef qualitylow fill:#B02020,stroke:#333,stroke-width:4px;color:#ffffff;
    classDef qualitymid fill:#DD550C,stroke:#333,stroke-width:4px;
    classDef qualityhigh fill:#DFE74A,stroke:#333,stroke-width:4px;
    classDef q09 fill:#ffffff
    classDef q19 fill:#fff5eb
    classDef q29 fill:#fee6ce
    classDef q39 fill:#fdd0a2
    classDef q49 fill:#fdae6b
    classDef q59 fill:#fd8d3c
    classDef q69 fill:#f16913
    classDef q79 fill:#d94801
    classDef q89 fill:#a63603
    classDef q99 fill:#7f2704

    class DB qualityow;
    class FE-API qualitylow;
    class DB2,Web q99;
    class DB3,BE-API qualityhigh;

    click DB2 callback "text"
    click FE-API undefinedTooltip "Any Tooltip Text"
    `;

    //console.log(this.graphData);

    // var mermaidcontainer = document.querySelector("#mermaidcontainer");
    // if(mermaidcontainer){
    //   mermaidcontainer.innerHTML = this.graphData;
    //   console.log(mermaidcontainer.innerHTML === this.graphData);
    // }
  }

  async ngAfterContentInit(): Promise<void> {

    this.MermaidFirstLoad();

    await this.delay(3500);
    this.loading = false;

    this.mermaidWrapperCssClass = "";

    // // mermaidAPI.initialize({
    // //   startOnLoad:true
    // // });
    // // $(function(){
    // //     const graphDefinition = 'graph TB\na-->b';
    // //     const cb = function(svgGraph){
    // //         console.log(svgGraph);
    // //     };
    // //     mermaidAPI.render('id1',graphDefinition,cb);
    // // });
    // var config = {
    //   startOnLoad:true,
    //   flowchart:{
    //     useMaxWidth:true,
    //     htmlLabels:true,
    //     curve:'cardinal',
    //   },

    //   securityLevel:'loose',
    // };
    // var mermaidcontainer = document.querySelector("#mermaidcontainer");
    // console.log('preinit', config, mermaid, mermaidcontainer);
    // mermaid.initialize(config);
    // console.log('postinit', config, mermaid, mermaidcontainer);
    // const graphDefinition = 'graph TB\na-->b';
    //  const cb = function(svgGraph:any){
    //      console.log(svgGraph);
    //  };

    // // if(mermaidcontainer && this.graphData != "") {
    // //   console.log('this should be a refresh')
    // //   mermaidcontainer.innerHTML = this.graphData;
    // //   mermaidcontainer.removeAttribute('data-processed');
    // //   mermaid.init(undefined, mermaidcontainer);
    // // }
    // // else {
    // //   console.log('no mermaid container to update innerhtml')
    // // }
    // mermaid.render('mermaidcontainer',graphDefinition,cb);
    // console.log('postrender', config, mermaid, mermaidcontainer);
    // dispatchEvent(new Event('load'));
  }

  MermaidFirstLoad(){
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

    this.RefreshMermaid();
  }

  RefreshMermaid(){
    let element = document.getElementById('mermaidcontainer') as HTMLElement;
    console.log('svg?',element)
    element.removeAttribute('data-processed');
    element.firstElementChild?.removeAttribute('style');
    console.log('svg?',element.firstElementChild);
    //mermaid.init(undefined, element);


    // element = document.getElementById('mermaidcontainerdirectrender') as HTMLElement;
    // console.log(element)
    // element.removeAttribute('data-processed');
    // mermaid.init(undefined, element);
  }



  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
