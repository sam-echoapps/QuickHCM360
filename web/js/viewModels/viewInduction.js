define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {
    
    class ViewInductionViewModel {
        constructor(context) {
            var self = this;
            self.DepName = context.routerState.detail.dep_url;
            self.induction_time = ko.observable(ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIso(new Date(2013, 0, 1)));
            self.induction_date = ko.observable();
            self.induction_limit = ko.observable();
            self.progressDialog = ko.observable('Saving Induction Details');
            self.addInductionMsg = ko.observable();
            self.ResultTitle = ko.observable();
            self.groupValid = ko.observable();  
            var BaseURL = sessionStorage.getItem("BaseURL")
            self.InductionDet = ko.observableArray([]);
            self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();
            self.CancelBehaviorOpt = ko.observable('icon'); 

            self.connected = function () {
                if (sessionStorage.getItem("userName") == null) {
                    self.router.go({ path: 'signin' });
                }
                else {
                   app.onAppSuccess();
                   getInduction();
                }
            };
            
            function getInduction() {
                self.InductionDet([]);
                var BaseURL = sessionStorage.getItem("BaseURL")
                $.ajax({
                    url: BaseURL + "/jpInductionInfoGet",
                    type: 'POST',
                    data: JSON.stringify({
                       // staffId : sessionStorage.getItem("staffId"),
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout' || textStatus == 'error'){
                            document.querySelector('#TimeoutSup').open();
                        }
                    },
                    success: function (result) {
                        var data = JSON.parse(result);
                        console.log(data)

                     for (var i = 0; i < data.length; i++) {
                        self.InductionDet.push({'id': data[i][0], 'induction_date' : data[i][1], 'induction_time' : data[i][2] , 'induction_limit' : data[i][3] }); 
                    } 
                    self.InductionDet.valueHasMutated();
                    return self; 
                }
                })
            }
            this.dataProvider1 = new ArrayDataProvider(this.InductionDet, { keyAttributes: "id"});

            //Validation 
            self._checkValidationGroup = (value) => {
                var tracker = document.getElementById(value);
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
                sessionStorage.setItem("inductionId", clickedRowId);
                console.log(clickedRowId)
                if(clickedRowId !=undefined){
                    document.querySelector('#openDeleteConfirm').open();
                }         
               
            }

            self.getDisplayValue = function (set) {
                var arr = [];
                set.values().forEach(function (key) {
                    arr.push(key);
                });
                return arr;
            };
            self.DBErrorOKClose = function (event) {
                document.querySelector('#openDeleteInductionInfoResult').close();
                location.reload()
            };

            self.deleteInductionInfo = function (event,data) {
                var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
                sessionStorage.setItem("educationId", clickedRowId);
                self.ResultTitle('Delete Induction Details')
                console.log(clickedRowId)
                if(clickedRowId !=undefined){
                    document.querySelector('#openDeleteConfirm').close();
                    document.querySelector('#openDeleteProgress').open();
                     $.ajax({
                        url: BaseURL + "/jpDeleteInductionDetails",
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
                            document.querySelector('#openDeleteProgress').close();
                            document.querySelector('#openDeleteInductionInfoResult').open();
                            self.addInductionMsg(data[0]);
                            console.log("success")
                    }
                    })  
    
                }         
               
            }

        }
    }
    return  ViewInductionViewModel;
});