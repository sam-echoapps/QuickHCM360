define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class AddBankModel {
        constructor(context) {
                var self = this;
                self.startOpened = ko.observable(true);
                self.startToggle = () => self.startOpened(!self.startOpened());
                
                
                self.account_no = ko.observable();
                self.sort_code = ko.observable();
                self.bank_name = ko.observable();
                self.account_name = ko.observable();

                self.groupValid = ko.observable();   
                self.accountError = ko.observable(); 
                self.sortCodeError = ko.observable(); 
                self.saveBankMsg = ko.observable();
                self.staffActionBtn = ko.observable();
                self.bankStatus = ko.observable('');

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({ path: 'signin' });
                    }
                    else {
                       app.onAppSuccess();
                       getBank();
                    }
                };
                function getBank() {
                console.log(context)
                self.DepName = context.routerState.detail.dep_url;
                console.log(sessionStorage.getItem("userId"))
                var BaseURL = sessionStorage.getItem("BaseURL")
                 $.ajax({
                    url: BaseURL + "/jpEditBankInfo",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId : sessionStorage.getItem("userId")
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
                        if(data==''){
                            self.staffActionBtn('Add')
                        }else{
                            self.staffActionBtn('Update')
                            self.account_no(data[0][2]);
                            self.bank_name(data[0][3]);
                            self.sort_code(data[0][4]);
                            self.account_name(data[0][5]);
                            if(data[0][6] == "Pending") {
                                self.bankStatus('Pending');
                            }else if(data[0][6] == "Audited") {
                                self.bankStatus('Audited');
                            }     
                        }
                }
                }) 
            }

                self.context = context;
                self.router = self.context.parentRouter;
                self.DBErrorOKClose = function (event) {
                    document.querySelector('#openBankSaveResult').close();
                    self.startOpened(false);
                    self.router.go({path:'addStaff'})
                };
                
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
            
            self.bankInfoSave = function (event,data) {
                var validReferenceSave1 = self._checkValidationGroup("bankAddSec1"); 
                var validReferenceSave2 = self._checkValidationGroup("bankAddSec2"); 
                //alert(self.DepName())
                var BaseURL = sessionStorage.getItem("BaseURL")
                if (validReferenceSave1 && validReferenceSave2) {
                document.querySelector('#openAddBankProgress').open();
                self.saveBankMsg('');
                $.ajax({
                    //url: self.DepName() + "/jpStaffProfilePhoto",
                    url: BaseURL + "/jpAddBankInfo",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId : sessionStorage.getItem("userId"),
                        account_no : self.account_no(),
                        sort_code : self.sort_code(),
                        bank_name : self.bank_name(),
                        account_name : self.account_name(),
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openAddBankProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                        document.querySelector('#openAddBankProgress').close();
                        document.querySelector('#openBankSaveResult').open();
                        self.saveBankMsg(data[0]);
                    }
                }) 
                }
            }

            self.bankInfoUpdate = function (event,data) {
                var validBankSave1 = self._checkValidationGroup("bankAddSec1"); 
                var validBankSave2 = self._checkValidationGroup("bankAddSec2"); 
                //alert(self.DepName())
                var BaseURL = sessionStorage.getItem("BaseURL")
                if (validBankSave1 && validBankSave2) {
                document.querySelector('#openAddBankProgress').open();
                self.saveBankMsg('');
                $.ajax({
                    //url: self.DepName() + "/jpStaffProfilePhoto",
                    url: BaseURL + "/jpBankUpdate",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId : sessionStorage.getItem("userId"),
                        account_no : self.account_no(),
                        sort_code : self.sort_code(),
                        bank_name : self.bank_name(),
                        account_name : self.account_name(),
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openAddBankProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                        document.querySelector('#openAddBankProgress').close();
                        document.querySelector('#openBankSaveResult').open();
                        self.saveBankMsg(data[0]);
                    }
                }) 
                }
            }

            self.accountLengthCheck= function(event,data) {
                console.log(event.detail.value)
                var ASCIICode= event.detail.value
                if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57) && ASCIICode.length==8){
                    self.accountError('')
                }else{
                    self.accountError("Invalid account number.");
                }
             }
             self.sortCodeLengthCheck= function(event,data) {
                console.log(event.detail.value)
                var ASCIICode= event.detail.value
                if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57) && ASCIICode.length==6){
                    self.sortCodeError('')
                }else{
                    self.sortCodeError("Invalid sort code numbe.");
                }
             }

             self.updateBankStatus = function (event,data) {
                var BaseURL = sessionStorage.getItem("BaseURL")
                $.ajax({
                    url: BaseURL+ "/jpStaffUpdateBankStatus",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId : sessionStorage.getItem("userId"),
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openUpdateStaffProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                       console.log("Success")
                       if(sessionStorage.getItem('bank_status')=="Pending"){
                        sessionStorage.setItem('bank_status','Audited');
                       }else if(sessionStorage.getItem('bank_status')=="Audited"){
                        sessionStorage.setItem('bank_status','Pending');
                       }
                       location.reload();
                    }
                })  

            }
            }
            
            
          }
            return  AddBankModel;

        });
