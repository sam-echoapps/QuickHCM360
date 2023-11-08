define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class ManageDepartmentModel {
        constructor(context) {
                var self = this;
                self.DepName = context.routerState.detail.dep_url;
                self.CancelBehaviorOpt = ko.observable('icon');
                self.department = ko.observable();
                self.groupValid = ko.observable();
                var BaseURL = sessionStorage.getItem("BaseURL")
                self.departmentDet = ko.observableArray([]);
                self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({ path: 'signin' });
                    }
                    else {
                       app.onAppSuccess();
                       getDepartment();
                    }
                };
                function getDepartment() {
                    self.departmentDet([]);
                    $.ajax({
                       url: BaseURL + "/jpGetDepartment",
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
                           if(data[0].length !=0){ 
                            for (var i = 0; i < data[0].length; i++) {
                            self.departmentDet.push({'id': data[0][i][0],'client_id': data[0][i][1], 'department_name' : data[0][i][2] });
                            }
                    }
                        self.departmentDet.valueHasMutated();
                        return self; 
                   }
                   }) 
               }
               self.dataProvider1 = new ArrayDataProvider(this.departmentDet, { keyAttributes: "id"});

            self.openAddDepartmentDialog = function (data, event) {
                refresh()
                document.querySelector('#openAddDepartmentDialog').open();
            }
            function refresh(){
                self.department('')
            }
            self.departmentSave = function (event,data) {
                var validSec = self._checkValidationGroup("departmentSec");
                if(validSec){
                document.querySelector('#openAddDepartmentDialog').close();
                document.querySelector('#openAddClientProgress').open();
                $.ajax({
                    url: BaseURL + "/jpDepartmentSave",
                    type: 'POST',
                    data: JSON.stringify({
                        clientId : sessionStorage.getItem("clientId"),
                        department : self.department()
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openAddClientProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                        console.log(data)
                        document.querySelector('#openAddClientProgress').close();
                        location.reload()
                    }
                }) 
            }
            }
            self._checkValidationGroup = (value) => {
                ////console.log(value)
                var tracker = document.getElementById(value);
                ////console.log(tracker.valid)
                if (tracker.valid === "valid") {
                    return true;
                }
                else {

                    tracker.showMessages();
                    tracker.focusOn("@firstInvalidShown");
                    return false;
                }
            };
            self.deleteConfirm = function (event,data) {
                //var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
                var clickedRowId = data.data.id
                sessionStorage.setItem("departmentId", clickedRowId);
                console.log(clickedRowId)
                if(clickedRowId !=undefined){
                    document.querySelector('#openDeleteConfirm').open();
                }         
               
            }
            self.deleteDepartment = function (event,data) {
                var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
                console.log(clickedRowId)
                var BaseURL = sessionStorage.getItem("BaseURL");
                if(clickedRowId !=undefined){
                    document.querySelector('#openDeleteConfirm').close();
                    document.querySelector('#openDeleteDepartmentProgress').open();
                     $.ajax({
                        url: BaseURL + "/jpDeleteDepartment",
                        type: 'POST',
                        data: JSON.stringify({
                           rowId : self.getDisplayValue(self.selectorSelectedItems())[0]
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
                            document.querySelector('#openDeleteDepartmentProgress').close();
                            location.reload()
                    }
                    })  
    
                }         
               
            }
            self.getDisplayValue = function (set) {
                var arr = [];
                set.values().forEach(function (key) {
                    arr.push(key);
                });
                return arr;
            };
            }
            
            
          }
            return  ManageDepartmentModel;

        });
