
import * as angular from 'angular';  
import HomeController from './HomeController';  
import ListService from './ListService';  
  
import 'ng-office-ui-fabric';  
  
const splistitemcrudapp: ng.IModule = angular.module('splistitemcrudapp', [  
  'officeuifabric.core',  
  'officeuifabric.components'  
]);  
  
splistitemcrudapp  
  .controller('HomeController', HomeController)  
  .service('ListService', ListService);