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
  subProjects: string[]=[];
  subProjectNames: string[] = [];

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
    this.ProcessSvgWrappingElement();

    //Return final postprocessed svg.
    var markup = this._xmlDoc.documentElement.outerHTML;
    console.log(markup);
    svgContent = markup;

    return svgContent;
  }

  ProcessSvgWrappingElement() {
    if(!this._xmlDoc) { throw "no xmldoc defined" }

    var generatedDiagramHeight = this._xmlDoc.getElementsByClassName("output")[0].getAttribute("height");
    //Set the overall SVG height to  g (.output) 's height
    this._xmlDoc.documentElement.setAttribute("height", generatedDiagramHeight?.toString() ?? "1300");
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
    this.subProjectNames = this.projectDataService.getSubProjectNames();
    this.subProjects = this.projectDataService.getSubProjects();
  }

  clusterOnClick(cluster:any){
  		alert('cluster on click fn!');
  		alert('a cluster on click should show subproject summary, and element should show element results breakdown (getResultsOfElement(elementId)');
  		console.log(cluster);
  }

  simpleclick(){
    alert('!!');
  }

  ProcessClusters() {
    if(!this._xmlDoc) { throw "no xmldoc defined" }

    let svgClusters = this._xmlDoc.getElementsByClassName("cluster");
    // var svgClusters = (<SVGElement[]><any>this._xmlDoc.getElementsByClassName("cluster"));
    // var svgClusters = (<SVGElement[]><any>this._xmlDoc.getElementsByClassName("cluster"));
    for (var i=0, len=svgClusters.length|0; i<len; i=i+1|0) {
      svgClusters[i].classList.add("svg-mermaid-cluster"); //TODO: Use this class to style using CSS, and apply classes to other mermaid types

      // svgClusters[i].setAttribute("onclick","alert('!, next trying passing this to the postprocessing function')");
      // svgClusters[i].setAttribute("onclick",this.clusterOnClick.bind(null, svgClusters[i]));
      // svgClusters[i].onclick = this.simpleclick.bind(null);
      // svgClusters[i].setAttribute("onclick",this.simpleclick.bind(null).toString());
      var svgEl: SVGElement = <SVGElement>svgClusters[i];
      //svgEl.addEventListener("click", function(){alert('clicked')}, false);
      // svgClusters[i].onclick = () => { alert('!, next trying passing this to the postprocessing function');}
//clusterOnClick
      svgEl.onclick = function() { alert('!!!');}
      svgEl.style.fill = "red";
      svgEl.style.stroke = "#FFAAAA";
      var parsedClusterName:string = svgEl.id.replace("flowchart-", "");
      parsedClusterName = parsedClusterName.substring( 0, parsedClusterName.lastIndexOf('-') );

      var tempClusterData = this.projectDataService.getSubProject(parsedClusterName);

      // {
      //   name: parsedClusterName
      // }

      svgEl.setAttribute("data-cluster-name", parsedClusterName);// readable using svgEl.dataset.clusterName,
      svgEl.setAttribute("data-cluster", JSON.stringify(tempClusterData));// readable using svgEl.dataset.cluster,
      var alertString = `Subproject clicked: ${parsedClusterName}. Data on data-cluster attribute: ${JSON.stringify(tempClusterData)}`;
      // svgEl.setAttribute("onclick","alert('Subproject clicked: ' + this.dataset.clusterName + '. Data on data-cluster attribute: ' + this.dataset.cluster ); console.log('SVGELCLICK', this, this.dataset.cluster, this.dataset.clusterName);");
      svgEl.setAttribute("onclick",`window.showGlobalModal_Subproject(this.dataset, this.dataset.clusterName); `);

      var r = svgClusters[i].getElementsByTagName("rect")[0] //rect element in svg, background of a subgraph.
      r.classList.add(`svg-mermaid-cluster-background`);

      var g1 = svgClusters[i].getElementsByTagName("g")[0]
      var g2 = g1.getElementsByTagName("g")[0]
      var f1 = g2.getElementsByTagName("foreignObject")[0]
      var d1 = f1.getElementsByTagName("div")[0]

      d1.classList.add(`svg-mermaid-cluster-title`); //Subproject title.

      var newElement = document.createElement("div");
      newElement.className = "svg-mermaid-cluster-textblock";
      newElement.innerHTML = "<p>TEXTY</p>";
      d1.appendChild(newElement);//Add alias and tagline.

      // // var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
      // // newElement.setAttribute("d","M 0 0 L 10 10"); //Set path's data
      // // newElement.style.stroke = "#000"; //Set stroke colour
      // // newElement.style.strokeWidth = "5px"; //Set stroke width
      // var subProjectSecondaryTextBlock = document.createElementNS("http://www.w3.org/2000/svg", 'text'); //Create a path in SVG's namespace
      // subProjectSecondaryTextBlock.setAttribute("x","0"); //Set path's data
      // subProjectSecondaryTextBlock.setAttribute("y","35"); //Set path's data
      // subProjectSecondaryTextBlock.textContent = "";
      // // subProjectSecondaryTextBlock.style.stroke = "#444"; //Set stroke colour
      // // subProjectSecondaryTextBlock.style.strokeWidth = "5px"; //Set stroke width

      // // text x="20" y="35" class="small">My</text>
      // // var newElement = document.createElement("span");
      // // newElement.className = "subproject-aliaslist";
      // // newElement.innerHTML = "<br/>TEXTY";

      // g2.appendChild(subProjectSecondaryTextBlock);//Add alias and tagline.
      // var subProjectSecondaryTextBlock_aliases = document.createElementNS("http://www.w3.org/2000/svg", 'tspan'); //Create a path in SVG's namespace
      // subProjectSecondaryTextBlock_aliases.setAttribute("dy","1.2em"); //Set path's data
      // subProjectSecondaryTextBlock_aliases.textContent = "aliases";
      // subProjectSecondaryTextBlock.appendChild(subProjectSecondaryTextBlock_aliases);
      // var subProjectSecondaryTextBlock_tagline = document.createElementNS("http://www.w3.org/2000/svg", 'tspan'); //Create a path in SVG's namespace
      // subProjectSecondaryTextBlock_tagline.setAttribute("dy","1.2em"); //Set path's data
      // subProjectSecondaryTextBlock_tagline.textContent = "tagline";
      // subProjectSecondaryTextBlock.appendChild(subProjectSecondaryTextBlock_tagline);
      // // <text x="0" y="0">
      // //   <tspan x="0" dy="1.2em">very long text</tspan>
      // //   <tspan x="0" dy="1.2em">I would like to linebreak</tspan>
      // // </text>

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
