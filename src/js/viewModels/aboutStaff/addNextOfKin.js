define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class AddNextOfKinModel {
        constructor(context) {
                var self = this;
                self.startOpened = ko.observable(true);
                self.startToggle = () => self.startOpened(!self.startOpened());
                
                self.relative_first_name = ko.observable();
                self.relative_last_name = ko.observable();
                self.relationshipList = ko.observableArray([]);
                self.relationship = ko.observable();
                self.relationshipList.push(
                    {'value' : 'Brother', 'label' : 'Brother'},
                    {'value' : 'Daughter', 'label' : 'Daughter'},
                    {'value' : 'Father', 'label' : 'Father'},
                    {'value' : 'Friend', 'label' : 'Friend'},
                    {'value' : 'Husband', 'label' : 'Husband'},
                    {'value' : 'Mother', 'label' : 'Mother'},
                    {'value' : 'Partner', 'label' : 'Partner'},
                    {'value' : 'Sister', 'label' : 'Sister'},
                    {'value' : 'Son', 'label' : 'Son'},
                    {'value' : 'Wife', 'label' : 'Wife'},
                    {'value' : 'Others', 'label' : 'Others'}
                );
                self.relationshipDP = new ArrayDataProvider(self.relationshipList, {keyAttributes: 'value'});
                self.relative_address = ko.observable();
                self.relative_email = ko.observable();
                self.relative_contact = ko.observable();

                self.groupValid = ko.observable();   
                self.saveRelativeMsg = ko.observable();
                self.emailError = ko.observable();
                self.contactError = ko.observable();
                self.relationActionBtn = ko.observable();
                self.relativeStatus = ko.observable('');

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({ path: 'signin' });
                    }
                    else {
                       app.onAppSuccess();
                       getNextOfKin();
                    }
                };
                function getNextOfKin(){

               console.log(context)
                self.DepName = context.routerState.detail.dep_url;
                console.log(sessionStorage.getItem("userId"))
                var BaseURL = sessionStorage.getItem("BaseURL")
                  $.ajax({
                    url: BaseURL + "/jpEditRelativeInfo",
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
                            self.relationActionBtn('Add')
                        }else{
                            self.relationActionBtn('Update')
                            self.relative_first_name(data[0][2]);
                            self.relative_last_name(data[0][3]);
                            self.relationship(data[0][4]);
                            self.relative_address(data[0][5]);
                            self.relative_email(data[0][6]);
                            self.relative_contact(data[0][7]);
                            if(data[0][8] == "Pending") {
                                self.relativeStatus('Pending');
                            }else if(data[0][8] == "Audited") {
                                self.relativeStatus('Audited');
                            }  
                        }
                }
                }) 
            }

                self.context = context;
                self.router = self.context.parentRouter;
                self.DBErrorOKClose = function (event) {
                    document.querySelector('#openRelativeSaveResult').close();
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
            
            self.relativeInfoSave = function (event,data) {
                var validRelativeSave1 = self._checkValidationGroup("relativeAddSec1"); 
                var validRelativeSave2 = self._checkValidationGroup("relativeAddSec2"); 
                //alert(self.DepName())
                var BaseURL = sessionStorage.getItem("BaseURL")
                if (validRelativeSave1 && validRelativeSave2) {
                document.querySelector('#openAddRelativeProgress').open();
                self.saveRelativeMsg('');
                $.ajax({
                    //url: self.DepName() + "/jpStaffProfilePhoto",
                    url: BaseURL + "/jpAddRelativeInfo",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId : sessionStorage.getItem("userId"),
                        relative_first_name : self.relative_first_name(),
                        relative_last_name : self.relative_last_name(),
                        relative_address : self.relative_address(),
                        relationship : self.relationship(),
                        relative_contact : self.relative_contact(),
                        relative_email : self.relative_email(),
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openAddRelativeProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                        document.querySelector('#openAddRelativeProgress').close();
                        document.querySelector('#openRelativeSaveResult').open();
                        self.saveRelativeMsg(data[0]);
                    }
                }) 
                }
            }

            self.relativeInfoUpdate = function (event,data) {
                var validRelativeSave1 = self._checkValidationGroup("relativeAddSec1"); 
                var validRelativeSave2 = self._checkValidationGroup("relativeAddSec2"); 
                //alert(self.DepName())
                var BaseURL = sessionStorage.getItem("BaseURL")
                if (validRelativeSave1 && validRelativeSave2) {
                document.querySelector('#openAddRelativeProgress').open();
                self.saveRelativeMsg('');
                $.ajax({
                    //url: self.DepName() + "/jpStaffProfilePhoto",
                    url: BaseURL + "/jpRelativeUpdate",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId : sessionStorage.getItem("userId"),
                        relative_first_name : self.relative_first_name(),
                        relative_last_name : self.relative_last_name(),
                        relative_address : self.relative_address(),
                        relationship : self.relationship(),
                        relative_contact : self.relative_contact(),
                        relative_email : self.relative_email(),
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openAddRelativeProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                        document.querySelector('#openAddRelativeProgress').close();
                        document.querySelector('#openRelativeSaveResult').open();
                        self.saveRelativeMsg(data[0]);
                    }
                }) 
                }
            }

             self.emailPatternValidator= function(event,data) {
                console.log(self.relative_email())  
                var inputText=self.relative_email()
                var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if(inputText.match(mailformat))
                {
                    self.emailError('')
                }
                else
                {
                    self.emailError("Should enter a valid email address.");
                    return false;
                }     
             }
             self.onlyNumberKey= function(event,data) {
                console.log(event.detail.value)
                var ASCIICode= event.detail.value
                if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57) && ASCIICode.length==10){
                    self.contactError('')
                }else{
                    self.contactError("Invalid phone number.");
                }
             }
             self.updateRelativeStatus = function (event,data) {
                var BaseURL = sessionStorage.getItem("BaseURL")
                $.ajax({
                    url: BaseURL+ "/jpStaffUpdateRelativeStatus",
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
                       if(sessionStorage.getItem('relative_status')=="Pending"){
                        sessionStorage.setItem('relative_status','Audited');
                       }else if(sessionStorage.getItem('relative_status')=="Audited"){
                        sessionStorage.setItem('relative_status','Pending');
                       }
                       location.reload();
                    }
                })  

            }
            }
            
            
          }
            return  AddNextOfKinModel;

        });
