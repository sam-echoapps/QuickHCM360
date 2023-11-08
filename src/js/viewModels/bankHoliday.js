define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class BankHolidayModel {
        constructor(context) {
                var self = this;
                self.DepName = context.routerState.detail.dep_url;
                self.CancelBehaviorOpt = ko.observable('icon');
                self.percentageChecked = ko.observable(true);
                self.fixedChecked = ko.observable(false);
                var BaseURL = sessionStorage.getItem("BaseURL")
                self.clientActionBtn = ko.observable('Add');
                self.bankHolidayDate = ko.observable();
                self.bankHolidayDateList = ko.observableArray([]);
               /*  self.bankHolidayDateList.push(
                    {'value' : 'All dates', 'label' : 'All dates'}
                ); */
                /* self.bankHolidayDateList.push(
                    {'value' : '1.00AM-12.00PM', 'label' : '1.00AM-12.00PM'},
                    {'value' : 'Morning Shift+Night Shift', 'label' : 'Morning Shift+Night Shift'}
                ); */
                self.bankHolidayDateList.push(
                    {'value' : 'Midnight to Midnight', 'label' : 'Midnight to Midnight'},
                    {'value' : 'Whole day', 'label' : 'Whole day'}
                );
                self.BankHolidayDateListDP = new ArrayDataProvider(self.bankHolidayDateList, {keyAttributes: 'value'});
                self.selectUserType = ko.observable();
                self.userTypeList = ko.observableArray([]);
                self.userTypeListDP = new ArrayDataProvider(self.userTypeList, { keyAttributes: "value"});
                self.clientDayRate = ko.observable();
                self.clientNightRate = ko.observable();
                self.clientRateList = ko.observableArray([]);
                self.clientRateList.push(
                    {'value' : '1.00 times', 'label' : '1.00 times'}, 
                    {'value' : '1.25 times', 'label' : '1.25 times'},
                    {'value' : '1.50 times', 'label' : '1.50 times'}, 
                    {'value' : '1.75 times', 'label' : '1.75 times'},
                    {'value' : '1.90 times', 'label' : '1.90 times'},
                    {'value' : '2.00 times', 'label' : '2.00 times'}, 
                    {'value' : '2.25 times', 'label' : '2.25 times'},
                    {'value' : '2.50 times', 'label' : '2.50 times'}                );
                self.clientRateListDP = new ArrayDataProvider(self.clientRateList, {keyAttributes: 'value'});
                self.clientPayeDayRate = ko.observable();  
                self.clientPayeNightRate = ko.observable();
                self.clientLtdDayRate = ko.observable();  
                self.clientLtdNightRate = ko.observable();
                self.clientEmpDayRate = ko.observable();  
                self.clientEmpNightRate = ko.observable();
                self.clientUmbrellaDayRate = ko.observable();  
                self.clientUmbrellaNightRate = ko.observable();
                self.groupValid = ko.observable();
                self.bankHolidayDet = ko.observableArray([]);
                self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();
                self.bankHolidayList = ko.observable();
                self.bankHolidayType = ko.observable();
                self.bankHolidayRate = ko.observable();

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({ path: 'signin' });
                    }
                    else {
                       app.onAppSuccess();
                       //getClientBankHolidayRate();
                       getBankHolidayRate()
                    }
                };
                function getClientBankHolidayRate() {
                    getJobRoles();
                    self.bankHolidayDet([]);
                    $.ajax({
                        url: BaseURL + "/jpGetClientBankHolidayRate",
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
                            console.log(data[0].length)
                            if(data[0].length !=0){ 
                                self.bankHolidayList(true)
                            for (var i = 0; i < data[0].length; i++) {
                            self.bankHolidayDet.push({'id': data[0][i][0], 'client_id' : data[0][i][1], 'holiday_date' : data[0][i][2], 'user_type' : data[0][i][3], 'clientDayRate' :data[0][i][4],'clientNightRate' :data[0][i][5], 'clientPayeDayRate' :data[0][i][6],'clientPayeNightRate' :data[0][i][7], 'clientLtdDayRate' :data[0][i][8],'clientLtdNightRate' :data[0][i][9], 'clientEmpDayRate' :data[0][i][10],'clientEmpNightRate' :data[0][i][11], 'clientUmbrellaDayRate' :data[0][i][12],'clientUmbrellaNightRate' :data[0][i][13] });
                            }
                        }
                            self.bankHolidayDet.valueHasMutated();
                            return self; 
                    }
                    }) 
               }
               function getBankHolidayRate() {
                self.bankHolidayDet([]);
                $.ajax({
                    url: BaseURL + "/jpGetBankHolidayRate",
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
                        console.log(data[0].length)
                        if(data[0].length !=0){ 
                            self.bankHolidayList(true)
                            self.bankHolidayType(data[0][0][2])
                            self.bankHolidayRate(data[0][0][3])
                            self.clientActionBtn('Update')
                        // for (var i = 0; i < data[0].length; i++) {
                        // self.bankHolidayDet.push({'id': data[0][i][0], 'client_id' : data[0][i][1], 'holiday_date' : data[0][i][2], 'user_type' : data[0][i][3], 'clientDayRate' :data[0][i][4],'clientNightRate' :data[0][i][5], 'clientPayeDayRate' :data[0][i][6],'clientPayeNightRate' :data[0][i][7], 'clientLtdDayRate' :data[0][i][8],'clientLtdNightRate' :data[0][i][9], 'clientEmpDayRate' :data[0][i][10],'clientEmpNightRate' :data[0][i][11], 'clientUmbrellaDayRate' :data[0][i][12],'clientUmbrellaNightRate' :data[0][i][13] });
                        // }
                    }
                        self.bankHolidayDet.valueHasMutated();
                        return self; 
                }
                }) 
           }
               this.dataProvider1 = new ArrayDataProvider(this.bankHolidayDet, { keyAttributes: "id"});

                self.clientBankHolidayRateAdd = function (event,data) {
                    var validbankHolidaySec = self._checkValidationGroup("bankHolidaySec");
                    var charging_type;
                    if (validbankHolidaySec) {
                        if(self.fixedChecked()==true){
                            charging_type = "Fixed"
                        }else  if(self.percentageChecked()==true){
                            charging_type = "Percentage"
                        }
                        document.querySelector('#openAddClientProgress').open(); 
                        $.ajax({
                            url: BaseURL + "/jpClientBankHolidaySave",
                            type: 'POST',
                            data: JSON.stringify({
                                clientId : sessionStorage.getItem("clientId"),
                                holiday_date : self.bankHolidayDate(),
                                user_type : self.selectUserType(),
                                clientDayRate : self.clientDayRate(),
                                clientNightRate : self.clientNightRate(),
                                clientPayeDayRate : self.clientPayeDayRate(),
                                clientPayeNightRate : self.clientPayeNightRate(),
                                clientLtdDayRate : self.clientLtdDayRate(),
                                clientLtdNightRate : self.clientLtdNightRate(),
                                clientEmpDayRate : self.clientEmpDayRate(),
                                clientEmpNightRate : self.clientEmpNightRate(),  
                                clientUmbrellaDayRate : self.clientUmbrellaDayRate(),
                                clientUmbrellaNightRate : self.clientUmbrellaNightRate(),  
                                charging_type : charging_type
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
                                /* console.log(data)
                                document.querySelector('#openAddClientProgress').close();
                                document.querySelector('#openAddClientPaymentResult').open();
                                self.addClientPaymentMsg(data[0]);
        
                                return self; */
                                document.querySelector('#openAddClientProgress').close(); 
                                location.reload()
                            }
                        }) 
                    }
                }
                self.checkedPercentage = () => {
                    refresh()
                    if(self.percentageChecked() === false){
                        self.fixedChecked(true)
                    }else if(self.percentageChecked() === true){
                        self.fixedChecked(false)
                    }
                }
                self.checkedFixed = () => {
                    refresh()
                    if(self.fixedChecked() === false){
                        self.percentageChecked(true)
                    }else if(self.fixedChecked() === true){
                        self.percentageChecked(false)
                    }
                }
                function getJobRoles() {
                    self.userTypeList([]);
                $.ajax({
                    url: BaseURL + "/jpGetJobRole",
                    type: 'POST',
                    data: JSON.stringify({
                        clientId : sessionStorage.getItem("clientId"),
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
                        console.log(data.length)
                        if(data.length ==0){
                            //jobRoleString ="Must fill Job role section-Step4"
                        }else{
                        var jobRoleString=(data[0][2])
                        }
                        if(jobRoleString){
                        console.log(jobRoleString)
                        var userList = jobRoleString.split(",");
                         for (var i = 0; i < userList.length; i++) {
                            self.userTypeList.push({'label' : userList[i], 'value' : userList[i]});
                         }
                        }
                         self.userTypeList.valueHasMutated();
                        return self;
                    }
                })
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
            function refresh(){
                var charging_type;
                if(self.fixedChecked()==true){
                    charging_type = "Fixed"
                }else  if(self.percentageChecked()==true){
                    charging_type = "Percentage"
                }
                /* self.bankHolidayDate('');
                self.selectUserType(''); */
                if(self.selectUserType()!=undefined && charging_type!=undefined){
                    $.ajax({
                        url: BaseURL + "/getCheckClientBankHolidayInfo",
                        type: 'POST',
                        data: JSON.stringify({
                            clientId : sessionStorage.getItem("clientId"),
                            bankHolidayDate : self.bankHolidayDate(),
                            userType : self.selectUserType(),
                            charging_type : charging_type
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
                            self.clientDayRate(data[0][0][4]);
                            self.clientNightRate(data[0][0][5]);
                            self.clientPayeDayRate(data[0][0][6]);
                            self.clientPayeNightRate(data[0][0][7]);
                            self.clientLtdDayRate(data[0][0][8]);
                            self.clientLtdNightRate(data[0][0][9]);
                            self.clientEmpDayRate(data[0][0][10]);
                            self.clientEmpNightRate(data[0][0][11]);
                            self.clientUmbrellaDayRate(data[0][0][12]);
                            self.clientUmbrellaNightRate(data[0][0][13]);
                            /* if(data[0][0][14]=="Percentage"){
                                self.percentageChecked(true)
                            }else if(data[0][0][14]=="Fixed"){
                                self.fixedChecked(true)
                            } */
                            self.clientActionBtn('Update')
                        }else{
                            self.clientDayRate('');
                            self.clientNightRate('');
                            self.clientPayeDayRate('');  
                            self.clientPayeNightRate('');  
                            self.clientLtdDayRate('');  
                            self.clientLtdNightRate('');  
                            self.clientEmpDayRate('');  
                            self.clientEmpNightRate('');  
                            self.clientUmbrellaDayRate('');   
                            self.clientUmbrellaNightRate('');  
                        }
                    }
                    })
                } 
            }
            self.deleteConfirm = function (event,data) {
                //var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
                var clickedRowId = data.data.id
                sessionStorage.setItem("bankHolidayId", clickedRowId);
                console.log(clickedRowId)
                if(clickedRowId !=undefined){
                    document.querySelector('#openDeleteConfirm').open();
                }         
               
            }
            self.deleteBankHolidayInfo = function (event,data) {
                var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
                console.log(clickedRowId)
                var BaseURL = sessionStorage.getItem("BaseURL");
                if(clickedRowId !=undefined){
                    document.querySelector('#openDeleteConfirm').close();
                    document.querySelector('#openDeleteBankHolidayProgress').open();
                     $.ajax({
                        url: BaseURL + "/jpDeleteBankHolidayDetails",
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
                            document.querySelector('#openDeleteBankHolidayProgress').close();
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
            self.getBankHolidayInfo = function (event,data) {
                self.clientDayRate('');
                self.clientNightRate('');
                self.clientPayeDayRate('');  
                self.clientPayeNightRate('');  
                self.clientLtdDayRate('');  
                self.clientLtdNightRate('');  
                self.clientEmpDayRate('');  
                self.clientEmpNightRate('');  
                self.clientUmbrellaDayRate('');   
                self.clientUmbrellaNightRate('');  
                if(self.selectUserType()!=undefined){
                $.ajax({
                    url: BaseURL + "/getClientBankHolidayInfo",
                    type: 'POST',
                    data: JSON.stringify({
                        clientId : sessionStorage.getItem("clientId"),
                        bankHolidayDate : self.bankHolidayDate(),
                        userType : self.selectUserType(),
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
                        self.clientDayRate(data[0][0][4]);
                        self.clientNightRate(data[0][0][5]);
                        self.clientPayeDayRate(data[0][0][6]);
                        self.clientPayeNightRate(data[0][0][7]);
                        self.clientLtdDayRate(data[0][0][8]);
                        self.clientLtdNightRate(data[0][0][9]);
                        self.clientEmpDayRate(data[0][0][10]);
                        self.clientEmpNightRate(data[0][0][11]);
                        self.clientUmbrellaDayRate(data[0][0][12]);
                        self.clientUmbrellaNightRate(data[0][0][13]);
                        if(data[0][0][14]=="Percentage"){
                            self.percentageChecked(true)
                        }else if(data[0][0][14]=="Fixed"){
                            self.fixedChecked(true)
                        }
                        self.clientActionBtn('Update')
                    }else{
                        self.clientActionBtn('Add')
                    }
                }
                })
            } 
            }
            self.clientBankHolidayRateUpdate = function (event,data) {
                var validbankHolidaySec = self._checkValidationGroup("bankHolidaySec");
                var charging_type;
                if (validbankHolidaySec) {
                    if(self.fixedChecked()==true){
                        charging_type = "Fixed"
                    }else  if(self.percentageChecked()==true){
                        charging_type = "Percentage"
                    }
                    document.querySelector('#openAddClientProgress').open(); 
                    $.ajax({
                        url: BaseURL + "/jpClientBankHolidayUpdate",
                        type: 'POST',
                        data: JSON.stringify({
                            clientId : sessionStorage.getItem("clientId"),
                            holiday_date : self.bankHolidayDate(),
                            user_type : self.selectUserType(),
                            clientDayRate : self.clientDayRate(),
                            clientNightRate : self.clientNightRate(),
                            clientPayeDayRate : self.clientPayeDayRate(),
                            clientPayeNightRate : self.clientPayeNightRate(),
                            clientLtdDayRate : self.clientLtdDayRate(),
                            clientLtdNightRate : self.clientLtdNightRate(),
                            clientEmpDayRate : self.clientEmpDayRate(),
                            clientEmpNightRate : self.clientEmpNightRate(),  
                            clientUmbrellaDayRate : self.clientUmbrellaDayRate(),
                            clientUmbrellaNightRate : self.clientUmbrellaNightRate(),  
                            charging_type : charging_type
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
                            /* console.log(data)
                            document.querySelector('#openAddClientProgress').close();
                            document.querySelector('#openAddClientPaymentResult').open();
                            self.addClientPaymentMsg(data[0]);
    
                            return self; */
                            document.querySelector('#openAddClientProgress').close(); 
                            location.reload()
                        }
                    }) 
                }
            }

            self.BankHolidayRateAdd = function (event,data) {
                var validbankHolidaySec = self._checkValidationGroup("bankHolidaySec");
                if (validbankHolidaySec) {
                    document.querySelector('#openAddClientProgress').open(); 
                    $.ajax({
                        url: BaseURL + "/jpBankHolidaySave",
                        type: 'POST',
                        data: JSON.stringify({
                            clientId : sessionStorage.getItem("clientId"),
                            holiday_type : self.bankHolidayType(),
                            holiday_rate : self.bankHolidayRate(),
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
                            //console.log(data)
                            document.querySelector('#openAddClientProgress').close(); 
                            location.reload()
                        }
                    }) 
                }
            }

            self.BankHolidayRateUpdate = function (event,data) {
                var validbankHolidaySec = self._checkValidationGroup("bankHolidaySec");
                if (validbankHolidaySec) {
                    document.querySelector('#openAddClientProgress').open(); 
                    $.ajax({
                        url: BaseURL + "/jpBankHolidayUpdate",
                        type: 'POST',
                        data: JSON.stringify({
                            clientId : sessionStorage.getItem("clientId"),
                            holiday_type : self.bankHolidayType(),
                            holiday_rate : self.bankHolidayRate(),
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
                            /* console.log(data)
                            document.querySelector('#openAddClientProgress').close();
                            document.querySelector('#openAddClientPaymentResult').open();
                            self.addClientPaymentMsg(data[0]);
    
                            return self; */
                            document.querySelector('#openAddClientProgress').close(); 
                            location.reload()
                        }
                    }) 
                }
            }
            }
            
            
          }
            return  BankHolidayModel;

        });
