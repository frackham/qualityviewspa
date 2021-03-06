import { Injectable, Optional } from '@angular/core';
import mermaid, { mermaidAPI } from 'mermaid';
import { Project } from '../model/project';
import { ProjectDataService } from './project-data.service';

export interface GraphBuilderConfig {
  subProjectsToHide: string[];
  subProjectsToShow: string[];
  debug: boolean;
}


@Injectable({
  providedIn: 'root'
})

export class GraphBuilderService {

  /*config notes:
    include/exclude list for projects - Show takes priority if in both lists.

  */
  public config:GraphBuilderConfig = {
    subProjectsToHide: [
      "Other_UnHomed"
      //, "Website", "Experience-Classic", "Experience-Iceberg"
    ],
    subProjectsToShow: [],
    debug: false
  };
  private _debug:boolean = false;
  graphTemplate:string = "";
  graphDirty:boolean = false;
  testGraphData:string = `
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
  classDef q09 fill:#ffffff,stroke:#333
  classDef q19 fill:#fff5eb,stroke:#333
  classDef q29 fill:#fee6ce,stroke:#333
  classDef q39 fill:#fdd0a2,stroke:#333
  classDef q49 fill:#fdae6b,stroke:#333
  classDef q59 fill:#fd8d3c,stroke:#333
  classDef q69 fill:#f16913,stroke:#333
  classDef q79 fill:#d94801,stroke:#333
  classDef q89 fill:#a63603,stroke:#333
  classDef q99 fill:#7f2704,stroke:#333

  class DB qualityow;
  class FE-API qualitylow;
  class DB2,Web q99;
  class DB3,BE-API qualityhigh;

  click DB2 callback "text"
  click FE-API undefinedTooltip "Any Tooltip Text"
  `;
  testFailingGraphData:string = `ada


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
  classDef q19  as fill:#fff5eb
  classDef q29  s fill:#fee6ce
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
  // config: GraphBuilderConfig | null = null;

  constructor(private projectDataService: ProjectDataService, @Optional() public _config:GraphBuilderConfig) {
    if(_config) {
      this.config = _config;
    } else {
      this.config =      {
        subProjectsToHide: [
          "Other_UnHomed"
          //, "Website", "Experience-Classic", "Experience-Iceberg"
        ],
        subProjectsToShow: [],
        debug: false
      }
    }
    if(this.config.subProjectsToShow = []) { this.config.subProjectsToShow = this.projectDataService.getSubProjectNames(); }


  }

  // UseConfig(config:GraphBuilderConfig){
  //   this.config = config;
  // }

  BuildGraph(){
    let buildingTemplate:string = `
    `;

    buildingTemplate = this.Builder_AddHeader(buildingTemplate)
    buildingTemplate = this.Builder_AddElements(buildingTemplate)
    buildingTemplate = this.Builder_AddRelationships(buildingTemplate)
    buildingTemplate = this.Builder_AddResults(buildingTemplate)
    buildingTemplate = this.Builder_AddStyles(buildingTemplate)
    buildingTemplate = this.Builder_AddInteractivity(buildingTemplate)
    buildingTemplate = this.Builder_AddFooter(buildingTemplate)

    //DEBUG:
    // buildingTemplate = this.testGraphData;        // Use known working data instead of the generated template.
    // buildingTemplate = this.testFailingGraphData; // Use known failing data instead of the generated template.

    this.VerifyGraph(buildingTemplate);

    this.graphTemplate = buildingTemplate
  }

  RefreshGraph(){
    this.BuildGraph();
    this.graphDirty = false;
  }

  MermaidGraph():string{
    //option to always refresh in call?
    if(!this.graphDirty){
      this.RefreshGraph();
    }

    return this.graphTemplate;
  }

  SetGraphIsOutdated(){
    this.graphDirty = false;
  }

  VerifyGraph(templateToVerify:string){
    let result;
    let result1;
    try {
      result = mermaid.parse(templateToVerify);
      result1 = mermaidAPI.parse(templateToVerify);
    } catch {
      console.log("Error parsing mermaid template")
      console.log(result);
      console.log(result1);
      console.log('graphTemplate', templateToVerify)
    }
  }

/* Builder functions */
// REFACTOR: Import from a stylesheet-esque file.
// REFACTOR: Each of these should generate based on the data services.
Builder_AddHeader(template: string): string {
  return template += `
  graph LR
  `;
}

GetSubProjectsToShow(){
  //Correctly apply both hide/show filters.
  //*HIDE* takes priority if in both lists. //BUG:Should be show rather than hide that takes priority..
  var subProjects = this.config.subProjectsToShow;

  //Remove values to hide.
  subProjects = subProjects.filter( ( subProject ) => !this.config.subProjectsToHide.includes( subProject ) );

  //Add values to show.
  // this.config.subProjectsToShow.forEach( subToShow => {
  //   if (!subProjects.includes(subToShow))
  //   subProjects.push(subToShow);
  // });

  return subProjects;
}

Builder_AddElements(template: string): string {
  for (let sg of this.GetSubProjectsToShow()) {
    if(sg === "StyleHelper" && !this._debug) {
      continue;
    }

    var subproject = this.projectDataService.getSubProject(sg);
    if(subproject){
      template += `\r\n subgraph "${sg}"`
      // template += `\r\n subgraph "${sg}<br/>${tagline}"`
      var elements = this.projectDataService.getElements().filter(function(element) { return element.subProject === sg; });
      elements.forEach(el =>  {
        switch (el.shape ?? null) {
          case null:
            template += `\r\n  ${el.elementId}[${el.elementName}]`
            break;

          case "database":
            template += `\r\n  ${el.elementId}[(${el.elementName})]`
            break;

          case "circle":
            template += `\r\n  ${el.elementId}((${el.elementName}))`
            break;

          case "rounded":
            template += `\r\n  ${el.elementId}(${el.elementName})`
            break;

          default:
            template += `\r\n  ${el.elementId}[${el.elementName}]`
            break;
        }
      });
      template += `\r\n end \r\n\r\n`
    } else {
      console.error(`${sg} did not return a project from this.projectDataService during graph build process.`)
    };
  };
  return template;
}

Builder_AddRelationships(template: string): string {
  var allElements = this.projectDataService.getElements();

  this.projectDataService.getProject().relationships.forEach(rel => {
    var fromElement: any | null = allElements.find(x => x.elementId === rel.fromElement);
    var toElement: any | null= allElements.find(x => x.elementId === rel.toElement);

    //Don't include relationships where either element is in subprojects we're excluding.
    var includeRelationShip:boolean = false;
    if(this.config.subProjectsToShow.includes(fromElement?.subProject)) { includeRelationShip = true; }
    if(this.config.subProjectsToShow.includes(toElement?.subProject)) { includeRelationShip = true; }

    this.GetSubProjectsToShow()
    if(this.config.subProjectsToHide.includes(fromElement?.subProject)) { includeRelationShip = false; }
    if(this.config.subProjectsToHide.includes(toElement?.subProject)) { includeRelationShip = false; }

    if(includeRelationShip) { template += `\r\n  ${rel.fromElement} ---> ${rel.toElement}` }
  });
  return template ;
}

Builder_AddResults(template: string): string {
  return template += `

  %% Results
  class DB2,Web q99;
  class FE-API q79;
  class DB,BE-API q59;
  class DB3,BE-API q09;
  `;
}

Builder_AddStyles(template:string): string {
  return template += `

  %% Styles
    classDef default fill:#f9f,stroke:#333,stroke-width:4px,stroke:red
    classDef q09 fill:#ffffff,stroke:#111,stroke-width:2px
    classDef q19 fill:#fff5eb,stroke:#111,stroke-width:2px
    classDef q29 fill:#fee6ce,stroke:#111,stroke-width:2px
    classDef q39 fill:#fdd0a2,stroke:#111,stroke-width:2px
    classDef q49 fill:#fdae6b,stroke:#111,stroke-width:2px
    classDef q59 fill:#fd8d3c,stroke:#111,stroke-width:2px
    classDef q69 fill:#f16913,stroke:#111,stroke-width:2px
    classDef q79 fill:#d94801,stroke:#111,stroke-width:2px
    classDef q89 fill:#a63603,stroke:#111,stroke-width:2px
    classDef q99 fill:#7f2704,stroke:#111,stroke-width:2px

    linkStyle default fill:none,stroke-width:4px,stroke:black, opacity: 0.3;

    %%Thick solid lines
    %%linkStyle default fill:none,stroke-width:4px,stroke:black

  `;
}

Builder_AddInteractivity(template:string): string {
  return template += `

  %%Interactivity
click DB2 callback "text"
click FE-API undefinedTooltip "Any Tooltip Text"

`;
}

Builder_AddFooter(template:string): string {
  return template += `

  %%Footer
  %%Want key here
  %%Use # codes for special characters: https://www.codetable.net/unicodecharacters?page=87
  %%subgraph SGKey[" "]
  %%  KeyItem1{{"#127755; Descriptive text in key"}}
  %%  KeyItem2{{"#127755; Descriptive text in key"}}
  %%end
%%
  %%style SGKey fill:#FFF,stroke:#FFF,stroke-width:0px
  %%class KeyItem1,KeyItem2 KeyStyle;
  %%classDef KeyStyle fill:#FFF,stroke:#FFF,stroke-width:0px
`;
}

///////////////////////////////////////////
//Standalone graphs - how to execute from global js...?
/*
e.g
graph LR
  subgraph Dev
    DevBuild[Build] --> DevDeploy[Deploy]
  end
  subgraph Prod
    ProdBuild[Build] --> ProdDeploy[Deploy]
  end
*/
Builder_ReturnStandalonGraph_SubProject(source:any): string {
  var completedTemplate:string = 'graph LR';

  completedTemplate += `subgraph Dev
  DevBuild[Build] --> DevDeploy[Deploy]
  end `;
  completedTemplate += `subgraph Dev
  DevBuild[Build] --> DevDeploy[Deploy]
  end `;


  console.log('standalone subgraph template:', {completedTemplate} )
  return completedTemplate;
}

}
