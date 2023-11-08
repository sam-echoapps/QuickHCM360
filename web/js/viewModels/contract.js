define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class ContractModel {
        constructor(context) {
                var self = this;
                self.startOpened = ko.observable(true);
                self.startToggle = () => self.startOpened(!self.startOpened());
                self.ContractDet = ko.observableArray([]);
                self.staff_name = ko.observable();  
                self.main_post = ko.observable();  
                self.sub_post = ko.observable();  
                self.weekday_longday_type = ko.observable();  
                self.weekday_night_type = ko.observable();  
                self.bank_holiday_type = ko.observable();  
                self.weekend_longday_type = ko.observable();  
                self.weekend_night_type = ko.observable();  
                self.kitchen_weekday_longday = ko.observable();  
                self.kitchen_weekday_night = ko.observable();  
                self.kitchen_bank_holiday = ko.observable();  
                self.kitchen_weekend_longday = ko.observable();  
                self.kitchen_weekend_night = ko.observable();  
                self.domestic_weekday_longday = ko.observable();  
                self.domestic_weekday_night = ko.observable();  
                self.domestic_bank_holiday = ko.observable();  
                self.domestic_weekend_longday = ko.observable();  
                self.domestic_weekend_night = ko.observable();  
                self.care_weekday_longday = ko.observable();  
                self.care_weekday_night = ko.observable();  
                self.care_bank_holiday = ko.observable();  
                self.care_weekend_longday = ko.observable();  
                self.care_weekend_night = ko.observable();  
                self.living_weekday_longday = ko.observable();  
                self.living_weekday_night = ko.observable();  
                self.living_bank_holiday = ko.observable();  
                self.living_weekend_longday = ko.observable();  
                self.living_weekend_night = ko.observable();  
                self.groupValid = ko.observable();
                self.requiredSec1 = ko.observable();
                self.requiredSec2 = ko.observable(); 
                self.kitchenSec = ko.observable();   
                self.domesticSec = ko.observable();    
                self.careSec = ko.observable(); 
                self.livingSec = ko.observable(); 
                self.commencement_date = ko.observable();
                self.savePayRateMsg = ko.observable();
                self.RateActionBtn= ko.observable('Add');   
                self.contractStatus = ko.observable();
                self.contractCurrentStatus = ko.observable();   
                self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();
                self.contractSendDate = ko.observable();
                self.contractSendBy = ko.observable();
                self.contractSubmitter = ko.observable();
                self.contractSignature = ko.observable();
                self.contractSubmittedDate = ko.observable();

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({ path: 'signin' });
                    }
                    else {
                       app.onAppSuccess();
                       getCotractInfo();
                    }
                };

                //Validation 
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
                function getCotractInfo() {
                        self.ContractDet([]);
                        var BaseURL = sessionStorage.getItem("BaseURL")
                        $.ajax({
                            url: BaseURL + "/jpStaffContractGet",
                            type: 'POST',
                            data: JSON.stringify({
                                staffId : sessionStorage.getItem("staffId"),
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
                                var result = JSON.parse(data[1]);
                                console.log(result)
                                self.staff_name(data[0][0] + " " + data[0][1]);
                                self.main_post(data[0][2]);
                                if(data[0][2]=="Nurse" || data[0][2]=="Care Assistant" || data[0][2]=="Senior Care Assistant" || data[0][2]=="Domiciliary Care"){
                                    document.getElementById('mainPostType1').style.display='block';
                                    self.requiredSec1(true)
                                }
                                if(data[0][2]=="Kitchen Assistant" || data[0][2]=="Chefs" || data[0][2]=="Domestic Care"){
                                    document.getElementById('mainPostType2').style.display='block';
                                    self.requiredSec2(true)
                                }
                                if(data[0][3]=="kitchen_assistant"){
                                    self.sub_post("Kitchen Assistant");
                                    document.getElementById('kitchenRate').style.display='block';
                                    self.kitchenSec(true)
                                }
                                if(data[0][3]=="domestic_care"){
                                    self.sub_post("Domestic Care");
                                    document.getElementById('domesticRate').style.display='block';
                                    self.domesticSec(true)
                                }
                                if(data[0][3]=="kitchen_assistant,domestic_care"){
                                    self.sub_post("Kitchen Assistant,Domestic Care");
                                    document.getElementById('kitchenRate').style.display='block';
                                    document.getElementById('domesticRate').style.display='block';
                                    self.kitchenSec(true)
                                    self.domesticSec(true)
                                }
                                if(data[0][3]=="care_assistant"){
                                    self.sub_post("Care Assistant");
                                    document.getElementById('careRate').style.display='block';
                                    self.careSec(true)
                                }
                                if(data[0][3]=="living_care"){
                                    self.sub_post("Living Care");
                                    document.getElementById('livingRate').style.display='block';
                                    self.livingSec(true)
                                }
                                if(result){
                                self.RateActionBtn('Update')
                                self.commencement_date(result[2])
                                self.weekday_longday_type(Number(result[3]))
                                self.weekday_night_type(Number(result[4]))
                                self.bank_holiday_type(Number(result[5]))
                                self.weekend_longday_type(Number(result[6]))
                                self.weekend_night_type(Number(result[7]))
                                self.kitchen_weekday_longday(Number(result[8]))
                                self.kitchen_weekday_night(Number(result[9]))
                                self.kitchen_bank_holiday(Number(result[10]))
                                self.kitchen_weekend_longday(Number(result[11]))
                                self.kitchen_weekend_night(Number(result[12]))
                                self.domestic_weekday_longday(Number(result[13]))
                                self.domestic_weekday_night(Number(result[14]))
                                self.domestic_bank_holiday(Number(result[15]))
                                self.domestic_weekend_longday(Number(result[16]))
                                self.domestic_weekend_night(Number(result[17]))
                                self.care_weekday_longday(Number(result[18]))
                                self.care_weekday_night(Number(result[19]))
                                self.care_bank_holiday(Number(result[20]))
                                self.care_weekend_longday(Number(result[21]))
                                self.care_weekend_night(Number(result[22]))
                                self.living_weekday_longday(Number(result[23]))
                                self.living_weekday_night(Number(result[24]))
                                self.living_bank_holiday(Number(result[25]))
                                self.living_weekend_longday(Number(result[26]))
                                self.living_weekend_night(Number(result[27]))
                                self.contractCurrentStatus(result[28])
                                if(result[29] == "Pending") {
                                    self.contractStatus('Pending');
                                }else if(result[29] == "Audited") {
                                    self.contractStatus('Audited');
                                } 
                                self.contractSendDate(result[30]) 
                                self.contractSendBy(result[31]) 
                                self.contractSubmitter(result[32]) 
                                self.contractSignature(result[33]) 
                                self.contractSubmittedDate(result[34]) 
                                if(result[30] == '1900-01-01'){
                                self.ContractDet.push({'id': result[0],'name': data[0][0] + " " + data[0][1],'currentStatus': result[28],'contractStatus': result[29],'contractSendDate': "N/A", 'contractSendBy': result[31]});   
                                }else if(result[30] != '1900-01-01'){
                                    self.ContractDet.push({'id': result[0],'name': data[0][0] + " " + data[0][1],'currentStatus': result[28],'contractStatus': result[29],'contractSendDate': result[30], 'contractSendBy': result[31]});   
                                }
                            }
                                else{
                                    document.getElementById('payRateSection').style.display="block";
                                    document.getElementById('contractStatus').style.display="none";
                                }
                        }
                        })
                
                }
                this.dataProvider1 = new ArrayDataProvider(this.ContractDet, { keyAttributes: "id"});

                self.payRateSubmit = function (event,data) {
                    var contactSubmitCheck = self._checkValidationGroup("contactSubmitCheck"); 
                    var BaseURL = sessionStorage.getItem("BaseURL")
                    self.savePayRateMsg('');
                    if (contactSubmitCheck){
                        document.querySelector('#openAddPayRatesProgress').open();
                        if(self.weekend_longday_type() == undefined){
                            self.weekend_longday_type(0)
                        }
                        if(self.weekend_night_type() == undefined){
                            self.weekend_night_type(0)
                        }
                        if(self.kitchen_weekday_longday() == undefined){
                            self.kitchen_weekday_longday(0)
                        }
                        if(self.kitchen_weekday_night() == undefined){
                            self.kitchen_weekday_night(0)
                        }
                        if(self.kitchen_bank_holiday() == undefined){
                            self.kitchen_bank_holiday(0)
                        }
                        if(self.kitchen_weekend_longday() == undefined){
                            self.kitchen_weekend_longday(0)
                        }
                        if(self.kitchen_weekend_night() == undefined){
                            self.kitchen_weekend_night(0)
                        }
                        if(self.domestic_weekday_longday() == undefined){
                            self.domestic_weekday_longday(0)
                        }
                        if(self.domestic_weekday_night() == undefined){
                            self.domestic_weekday_night(0)
                        }
                        if(self.domestic_bank_holiday() == undefined){
                            self.domestic_bank_holiday(0)
                        }
                        if(self.domestic_weekend_longday() == undefined){
                            self.domestic_weekend_longday(0)
                        }
                        if(self.domestic_weekend_night() == undefined){
                            self.domestic_weekend_night(0)
                        }
                        if(self.care_weekday_longday() == undefined){
                            self.care_weekday_longday(0)
                        }
                        if(self.care_weekday_night() == undefined){
                            self.care_weekday_night(0)
                        }
                        if(self.care_bank_holiday() == undefined){
                            self.care_bank_holiday(0)
                        }
                        if(self.care_weekend_longday() == undefined){
                            self.care_weekend_longday(0)
                        }
                        if(self.care_weekend_night() == undefined){
                            self.care_weekend_night(0)
                        }
                        if(self.living_weekday_longday() == undefined){
                            self.living_weekday_longday(0)
                        }
                        if(self.living_weekday_night() == undefined){
                            self.living_weekday_night(0)
                        }
                        if(self.living_bank_holiday() == undefined){
                            self.living_bank_holiday(0)
                        }
                        if(self.living_weekend_longday() == undefined){
                            self.living_weekend_longday(0)
                        }
                        if(self.living_weekend_night() == undefined){
                            self.living_weekend_night(0)
                        }
                        $.ajax({
                            url: BaseURL + "/jpStaffPayRateAdd",
                            type: 'POST',
                            data: JSON.stringify({
                                staffId : sessionStorage.getItem("staffId"),
                                commencement_date : self.commencement_date(),  
                                weekday_longday_type : self.weekday_longday_type(),
                                weekday_night_type : self.weekday_night_type(),
                                bank_holiday_type : self.bank_holiday_type(),
                                weekend_longday_type : self.weekend_longday_type(),
                                weekend_night_type : self.weekend_night_type(),
                                kitchen_weekday_longday : self.kitchen_weekday_longday(),
                                kitchen_weekday_night : self.kitchen_weekday_night(),
                                kitchen_bank_holiday : self.kitchen_bank_holiday(),
                                kitchen_weekend_longday : self.kitchen_weekend_longday(),
                                kitchen_weekend_night : self.kitchen_weekend_night(),
                                domestic_weekday_longday : self.domestic_weekday_longday(),
                                domestic_weekday_night : self.domestic_weekday_night(),
                                domestic_bank_holiday : self.domestic_bank_holiday(),
                                domestic_weekend_longday : self.domestic_weekend_longday(),
                                domestic_weekend_night : self.domestic_weekend_night(),
                                care_weekday_longday : self.care_weekday_longday(),
                                care_weekday_night : self.care_weekday_night(),
                                care_bank_holiday : self.care_bank_holiday(),
                                care_weekend_longday : self.care_weekend_longday(),
                                care_weekend_night : self.care_weekend_night(),
                                living_weekday_longday : self.living_weekday_longday(),
                                living_weekday_night : self.living_weekday_night(),
                                living_bank_holiday : self.living_bank_holiday(),
                                living_weekend_longday : self.living_weekend_longday(),
                                living_weekend_night : self.living_weekend_night(),
                            }),
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                if(textStatus == 'timeout'){
                                    document.querySelector('#openAddHealthProgress').close();
                                    document.querySelector('#Timeout').open();
                                }
                            },
                            success: function (data) {
                                document.querySelector('#openAddPayRatesProgress').close();
                                document.querySelector('#openPayRateSaveResult').open();
                                self.savePayRateMsg(data[0]);
                            }
                        })        
                    }
                }

                self.payRateUpdate = function (event,data) {
                    var contactSubmitCheck = self._checkValidationGroup("contactSubmitCheck"); 
                    var BaseURL = sessionStorage.getItem("BaseURL")
                    self.savePayRateMsg('');
                    if (contactSubmitCheck){
                        document.querySelector('#openAddPayRatesProgress').open();
                        if(self.weekend_longday_type() == undefined){
                            self.weekend_longday_type(0)
                        }
                        if(self.weekend_night_type() == undefined){
                            self.weekend_night_type(0)
                        }
                        if(self.kitchen_weekday_longday() == undefined){
                            self.kitchen_weekday_longday(0)
                        }
                        if(self.kitchen_weekday_night() == undefined){
                            self.kitchen_weekday_night(0)
                        }
                        if(self.kitchen_bank_holiday() == undefined){
                            self.kitchen_bank_holiday(0)
                        }
                        if(self.kitchen_weekend_longday() == undefined){
                            self.kitchen_weekend_longday(0)
                        }
                        if(self.kitchen_weekend_night() == undefined){
                            self.kitchen_weekend_night(0)
                        }
                        if(self.domestic_weekday_longday() == undefined){
                            self.domestic_weekday_longday(0)
                        }
                        if(self.domestic_weekday_night() == undefined){
                            self.domestic_weekday_night(0)
                        }
                        if(self.domestic_bank_holiday() == undefined){
                            self.domestic_bank_holiday(0)
                        }
                        if(self.domestic_weekend_longday() == undefined){
                            self.domestic_weekend_longday(0)
                        }
                        if(self.domestic_weekend_night() == undefined){
                            self.domestic_weekend_night(0)
                        }
                        if(self.care_weekday_longday() == undefined){
                            self.care_weekday_longday(0)
                        }
                        if(self.care_weekday_night() == undefined){
                            self.care_weekday_night(0)
                        }
                        if(self.care_bank_holiday() == undefined){
                            self.care_bank_holiday(0)
                        }
                        if(self.care_weekend_longday() == undefined){
                            self.care_weekend_longday(0)
                        }
                        if(self.care_weekend_night() == undefined){
                            self.care_weekend_night(0)
                        }
                        if(self.living_weekday_longday() == undefined){
                            self.living_weekday_longday(0)
                        }
                        if(self.living_weekday_night() == undefined){
                            self.living_weekday_night(0)
                        }
                        if(self.living_bank_holiday() == undefined){
                            self.living_bank_holiday(0)
                        }
                        if(self.living_weekend_longday() == undefined){
                            self.living_weekend_longday(0)
                        }
                        if(self.living_weekend_night() == undefined){
                            self.living_weekend_night(0)
                        }
                        $.ajax({
                            url: BaseURL + "/jpStaffPayRateUpdate",
                            type: 'POST',
                            data: JSON.stringify({
                                staffId : sessionStorage.getItem("staffId"),
                                commencement_date : self.commencement_date(),  
                                weekday_longday_type : self.weekday_longday_type(),
                                weekday_night_type : self.weekday_night_type(),
                                bank_holiday_type : self.bank_holiday_type(),
                                weekend_longday_type : self.weekend_longday_type(),
                                weekend_night_type : self.weekend_night_type(),
                                kitchen_weekday_longday : self.kitchen_weekday_longday(),
                                kitchen_weekday_night : self.kitchen_weekday_night(),
                                kitchen_bank_holiday : self.kitchen_bank_holiday(),
                                kitchen_weekend_longday : self.kitchen_weekend_longday(),
                                kitchen_weekend_night : self.kitchen_weekend_night(),
                                domestic_weekday_longday : self.domestic_weekday_longday(),
                                domestic_weekday_night : self.domestic_weekday_night(),
                                domestic_bank_holiday : self.domestic_bank_holiday(),
                                domestic_weekend_longday : self.domestic_weekend_longday(),
                                domestic_weekend_night : self.domestic_weekend_night(),
                                care_weekday_longday : self.care_weekday_longday(),
                                care_weekday_night : self.care_weekday_night(),
                                care_bank_holiday : self.care_bank_holiday(),
                                care_weekend_longday : self.care_weekend_longday(),
                                care_weekend_night : self.care_weekend_night(),
                                living_weekday_longday : self.living_weekday_longday(),
                                living_weekday_night : self.living_weekday_night(),
                                living_bank_holiday : self.living_bank_holiday(),
                                living_weekend_longday : self.living_weekend_longday(),
                                living_weekend_night : self.living_weekend_night(),
                            }),
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                if(textStatus == 'timeout'){
                                    document.querySelector('#openAddHealthProgress').close();
                                    document.querySelector('#Timeout').open();
                                }
                            },
                            success: function (data) {
                                document.querySelector('#openAddPayRatesProgress').close();
                                document.querySelector('#openPayRateSaveResult').open();
                                self.savePayRateMsg(data[0]);
                            }
                        })        
                    }
                }
                self.DBErrorOKClose = function (event) {
                    document.querySelector('#openPayRateSaveResult').close();
                    //self.router.go({path:'addStaff'})
                    location.reload()
                }; 

                self.sendContract = function (event,data) {
                    document.querySelector('#openAddEmailProgress').open();
                    var BaseURL = sessionStorage.getItem("BaseURL")
                    $.ajax({
                        url: BaseURL+ "/jpStaffSendContract",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("staffId"),
                            contractSender : sessionStorage.getItem("userName")
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
                           document.querySelector('#openAddEmailProgress').close();
                           location.reload();
                        }
                    })  
    
                }

                self.updateContractStatus = function (event,data) {
                    var BaseURL = sessionStorage.getItem("BaseURL")
                    $.ajax({
                        url: BaseURL+ "/jpStaffUpdateContractStatus",
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
                           console.log("Success")
                           if(sessionStorage.getItem('contract_status')=="Pending"){
                            sessionStorage.setItem('contract_status','Audited');
                           }else if(sessionStorage.getItem('contract_status')=="Audited"){
                            sessionStorage.setItem('contract_status','Pending');
                           }
                           location.reload();
                        }
                    })  
    
                }
                self.viewContractSec = function (event) {
                    document.getElementById('contractContent').style.display="block";
                    document.getElementById('payRateSection').style.display="none";
                }; 
                self.editPayRate = function (event) {
                    document.getElementById('contractContent').style.display="none";
                    document.getElementById('payRateSection').style.display="block";                }; 

            }
            
            
          }
            return  ContractModel;

        });
