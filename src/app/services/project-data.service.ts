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

  constructor(
    private jsonDataService: JsonDataService) {

    }
  //Project
  getProject(): Project {
    //throw new Error('Method not implemented.');
    return this.jsonDataService.project;
  }

  //Elements
  getElements(): Element[] {
    //throw new Error('Method not implemented.');
    return this.getProject().elements;
  }


  //Dimensions
  getDimensions(): Dimension[] {
    //throw new Error('Method not implemented.');
    return this.jsonDataService.dimensions;
  }


  // Evidence
  getEvidence(): Evidence[] {
    return this.jsonDataService.evidence;
  }




  getResults(): Result[] {
    //throw new Error('Method not implemented.');
    return this.jsonDataService.results;
  }




  elementScore(element:string):number {
    var project = this.jsonDataService.project;
    return project.elements.find(x => x.elementName = element)?.tempElementScore ?? -1;

  }
}
