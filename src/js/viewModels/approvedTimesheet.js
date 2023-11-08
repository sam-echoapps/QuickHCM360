define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {
 "use strict";
    class ApprovedTimeSheetViewModel {
        constructor(args) {
            var self = this

            self.record = ko.observable();
            self.router = args.parentRouter;

            self.ClientDet = ko.observableArray([]);   
            self.name = ko.observable();
            self.clientName = ko.observable();
            var BaseURL = sessionStorage.getItem("BaseURL")
            self.selectedShift = ko.observable('');
            self.shiftDet = ko.observableArray([]);  
            self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();
            self.clientNameCap = ko.observable(); 
            self.currentDate = ko.observable(); 
            self.TimesheetDet = ko.observableArray([]); 
            self.CancelBehaviorOpt = ko.observable('icon'); 
            self.serialNumber = ko.observable('');
            self.jobRole = ko.observable();
            self.shiftName = ko.observable();
            self.shiftDate = ko.observable();
            self.shiftDay = ko.observable();
            self.checkin = ko.observable();
            self.checkout = ko.observable();
            self.breakTime = ko.observable();
            self.workedHours = ko.observable();
            self.paidHours = ko.observable();
            self.authoriser = ko.observable();
            self.position = ko.observable();
            self.signature = ko.observable();
            self.otherExpenses = ko.observable('');
            self.starRate = ko.observable('');
            self.rating_note = ko.observable('');
            self.selectStartDate = ko.observable('');
            self.selectEndDate = ko.observable('');
            self.groupValid = ko.observable();
            self.selected_status = ko.observable(); 
            self.statusList = ko.observableArray([]);
            self.statusList.push({'value' : 'Approved', 'label' : 'Approved'},{'value' : 'Submitted', 'label' : 'Submitted'});
            self.statusListDP = new ArrayDataProvider(self.statusList, {keyAttributes: 'value'});

            self.connected = function () {
                if (sessionStorage.getItem("userName") == null) {
                    self.router.go({path : 'signin'});
                }
                else {
                    app.onAppSuccess();
                    getApprovedTimesheet()
                }
            }

            function getApprovedTimesheet() {
                self.ClientDet([]);
                document.getElementById('loaderView').style.display='block';
                $.ajax({
                    url: BaseURL  + "/jpGetApprovedTimesheet",
                    type: 'POST',
                    data: JSON.stringify({
                        clientId : sessionStorage.getItem("clientId"),
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
                    document.getElementById('loaderView').style.display='none';
                    document.getElementById('mainView').style.display='block';
                    document.getElementById('contentView').style.display='block';
                    console.log(result[1])
                    var data = JSON.parse(result[0]);
                    console.log(data)
          
                    if(data.length !=0){ 
                        for (var i = 0; i < data.length; i++) {
                            //self.TimesheetDet.push({'id': data[i][0],'shift_name': data[i][1], 'shift_date' : data[i][2], 'shift_time': data[i][3]+"-"+data[i][4], 'staff_name': data[i][5], 'contactEmail': data[i][6], 'contactNumber' : data[i][7]+" "+data[i][8], 'staff_id': data[i][9]  });
                        }
                }
                 self.clientNameCap(result[1][0][0].toUpperCase())
                 self.clientName(result[1][0][0])
                 self.TimesheetDet.valueHasMutated();
                 return self; 
                }
                })
            }
            self.ClientDetDP = new ArrayDataProvider(self.ClientDet, {keyAttributes: 'value'});
            self.dataProvider = new ArrayDataProvider(this.TimesheetDet, { keyAttributes: "id"});

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
                        postedShiftId : data.data.id
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

            self.approvedTimesheetFilter = function (event,data) {
                self.TimesheetDet([]);
                var validSec1 = self._checkValidationGroup("filterSec1");
                var validSec2 = self._checkValidationGroup("filterSec2");
                if (validSec1 && validSec2) {
                document.getElementById('loaderView').style.display='block';
                document.getElementById('invoiceGenerate').style.display="none"
                $.ajax({
                    url: BaseURL  + "/jpGetApprovedTimesheetFilter",
                    type: 'POST',
                    data: JSON.stringify({
                        clientId : sessionStorage.getItem("clientId"),
                        startDate : self.selectStartDate(),
                        endDate : self.selectEndDate(),
                        invoiceId : 'Null'
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
                    self.TimesheetDet([]);
                    document.getElementById('loaderView').style.display='none';
                    console.log(result[1])
                    var data = JSON.parse(result[0]);
                    console.log(data)
          
                    if(data.length !=0){ 
                        document.getElementById('invoiceGenerate').style.display="block"
                        for (var i = 0; i < data.length; i++) {
                            self.TimesheetDet.push({'id': data[i][0],'shift_name': data[i][1], 'shift_date' : data[i][2], 'shift_time': data[i][3]+"-"+data[i][4], 'staff_name': data[i][5], 'contactEmail': data[i][6], 'contactNumber' : data[i][7]+" "+data[i][8], 'staff_id': data[i][9], 'serial_no': 7000 + data[i][10], 'document': result[2][i],  'timesheetId': data[i][10], 'timesheet_status': data[i][12], 'approved_by': 'Approved by : '+data[i][13]  });
                        }
                }
                 self.clientNameCap(result[1][0][0].toUpperCase())
                 self.clientName(result[1][0][0])
                 self.TimesheetDet.valueHasMutated();
                 return self; 
                }
                })
            }
            }

            this.getBadgeClass = (status) => {
                switch (status) {
                    case "Submitted":
                        return "oj-badge oj-badge-info";
                    case "Approved":
                        return "oj-badge oj-badge-success";
                    default:
                        return "oj-badge";
                }
            };

            self.goToProfile = function (event,data) {
                var clickedStaffId = data.data.staff_id
                console.log(clickedStaffId)
                sessionStorage.setItem("staffId", clickedStaffId);
                self.router.go({path:'staffManagerView'})  
                //self.router.go({path:'staffCalenderView'})
            }; 

            self.previewClick = function (event) {
                var data64=event.srcElement.id
                var pdfDataUri = "data:application/octet-stream;charset=utf-16le;base64,"+data64;
        
                var downloadLink = document.createElement("a");
                downloadLink.href = pdfDataUri;
                var fileName = "document.pdf";
                downloadLink.download = fileName;
                downloadLink.click();
        
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

            self.disapproveTimesheet = function (event,data) {
                var clickedRowId = data.data.timesheetId
                    document.querySelector('#openTimesheetDisapproveProgress').open();
                    $.ajax({
                        url: BaseURL + "/jpStaffTimesheetDisapprove",
                        type: 'POST',
                        data: JSON.stringify({
                            rowId : clickedRowId,
                            loggedUser : sessionStorage.getItem("userName")
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            if(textStatus == 'timeout'){
                                document.querySelector('#openTimesheetDisapproveProgress').close();
                                document.querySelector('#Timeout').open();
                            }
                        },
                        success: function (data) {
                            document.querySelector('#openTimesheetDisapproveProgress').close();
                            //location.reload()
                                    self.TimesheetDet([]);
                            var validSec1 = self._checkValidationGroup("filterSec1");
                            var validSec2 = self._checkValidationGroup("filterSec2");
                            if (validSec1 && validSec2) {
                            $.ajax({
                                url: BaseURL  + "/jpGetApprovedTimesheetFilter",
                                type: 'POST',
                                data: JSON.stringify({
                                    clientId : sessionStorage.getItem("clientId"),
                                    startDate : self.selectStartDate(),
                                    endDate : self.selectEndDate(),
                                    invoiceId : 'Null'
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
                                console.log(result[1])
                                var data = JSON.parse(result[0]);
                                console.log(data)
                    
                                if(data.length !=0){ 
                                    document.getElementById('invoiceGenerate').style.display="block"
                                    for (var i = 0; i < data.length; i++) {
                                        self.TimesheetDet.push({'id': data[i][0],'shift_name': data[i][1], 'shift_date' : data[i][2], 'shift_time': data[i][3]+"-"+data[i][4], 'staff_name': data[i][5], 'contactEmail': data[i][6], 'contactNumber' : data[i][7]+" "+data[i][8], 'staff_id': data[i][9], 'serial_no': 7000 + data[i][10], 'document': result[2][i],  'timesheetId': data[i][10], 'timesheet_status': data[i][12], 'approved_by': 'Approved by : '+data[i][13]  });
                                    }
                            }
                            self.clientNameCap(result[1][0][0].toUpperCase())
                            self.clientName(result[1][0][0])
                            self.TimesheetDet.valueHasMutated();
                            return self; 
                            }
                            })
                    }
                        }
                    })  
            };

            self.invoiceCreate  = function (event,data) {
                var clickedRowId = sessionStorage.getItem("clientId")
                console.log(clickedRowId)
                sessionStorage.setItem("clientId", clickedRowId);
                sessionStorage.setItem("startDate", self.selectStartDate());
                sessionStorage.setItem("endDate", self.selectEndDate());
                self.router.go({path:'staffInvoiceCreate'})
            }
            
        }
        
    }
    return ApprovedTimeSheetViewModel;
});