
  export interface Project {
    projectName: string;
    tempElementScoreScale: number;
    elements: Element[];
    relationships: Relationship[];
    subProjects: string[];
}

    export interface Element {
      elementId: string;
      elementName: string;
      tempElementScore: number;
      subProject?: string;
      elementRegex?(): string;
      shape?: string; // default is square. alternatives: "database", "circle", "rounded"
  }

  export interface Relationship {
      fromElement: string;
      toElement: string;
      label?: string;
  }
