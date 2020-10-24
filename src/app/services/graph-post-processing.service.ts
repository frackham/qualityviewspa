import { Injectable } from '@angular/core';
import { ProjectDataService } from './project-data.service';
import { Element } from '../model/project';

@Injectable({
  providedIn: 'root'
})
export class GraphPostProcessingService {
  private _parser: DOMParser;
  private _xmlDoc: Document | null = null;
  private elements: Element[] = [];

  constructor(
    private projectDataService: ProjectDataService) {

    this._parser = new DOMParser();
   }


  PostProcess(svgContent: string): string {

    var xmlDoc = this._parser.parseFromString(svgContent, "image/svg+xml");
    this._xmlDoc = xmlDoc;

    this.getPostProcessingData();
    this.InsertSvgStyles(); //Updates xmldoc.
    this.ProcessClusters();
    this.ProcessNodes(); //Updates xmldoc.


    //Return final postprocessed svg.
    var markup = this._xmlDoc.documentElement.outerHTML;
    console.log(markup);
    svgContent = markup;

    return svgContent;
  }

  InsertSvgStyles() {
    var preStyle = `


      .svg-mermaid-cluster {
          color:blue;
      }

      .svg-mermaid-cluster-background {
        fill:red;
        stroke:hotpink;
      }

      .svg-mermaid-cluster-title {
        font-size:1.2em;
      }

      .svg-mermaid-element {

      }


      .svg-element-style-whitetext {
          color:white;
      }
      .svg-element-style-paletext {
          color:#eee;
      }


    `

    // var theSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // theSvg.innerHTML = preStyle;
    var theStyle = document.createElementNS("http://www.w3.org/2000/svg", "style");
    theStyle.innerHTML = preStyle;
    if(this._xmlDoc?.firstElementChild){

    this._xmlDoc.firstElementChild.appendChild(theStyle);
    console.log("theStyle=", theStyle, this._xmlDoc.firstElementChild); // undefined, try adding svg to DOM
    // this._xmlDoc.appendChild(theSvg);
    // console.log("theSvg=", theSvg); // still undefined
    }

  }
  getPostProcessingData() {
    this.elements = this.projectDataService.getElements();
  }

  ProcessClusters() {
    if(!this._xmlDoc) { throw "no xmldoc defined" }
    var svgClusters = this._xmlDoc.getElementsByClassName("cluster");
    for (var i=0, len=svgClusters.length|0; i<len; i=i+1|0) {
      svgClusters[i].classList.add("svg-mermaid-cluster"); //TODO: Use this class to style using CSS, and apply classes to other mermaid types


      var r = svgClusters[i].getElementsByTagName("rect")[0] //rect element in svg, background of a subgraph.
      r.classList.add(`svg-mermaid-cluster-background`);

      var g1 = svgClusters[i].getElementsByTagName("g")[0]
      var g2 = g1.getElementsByTagName("g")[0]
      var f1 = g2.getElementsByTagName("foreignObject")[0]
      var d1 = f1.getElementsByTagName("div")[0]

      d1.classList.add(`svg-mermaid-cluster-title`);
      var originalWidth:string|null = f1.getAttribute('width')
      f1.setAttribute('width', (parseFloat(originalWidth ? originalWidth : '')*2).toString() ?? '100%' )
    }
  }
  ProcessNodes() {
    if(!this._xmlDoc) { throw "no xmldoc defined" }
    var svgElementsNodes = this._xmlDoc.getElementsByClassName("node");

    //Manually editing the svg from mermaid before we use it.
    //This allows us to inject anything we want here that can be applied to svg (including css and interactions) rather than relying what's available in mermaid.
    for (var i=0, len=svgElementsNodes.length|0; i<len; i=i+1|0) {
      svgElementsNodes[i].classList.add("myClass"); //TODO: Use this class to style using CSS, and apply classes to other mermaid types
      svgElementsNodes[i].classList.add("svg-mermaid-element"); //TODO: Use this class to style using CSS, and apply classes to other mermaid types
      var elementData = this.projectDataService.getElementOfSvgId(svgElementsNodes[i].id);
      var elementDataText = JSON.stringify(elementData);
      svgElementsNodes[i].setAttribute("data-example", "plaintext");
      svgElementsNodes[i].setAttribute("data-element", elementDataText);
      svgElementsNodes[i].setAttribute("onclick","window.parent.SvgElementClickHandler(this, this.dataset.element)");

      //Get matching data element, and attach to svg
      var score : number = elementData?.tempElementScore ?? 10;
      score -=1;
      score = score >= 0 ? score : 0;
      score = score <= 9 ? score : 9;
      svgElementsNodes[i].setAttribute("data-score-total", score.toString() ?? "10");


      svgElementsNodes[i].classList.add(`q${score}9`); //TODO: Get actual score


      //Text styling, has to act on the (svg styles, not standard css!)
      if(score>6) {
        var g1 = svgElementsNodes[i].getElementsByTagName("g")[0]
        var g2 = g1.getElementsByTagName("g")[0]
        var f1 = g2.getElementsByTagName("foreignObject")[0]
        var d1 = f1.getElementsByTagName("div")[0]

        d1.classList.add(`svg-element-style-paletext`);
      }
    }
  }

  postProcessMermaidSvg(inputSvg: string) : string{
    //document.querySelector('[id^="flowchart-Website-DB-"]').id;
    let outputSvg = inputSvg;

    //attach element to each element

    return outputSvg;
  }
}
