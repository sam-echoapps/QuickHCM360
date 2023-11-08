define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class AddApplicationModel {
        constructor(context) {
                var self = this;
                self.startOpened = ko.observable(true);
                self.startToggle = () => self.startOpened(!self.startOpened());
                
                
                self.date_of_birth = ko.observable('');
                self.marital_status = ko.observable('');
                self.maritalStatusList = ko.observableArray([]);
                self.maritalStatusList.push(
                    {'value' : 'Single', 'label' : 'Single'},
                    {'value' : 'Married', 'label' : 'Married'},
                    {'value' : 'Widowed', 'label' : 'Widowed'},
                    {'value' : 'Separated', 'label' : 'Separated'},
                    {'value' : 'Divorced', 'label' : 'Divorced'},
                );
                self.maritalStatusDetDP = new ArrayDataProvider(self.maritalStatusList, {keyAttributes: 'value'});
                self.nationality = ko.observable('');
                self.nmc_pin = ko.observable('');
                self.ni_number = ko.observable('');
                self.ni_reference_number = ko.observable('');  
                self.ni_number_sec = ko.observable('');  
                self.choiceList = ko.observableArray([]);  
                self.choiceList.push(
                    {'value' : 'Yes', 'label' : 'Yes'},
                    {'value' : 'No', 'label' : 'No'},  
                );
                self.choiceListDP = new ArrayDataProvider(self.choiceList, {keyAttributes: 'value'});
                self.have_ni = ko.observable(''); 
                self.ethinic = ko.observable(''); 
                self.ethinicList = ko.observableArray([]);  
                self.ethinicList.push(
                    {'value' : 'White', 'label' : 'White'},
                    {'value' : 'Mixed', 'label' : 'Mixed'},  
                    {'value' : 'Asian', 'label' : 'Asian'},
                    {'value' : 'Black', 'label' : 'Black'},  
                    {'value' : 'Chinese', 'label' : 'Chinese'},
                    {'value' : 'Other', 'label' : 'Other'},  
                );
                self.ethinicListDP = new ArrayDataProvider(self.ethinicList, {keyAttributes: 'value'});
                self.genderList = ko.observableArray([]);  
                self.genderList.push(
                    {'value' : 'Male', 'label' : 'Male'},
                    {'value' : 'Female', 'label' : 'Female'},  
                    {'value' : 'Other', 'label' : 'Other'}
                );
                self.genderListDP = new ArrayDataProvider(self.genderList, {keyAttributes: 'value'});
                self.gender = ko.observable('');

                self.ageList = ko.observableArray([]);  
                self.ageList.push(
                    {'value' : '16-21', 'label' : '16-21'},
                    {'value' : '22-25', 'label' : '22-25'},  
                    {'value' : '26-30', 'label' : '26-30'},
                    {'value' : '31-35', 'label' : '31-35'},
                    {'value' : '36-40', 'label' : '36-40'},  
                    {'value' : '41-50', 'label' : '41-50'},
                    {'value' : '51-60', 'label' : '51-60'},
                    {'value' : '61-65', 'label' : '61-65'}
                );
                self.ageListDP = new ArrayDataProvider(self.ageList, {keyAttributes: 'value'});
                self.age = ko.observable('');
                self.disable = ko.observable('');
                self.disability_note_show = ko.observable('');
                self.disability_note = ko.observable('');
                self.service = ko.observable('');
                self.service_note_show = ko.observable('');  
                self.service_note = ko.observable('');
                self.offence = ko.observable('');
                self.offence_note_show = ko.observable('');
                self.offence_note = ko.observable('');
                self.disciplinary = ko.observable('');
                self.disciplinary_note_show = ko.observable('');
                self.disciplinary_note = ko.observable('');  
                self.criminal = ko.observable('');
                self.criminal_note_show = ko.observable('');
                self.criminal_note = ko.observable('');
                self.agreement = ko.observable();
                self.declaration = ko.observable();
                var BaseURL = sessionStorage.getItem("BaseURL")

                self.groupValid = ko.observable();   
                self.saveApplicationMsg = ko.observable();
                self.staffActionBtn = ko.observable();
                self.applicationStatus = ko.observable('');

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({ path: 'signin' });
                    }
                    else {
                       app.onAppSuccess();
                       getApplication();
                    }
                };
                function getApplication() {
                console.log(sessionStorage.getItem("staffId"))
                var BaseURL = sessionStorage.getItem("BaseURL")
                 $.ajax({
                    url: BaseURL + "/jpApplicationGet",
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
                    success: function (result) {
                        let data = JSON.parse(result);
                        console.log(data)
                    if(data==''){
                            self.staffActionBtn('Add')
                        }else{
                            self.staffActionBtn('Update')
                            self.date_of_birth(data[0][0]);
                            self.nationality(data[0][1]);
                            self.ni_number_sec(data[0][2]);
                            self.ni_number(data[0][3]);
                            self.ni_reference_number(data[0][4]);
                            self.marital_status(data[0][5]);
                            self.nmc_pin(data[0][6]);
                            self.ethinic(data[0][7]);
                            self.disable(data[0][8]);
                            self.disability_note(data[0][9]);
                            self.age(data[0][10]);
                            self.service(data[0][11]);
                            self.service_note(data[0][12]);
                            self.offence(data[0][13]);
                            self.offence_note(data[0][14])   
                            self.disciplinary(data[0][15]);
                            self.disciplinary_note(data[0][16])  
                            self.criminal(data[0][17]);
                            self.criminal_note(data[0][18]) 
                            if(data[0][19] == "Pending") {
                                self.applicationStatus('Pending');
                            }else if(data[0][19] == "Audited") {
                                self.applicationStatus('Audited');
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
        
             self.updateApplicationStatus = function (event,data) {
                var BaseURL = sessionStorage.getItem("BaseURL")
                $.ajax({
                    url: BaseURL+ "/jpStaffUpdateApplicationStatus",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId : sessionStorage.getItem("staffId"),
                        auditerName : sessionStorage.getItem("userName")
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
                       console.log(data)
                       console.log("Success")
                       if(sessionStorage.getItem('application_status')=="Pending"){
                        sessionStorage.setItem('application_status','Audited');
                       }else if(sessionStorage.getItem('application_status')=="Audited"){
                        sessionStorage.setItem('application_status','Pending');
                       }
                       location.reload();
                    }
                })  

            }

            self.NISecShow = function (event,data) {
                if(self.ni_number_sec()=='Yes'){
                   self.have_ni(true)              
                }else if(self.ni_number_sec()=='No'){
                    self.have_ni(false)              
                }
    
            }

            self.nextPage = function (event,data) {
                var validApplication1 = self._checkValidationGroup("applicationSec1"); 
                if (validApplication1) {  
                    document.getElementById("detailsSec").style.display = "none";
                    document.getElementById("nextButton").style.display = "none";
                    document.getElementById("actionButtons").style.display = "block";
                    document.getElementById("formsSec").style.display = "block";
                }
            }

            self.disableSecShow = function (event,data) {
                if(self.disable()=='Yes'){
                   self.disability_note_show(true)              
                }else if(self.disable()=='No'){
                    self.disability_note_show(false)              
                }
    
            }
            self.serviceSecShow = function (event,data) {
                if(self.service()=='Yes'){
                    self.service_note_show(true)              
                 }else if(self.service()=='No'){
                     self.service_note_show(false)              
                 } 
            }
            self.offenceSecShow = function (event,data) {
                if(self.offence()=='Yes'){
                    self.offence_note_show(true)              
                 }else if(self.offence()=='No'){
                     self.offence_note_show(false)              
                 } 
            }
            self.disciplinarySecShow = function (event,data) {
                if(self.disciplinary()=='Yes'){
                    self.disciplinary_note_show(true)              
                 }else if(self.disciplinary()=='No'){
                     self.disciplinary_note_show(false)              
                 } 
            }
            self.criminalSecShow = function (event,data) {
                if(self.criminal()=='Yes'){
                    self.criminal_note_show(true)              
                 }else if(self.criminal()=='No'){
                     self.criminal_note_show(false)              
                 } 
            }

            self.applicationInfoSave = function (event,data) {
                var validApplication2 = self._checkValidationGroup("applicationSec2"); 
                if (validApplication2) { 
                    document.querySelector('#openAddApplicationProgress').open();
                    self.saveApplicationMsg('');
                    $.ajax({
                        url: BaseURL + "/jpAddApplicationInfo",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("staffId"),
                            date_of_birth : self.date_of_birth(),
                            nationality : self.nationality(),
                            have_ni : self.ni_number_sec(),
                            ni_number : self.ni_number(),
                            ni_reference_number : self.ni_reference_number(),
                            marital_status : self.marital_status(),
                            nmc_pin : self.nmc_pin(), 
                            ethinic : self.ethinic(),
                            disable : self.disable(),
                            disability_note : self.disability_note(),
                            age : self.age(),
                            service : self.service(),
                            service_note : self.service_note(),
                            offence : self.offence(),
                            offence_note : self.offence_note(),
                            disciplinary : self.disciplinary(),
                            disciplinary_note : self.disciplinary_note(),
                            criminal : self.criminal(),
                            criminal_note : self.criminal_note(),
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            if(textStatus == 'timeout'){
                                document.querySelector('#openAddApplicationProgress').close();
                                document.querySelector('#Timeout').open();
                            }
                        },
                        success: function (data) {
                            document.querySelector('#openAddApplicationProgress').close();
                            console.log(data)
                            location.reload()
                        }
                    }) 
                }
            }

            self.applicationInfoUpdate = function (event,data) {
                var validApplication2 = self._checkValidationGroup("applicationSec2"); 
                if (validApplication2) { 
                    document.querySelector('#openAddApplicationProgress').open();
                    self.saveApplicationMsg('');
                    $.ajax({
                        url: BaseURL + "/jpUpdateApplicationInfo",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("staffId"),
                            date_of_birth : self.date_of_birth(),
                            nationality : self.nationality(),
                            have_ni : self.ni_number_sec(),
                            ni_number : self.ni_number(),
                            ni_reference_number : self.ni_reference_number(),
                            marital_status : self.marital_status(),
                            nmc_pin : self.nmc_pin(), 
                            ethinic : self.ethinic(),
                            disable : self.disable(),
                            disability_note : self.disability_note(),
                            age : self.age(),
                            service : self.service(),
                            service_note : self.service_note(),
                            offence : self.offence(),
                            offence_note : self.offence_note(),
                            disciplinary : self.disciplinary(),
                            disciplinary_note : self.disciplinary_note(),
                            criminal : self.criminal(),
                            criminal_note : self.criminal_note(),
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            if(textStatus == 'timeout'){
                                document.querySelector('#openAddApplicationProgress').close();
                                document.querySelector('#Timeout').open();
                            }
                        },
                        success: function (data) {
                            document.querySelector('#openAddApplicationProgress').close();
                            console.log(data)
                            location.reload()
                        }
                    }) 
                }
            }

            }
            
            
          }
            return  AddApplicationModel;

        });
