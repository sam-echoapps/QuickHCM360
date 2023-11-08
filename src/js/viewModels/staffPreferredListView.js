define(['ojs/ojcore', 'knockout', 'jquery', 'appController', "ojs/ojmodulerouter-adapter", "ojs/ojarraydataprovider", 
    "ojs/ojknockout", "ojs/ojlistview", "ojs/ojmodule-element","ojs/ojprogress-bar"], 
    function (oj, ko, $, app, ModuleRouterAdapter, ArrayDataProvider) {
    "use strict";
    class StaffPreferredListViewModel {
        constructor(args) {
            var self = this
            self.progressValue = ko.observable();

            self.DepName = args.routerState.detail.dep_url;
            self.DepType = args.routerState.detail.dep_type;
            self.record = ko.observable();
            self.clientName = ko.observable();
            self.clientNameCap = ko.observable();
            
            self.router = args.parentRouter;

            self.connected = function () {
                if (sessionStorage.getItem("userName") == null) {
                    self.router.go({path : 'signin'});
                }
                else {
                    app.onAppSuccess();
                }
            }
                 console.log(sessionStorage.getItem("clientId"))
                 var BaseURL = sessionStorage.getItem("BaseURL")
                $.ajax({                   
                    url: BaseURL + "/jpGetClientDetails",
                    type: 'POST',
                    data: JSON.stringify({
                        clientId : sessionStorage.getItem("clientId")
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout' || textStatus == 'error'){
                            document.querySelector('#TimeoutSup').open();
                        }
                    },
                    success: function (data) {
                        console.log(data)
                        self.clientName(data[0][0][0])
                        self.clientNameCap(self.clientName().toUpperCase());
                }
                }) 
                //alert(sessionStorage.getItem('profile_status'))
            var records = {
                "childPath" : [
                    { "path" : "preferredListStaff", "label" : "My Preferred Staffs", "status" : "Staff Manager"},
                    // { "path" : "pendingShiftsClient", "label" : "Pending Shifts", "status" : "Staff Manager"}
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
                { path: '', redirect: 'preferredListStaff' },
                { path: 'preferredListStaff'},
                { path: 'pendingShiftsClient'}
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
    return StaffPreferredListViewModel;
});