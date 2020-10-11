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
  }

  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
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
      theme: "forest",
      themeVariables: {
        "fontSize": "18px"
      }

  };
  mermaid.initialize(config);
    // mermaid.initialize({
    // });

  // mermaid.render();

  }



}
