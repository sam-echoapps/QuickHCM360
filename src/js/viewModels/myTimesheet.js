define(['ojs/ojcore', 'knockout', 'jquery', 'appController', "ojs/ojmodulerouter-adapter", "ojs/ojarraydataprovider", 'ojs/ojknockout-keyset', "ojs/ojlistitemlayout",
    "ojs/ojknockout", "ojs/ojlistview", "ojs/ojmodule-element", 'ojs/ojvalidationgroup',"ojs/ojdatetimepicker","ojs/ojfilepicker"], 
    function (oj, ko, $, app, ModuleRouterAdapter, ArrayDataProvider,ojknockout_keyset_1) {
    "use strict";
    class MyTimesheetModel {
        constructor(args) {
            var self = this

            self.record = ko.observable();
            self.router = args.parentRouter;

            var BaseURL = sessionStorage.getItem("BaseURL");
            self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();
            self.ShiftPostDet = ko.observableArray([]);  
            self.shiftDate = ko.observable();
            self.name = ko.observable();
            self.jobRole = ko.observable();
            self.shiftName = ko.observable();
            self.clientName = ko.observable();
            self.startTime = ko.observable();
            self.endTime = ko.observable();
            self.requiredStaff = ko.observable();
            self.allocateStaff = ko.observable();
            self.CancelBehaviorOpt = ko.observable('icon'); 
            self.gender = ko.observable();
            self.profilePhoto = ko.observable();
            self.dbsNumber = ko.observable();
            self.dbsExpiryDate = ko.observable();  
            self.movingFile_expiry_date = ko.observable();
            self.safeguarding_expiry_date = ko.observable();
            self.health_expiry_date = ko.observable();
            self.food_expiry_date = ko.observable();
            self.support_expiry_date = ko.observable();  
            self.coshh_expiry_date = ko.observable();
            self.safety_expiry_date = ko.observable();
            self.behaviour_expiry_date = ko.observable();
            self.epilepsy_expiry_date = ko.observable();
            self.act_expiry_date = ko.observable();
            self.prevention_expiry_date = ko.observable();
            self.disability_expiry_date = ko.observable();
            self.care_expiry_date = ko.observable();
            self.rejectionNote = ko.observable();  
            self.groupValid = ko.observable();
            self.approvedCount = ko.observable();
            self.actionVal = ko.observable(false);
            self.approveNote = ko.observable('');  
            self.selectedClientId = ko.observable();
            self.profileNote = ko.observable();
            self.notifyClient = ko.observable();
            self.shiftStatus = ko.observable();
            self.checkin = ko.observable();
            self.checkout = ko.observable();
            self.timesheetFileText = ko.observable('Timesheet');
            self.timesheetCustomText = ko.observable('Please upload user timesheet document');
            self.progressText = ko.observable('');
            self.filePath = ko.observable();
            self.typeError = ko.observable();
            self.shiftDay = ko.observable();
            self.breakTime = ko.observable();
            self.workedHours = ko.observable();
            self.paidHours = ko.observable();
            self.authoriser = ko.observable();
            self.position = ko.observable();
            self.signature = ko.observable();
            self.breakTimeFormatted = ko.observable();
            self.workedHoursFormatted = ko.observable();   
            self.paidHoursFormatted = ko.observable();
            self.otherExpenses = ko.observable('');
            self.actionType = ko.observable('');
            self.serialNumber = ko.observable('');
            self.starRate = ko.observable('');
            self.rating_note = ko.observable('');
            self.checkinVal = ko.observable('');

            self.connected = function () {
                if (sessionStorage.getItem("userName") == null) {
                    self.router.go({path : 'signin'});
                }
                else {
                    app.onAppSuccess();
                    getShiftsInfo()
                }
            }

            
            function getShiftsInfo(){
                var formattedCheckinTime;
                var formattedCheckoutTime;
                self.ShiftPostDet([]);
                $.ajax({
                    url: BaseURL + "/jpGetStaffTimesheet",
                    type: 'POST',
                    data: JSON.stringify({
                        postedShiftId : sessionStorage.getItem("postedShiftId"),
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
                    success: function (result) {
                        console.log(result)
                        var data = JSON.parse(result);
                        console.log(data)
                        if(data.length !=0){ 
                            for (var i = 0; i < data.length; i++) {
                                const StartTimeString = data[i][6]
                                const StartTimeParts = StartTimeString.split(":");
                                const startHours = parseInt(StartTimeParts[0], 10);
                                const startMinutes = parseInt(StartTimeParts[1], 10);
                                const startSeconds = parseInt(StartTimeParts[2], 10);
                                const startDate = new Date();
                                startDate.setHours(startHours);
                                startDate.setMinutes(startMinutes);
                                startDate.setSeconds(startSeconds);
                                const formattedStartTime = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

                                const EndTimeString = data[i][7];
                                const EndTimeParts = EndTimeString.split(":");
                                const endHours = parseInt(EndTimeParts[0], 10);
                                const endMinutes = parseInt(EndTimeParts[1], 10);
                                const endSeconds = parseInt(EndTimeParts[2], 10);
                                const endDate = new Date();
                                endDate.setHours(endHours);
                                endDate.setMinutes(endMinutes);
                                endDate.setSeconds(endSeconds);
                                const formattedEndTime = endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                                
                                self.selectedClientId(data[i][1])
                                self.clientName(data[i][3])
                                self.shiftName(data[i][4])
                                self.shiftDate(data[i][5])
                                sessionStorage.setItem("shiftDate", self.shiftDate());
                                self.requiredStaff(data[i][9])
                                self.jobRole(data[i][10])
                                sessionStorage.setItem("jobRole", self.jobRole());
                                self.startTime(formattedStartTime)
                                self.endTime(formattedEndTime)
                                if(data[i][21] != null){
                                    const StartTimeString = data[i][21]
                                    const StartTimeParts = StartTimeString.split(":");
                                    const startHours = parseInt(StartTimeParts[0], 10);
                                    const startMinutes = parseInt(StartTimeParts[1], 10);
                                    const startSeconds = parseInt(StartTimeParts[2], 10);
                                    const startDate = new Date();
                                    startDate.setHours(startHours);
                                    startDate.setMinutes(startMinutes);
                                    startDate.setSeconds(startSeconds);
                                     formattedCheckinTime = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                                    }else{
                                        formattedCheckinTime = 'N/A'
                                    }
                                    if(data[i][22] != null){
                                    const EndTimeString = data[i][22];
                                    const EndTimeParts = EndTimeString.split(":");
                                    const endHours = parseInt(EndTimeParts[0], 10);
                                    const endMinutes = parseInt(EndTimeParts[1], 10);
                                    const endSeconds = parseInt(EndTimeParts[2], 10);
                                    const endDate = new Date();
                                    endDate.setHours(endHours);
                                    endDate.setMinutes(endMinutes);
                                    endDate.setSeconds(endSeconds);
                                    formattedCheckoutTime = endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                                    }else{
                                        formattedCheckoutTime = 'N/A' 
                                    }
                                if(formattedCheckoutTime == 'N/A'){
                                    self.actionType('Save')
                                }else{
                                    self.actionType('View')
                                }

                                self.approvedCount(data[i][16]+"/"+self.requiredStaff())
                                self.ShiftPostDet.push({'id': data[i][0],'client_id': data[i][18],'client_name': data[i][3],'shift_name': data[i][4], 'shift_date' : data[i][5], 'start_time': formattedStartTime, 'end_time' : formattedEndTime, 'staff_name' : data[i][8], 'contactEmail' : data[i][11] , 'contactNumber' : data[i][12] + " " + data[i][13], 'approve_status' : data[i][14], 'staff_id' : data[i][15], 'profile_note' : data[i][17], 'checkin' : formattedCheckinTime, 'checkout' : formattedCheckoutTime, 'document' : data[i][23] });
                                if(data[i][16] < self.requiredStaff()){
                                    self.actionVal(false)
                                }else{
                                    self.actionVal(true)
                                }
                                 if(data[i][19] < self.requiredStaff()){
                                    self.notifyClient(false)
                                 }
                                self.shiftStatus(data[i][20])
                            }
                        }
                }
                }) 
            }
            self.dataProvider1 = new ArrayDataProvider(self.ShiftPostDet, {keyAttributes: 'value'});

            self.profileView = function (event,data) {
                var clickedRowId = data.data.staff_id
                console.log(clickedRowId)
                document.querySelector('#openUserProfileInfo').open();
                var BaseURL = sessionStorage.getItem("BaseURL")
                $.ajax({
                    url: BaseURL+ "/jpStaffProfileInfoGet",
                    type: 'POST',
                    data: JSON.stringify({
                        rowId : clickedRowId,
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openUserProfileInfo').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (result) {
                      console.log(result)
                       data = JSON.parse(result[0]);
                       var data1 = JSON.parse(result[1]);
                       if(data1 == null){
                           self.movingFile_expiry_date('N/A')
                       }else{
                           self.movingFile_expiry_date(data1)
                       }
                       var data2 = JSON.parse(result[2]);
                       if(data2 == null){
                           self.safeguarding_expiry_date('N/A')
                       }else{
                           self.safeguarding_expiry_date(data2)
                       }
                       var data3 = JSON.parse(result[3]);
                       if(data3 == null){
                           self.health_expiry_date('N/A')
                       }else{
                           self.health_expiry_date(data3)
                       }
                       var data4 = JSON.parse(result[4]);
                       if(data4 == null){
                           self.food_expiry_date('N/A')
                       }else{
                           self.food_expiry_date(data4)
                       }
                       var data5 = JSON.parse(result[5]);
                       if(data5 == null){
                           self.support_expiry_date('N/A')
                       }else{
                           self.support_expiry_date(data5)
                       }
                       var data6 = JSON.parse(result[6]);
                       if(data6 == null){
                           self.coshh_expiry_date('N/A')
                       }else{
                           self.coshh_expiry_date(data6)
                       }
                       var data7 = JSON.parse(result[7]);
                       if(data7 == null){
                           self.safety_expiry_date('N/A')
                       }else{
                           self.safety_expiry_date(data7)
                       }
                       var data8 = JSON.parse(result[8]);
                       if(data8 == null){
                           self.behaviour_expiry_date('N/A')
                       }else{
                           self.behaviour_expiry_date(data8)
                       }
                       var data9 = JSON.parse(result[9]);
                       if(data9 == null){
                           self.epilepsy_expiry_date('N/A')
                       }else{
                           self.epilepsy_expiry_date(data9)
                       }
                       var data10 = JSON.parse(result[10]);
                       if(data10 == null){
                           self.act_expiry_date('N/A')
                       }else{
                           self.act_expiry_date(data10)
                       }
                       var data11 = JSON.parse(result[11]);
                       if(data11 == null){
                           self.prevention_expiry_date('N/A')
                       }else{
                           self.prevention_expiry_date(data11)
                       }
                       var data12 = JSON.parse(result[12]);
                       if(data12 == null){
                           self.disability_expiry_date('N/A')
                       }else{
                           self.disability_expiry_date(data12)
                       }
                       var data13 = JSON.parse(result[13]);
                       if(data13 == null){
                           self.care_expiry_date('N/A')
                       }else{
                           self.care_expiry_date(data13)
                       }
                       self.name(data[0] + " " + data[1] + " " + data[2])
                       self.jobRole(data[3])
                       self.gender(data[4])
                       self.profilePhoto(data[5])
                       if(data[6] == null){
                       self.dbsNumber('N/A')
                       }else{
                           self.dbsNumber(data[6])
                       }
                       if(data[7] == null){
                           self.dbsExpiryDate('N/A')
                           }else{
                               self.dbsExpiryDate(data[7])
                           }
                    }
                })  
    
            }

            self.generateTimesheet = function (event,data) {
                refersh()
                var clickedRowId = data.data.staff_id
                console.log(clickedRowId)
                sessionStorage.setItem("timesheetStaffId", clickedRowId);
                document.querySelector('#openAddStaffTimesheet').open();
                var BaseURL = sessionStorage.getItem("BaseURL")
                $.ajax({
                    url: BaseURL+ "/jpStaffEnteredTimesheetInfoGet",
                    type: 'POST',
                    data: JSON.stringify({
                        rowId : clickedRowId,
                        postedShiftId : sessionStorage.getItem("postedShiftId")
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openUserProfileInfo').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (result) {
                      data = JSON.parse(result[0]);
                      console.log(data)
                      if(data!=null){
                        self.checkinVal('Yes')
                      if(data[0].split(':')[0].length==1){
                        self.checkin('T0'+data[0]+'+05:30')
                        }else if(data[0].split(':')[0].length==2){
                            self.checkin('T'+data[0]+'+05:30')
                        }
                    }else{
                        self.checkinVal('No')
                    }
                    }
                })
            }
            
            function refersh(){
                self.checkin('')
                self.checkout('')
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
            self.timesheetSave = function (event,data) {
                var validSec = self._checkValidationGroup("timesheetSec");
                if(validSec){
                document.querySelector('#openAddStaffTimesheet').close();
                document.querySelector('#openTimesheetSaveProgress').open();
                $.ajax({
                    url: BaseURL + "/jpStaffEnteredTimesheetSave",
                    type: 'POST',
                    data: JSON.stringify({
                        clientId : sessionStorage.getItem("clientId"),
                        postedShiftId : sessionStorage.getItem("postedShiftId"),
                        staffId : sessionStorage.getItem("timesheetStaffId"),
                        checkin : self.checkin().split('+')[0],
                        checkout : self.checkout(), 
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openTimesheetSaveProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                        console.log(data)
                        document.querySelector('#openTimesheetSaveProgress').close();
                        location.reload()
                    }
                })
            } 
            }

            
        self.UploadDocument = function (event,data) {
            var clickedRowId = data.data.staff_id
            console.log(clickedRowId)
            sessionStorage.setItem("timesheetStaffId", clickedRowId);
            document.querySelector('#openFileUpload').open();
        }

        self.timesheetDocUpload = function (event,data) {
            var uploadURL = BaseURL + "/css/uploads/";
            const result = event.detail.files;
            const files = result[0];
            var fileName= files.name;
            var filePath= uploadURL+fileName;
            self.filePath(filePath);
    
            console.log(files)
            var fileFormat =files.name.split(".");
            var checkFormat =fileFormat[1];
            
            if(checkFormat == 'jpg' || checkFormat =="jpeg" || checkFormat =="png"){
            self.progressText('Please wait!Uploading....')
            document.querySelector('#openFileUpload').close();
            document.querySelector('#openAddUploadingProgress').open();
            self.typeError('')
            const reader = new FileReader();
            reader.readAsDataURL(files);
            
            reader.onload = ()=>{
                $.ajax({
                    url: BaseURL + "/jpStaffTimesheetDocUplaod",
                    type: 'POST',
                    data: JSON.stringify({
                        file : reader.result,
                        file_name : fileName,
                        staffId : sessionStorage.getItem("timesheetStaffId"),
                        postedShiftId : sessionStorage.getItem("postedShiftId"),
                        clientId : sessionStorage.getItem("clientId"),
                        file_path : filePath
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openAddUploadingProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                        console.log(data)
                        console.log("success")
                        // document.querySelector('#openAddUploadingProgress').close();
                        // document.querySelector('#openFileUpload').close();
                        location.reload()
    
                    }
                })
            }
        }
        else{
            self.typeError('The certificate must be a file of type: pdf, doc, jpeg, jpeg, png')
        }
        console.log(self.typeError())
      }
      self.previewClick = function (event) {
        console.log(event.srcElement.id)  
        var clickedId=event.srcElement.id
        var file=clickedId.replace(/\s/g,'%20');
        document.getElementById(clickedId).href = file;

    }; 
    

       self.viewTimesheet = function (event,data) {
        var clickedRowId = data.data.staff_id
        console.log(clickedRowId)
        document.querySelector('#openStaffTimesheetView').open();
        var BaseURL = sessionStorage.getItem("BaseURL")
        $.ajax({
            url: BaseURL+ "/jpTimesheetGetInfo",
            type: 'POST',
            data: JSON.stringify({
                rowId : clickedRowId,
                postedShiftId : sessionStorage.getItem("postedShiftId")
            }),
            dataType: 'json',
            timeout: sessionStorage.getItem("timeInetrval"),
            context: self,
            error: function (xhr, textStatus, errorThrown) {
                if(textStatus == 'timeout'){
                    document.querySelector('#openUserProfileInfo').close();
                    document.querySelector('#Timeout').open();
                }
            },
            success: function (result) {
                var data = JSON.parse(result);
                console.log(data)
                self.name(data[0]);
                self.jobRole(data[1]);
                self.shiftDate(data[2]);
                self.shiftDay(data[3]);
                const CheckinTimeString = data[4]
                const CheckinTimeParts = CheckinTimeString.split(":");
                const CheckinHours = parseInt(CheckinTimeParts[0], 10);
                const CheckinMinutes = parseInt(CheckinTimeParts[1], 10);
                const CheckinSeconds = parseInt(CheckinTimeParts[2], 10);
                const CheckinDate = new Date();
                CheckinDate.setHours(CheckinHours);
                CheckinDate.setMinutes(CheckinMinutes);
                CheckinDate.setSeconds(CheckinSeconds);
                const formattedCheckinTime = CheckinDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                self.checkin(formattedCheckinTime);
                const CheckoutTimeString = data[5]
                const CheckoutTimeParts = CheckoutTimeString.split(":");
                const CheckoutHours = parseInt(CheckoutTimeParts[0], 10);
                const CheckoutMinutes = parseInt(CheckoutTimeParts[1], 10);
                const CheckoutSeconds = parseInt(CheckoutTimeParts[2], 10);
                const CheckoutDate = new Date();
                CheckoutDate.setHours(CheckoutHours);
                CheckoutDate.setMinutes(CheckoutMinutes);
                CheckoutDate.setSeconds(CheckoutSeconds);
                const formattedCheckoutTime = CheckoutDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                self.checkout(formattedCheckoutTime);
                self.breakTime(data[6]);
                self.workedHours(data[7]);
                self.paidHours(data[8]);
                self.otherExpenses(data[9]);
                self.authoriser(data[10]);
                self.position(data[11]);
                self.signature(data[12]);
                self.clientName(data[13]);
                self.shiftName(data[14]);
                self.serialNumber(7000+data[15]);
                self.starRate(data[16]+'/5');
                self.rating_note(data[17]);
            }
        })  

    }

    self.timesheetPDFGenerate = function (event,data) {
        var BaseURL = sessionStorage.getItem("BaseURL")
        $.ajax({
            url: BaseURL+ "/jpTimesheetPDFGenerate",
            type: 'POST',
            data: JSON.stringify({
               
            }),
            dataType: 'json',
            timeout: sessionStorage.getItem("timeInetrval"),
            context: self,
            error: function (xhr, textStatus, errorThrown) {
                if(textStatus == 'timeout'){
                    document.querySelector('#openUserProfileInfo').close();
                    document.querySelector('#Timeout').open();
                }
            },
            success: function (data) {
                console.log(data)
            }
        })  
       }
          
        }
        
    }
    return MyTimesheetModel;
});