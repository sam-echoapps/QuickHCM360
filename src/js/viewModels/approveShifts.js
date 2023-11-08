define(['ojs/ojcore', 'knockout', 'jquery', 'appController', "ojs/ojmodulerouter-adapter", "ojs/ojarraydataprovider", 'ojs/ojknockout-keyset', "ojs/ojlistitemlayout",
    "ojs/ojknockout", "ojs/ojlistview", "ojs/ojmodule-element", 'ojs/ojvalidationgroup'], 
    function (oj, ko, $, app, ModuleRouterAdapter, ArrayDataProvider,ojknockout_keyset_1) {
    "use strict";
    class ApproveShiftsModel {
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
            self.jobRoleStaff = ko.observable();
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
                self.ShiftPostDet([]);
                $.ajax({
                    url: BaseURL + "/jpGetShiftsToApprove",
                    type: 'POST',
                    data: JSON.stringify({
                        postedShiftId : sessionStorage.getItem("postedShiftId")
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
                                self.requiredStaff(data[i][9])
                                self.jobRole(data[i][10])
                                self.startTime(formattedStartTime)
                                self.endTime(formattedEndTime)
                                self.approvedCount(data[i][16]+"/"+self.requiredStaff())
                                self.ShiftPostDet.push({'id': data[i][0],'client_id': data[i][18],'client_name': data[i][3],'shift_name': data[i][4], 'shift_date' : data[i][5], 'start_time': formattedStartTime, 'end_time' : formattedEndTime, 'staff_name' : data[i][8], 'contactEmail' : data[i][11] , 'contactNumber' : data[i][12] + " " + data[i][13], 'approve_status' : data[i][14], 'staff_id' : data[i][15], 'profile_note' : data[i][17] });
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

            self.approveAllocation = function (event,data) {
                var clickedRowId = data.data.id
                    document.querySelector('#openAllocationProgress').open();
                    $.ajax({
                        url: BaseURL + "/jpStaffApproveAllocation",
                        type: 'POST',
                        data: JSON.stringify({
                            rowId : clickedRowId,
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            if(textStatus == 'timeout'){
                                document.querySelector('#openAllocationProgress').close();
                                document.querySelector('#Timeout').open();
                            }
                        },
                        success: function (data) {
                            document.querySelector('#openAllocationProgress').close();
                            location.reload()
                        }
                    })  
            };

            self.rejectStaff = function (event,data) {
                var clickedRowId = data.data.id
                sessionStorage.setItem("allocationId", clickedRowId);
                document.querySelector('#openRejectionReasonNote').open();
                $.ajax({
                    url: BaseURL + "/jpGetRejectNote",
                    type: 'POST',
                    data: JSON.stringify({
                        rowId : sessionStorage.getItem("allocationId"),
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openRejectionReasonNote').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                       self.rejectionNote(data[0][0][0])
                    }
                })  
            };

            self.confirmReject = function (event,data) {
                var validRejectSec = self._checkValidationGroup("rejectSec")
                if (validRejectSec) {
                    $.ajax({
                        url: BaseURL + "/jpStaffAllocationRejection",
                        type: 'POST',
                        data: JSON.stringify({
                            rowId : sessionStorage.getItem("allocationId"),
                            rejectionNote : self.rejectionNote(),
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            if(textStatus == 'timeout'){
                                document.querySelector('#openRejectionReasonNote').close();
                                document.querySelector('#Timeout').open();
                            }
                        },
                        success: function (data) {
                            document.querySelector('#openRejectionReasonNote').close();
                            location.reload()
                        }
                    })  
                }
            };

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
                       self.jobRoleStaff(data[3])
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
            
            self.approveShiftOpen = function (event,data) {
                document.querySelector('#openApproveReasonNote').open();
                $.ajax({
                    url: BaseURL + "/jpGetRejectNote",
                    type: 'POST',
                    data: JSON.stringify({
                        rowId : sessionStorage.getItem("allocationId"),
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openApproveReasonNote').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                       self.rejectionNote(data[0][0][0])
                    }
                })  
            };

            self.confirmShift = function (event,data) {
                    document.querySelector('#openApproveReasonNote').close();
                    document.querySelector('#openConfirmProgress').open();
                    $.ajax({
                        url: BaseURL + "/jpShiftApprove", 
                        type: 'POST',
                        data: JSON.stringify({
                            rowId : sessionStorage.getItem("postedShiftId"),
                            approveNote : self.approveNote()
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            if(textStatus == 'timeout'){
                                document.querySelector('#openConfirmProgress').close();
                                document.querySelector('#Timeout').open();
                            }
                        },
                        success: function (data) {
                            console.log(data)
                            document.querySelector('#openConfirmProgress').close();
                            //location.reload()
                            self.router.go({path:'shiftManager'})
                        }
                    })  
            };

            self.profileNoteOpen = function (event,data) {
                var clickedRowId = data.data.id
                sessionStorage.setItem("allocationId", clickedRowId);
                document.querySelector('#openProfileNote').open();
                $.ajax({
                    url: BaseURL + "/jpGetProfileNote",
                    type: 'POST',
                    data: JSON.stringify({
                        rowId : sessionStorage.getItem("allocationId"),
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openProfileNote').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                       self.profileNote(data[0][0][0])
                    }
                })  
            };

            self.profileNoteSave = function (event,data) {
                var validProfileSec = self._checkValidationGroup("profileSec")
                if (validProfileSec) {
                    $.ajax({
                        url: BaseURL + "/jpStaffProfileNote",
                        type: 'POST',
                        data: JSON.stringify({
                            rowId : sessionStorage.getItem("allocationId"),
                            profileNote : self.profileNote(),
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            if(textStatus == 'timeout'){
                                document.querySelector('#openProfileNote').close();
                                document.querySelector('#Timeout').open();
                            }
                        },
                        success: function (data) {
                            document.querySelector('#openProfileNote').close();
                            location.reload()
                        }
                    })  
                }
            };

            self.notifyClientClick = function (event,data) {
                document.querySelector('#openAllocationNotifyProgress').open();
                $.ajax({
                    url: BaseURL + "/jpNotifyClientToApprove",
                    type: 'POST',
                    data: JSON.stringify({
                        rowId : sessionStorage.getItem("postedShiftId"),
                        clientID : self.selectedClientId()
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openAllocationNotifyProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                        console.log(data)
                        document.querySelector('#openAllocationNotifyProgress').close();
                        location.reload()
                    }
                })  
            };
        }
        
    }
    return ApproveShiftsModel;
});