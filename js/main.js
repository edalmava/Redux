function reducer(state, action) {
  if (typeof state === 'undefined') {
	return {
	  estudiantes: {},
	  curso: '6-1'
	}
  }
  switch (action.type) {	    
	case 'ADD_ESTUDIANTE':
	  state.estudiantes[action.codigo] = action.notas;
	  return state
	case 'ADD_TODO_ESTUDIANTE':
	  state.estudiantes = action.estudiantes;
	  return state
	case 'UPDATE_NOTA_ESTUDIANTE':
	  state.estudiantes[action.codigo][action.comp][action.pos] = action.nota
	  return state
	case 'DELETE_NOTA_ESTUDIANTE':
	  delete state.estudiantes[action.codigo][action.comp][action.pos]
	  return state
	default:
	  return state
  }
}

var store = Redux.createStore(reducer)

store.subscribe(() => {
  console.log(store.getState());
})

function init() {
  /*let estudiantes = {
	"1000": {saber: {1: 5.0, 2: 3.5, 3: 4.5}, hacer: {1: 3.5, 3: 5.0}, ser: {1: 0}}
  }	  

  for (codigo in estudiantes) {
	store.dispatch({ type: 'ADD_ESTUDIANTE', codigo: codigo, notas: estudiantes[codigo] })
	renderEstudiante(codigo)
  }*/
  
  let estudiantes = JSON.parse('{"1000":{"saber":{"1":5,"2":3.5,"3":4.5},"hacer":{"1":3.5,"3":5},"ser":{"1":0}}}')
  store.dispatch({ type: 'ADD_TODO_ESTUDIANTE', estudiantes: estudiantes })
  for (let codigo in estudiantes) {
	renderEstudiante(codigo)
  }
}

function renderEstudiante(codigo) {
  let tr = document.getElementById(codigo)
  let estudiante = store.getState().estudiantes[codigo]
  if (tr) {
	if (typeof estudiante !== undefined) {
	  for (let comp in estudiante) {
		  for (let pos in estudiante[comp]) {
			  let input = tr.querySelector('input[data-' + comp + '="' + pos + '"]')
			  
			  if (input) {
				input.value = estudiante[comp][pos]					
				def(comp, { codigo: codigo })					
			  }
		  }
	  }
	}
  }
}

function add(nota, comp, dataset) {	  
  let codigo = dataset.codigo
  let pos = dataset[comp]
  //let estudiantes = store.getState().estudiantes
  if (typeof store.getState().estudiantes[codigo][comp][pos] !== undefined && nota == '') {
	store.dispatch({ type: 'DELETE_NOTA_ESTUDIANTE', codigo: codigo, comp: comp, pos: pos })
  } else {	    
	if (nota != '') {
	  store.dispatch({ type: 'UPDATE_NOTA_ESTUDIANTE', codigo: codigo, comp: comp, pos: pos, nota: +nota })
	}
  }
  def(comp, dataset)
}

function validar(comp, dataset) {
  let codigo = dataset.codigo
  let pos = dataset[comp]
  let tr = document.getElementById(codigo)
  
  if (tr) {
	  let input = tr.querySelector('input[data-' + comp + '="' + pos + '"]')
	  
	  if (input) {
		let nota = input.value
		input.value = nota.replace(/[^0-9\.]/g, '')			
	  }
  }
}

function def(comp, dataset) {
  let codigo = dataset.codigo
  let notaDef = document.getElementById('def-' + comp + '-' + codigo)
  let cant = 0, sum = 0;	  
  for (let pos in store.getState().estudiantes[codigo][comp]) {
	sum += +store.getState().estudiantes[codigo][comp][pos]
	cant++
  }
  if (cant) {
	notaDef.innerHTML = (sum/cant).toFixed(2)
  }	  
}

window.onload = () => {
  init()
  
  let guardar = document.getElementById('guardar')
  guardar.addEventListener('click', () => {
	console.log(JSON.stringify(store.getState()))
  })
}