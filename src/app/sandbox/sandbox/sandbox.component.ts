import { Component, OnInit } from '@angular/core';
import { Dimension } from 'src/app/model/dimension';
import { Evidence } from 'src/app/model/evidence';
import { Result } from 'src/app/model/result';

import { ProjectDataService } from '../../services/project-data.service';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss']
})
export class SandboxComponent implements OnInit {

  dimensions: Dimension[] = [];
  evidence: Evidence[]=[];
  results: Result[]=[];

  constructor(
    private projectDataService: ProjectDataService) { }

  ngOnInit(): void {
    this.dimensions = this.projectDataService.getDimensions();
    this.evidence = this.projectDataService.getEvidence();
    this.results = this.projectDataService.getResults();
  }

}
