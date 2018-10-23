import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './AngularCrudspListItemsWebPart.module.scss';
import * as strings from 'AngularCrudspListItemsWebPartStrings';
import * as angular from 'angular';
import './app/app-module';
export interface IAngularCrudspListItemsWebPartProps {
  listName: string;
}

export default class AngularCrudspListItemsWebPart extends BaseClientSideWebPart<IAngularCrudspListItemsWebPartProps> {

  private $injector: angular.auto.IInjectorService;  
  
  
  public render(): void {
    if (this.renderedOnce === false) {
      this.domElement.innerHTML = `
        <div class="${styles.angularCrud}" data-ng-controller="HomeController as vm">
          <div class="${styles.container}">
            <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
              <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
                  <span class="ms-font-xl ms-fontColor-white">
                    SharePoint CRUD operations in Angular
                  </span>
                </div>
              </div>
              <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
                <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
                  <uif-button ng-click="vm.createItem()" ng-disabled="vm.listNotConfigured">Create item</uif-button>
                  <uif-button ng-click="vm.readItem()" ng-disabled="vm.listNotConfigured">Read item</uif-button>
                </div>
              </div>

              <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
                <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
                  <uif-button ng-click="vm.updateItem()" ng-disabled="vm.listNotConfigured">Update item</uif-button>
                  <uif-button ng-click="vm.deleteItem()" ng-disabled="vm.listNotConfigured">Delete item</uif-button>
                </div>
              </div>
              <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
                <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
                  <div>{{vm.status}}</div>
                  <ul>
                    <li ng-repeat="item in vm.items">{{item.Title}} ({{item.Id}})</li>
                  <ul>
                </div>
              </div>
          </div>
        </div>`;

      this.$injector = angular.bootstrap(this.domElement, ['splistitemcrudapp']);
    }  
  
    this.$injector.get('$rootScope').$broadcast('configurationChanged', {  
      webUrl: this.context.pageContext.web.absoluteUrl,  
      listName: this.properties.listName  
    });  
  }  
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('listName', {
                  label: strings.ListNameFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
