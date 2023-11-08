define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class AddReferenceModel {
        constructor(context) {
                var self = this;
                self.startOpened = ko.observable(true);
                self.startToggle = () => self.startOpened(!self.startOpened());
                
                
                self.refer1_name = ko.observable();
                self.jobList = ko.observableArray([]);
                self.refer1_job = ko.observable();
                self.jobList.push(
                    {'value' : 'Administrator', 'label' : 'Administrator'},
                    {'value' : 'Colleague', 'label' : 'Colleague'},
                    {'value' : 'Employer', 'label' : 'Employer'},
                    {'value' : 'Manager', 'label' : 'Manager'},
                    {'value' : 'Professional Person', 'label' : 'Professional Person'}
                );
                self.jobListDP = new ArrayDataProvider(self.jobList, {keyAttributes: 'value'});
                self.refer1_address = ko.observable();
                self.refer1_company = ko.observable();
                self.refer1_email = ko.observable();
                self.refer1_contact = ko.observable();

                self.refer2_name = ko.observable();
                self.refer2_job = ko.observable();
                self.refer2_address = ko.observable();
                self.refer2_company = ko.observable();
                self.refer2_email = ko.observable();
                self.refer2_contact = ko.observable();

                self.emailError1 = ko.observable();
                self.contactError1 = ko.observable();
                self.emailError2 = ko.observable();
                self.contactError2 = ko.observable();
                self.groupValid = ko.observable();  
                self.saveReferenceMsg = ko.observable();
                self.clientActionBtn = ko.observable();
                self.referenceStatus = ko.observable('');

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({ path: 'signin' });
                    }
                    else {
                       app.onAppSuccess();
                       getReference();
                    }
                };
                function getReference(){
               console.log(context)
                self.DepName = context.routerState.detail.dep_url;
                console.log(sessionStorage.getItem("staffId"))
                var BaseURL = sessionStorage.getItem("BaseURL")
                 $.ajax({
                    url: BaseURL + "/jpEditReferenceInfo",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId : sessionStorage.getItem("staffId")
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
                            self.clientActionBtn('Add')
                        }else{
                            self.clientActionBtn('Update')
                            self.refer1_name(data[0][2]);
                            self.refer1_job(data[0][3]);
                            self.refer1_address(data[0][4]);
                            self.refer1_company(data[0][5]);
                            self.refer1_email(data[0][6]);
                            self.refer1_contact(data[0][7]);
                            self.refer2_name(data[0][8]);
                            self.refer2_job(data[0][9]);
                            self.refer2_address(data[0][10]);
                            self.refer2_company(data[0][11]);
                            self.refer2_email(data[0][12]);
                            self.refer2_contact(data[0][13]);
                            if(data[0][14] == "Pending") {
                                self.referenceStatus('Pending');
                            }else if(data[0][14] == "Audited") {
                                self.referenceStatus('Audited');
                            }     
                        }
                }
                }) 
            }

                self.context = context;
                self.router = self.context.parentRouter;
                self.DBErrorOKClose = function (event) {
                    document.querySelector('#openReferenceSaveResult').close();
                    self.startOpened(false);
                    self.router.go({path:'addStaff'})
                };
                
              self.emailPatternValidator1= function(event,data) {
                console.log(self.refer1_email())  
                var inputText=self.refer1_email()
                var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if(inputText.match(mailformat))
                {
                    self.emailError1('')
                }
                else
                {
                    self.emailError1("Should enter a valid email address.");
                    return false;
                }     
             }
             self.onlyNumberKey1= function(event,data) {
                console.log(event.detail.value)
                var ASCIICode= event.detail.value
                if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57) && ASCIICode.length==10){
                    self.contactError1('')
                }else{
                    self.contactError1("Invalid phone number.");
                }
             }
             self.emailPatternValidator2= function(event,data) {
                console.log(self.refer2_email())  
                var inputText=self.refer2_email()
                var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if(inputText.match(mailformat))
                {
                    self.emailError2('')
                }
                else
                {
                    self.emailError2("Should enter a valid email address.");
                    return false;
                }     
             }
             self.onlyNumberKey2= function(event,data) {
                console.log(event.detail.value)
                var ASCIICode= event.detail.value
                if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57) && ASCIICode.length==10){
                    self.contactError2('')
                }else{
                    self.contactError2("Invalid phone number.");
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
            
            self.referenceInfoSave = function (event,data) {
                var validReferenceSave1 = self._checkValidationGroup("referAddSec1"); 
                var validReferenceSave2 = self._checkValidationGroup("referAddSec2"); 
                //alert(self.DepName())
                var BaseURL = sessionStorage.getItem("BaseURL")
                if (validReferenceSave1 && validReferenceSave2) {
                document.querySelector('#openAddReferenceProgress').open();
                self.saveReferenceMsg('');
                $.ajax({
                    //url: self.DepName() + "/jpStaffProfilePhoto",
                    url: BaseURL + "/jpAddReferenceInfo",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId : sessionStorage.getItem("staffId"),
                        refer1_name : self.refer1_name(),
                        refer1_job : self.refer1_job(),
                        refer1_address : self.refer1_address(),
                        refer1_company : self.refer1_company(),
                        refer1_email : self.refer1_email(),
                        refer1_contact : self.refer1_contact(),
                        refer2_name : self.refer2_name(),
                        refer2_job : self.refer2_job(),
                        refer2_address : self.refer2_address(),
                        refer2_company : self.refer2_company(),
                        refer2_email : self.refer2_email(),
                        refer2_contact : self.refer2_contact(),
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openAddReferenceProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                        document.querySelector('#openAddReferenceProgress').close();
                        document.querySelector('#openReferenceSaveResult').open();
                        self.saveReferenceMsg(data[0]);
                    }
                }) 
                }
            }

            self.referenceInfoUpdate = function (event,data) {
                var validReferenceSave1 = self._checkValidationGroup("referAddSec1"); 
                var validReferenceSave2 = self._checkValidationGroup("referAddSec2"); 
                //alert(self.DepName())
                var BaseURL = sessionStorage.getItem("BaseURL")
                if (validReferenceSave1 && validReferenceSave2) {
                document.querySelector('#openAddReferenceProgress').open();
                self.saveReferenceMsg('');
                $.ajax({
                    //url: self.DepName() + "/jpStaffProfilePhoto",
                    url: BaseURL + "/jpReferenceUpdate",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId : sessionStorage.getItem("staffId"),
                        refer1_name : self.refer1_name(),
                        refer1_job : self.refer1_job(),
                        refer1_address : self.refer1_address(),
                        refer1_company : self.refer1_company(),
                        refer1_email : self.refer1_email(),
                        refer1_contact : self.refer1_contact(),
                        refer2_name : self.refer2_name(),
                        refer2_job : self.refer2_job(),
                        refer2_address : self.refer2_address(),
                        refer2_company : self.refer2_company(),
                        refer2_email : self.refer2_email(),
                        refer2_contact : self.refer2_contact(),
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openAddReferenceProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                        document.querySelector('#openAddReferenceProgress').close();
                        document.querySelector('#openReferenceSaveResult').open();
                        self.saveReferenceMsg(data[0]);
                    }
                }) 
                }
            }

            self.updateReferenceStatus = function (event,data) {
                var BaseURL = sessionStorage.getItem("BaseURL")
                $.ajax({
                    url: BaseURL+ "/jpStaffUpdateReferenceStatus",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId : sessionStorage.getItem("staffId"),
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
                       if(sessionStorage.getItem('reference_status')=="Pending"){
                        sessionStorage.setItem('reference_status','Audited');
                       }else if(sessionStorage.getItem('reference_status')=="Audited"){
                        sessionStorage.setItem('reference_status','Pending');
                       }
                       location.reload();
                    }
                })  

            }
            }
            
            
          }
            return  AddReferenceModel;

        });
