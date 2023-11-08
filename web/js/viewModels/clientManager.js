define(['ojs/ojcore', 'knockout', 'jquery', 'appController', "ojs/ojmodulerouter-adapter", "ojs/ojarraydataprovider", 
    "ojs/ojknockout", "ojs/ojlistview", "ojs/ojmodule-element","ojs/ojprogress-bar"], 
    function (oj, ko, $, app, ModuleRouterAdapter, ArrayDataProvider) {
    "use strict";
    class ClientManagerModel {
        constructor(args) {
            var self = this

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
                 
            var records = {
                "childPath" : [
                    { "path" : "viewClient", "label" : "Client Profile"},
                    { "path" : "clientAddress", "label" : "Client Address"},
                    { "path" : "billingAddress", "label" : "Billing Address & Payment"},
                    { "path" : "jobRoles", "label" : "Job Roles"},
                    { "path" : "clientShift", "label" : "Client Shift Rate & Rules"},
                    { "path" : "bankHoliday", "label" : "Bank Holiday Payment"},
                    { "path" : "addDepartment", "label" : "Manage Departments"},
                    { "path" : "clientUsers", "label" : "Manage Users"},
/*                     { "path" : "clientPassword", "label" : "Change Password"}
 */                ]
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
                { path: '', redirect: 'viewClient' },
                { path: 'viewClient'},
                { path: 'clientAddress'},
                { path: 'billingAddress'},
                { path: 'jobRoles'},
                { path: 'clientShift'},
                { path: 'bankHoliday'},
                { path: 'addDepartment'},
                { path: 'clientUsers'},
               /*  { path: 'clientPassword'} */
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
    return ClientManagerModel;
});