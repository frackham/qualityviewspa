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
  alert(`A callback was triggered [${e}, ${e.id}, ${e.text}, ${e.name}.\r\n\r\n ${e.dataset.example}. \r\n\r\n${e.dataset.element}]`);
  // alert('dataelement', e["dataelement"].val())
  window.parent["lastSvgElement"] = e;
}

