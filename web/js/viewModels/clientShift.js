define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class ClientShiftModel {
        constructor(context) {
                var self = this;
                self.DepName = context.routerState.detail.dep_url;
                self.startTime = ko.observable(ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIso(new Date(2013, 0, 1)));
                self.endTime = ko.observable(ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIso(new Date(2013, 0, 1)));
                self.CancelBehaviorOpt = ko.observable('icon');
                self.clientButton = ko.observable('conf');
                self.shiftModule = ko.observable('conf-shift');
                self.timeSheet = ko.observable();
                self.photoCapture = ko.observable();
                self.fingSign = ko.observable();
                self.nighShift = ko.observable();
                self.staffPay = ko.observable();
                self.shiftType = ko.observable();
                self.shiftEnd = ko.observable('');
                self.clientBreak = ko.observable();
                self.clientBreakTime = ko.observable();
                self.staffBreak = ko.observable();
                self.staffBreakTime = ko.observable();
                self.clientPay = ko.observable('');
                self.rateType = ko.observable('');  
                self.selectShift = ko.observable();
                self.selectedShift = ko.observable();
    
                self.selectShiftType = ko.observable();
                self.selectedShiftType = ko.observable();
                self.selectShiftType = ko.observable();
    
                self.dayList = ko.observableArray([]);
                self.editBind = ko.observable('no');
                self.clientRate = ko.observable();
    
                self.timesheetList = ko.observableArray([]);
                self.signatureList = ko.observableArray([]);
                self.photoCaptureList = ko.observableArray([]);
                self.nighShiftList = ko.observableArray([]);
                self.paymentList = ko.observableArray([]);
                self.shiftTypeList = ko.observableArray([]);
                self.shiftEndList = ko.observableArray([]);
                self.clientBreakList = ko.observableArray([]);
                self.clientBreakTimeList = ko.observableArray([]);
                self.staffBreakList = ko.observableArray([]);
                self.staffBreakTimeList = ko.observableArray([]);
                self.clientPayList = ko.observableArray([]);
                self.rateTypeList = ko.observableArray([]);
                self.shiftNameList = ko.observableArray([]);
                self.staffTypeList = ko.observableArray([]);
                self.shiftTypeList = ko.observableArray([]);
                self.dayListArray = ko.observableArray([]);
                var BaseURL = sessionStorage.getItem("BaseURL")
                self.groupValid = ko.observable();
                self.shiftName = ko.observable();

                self.clientActionBtn = ko.observable("Add");
                self.timeSheet = ko.observable();
                self.timesheetList = ko.observableArray([]);
                self.timesheetList.push({'value' : 'Yes', 'label' : 'Yes'},{'value' : 'No', 'label' : 'No'});
                self.timesheetDP = new ArrayDataProvider(self.timesheetList, {keyAttributes: 'value'});

                self.photoCapture = ko.observable();
                self.photoCaptureList = ko.observableArray([]);
                self.photoCaptureList.push({'value' : 'Yes', 'label' : 'Yes'},{'value' : 'No', 'label' : 'No'});
                self.photoDP = new ArrayDataProvider(self.photoCaptureList, {keyAttributes: 'value'});
                
                self.fingSign = ko.observable();
                self.signatureList = ko.observableArray([]);
                self.signatureList.push({'value' : 'Yes', 'label' : 'Yes'},{'value' : 'No', 'label' : 'No'});
                self.signatureDP = new ArrayDataProvider(self.signatureList, {keyAttributes: 'value'});

                self.nighShift = ko.observable();
                self.staffPay = ko.observable();
                self.shiftType = ko.observable();
                self.shiftEnd = ko.observable('');
                self.clientBreak = ko.observable();
                self.clientBreakTime = ko.observable();
                self.staffBreak = ko.observable();
                self.staffBreakTime = ko.observable();
                self.clientPay = ko.observable('');

                self.nighShiftList = ko.observableArray([]);
                self.paymentList = ko.observableArray([]);
                self.shiftTypeList = ko.observableArray([]);
                self.shiftEndList = ko.observableArray([]);
                self.clientBreakList = ko.observableArray([]);
                self.clientBreakTimeList = ko.observableArray([]);
                self.staffBreakList = ko.observableArray([]);
                self.staffBreakTimeList = ko.observableArray([]);
                self.clientPayList = ko.observableArray([]);
                self.rateTypeList = ko.observableArray([]);
                self.shiftNameList = ko.observableArray([]);
                self.editshiftDet = ko.observableArray([]);

                self.nighShiftList.push({'value' : 'Yes', 'label' : 'Yes'},{'value' : 'No', 'label' : 'No'});
            self.paymentList.push({'value' : 'Different Rate', 'label' : 'Different Rate'},{'value' : 'Common Rate', 'label' : 'Common Rate'});
            // self.shiftTypeList.push({'value' : 'Day Shift', 'label' : 'Day Shift'},{'value' : 'Night Shift', 'label' : 'Night Shift'});
            self.shiftTypeList.push({'value' : 'Weekday Early', 'label' : 'Weekday Early'},{'value' : 'Weekday Late', 'label' : 'Weekday Late'},{'value' : 'Weekday Long Day', 'label' : 'Weekday Long Day'},{'value' : 'Weekday Night', 'label' : 'Weekday Night'},{'value' : 'Weekend Early', 'label' : 'Weekend Early'},{'value' : 'Weekend Late', 'label' : 'Weekend Late'},{'value' : 'Weekend Long Day', 'label' : 'Weekend Long Day'},{'value' : 'Weekend Night', 'label' : 'Weekend Night'});  
            self.shiftEndList.push({'value' : 'Same Day', 'label' : 'Same Day'},{'value' : 'Next Day', 'label' : 'Next Day'});
            self.clientBreakList.push({'value' : 'Pay', 'label' : 'Shift break with payment'},{'value' : 'No Pay', 'label' : 'Shift break without payment'});
            self.staffBreakList.push({'value' : 'Pay', 'label' : 'Shift break with payment'},{'value' : 'No Pay', 'label' : 'Shift break without payment'});
            self.clientBreakTimeList.push({'value' : 'No', 'label' : 'No break allowed'},
            {'value' : '15', 'label' : '15 minutes'},
            {'value' : '20', 'label' : '20 minutes'},
            {'value' : '30', 'label' : '30 minutes'},
            {'value' : '40', 'label' : '40 minutes'},
            {'value' : '45', 'label' : '45 minutes'},
            {'value' : '60', 'label' : '60 minutes'},
            {'value' : '75', 'label' : '75 minutes'},
            {'value' : '90', 'label' : '90 minutes'},
            {'value' : '105', 'label' : '105 minutes'},
            {'value' : '120', 'label' : '120 minutes'}
            );
            self.staffBreakTimeList.push({'value' : 'No', 'label' : 'No break allowed'},
            {'value' : '15', 'label' : '15 minutes'},
            {'value' : '20', 'label' : '20 minutes'},
            {'value' : '30', 'label' : '30 minutes'},
            {'value' : '40', 'label' : '40 minutes'},
            {'value' : '45', 'label' : '45 minutes'},
            {'value' : '60', 'label' : '60 minutes'},
            {'value' : '75', 'label' : '75 minutes'},
            {'value' : '90', 'label' : '90 minutes'},
            {'value' : '105', 'label' : '105 minutes'},
            {'value' : '120', 'label' : '120 minutes'}
            );

            self.dayListArray.push({'value' : 'Mon', 'label' : 'Monday'},
            {'value' : 'Tue', 'label' : 'Tuesday'},
            {'value' : 'Wed', 'label' : 'Wednesday'},
            {'value' : 'Thur', 'label' : 'Thursday'},
            {'value' : 'Fri', 'label' : 'Friday'},
            {'value' : 'Sat', 'label' : 'Saturday'},
            {'value' : 'Sun', 'label' : 'Sunday'}
            );

            self.nighShiftDP = new ArrayDataProvider(self.nighShiftList, {keyAttributes: 'value'});
            self.paymentDP = new ArrayDataProvider(self.paymentList, {keyAttributes: 'value'});
            self.shiftTypeDP = new ArrayDataProvider(self.shiftTypeList, {keyAttributes: 'value'});
            self.shiftEndDP = new ArrayDataProvider(self.shiftEndList, {keyAttributes: 'value'});
            self.clientBreakDP = new ArrayDataProvider(self.clientBreakList, {keyAttributes: 'value'});
            self.clientBreakTimeDP = new ArrayDataProvider(self.clientBreakTimeList, {keyAttributes: 'value'});
            self.staffBreakDP = new ArrayDataProvider(self.staffBreakList, {keyAttributes: 'value'});
            self.staffBreakTimeDP = new ArrayDataProvider(self.staffBreakTimeList, {keyAttributes: 'value'});
            self.clientPayDP = new ArrayDataProvider(self.clientPayList, {keyAttributes: 'value'});
            self.rateTypeDP = new ArrayDataProvider(self.rateTypeList, {keyAttributes: 'value'});

            self.shiftNameList = ko.observableArray([]);
            self.shiftNameDP = new ArrayDataProvider(self.shiftNameList, { keyAttributes: "value"});

            self.staffTypeListDP = new ArrayDataProvider(self.staffTypeList, { keyAttributes: "value"});
            self.dayListDP = new ArrayDataProvider(self.dayListArray, {keyAttributes: 'value'});
            self.editShiftType = ko.observable();
            self.editStartTime = ko.observable();
            self.editEndTime = ko.observable();
            self.editShiftEnd = ko.observable('');
            self.editClientBreak = ko.observable();
            self.editClientBreakTime = ko.observable();
            self.editStaffBreak = ko.observable();
            self.editStaffBreakTime = ko.observable();
            self.editClientPay = ko.observable('');
            self.editRateType = ko.observable();
            self.clientPayList.push({'value' : 'Hourly', 'label' : 'Hourly'},{'value' : 'Fixed', 'label' : 'Fixed'});
            self.rateTypeList.push({'value' : 'Yes', 'label' : 'Yes'},{'value' : 'No', 'label' : 'No'});

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({ path: 'signin' });
                    }
                    else {
                       app.onAppSuccess();
                       getClientConfig();
                    }
                };
                function getClientConfig() {
                    configureShift();
                    StaffJobRole()
                    $.ajax({
                       url: BaseURL + "/jpGetClientConfig",
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
                            if(data==''){
                               self.clientActionBtn('Add')
                           }else{
                               self.clientActionBtn('Update')
                               self.timeSheet(data[0][0][2]) 
                               self.photoCapture(data[0][0][3]) 
                               self.fingSign(data[0][0][4]) 
                               self.nighShift(data[0][0][5]) 
                               self.staffPay(data[0][0][6])
                           }   
                   }
                   }) 
               }
                self.clientRoleSave = function (event,data) {
                    document.querySelector('#openAddClientProgress').open();
                    $.ajax({
                        url: BaseURL + "/jpClientRoleUpdate",
                        type: 'POST',
                        data: JSON.stringify({
                            clientId : sessionStorage.getItem("clientId"),
                            jobRole : self.jobRole()
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
                            document.querySelector('#openAddClientProgress').close();
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
                
                self.configShift = function (event,data) {
                    var validClientShift = self._checkValidationGroup("clientShift");
                    if (validClientShift) {
                        document.querySelector('#openAddClientProgress').open();
                    $.ajax({
                        url: BaseURL + "/jpconfigShiftAdd",
                        type: 'POST',
                        data: JSON.stringify({
                            clientID : sessionStorage.getItem("clientId"),
                            shiftName : self.shiftName(),
                            shiftType : self.shiftType(),
                            startTime : self.startTime(),
                            endTime : self.endTime(),
                            shiftEnd : self.shiftEnd(),
                            clientBreak : self.clientBreak(),
                            clientBreakTime : self.clientBreakTime(),
                            staffBreak : self.staffBreak(),
                            staffBreakTime : self.staffBreakTime(),
                            clientPay : self.clientPay(),
                            rateType : self.rateType()
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
                            configureShift();
                            document.querySelector('#openAddClientProgress').close();
                            self.shiftModule('add-rate');
                            self.shiftName(''),
                            self.shiftType(''),
                            self.startTime(''),
                            self.endTime(''),
                            self.shiftEnd(''),
                            self.clientBreak(''),
                            self.clientBreakTime(''),
                            self.staffBreak(''),
                            self.staffBreakTime(''),
                            self.clientPay(''),
                            self.rateType('')
                            self.selectShift(''),
                            self.selectShiftType(''),
                            self.dayList('')
                        }
                    })
                }
            }
    
                self.AddRate = function (event,data) {
                    var validClientRate = self._checkValidationGroup("clientRateSec"); 
                    if (validClientRate) {
                    document.querySelector('#openAddClientProgress').open();
                    $.ajax({
                        url: BaseURL + "/jpaddClientRate",
                        type: 'POST',
                        data: JSON.stringify({
                            clientID : sessionStorage.getItem("clientId"),
                            shiftName : self.selectShift(),
                            type : self.selectShiftType(),
                            // dayList : self.dayList(),
                            clientRate : self.clientRate()
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
                            self.shiftModule('edit-shift');
                            self.selectShift(''),
                            self.selectShiftType(''),
                            self.dayList([]),
                            self.clientRate(Number('')),
                            self.selectedShiftType('')
                        }
                    })
                }
                }
    
                self.configureShift = function () {
                    StaffJobRole()
                    self.shiftDet([]);
                    self.shiftNameList([]);
                    //self.shifTypeList([]);
                    console.log(self.getDisplayValue(self.selectorSelectedItems())[0])
                    $.ajax({
                        url: self.DepName() + "/jpGetShift",
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
                        success: function (result) {
                             console.log(result)
                             console.log(JSON.parse(result))
                            var data = JSON.parse(result);
                            //for (var i = 0; i < JSON.parse(data).length; i++) {
                                 self.shiftDet.push({'Shift Name' : data[0][2], 'Shift Type' : data[0][3], 'Start Time' : data[0][4], 'End Time' : data[0][5]});
                                //self.shiftNameList.push({'label' : data[0][2], 'value' : data[0][2]});
                                //self.shifTypeList.push({'label' : data[0][3], 'value' : data[0][3]}); 
                             //}
    
                             for (var i = 0; i < data.length; i++) {
                                self.shiftNameList.push({'label' : data[i][2], 'value' : data[i][2]});
                             }
    
                             console.log(self.shiftDet())
                             self.shiftDet.valueHasMutated();
                            return self;
                        }
                    })
                }
    
                self.shiftByName = function () {
                    console.log(self.selectedShift())   
                    self.editshiftDet([]);
                    $.ajax({
                        url: BaseURL + "/jpGetShiftByname",
                        type: 'POST',
                        data: JSON.stringify({
                            shift_name : self.selectedShift()
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
                            self.editBind('yes')
                            data = JSON.parse(data);
                            console.log(data)
                            console.log(data[0][4].split(':')[0].length)
                            self.editShiftType(data[0][3])
                            if(data[0][4].split(':')[0].length==1){
                                self.editStartTime('T0'+data[0][4]+'+05:30')
                            }else if(data[0][4].split(':')[0].length==2){
                                self.editStartTime('T'+data[0][4]+'+05:30')
                            }
                            if(data[0][5].split(':')[0].length==1){
                                self.editEndTime('T0'+data[0][5]+'+05:30')
                            }else if(data[0][5].split(':')[0].length==2){
                                self.editEndTime('T'+data[0][5]+'+05:30')
                            }
                            self.editShiftEnd(data[0][6])
                            self.editClientBreak(data[0][7])
                            self.editClientBreakTime(data[0][8])
                            self.editStaffBreak(data[0][9])
                            self.editStaffBreakTime(data[0][10])
                            self.editClientPay(data[0][11])
                            self.editRateType(data[0][12])
                            //for (var i = 0; i < JSON.parse(data).length; i++) {
                                //self.edtshiftDet.push({'shiftName' : data[0][2], 'shiftType' : data[0][3], 'startTime' : data[0][4], 'endTime' : data[0][5]});
                             //}
    
                             //console.log(self.shiftDet())
                             self.editshiftDet.valueHasMutated();
                            return self;
                        }
                    })
                }
                self.clientConfUpdate = function (event,data) {
                    var validClientConf = self._checkValidationGroup("clientConf");
                    // document.querySelector('#openAddClientDialog').close();
                    // self.addClientMsg('');
                if (validClientConf) {
                    document.querySelector('#openAddClientProgress').open();
                    $.ajax({
                        url: BaseURL + "/jpclientConfUpdate",
                        type: 'POST',
                        data: JSON.stringify({
                            clientId : sessionStorage.getItem("clientId"),
                            timeSheet : self.timeSheet(),
                            photoCapture : self.photoCapture(),
                            fingSign : self.fingSign(),
                            nighShift : self.nighShift(),
                            staffPay : self.staffPay()
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
                            getClientConfig()
                        }
                    })
                }
                }

                self.clientConfSelect = function (event,data) {
                    document.getElementById("clickActive").style.display = "none";
                    document.getElementById("defaultActive").style.display = "block";
                    self.clientButton('conf');
                }
                self.clientShiftSelect = function (event,data) {
                    document.getElementById("defaultActive").style.display = "none";
                    document.getElementById("clickActive").style.display = "block";
                    self.clientButton('rate');
                }

                self.configShiftEditAction = function (event,data) {
                    //alert(self.editStartTime().split('+')[0])
                    var validClientShift = self._checkValidationGroup("clientShift");
                    if (validClientShift) {
                        document.querySelector('#openAddClientProgress').open();
                     $.ajax({
                        url: BaseURL + "/jpclientShiftUpdate",
                        type: 'POST',
                        data: JSON.stringify({
                            clientId : sessionStorage.getItem("clientId"),
                            shiftName : self.selectedShift(),
                            shiftType : self.editShiftType(),
                            startTime : self.editStartTime().split('+')[0],
                            endTime : self.editEndTime().split('+')[0],
                            shiftEnd : self.editShiftEnd(),
                            clientBreak : self.editClientBreak(),
                            clientBreakTime : self.editClientBreakTime(),
                            staffBreak : self.editStaffBreak(),
                            staffBreakTime : self.editStaffBreakTime(),
                            clientPay : self.editClientPay(),
                            rateType : self.editRateType()
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
                            configureShift();
                            StaffJobRole();
                            console.log(data)
                            document.querySelector('#openAddClientProgress').close();
                            location.reload();
                            /* //self.shiftModule('add-rate');
                            document.querySelector('#openAddClientResult').open();
                            self.addClientMsg(data[0]);
                            return self; */
                        }
                    }) 
                }
            }
            function configureShift() {
                self.shiftNameList([]);
                $.ajax({
                    url: BaseURL + "/jpGetShift",
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
                    success: function (result) {
                        var data = JSON.parse(result);
                         for (var i = 0; i < data.length; i++) {
                            self.shiftNameList.push({'label' : data[i][2], 'value' : data[i][2]});
                         }
                         self.shiftNameList.valueHasMutated();
                        return self;
                    }
                })
            }

            function StaffJobRole() {
                self.staffTypeList([]);
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
                        var staffList = jobRoleString.split(",");
                         for (var i = 0; i < staffList.length; i++) {
                            self.staffTypeList.push({'label' : staffList[i], 'value' : staffList[i]});
                         }
                        }
                         self.staffTypeList.valueHasMutated();
                        return self;
                    }
                })
            }
            self.AddRateEditAction = function (event,data) {
                //alert(self.selectShiftType())
                self.selectShiftType('')
                $.ajax({
                    url: BaseURL + "/jpClientRateEdit",
                    type: 'POST',
                    data: JSON.stringify({
                        clientId : sessionStorage.getItem("clientId"),
                        shiftName : self.selectShift(),
                        // shiftType : self.selectShiftType(),
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
                        if(data[0] != ""){
                        self.clientActionBtn('Update')  
                        self.selectShiftType(data[0][0][3])  
                        self.clientRate(Number(data[0][0][4]))
                        self.selectedShiftType(data[1][0][0])
                        // self.dayList([])
                        // self.dayList.push(data[0][0][5])
                        // console.log(self.dayList())
                        // var myArray = self.dayList()[0].split(",");
                        // self.dayList(myArray);
                        }else{
                            self.clientActionBtn('Add')    
                            self.clientRate(Number())
                            self.selectedShiftType(data[1][0][0])
                            // self.dayList([])
                        }
                        /* document.querySelector('#openAddClientProgress').close();
                        self.shitModule('edit-shift');
                        return self; */
                    }
                })
            }

            self.UpdateRate = function (event,data) {
                var validClientRate = self._checkValidationGroup("clientRateSec"); 
                if (validClientRate) {
                document.querySelector('#openAddClientProgress').open();
                $.ajax({
                    url: BaseURL + "/jpUpdateClientRate",
                    type: 'POST',
                    data: JSON.stringify({
                        clientID : sessionStorage.getItem("clientId"),
                        shiftName : self.selectShift(),
                        type : self.selectShiftType(),
                        // dayList : self.dayList(),
                        clientRate : self.clientRate()
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
                        self.shiftModule('edit-shift');
                        self.selectShift(''),
                        self.selectShiftType(''),
                        // self.dayList([]),
                        self.clientRate(Number(''))
                    }
                })
            }
            }


            }
            
            
          }
            return  ClientShiftModel;

        });
