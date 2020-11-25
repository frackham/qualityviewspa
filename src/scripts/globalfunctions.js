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

function showGlobalModal_Element(e, dataelementText){
  modal.style.display = "block";
  var dataelement = JSON.parse(dataelementText);
  modalDynamicContentWrapper.innerHTML = `<h2>${dataelement.elementName}</h2>
  <p>Score: ${dataelement.tempElementScore}</p>
  `;
}

function showGlobalModal_Subproject(dataelement){
  modal.style.display = "block";
  console.log({dataelement});
  var clusterData = JSON.parse(dataelement.cluster);
  var optional_aliases = clusterData.aliases ? `<h3>(AKA ${clusterData.aliases})</h3>` : '';
  var optional_tagline = clusterData.tagline ? `<p><b>${clusterData.tagline}</b></p>` : '';
  modalDynamicContentWrapper.innerHTML = `<h2>${dataelement.clusterName}</h2>
  ${optional_aliases}
  ${optional_tagline}
  `;
}
