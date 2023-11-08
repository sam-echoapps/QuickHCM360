define(['ojs/ojcore', 'knockout', 'jquery', 'appController', "ojs/ojmodulerouter-adapter", 
    "ojs/ojarraydataprovider", "ojs/ojprogress-bar",
    "ojs/ojknockout", "ojs/ojlistview", "ojs/ojmodule-element"], 
    function (oj, ko, $, app, ModuleRouterAdapter, ArrayDataProvider) {
    "use strict";
    class ViewModel {
        constructor(args) {
            var self = this
            
            self.progressValue = ko.observable();

            self.DepName = args.routerState.detail.dep_url;
            self.DepType = args.routerState.detail.dep_type;
            self.record = ko.observable();
            self.profileStatus = ko.observable('');
            self.referenceStatus = ko.observable('');
            self.bankStatus = ko.observable('');
            self.relativeStatus = ko.observable('');
            self.educationStatus = ko.observable('');
            self.workStatus = ko.observable('');
            self.dbsStatus = ko.observable('');
            self.healthStatus = ko.observable('');
            self.trainingStatus = ko.observable('');
            self.rightStatus = ko.observable('');
            self.inductionStatus = ko.observable('');
            self.contractStatus = ko.observable('');
            self.starterStatus = ko.observable('');
                
            self.router = args.parentRouter;

            self.connected = function () {
                if (sessionStorage.getItem("userName") == null) {
                    self.router.go({path : 'signin'});
                }
                else {
                    app.onAppSuccess();
                }
            }
            
            var BaseURL = sessionStorage.getItem("BaseURL")
            
     

            var routerLength = args.parentRouter._routes.length;
          
            /* if(routerLength!=5){
                location.reload();
            }            
             */
            
            var records = {
                "childPath" : [
                    { "path" : "home", "label" : "Home"}
                ]
            }

            self.incidentData = records.childPath;
            
            self.dataProvider = new ArrayDataProvider(self.incidentData);
            
            self.selection = ko.pureComputed({
                read: () => {
                    const selected = [];
                    const record = self.record();
                    
                    if (record) {
                        var index = self.incidentData.indexOf(record);
                        selected.push(index);
                    }
                    return selected;
                },
                
                write: (selected) => {
                    var path = self.incidentData[selected[0]].path
                    
                    self.router.go({ path: path, params: { index: selected[0] } });
                }
            });
            
            self.args = args;
            // Create a child router with one default path
            self.router = self.args.parentRouter.createChildRouter([
                { path: '', redirect: 'home' },
                { path: 'home' }
            ]);

            self.router.currentState.subscribe((args) => {
                const state = args.state;
                if (state) {
                    self.record(self.incidentData[state.params.index]);
                }
            });

            self.module = new ModuleRouterAdapter(self.router, {
                viewPath: 'views/aboutClientManager/',
                viewModelPath: 'viewModels/aboutClientManager/'
            });
        }
        
    }
    return ViewModel;
});