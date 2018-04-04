angular.module('appTareas', ['ui.router'])

.config(function($stateProvider,$urlRouterProvider) {
	$stateProvider
		.state('alta',{
			url:'/alta',
			templateUrl:'views/alta.html',
			controller:'controladorAlta',
			controllerAs:'ctrlAlta'
		})
		.state('editar',{
			url:'/editar',
			templateUrl:'views/editar.html',
			controller: 'controladorEditar',
			controllerAs: 'ctrlEditar'
		});
	$urlRouterProvider.otherwise('alta');
})

.factory('comun',function($http){
	var comun = {};

	comun.tareas = [];

	comun.tarea = {};



	/*Sección de métodos remotos*/
	comun.getAll = function(){
		return $http.get('/tareas')
		.success(function(data){
			angular.copy(data,comun.tareas);
			return comun.tareas;
		})
	}

	comun.add = function(tarea){
		return $http.post('/tarea',tarea)
		.success(function(tarea){
			comun.tareas.push(tarea);	
		})
	}

	comun.update = function(tarea){
		return $http.put('/tarea/' + tarea._id,tarea)
		.success(function(data){
			var indice = comun.tareas.indexOf(tarea);
			comun.tareas[indice] = data;
		})
	}

	comun.delete = function(tarea){
		return $http.delete('/tarea/' + tarea._id)
		.success(function(){
			var indice = comun.tareas.indexOf(tarea);
			comun.tareas.splice(indice,1);
		})
	}


	return comun;
})

.controller('controladorAlta',function(comun,$state){
	this.tarea = {};

	comun.getAll();
	this.tareas = comun.tareas;

	this.prioridades = ['Baja','Normal','Alta'];

	this.agregar = function(){
		comun.add({
			nombre:this.tarea.nombre,
			prioridad:parseInt(this.tarea.prioridad)
		});

		this.tarea = {};
	}


	this.masPrioridad = function(tarea){
		tarea.prioridad++;
	}

	this.menosPrioridad = function(tarea){
		tarea.prioridad--;
	}

	this.eliminar = function(tarea){
		comun.delete(tarea);

	}
	this.procesaObjeto = function(tarea){
		comun.tarea = tarea;
		$state.go('editar');
	}
})

.controller('controladorEditar',function($state,comun){
	this.tarea = comun.tarea;

	this.actualizar = function(){
		comun.update(this.tarea);
		$state.go('alta');
	}

	this.eliminar = function(){
		comun.delete(this.tarea);
		$state.go('alta');
	}


})