import { Injectable } from '@angular/core';
import { Dimension } from '../model/dimension';
import { Evidence, EvidenceSource } from '../model/evidence';
import { Project, Element, Relationship } from '../model/project';
import { Result, ProjectElement } from '../model/result'; ///REFACTOR: Model, ProjectElement is poorly named coming from Result.
import { JsonDataService } from '../services/json-data.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectDataService {

  public globalDebugData:any = null


  private _cachedProject: Project | null = null;
  private _cachedSubProjects: any | null = null; //TODO: subproject model.
  private _cachedElements: Element[] = [];
  private _cachedDimensions: Dimension[] = [];
  private _cachedEvidence: Evidence[] = [];

  constructor(
    private jsonDataService: JsonDataService) {

      (<any>window).globalDebugData = this.jsonDataService.project.elements; //TODO: Remove.
    }

  //////////////////////////////////////////////////
  //Project
  getProject(useCached:boolean = true): Project {
    if (useCached && this._cachedProject) {
      return this._cachedProject;
    }
    this._cachedProject = this.jsonDataService.project
    return this._cachedProject;
  }


  //////////////////////////////////////////////////
  //SubProjects
  getSubProjectNames(useCached:boolean = true): string[] {
    if (useCached && this._cachedProject) {
      return this._cachedProject.subProjects;
    }
    this._cachedProject = this.jsonDataService.project
    return this._cachedProject.subProjects;  //Project only holds the names.
  }

  getSubProjects(useCached:boolean = true): any[] {
    if (useCached && this._cachedSubProjects) {
      return this._cachedSubProjects;
    }
    this._cachedSubProjects = this.jsonDataService.subProjects
    return this._cachedSubProjects;
  }

  getSubProject(name:string):any | undefined{
    return this.getSubProjects(true).find(sub => sub.name === name)
  }


  //////////////////////////////////////////////////
  //Elements
  getElements(useCached:boolean = true): Element[] {
    if (useCached && this._cachedElements.length > 0) {
      return this._cachedElements;
    }

    this._cachedElements = this.getProject(useCached).elements;
    this._cachedElements.forEach(el =>  {
      el.elementRegex = function(){
        //CODEREVIEW: Currently ids are manually including the subgraph (e.g. subgraph-element), so this works...but a bit flakey if we change the way ids work.
        return `flowchart-${el.elementId}-`;
      };
    });
    return this._cachedElements;
  }


  getElementOfId(id:string):Element | undefined{
    return this.getElements(true).find(el => el.elementId === id)
  }

  //TODO: Rename property, not really a regex.
  getElementOfSvgId(svgId:string):Element | undefined{
    return this.getElements(true).find(el => el.elementRegex && svgId.startsWith(el.elementRegex()))
  }

  elementScore(element:string):number {
    var project = this.jsonDataService.project;
    return project.elements.find(x => x.elementName = element)?.tempElementScore ?? -1;
  }

  //////////////////////////////////////////////////
  //Dimensions
  getDimensions(useCached:boolean = true): Dimension[] {
    if (useCached && this._cachedDimensions.length > 0) {
      return this._cachedDimensions;
    }
    this._cachedDimensions = this.jsonDataService.dimensions
    return this._cachedDimensions;
  }


  //////////////////////////////////////////////////
  // Evidence
  getEvidence(useCached:boolean = true): Evidence[] {
    if (useCached && this._cachedEvidence.length > 0) {
      return this._cachedEvidence;
    }
    this._cachedEvidence = this.jsonDataService.evidence
    return this._cachedEvidence;
  }




  //////////////////////////////////////////////////
  // Results
  getResults(): Result[] {
    //throw new Error('Method not implemented.');
    return this.jsonDataService.results;
  }




}
