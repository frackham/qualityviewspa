console.log('global functions loaded')

function SvgElementClickHandler(e){
  console.log(e)
  alert(`A callback was triggered [${e}, ${e.id}, ${e.text}, ${e.name}]`);

}

