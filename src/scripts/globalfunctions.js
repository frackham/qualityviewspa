console.log('global functions loaded')

function SvgElementClickHandler_TOUSE(e, dataelement, callback){ //TODO: Allow injecting a callback so different elements logic can be handled at the angular controller.
  console.log(e)
  alert(`A callback was triggered [${e}, ${e.id}, ${e.text}, ${e.name}.\r\n\r\n ${e.dataset.example}. \r\n\r\n${e.dataset.element}]`);
  // alert('dataelement', e["dataelement"].val())
  window.parent["lastSvgElement"] = e;

  if (callback && callbackIsFunction) {
    callback(e);
  }
}

function SvgElementClickHandler(e, dataelement){
  console.log(e)
  //alert(`A callback was triggered [${e}, ${e.id}, ${e.text}, ${e.name}.\r\n\r\n ${e.dataset.example}. \r\n\r\n${e.dataset.element}]`);
  // alert('dataelement', e["dataelement"].val())
  window.parent["lastSvgElement"] = e;

  window.showGlobalModal_Element(e, dataelement);
}



//Modal logic:
// Get the modal
var modal = document.getElementById("myModal");
var modalSpan = document.getElementsByClassName("modal-close")[0];
var modalDynamicContentWrapper= document.getElementById("modal-contentblock-wrapper");
// When the user clicks on <span> (x), close the modal
modalSpan.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

/////////////
//SVG draw functions for the subproject and element modals

var environmentStepStatusColors = {
  "green":    "#4CB27F",
  "amber":    "#B27F4C",
  "red":      "#B24C4C",
  "n/a":      "#7C7C7C",
  "default":  "#7F4CB2"
};

function showGlobalModal_Element(e, dataelementText){
  if(dataelementText && dataelementText != undefined) {
    var dataelement;
    try {
      dataelement = JSON.parse(dataelementText);
    } catch {
      console.error('globalfunctions.js : showGlobalModal_Element : could not parse dataelementText', {dataelementText}, {e});
      return;
    }
    modal.style.display = "block";
    modalDynamicContentWrapper.innerHTML = `<h2>${dataelement.elementName}</h2>
      <p>Score: ${dataelement.tempElementScore}</p>
      `;
  } else {
    console.error('globalfunctions.js : showGlobalModal_Element : called without dataelementText, the element may not exist in the element dataset.');
  }
}

function showGlobalModal_Subproject(dataelement, subprojectName){

  if(dataelement) {
    modal.style.display = "block";
    console.log({dataelement});
    var clusterData = JSON.parse(dataelement.cluster);
    var optional_aliases = clusterData.aliases ? `<h3>(AKA ${clusterData.aliases})</h3>` : '';
    var optional_tagline = clusterData.tagline ? `<p><b>${clusterData.tagline}</b></p>` : '';
    var optional_parsedEnvironments = clusterData.environments ? clusterData.environments.map(e => e.name).join(', ') : '';


    var test_svgMarkup = SVGDiagramFromSource_SubProjectEnvironments(clusterData.environments, subprojectName);
    modalDynamicContentWrapper.innerHTML = `<h2 class='modal-title-subprojectmodal'>${dataelement.clusterName} Notes</h2>
      ${optional_aliases}
      ${optional_tagline}
      <br />

      <h4 class="modal-section-subtitle">Environments</h4>
      ${test_svgMarkup}
    `;
  } else {
    console.error('globalfunctions.js : showGlobalModal_Subproject : called without dataelement, the subproject may not exist in the subproject dataset.');
  }
}

function SVGDiagramFromSource_SubProjectEnvironments(source, subprojectName){


  var svgMarkup = "";
  var environmentsMarkup = "";
  var yOffset = 50;
  var yStep = 150;
  var xStep = 300;
  var maxXOffset = 800;
  source.forEach(function(env) {
    var optional_parsedUrls = env.urls ? '<text xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="24" >' + env.urls.map( (url) => {  return `<a target="_blank" xlink:href="${url.url}"><text>${url.name}</text></a>`  } ).join('<br>') + "</text>": '';


    environmentsMarkup += "\r\n\ ";
    environmentsMarkup +="<g>"

    environmentsMarkup += `<title>${env.name}</title>`;
    environmentsMarkup += `<text xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="24" id="svg_2_${env.name}" y="${yOffset - 30}" x="0" stroke-width="0" stroke="#000" fill="#000000">${env.name}</text>`;
    environmentsMarkup += `<text xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="16" id="svg_2_${env.name}" y="${yOffset - 10}" x="0" stroke-width="0" stroke="#000" fill="#888888">(${env.deploymentMechanism})</text>`;

    //per step - move X.
    var xOffset = 0;
    var stepBlockHeight = 70;
    var stepBlockWidth = 250;
    if(env.steps) {
      env.steps.forEach(function(step) {
        envStepColour = step.status ? environmentStepStatusColors[step.status] : environmentStepStatusColors["default"];
        environmentsMarkup += `<rect id="svg_1_${step.name}" height="${stepBlockHeight}" width="${stepBlockWidth}" y="${yOffset}" x="${xOffset}" stroke-width="1.5" stroke="#000" fill="${envStepColour}" />`;
        environmentsMarkup += `<text xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="18" id="svg_2_STEPNAME" y="${yOffset + (yStep/2) - (stepBlockHeight/2) }" x="${xOffset + (xStep/2)- (stepBlockWidth/2)}" stroke-width="0" stroke="#000" fill="#000000">${step.name}</text>`;
        if (xOffset !== 0) {
          //Only draw arrows if not the first step, and draw before the box above.
          environmentsMarkup += `<use xlink:href="#svg_arrowtemplate" y="${(yOffset + (stepBlockHeight/2) - 15) }" x="${(xOffset - xStep) + stepBlockWidth}"></use>`;
        }
        xOffset += xStep;
      });
    } else { console.error(`${env.name} in subproject ${subprojectName} does not have any environment steps (stages) assigned.`, env, source);}
    // //  <text xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="24" id="svg_2" y="39.45313" x="349.5" stroke-width="0" stroke="#000" fill="#000000">Dev</text>
// //  <path id="svg_3" d="m344.72753,143.74241c0.06266,-7.86104 -0.04009,-15.7326 0.51528,-23.57981c13.64645,2.58139 27.13195,6.80519 40.54844,10.60361c0.72025,-3.85459 0.38125,-7.05201 1.00704,-10.61585c8.61932,7.49929 17.16091,15.10537 25.35244,23.07365c-7.85897,9.03877 -16.8735,16.88832 -25.72335,24.92635c-0.28658,-3.74319 -0.57321,-7.48635 -0.85979,-11.22954c-13.04338,3.62136 -26.83718,7.3655 -39.96489,10.67612c-0.89275,-7.63912 -0.86651,-15.95834 -0.87517,-23.85452z" stroke-width="1.5" stroke="#000" fill="#fff"/>
// //  <rect id="svg_5" height="93" width="274" y="100.45313" x="458.5" stroke-width="1.5" stroke="#000" fill="#BF7E96"/>
// //  <text xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="24" id="svg_6" y="153.45313" x="142.5" fill-opacity="null" stroke-opacity="null" stroke-width="0" stroke="#000" fill="#000000">Build</text>
// //  <text xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="24" id="svg_7" y="156.45313" x="558.5" fill-opacity="null" stroke-opacity="null" stroke-width="0" stroke="#000" fill="#000000">Deploy</text>
    environmentsMarkup +=`${optional_parsedUrls}`;
    environmentsMarkup +="</g>";

    //Set values for next environment
    yOffset += yStep;
    maxXOffset = Math.max(xOffset+50, maxXOffset);
  });

//   for(env in source){
//     console.log({env});


// //  <g>
// //  <title>Layer 1</title>
// //  <rect id="svg_1" height="93" width="274" y="101.45313" x="32.5" stroke-width="1.5" stroke="#000" fill="#7DD8B5"/>
// //  <text xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="24" id="svg_2" y="39.45313" x="349.5" stroke-width="0" stroke="#000" fill="#000000">Dev</text>
// //  <path id="svg_3" d="m344.72753,143.74241c0.06266,-7.86104 -0.04009,-15.7326 0.51528,-23.57981c13.64645,2.58139 27.13195,6.80519 40.54844,10.60361c0.72025,-3.85459 0.38125,-7.05201 1.00704,-10.61585c8.61932,7.49929 17.16091,15.10537 25.35244,23.07365c-7.85897,9.03877 -16.8735,16.88832 -25.72335,24.92635c-0.28658,-3.74319 -0.57321,-7.48635 -0.85979,-11.22954c-13.04338,3.62136 -26.83718,7.3655 -39.96489,10.67612c-0.89275,-7.63912 -0.86651,-15.95834 -0.87517,-23.85452z" stroke-width="1.5" stroke="#000" fill="#fff"/>
// //  <rect id="svg_5" height="93" width="274" y="100.45313" x="458.5" stroke-width="1.5" stroke="#000" fill="#BF7E96"/>
// //  <text xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="24" id="svg_6" y="153.45313" x="142.5" fill-opacity="null" stroke-opacity="null" stroke-width="0" stroke="#000" fill="#000000">Build</text>
// //  <text xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="24" id="svg_7" y="156.45313" x="558.5" fill-opacity="null" stroke-opacity="null" stroke-width="0" stroke="#000" fill="#000000">Deploy</text>
// // </g>
//   }

  var canvasY = Math.max(yOffset+50, 400);

  svgMarkup += `

  <!-- ARROW TEMPLATE - Hidden using size. -->
  <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
  <g>
    <rect fill="#fff" id="canvas_background" height="166" width="335" y="-1" x="-1"/>
  </g>
  <g>
    <path stroke="#9b9b37" id="svg_arrowtemplate" d="m9.75,13.89103c0.01859,-3.04586 -0.01189,-6.09579 0.15285,-9.13629c4.048,1.00019 8.04825,2.63675 12.02804,4.1085c0.21365,-1.49351 0.11309,-2.73239 0.29872,-4.11324c2.55678,2.90569 5.09051,5.85276 7.52039,8.94017c-2.33124,3.50218 -5.00525,6.54359 -7.63042,9.65802c-0.08501,-1.45034 -0.17003,-2.90068 -0.25504,-4.35102c-3.86911,1.40314 -7.96082,2.85385 -11.85494,4.13659c-0.26482,-2.95987 -0.25704,-6.18326 -0.2596,-9.24273z" stroke-width="1.5" fill="#666666"/>  </g>
  </svg>


  <svg width="${maxXOffset}" height="${canvasY}" xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink">
 <g>
  <title>background</title>
  <rect fill="#fff" id="canvas_background" height="${canvasY}" width="${maxXOffset+2}" y="-1" x="-1"/>
  <g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid">
   <rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%"/>
  </g>
 </g>
  ${environmentsMarkup}
</svg>
  `;

  return svgMarkup;
}
