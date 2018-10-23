import { IListItem, IListService } from "./ListService";

interface IConfigurationChangedArgs {
  webUrl: string;
  listName: string;
}

export default class HomeController {
  public static $inject: string[] = ['ListService', '$window', '$rootScope', '$scope'];

  public status: string = undefined;
  public items: IListItem[] = [];

  private webUrl: string = undefined;
  private listName: string = undefined;

  constructor(private listService: IListService, private $window: angular.IWindowService, private $rootScope: angular.IRootScopeService, private $scope: angular.IScope) {
    const vm: HomeController = this;
    this.init(undefined, undefined, undefined);

    $rootScope.$on('configurationChanged',
      (event: angular.IAngularEvent, args: IConfigurationChangedArgs): void => {
        vm.init(args.webUrl, args.listName, vm.$scope);
      });
  }

  private init(webUrl: string, listName: string, $scope: angular.IScope): void {
    if (webUrl !== undefined && webUrl.length > 0 &&
      listName !== undefined && listName.length > 0) {
      this.webUrl = webUrl;
      this.listName = listName;
    }
    
    if ($scope) {
      $scope.$digest();
    }
  }

  public createItem(): void {
    const itemTitle: string = `Item ${new Date()}`;
    this.status = 'Creating item...';
    this.items.length = 0;
    this.listService.createItem(itemTitle, this.webUrl, this.listName)
      .then((item: IListItem): void => {
        this.status = `Item '${item.Title}' (ID: ${item.Id}) successfully created`;
      }, (error: any): void => {
        this.status = 'Error while creating the item: ' + error;
      });
  }

  public readItem(): void {
    this.status = 'Loading latest items...';
    this.items.length = 0;
    this.listService.getLatestItemId(this.webUrl, this.listName)
      .then((itemId: number): angular.IPromise<IListItem> => {
        if (itemId === -1) {
          throw new Error('No items found in the list');
        }

        this.status = `Loading information about item ID: ${itemId}...`;
        return this.listService.readItem(itemId, this.webUrl, this.listName);
      })
      .then((item: IListItem): void => {
        this.status = `Item ID: ${item.Id}, Title: ${item.Title}`;
      }, (error: any): void => {
        this.status = 'Loading latest item failed with error: ' + error;
      });
  }

  public updateItem(): void {
    this.status = 'Loading latest items...';
    this.items.length = 0;
    let latestItemId: number = undefined;
    this.listService.getLatestItemId(this.webUrl, this.listName)
      .then((itemId: number): angular.IPromise<IListItem> => {
        if (itemId === -1) {
          throw new Error('No items found in the list');
        }

        latestItemId = itemId;
        this.status = `Loading information about item ID: ${latestItemId}...`;

        return this.listService.readItem(latestItemId, this.webUrl, this.listName);
      })
      .then((latestItem: IListItem): angular.IPromise<{}> => {
        this.status = `Updating item with ID: ${latestItemId}...`;
        latestItem.Title = `Item ${new Date()}`;
        return this.listService.updateItem(latestItem, this.webUrl, this.listName);
      })
      .then((result: {}): void => {
        this.status = `Item with ID: ${latestItemId} successfully updated`;
      }, (error: any): void => {
        this.status = `Error updating item: ${error}`;
      });
  }

  public deleteItem(): void {
    if (!this.$window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    this.status = 'Loading latest items...';
    this.items.length = 0;
    let latestItemId: number = undefined;
    this.listService.getLatestItemId(this.webUrl, this.listName)
      .then((itemId: number): angular.IPromise<IListItem> => {
        if (itemId === -1) {
          throw new Error('No items found in the list');
        }

        latestItemId = itemId;
        this.status = `Loading information about item ID: ${latestItemId}...`;

        return this.listService.readItem(latestItemId, this.webUrl, this.listName);
      })
      .then((latestItem: IListItem): angular.IPromise<{}> => {
        this.status = `Deleting item with ID: ${latestItemId}...`;
        return this.listService.deleteItem(latestItem, this.webUrl, this.listName);
      })
      .then((result: {}): void => {
        this.status = `Item with ID: ${latestItemId} successfully deleted`;
      }, (error: any): void => {
        this.status = `Error deleting item: ${error}`;
      });
  }
}