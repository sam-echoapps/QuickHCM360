define(['ojs/ojcore', 'knockout', 'jquery', 'appController', "ojs/ojmodulerouter-adapter", "ojs/ojarraydataprovider", 
    "ojs/ojknockout", "ojs/ojlistview", "ojs/ojmodule-element","ojs/ojprogress-bar"], 
    function (oj, ko, $, app, ModuleRouterAdapter, ArrayDataProvider) {
    "use strict";
    class InductionModel {
        constructor(args) {
            var self = this

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
            self.progressValue = ko.observable(30);

            self.router = args.parentRouter;

            self.connected = function () {
                if (sessionStorage.getItem("userName") == null) {
                    self.router.go({path : 'signin'});
                }
                else {
                    app.onAppSuccess();
                }
            }
                 
            var records = {
                "childPath" : [
                    { "path" : "createInduction", "label" : "Create Induction"},
                    { "path" : "viewInduction", "label" : "View Induction"},
                    { "path" : "inductionList", "label" : "Induction List"}, 
                    { "path" : "staffView", "label" : ""} 
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
                    //self.router.go({ path: path, params: { index: selected[0] } });

                    /* for hiding and not link to staffview */
                    if(path != 'staffView'){
                    self.router.go({ path: path, params: { index: selected[0] } });
                    }
                }
            });
            
            self.args = args;
            // Create a child router with one default path
            self.router = self.args.parentRouter.createChildRouter([
                { path: '', redirect: 'createInduction' },
                { path: 'createInduction'},
                { path: 'viewInduction'},
                { path: 'inductionList'}
            ]);

            self.router.currentState.subscribe((args) => {
                const state = args.state;
                if (state) {
                    self.record(self.incidentData[state.params.index]);
                }
            });

            self.module = new ModuleRouterAdapter(self.router, {
                viewPath: '',
                viewModelPath: ''
            });
        }
        
    }
    return InductionModel;
});