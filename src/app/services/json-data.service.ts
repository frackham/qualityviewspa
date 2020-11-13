import { Injectable } from '@angular/core';

//Json sources:

import * as qvDimensions from 'src/data/example/current/qvDimensions.json';
import * as qvEvidence from 'src/data/example/current/qvEvidence.json';
import * as qvProject from 'src/data/example/current/qvProject.json';
import * as qvSubProjects from 'src/data/example/current/qvSubProjects.json';
import * as qvResults from 'src/data/example/current/qvResults.json';
import { Dimension } from '../model/dimension';
import { Evidence } from '../model/evidence';
import { Project } from '../model/project';
import { Result } from '../model/result';

@Injectable({
  providedIn: 'root'
})
export class JsonDataService {

  //Use http://json2ts.com/ to create models from json files.

  dimensions:Dimension[];
  evidence:Evidence[];
  project:Project;
  subProjects:any[]; //TODO: Need a model.
  results:Result[];

  constructor() {
    this.dimensions = qvDimensions.dimensions;
    this.evidence = qvEvidence.evidence;
    this.project = qvProject.project;
    this.results = qvResults.results;

    this.subProjects = qvSubProjects.subProjects;
  }



  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    // console.log(this.dimensions)
    // console.log(this.evidence)
    // console.log(this.project)
    // console.log(this.results)
    // console.log(this.subProjects)
  }


}
