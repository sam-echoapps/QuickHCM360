define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {
    class ShiftManagerViewModel {
        constructor(args) {
            var self = this

            self.DepName = args.routerState.detail.dep_url;
            self.DepType = args.routerState.detail.dep_type;
                
            self.router = args.parentRouter;

            self.groupValid = ko.observable();
            self.ClientDet = ko.observableArray([]);   
            self.client_name = ko.observable();
            self.client_name_filter = ko.observable();
            self.CancelBehaviorOpt = ko.observable('icon');
            self.selectShiftDate = ko.observable();
            self.currentDate = ko.observable(); 
            self.jobRoleList = ko.observableArray([]);  
            self.selected_job_role = ko.observable('');   
            self.selected_shift_type = ko.observable();   
            var BaseURL = sessionStorage.getItem("BaseURL")
            self.selectedShift = ko.observable('');
            self.shiftDet = ko.observableArray([]);  
            self.startTime = ko.observable();
            self.endTime = ko.observable();
            self.required_staff = ko.observable();
            self.departmentDet = ko.observableArray([]);  
            self.department_name = ko.observable();
            self.requested_by = ko.observable();
            self.requestedList = ko.observableArray([]);
            // self.requestedList.push(
            //     {'value' : 'Requested by Client', 'label' : 'Requested by Client'},
            //     {'value' : 'On behalf of client', 'label' : 'On behalf of client'},
            // );
            // self.requestedDetDP = new ArrayDataProvider(self.requestedList, {keyAttributes: 'value'});
            // self.gender = ko.observable('All');
            self.staff_extra_pay = ko.observable();
            self.client_extra_pay = ko.observable();
            self.comments = ko.observable();
            self.ShiftPostDet = ko.observableArray([]);  
            self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();
            self.actionVal = ko.observable();
            self.genderList = ko.observableArray([]);  
            self.genderList.push(
                {'value' : 'Any', 'label' : 'Any'},
                {'value' : 'Male', 'label' : 'Male'},
                {'value' : 'Female', 'label' : 'Female'},  
                {'value' : 'Other', 'label' : 'Other'}
            );
            self.genderListDP = new ArrayDataProvider(self.genderList, {keyAttributes: 'value'});
            self.gender = ko.observable();
            self.staff_name = ko.observable();
            self.staffDet = ko.observableArray([]); 
            this.formatValues = [
                { id: "pending", label: "Pending Shifts" },
                { id: "confirmed", label: "Confirmed Shifts" },
                { id: "completed", label: "Completed Shifts" },
            ]; 
            self.shiftList = ko.observable('pending');  
            self.ConfirmedShiftPostDet = ko.observableArray([]);  
            self.CompletedShiftPostDet = ko.observableArray([]);  

            self.connected = function () {
                if (sessionStorage.getItem("userName") == null) {
                    self.router.go({path : 'signin'});
                }
                else {
                    app.onAppSuccess();
                    getClientNames()
                }
            }
            
            function getClientNames() {
                var currentDate = new Date();
                var year = currentDate.getFullYear();
                var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                var day = currentDate.getDate().toString().padStart(2, '0');
                var formattedDate = year + "-" + month + "-" + day;
                console.log("Current Date:", formattedDate);
                
                var currentTime = new Date();
                var hours = currentTime.getHours().toString().padStart(2, '0');
                var minutes = currentTime.getMinutes().toString().padStart(2, '0');
                var seconds = currentTime.getSeconds().toString().padStart(2, '0');
                var formattedTime = hours + ":" + minutes + ":" + seconds;
                console.log("Formatted Time:", formattedTime);

                self.ClientDet([]);
                self.ShiftPostDet([]);
                $.ajax({
                    url: BaseURL  + "/jpClientNamesGet",
                    type: 'POST',
                    dataType: 'json',
                    data: JSON.stringify({
                        currentDate : formattedDate,
                        currentTime : formattedTime
                    }),
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout' || textStatus == 'error'){
                            document.querySelector('#TimeoutSup').open();
                        }
                    },
                    success: function (result) {
                    console.log(result)
                    const CurrentDate = new Date(); 
                    let currentYear= CurrentDate.getFullYear(); 
                    let currentMonth= CurrentDate.getMonth()+1; 
                    let currentDay= CurrentDate.getDate(); 
                    
                    if(currentMonth<10){
                        currentMonth = '0'+currentMonth;
                    }       
                    if(currentDay<10){
                        currentDay = '0'+currentDay;
                    }
                    self.currentDate(currentYear+'-'+currentMonth+'-'+currentDay)
                    for (var i = 0; i < result[0].length; i++) {
                        self.ClientDet.push({'value' : result[0][i][0], 'label' : result[0][i][1]});
                    }
                   //console.log(self.ClientDet())
                   var data = JSON.parse(result[1]);
                    console.log(data)
                    if(data.length !=0){ 
                        self.ShiftPostDet([]);
                        for (var i = 0; i < data.length; i++) {
                            self.ShiftPostDet.push({'id': data[i][0],'shift_name': data[i][1], 'department_name' : data[i][2], 'job_role' : data[i][3], 'shift_date' : data[i][4], 'start_time': data[i][5], 'end_time' : data[i][6], 'required_staff' : data[i][7], 'requested_by' : data[i][8], 'gender' : data[i][9], 'staff_extra_pay' : data[i][10], 'client_extra_pay' : data[i][11], 'comments' : data[i][12], 'client_name' : data[i][13], 'shift_id' : data[i][14], 'shift_status' : data[i][15], 'booking_status' : data[i][16], 'client_id' : data[i][17], 'shift_time' : data[i][5] + "-" + data[i][6]  });
                        }
                }
                var data2 = JSON.parse(result[2]);
                    console.log(data2)
                    if(data2.length !=0){ 
                        for (var i = 0; i < data2.length; i++) {
                            self.ConfirmedShiftPostDet.push({'id': data2[i][0],'shift_name': data2[i][1], 'department_name' : data2[i][2], 'job_role' : data2[i][3], 'shift_date' : data2[i][4], 'start_time': data2[i][5], 'end_time' : data2[i][6], 'required_staff' : data2[i][7], 'requested_by' : data2[i][8], 'gender' : data2[i][9], 'staff_extra_pay' : data2[i][10], 'client_extra_pay' : data2[i][11], 'comments' : data2[i][12], 'client_name' : data2[i][13], 'shift_id' : data2[i][14], 'shift_status' : data2[i][15], 'booking_status' : data2[i][16], 'client_id' : data2[i][17], 'shift_time' : data2[i][5] + "-" + data2[i][6]  });
                        }
                }
                var data3 = JSON.parse(result[3]);
                    console.log(data3)
                    if(data3.length !=0){ 
                        for (var i = 0; i < data3.length; i++) {
                            self.CompletedShiftPostDet.push({'id': data3[i][0],'shift_name': data3[i][1], 'department_name' : data3[i][2], 'job_role' : data3[i][3], 'shift_date' : data3[i][4], 'start_time': data3[i][5], 'end_time' : data3[i][6], 'required_staff' : data3[i][7], 'requested_by' : data3[i][8], 'gender' : data3[i][9], 'staff_extra_pay' : data3[i][10], 'client_extra_pay' : data3[i][11], 'comments' : data3[i][12], 'client_name' : data3[i][13], 'shift_id' : data3[i][14], 'shift_status' : data3[i][15], 'booking_status' : data3[i][16], 'client_id' : data3[i][17], 'shift_time' : data3[i][5] + "-" + data3[i][6]  });
                        }
                }
                    self.ShiftPostDet.valueHasMutated();  
                    self.ClientDet.valueHasMutated();
                    self.ConfirmedShiftPostDet.valueHasMutated();  
                    self.CompletedShiftPostDet.valueHasMutated();
                    return self; 
                }
                })
            }
            self.ClientDetDP = new ArrayDataProvider(self.ClientDet, {keyAttributes: 'value'});
            
            self.filterPostedShift = function (event,data) {
                self.ShiftPostDet([]);
                var filterSec = self._checkValidationGroup("filterSec");
                if (filterSec) {
                    self.ShiftPostDet([]);
                 $.ajax({
                   url: BaseURL + "/jpGetPostShiftDetails",
                   type: 'POST',
                   data: JSON.stringify({
                       clientId : self.client_name_filter()
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
                    var data = JSON.parse(result);
                    console.log(data)
                    if(data[0].length !=0){ 
                        for (var i = 0; i < data[0].length; i++) {
                            self.ShiftPostDet.push({'id': data[i][0],'shift_name': data[i][1], 'department_name' : data[i][2], 'job_role' : data[i][3], 'shift_date' : data[i][4], 'start_time': data[i][5], 'end_time' : data[i][6], 'required_staff' : data[i][7], 'requested_by' : data[i][8], 'gender' : data[i][9], 'staff_extra_pay' : data[i][10], 'client_extra_pay' : data[i][11], 'comments' : data[i][12], 'client_name' : data[i][13], 'shift_id' : data[i][14], 'shift_status' : data[i][15], 'booking_status' : data[i][16], 'client_id' : data[i][17]  });
                        }
                }
                    self.ShiftPostDet.valueHasMutated();
                    return self;                    
                }
               }) 
           }
        }
           self.dataProvider1 = new ArrayDataProvider(this.ShiftPostDet, { keyAttributes: "id"});
           self.dataProvider2 = new ArrayDataProvider(this.ConfirmedShiftPostDet, { keyAttributes: "id"});
           self.dataProvider3 = new ArrayDataProvider(this.CompletedShiftPostDet, { keyAttributes: "id"});

            self.postNewShift = function () {
                document.querySelector('#openPostNewShiftDialog').open();
                self.actionVal('Add')
                refresh();
            }

            
            self.clientJobRole = function (event,data) {
                self.jobRoleList([])
                self.shiftDet([]);
                self.departmentDet([]);
                self.requestedList([]);
               if(self.client_name() !=undefined){
               $.ajax({
                url: BaseURL + "/jpGetJobRoleShift",
                type: 'POST',
                data: JSON.stringify({
                    clientId : self.client_name()
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
                    // var myArray = data[0][0][2].split(",");
                    // //console.log(myArray)
                    // self.jobRoleList([])
                    // for (var i = 0; i < myArray.length; i++) {
                    //    // console.log(self.jobRoleList())
                    //     self.jobRoleList.push({'value' : myArray[i], 'label' : myArray[i]});
                    // }
                    for (var i = 0; i < data[1].length; i++) {
                        self.shiftDet.push({'label' : data[1][i][1], 'value' : data[1][i][0]});
                     }
                     for (var i = 0; i < data[2].length; i++) {
                        self.departmentDet.push({'label' : data[2][i][1], 'value' : data[2][i][0]});
                     }
                     for (var i = 0; i < data[3].length; i++) {
                        self.requestedList.push({'label' : data[3][i][0], 'value' : data[3][i][0]});
                     }
                    self.jobRoleList.valueHasMutated();
                    self.shiftDet.valueHasMutated();
                    self.departmentDet.valueHasMutated();
                    self.requestedList.valueHasMutated();
                     return self;
            }
            }) 
            }
        }
            self.JobRoleDP = new ArrayDataProvider(self.jobRoleList, {keyAttributes: 'value'});
            self.shiftNameDP = new ArrayDataProvider(self.shiftDet, {keyAttributes: 'value'});
            self.DepartmentDetDP = new ArrayDataProvider(self.departmentDet, {keyAttributes: 'value'});
            self.requestedDetDP = new ArrayDataProvider(self.requestedList, {keyAttributes: 'value'});

            self.shiftTimeGet = function (event,data) {
               if(self.selectedShift() !=''){
               $.ajax({
                url: BaseURL + "/jpGetShiftTime",
                type: 'POST',
                data: JSON.stringify({
                    clientId : self.client_name(),
                    shiftId : self.selectedShift()
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
                    var data = JSON.parse(result[0]);
                    console.log(data)
                    if(data[0][0].split(':')[0].length==1){
                        self.startTime('T0'+data[0][0]+'+05:30')
                    }else if(data[0][0].split(':')[0].length==2){
                        self.startTime('T'+data[0][0]+'+05:30')
                    }
                    if(data[0][1].split(':')[0].length==1){
                        self.endTime('T0'+data[0][1]+'+05:30')
                    }else if(data[0][1].split(':')[0].length==2){
                        self.endTime('T'+data[0][1]+'+05:30')
                    }
                    self.selected_shift_type(data[0][3])
                    self.selected_job_role(result[1][0])
            }
            }) 
            }
        }

        self.onlyNumberKey = (event) => {
            let charCode = event.which ? event.which : event.keyCode;
            let char = String.fromCharCode(charCode);
            // Only allow ".0123456789" (and non-display characters)
            let replacedValue = char.replace(/[^0-9\.]/g, "");
            if (char !== replacedValue) {
                event.preventDefault();
            }
        };

        self.onlyNumberKeyDigits = (event) => {
            let charCode = event.which ? event.which : event.keyCode;
            let char = String.fromCharCode(charCode);
            // Only allow ".0123456789" (and non-display characters)
            let replacedValue = char.replace(/[^0-9]/g, "");
            if (char !== replacedValue) {
                event.preventDefault();
            }
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
        self.postShiftSave = function (event,data) {
            var validPostSec1 = self._checkValidationGroup("postShiftSec1");
            var validPostSec2 = self._checkValidationGroup("postShiftSec2");
            if (validPostSec1 && validPostSec2) {
                if(self.staff_extra_pay() == undefined){
                    self.staff_extra_pay('')
                }
                if(self.client_extra_pay() == undefined){
                    self.client_extra_pay('')
                }
                if(self.comments() == undefined){
                    self.comments('')
                }
                const startTime = self.startTime().split("+")[0];
                const endTime = self.endTime().split("+")[0];
                document.querySelector('#openPostNewShiftDialog').close();
                document.querySelector('#openPostShiftProgress').open();
            $.ajax({
                url: BaseURL + "/jpPostShiftSave",
                type: 'POST',
                data: JSON.stringify({
                    clientID : self.client_name(),
                    shiftId : self.selectedShift(),
                    departmentId : self.department_name(),
                    jobRole : self.selected_job_role(),
                    shiftType : self.selected_shift_type(),
                    shiftDate : self.selectShiftDate(),
                    startTime : startTime,
                    endTime : endTime,
                    required_staff : self.required_staff(),
                    requested_by : self.requested_by(),
                    gender : self.gender(),
                    staff_extra_pay : self.staff_extra_pay(),
                    client_extra_pay : self.client_extra_pay(),
                    comments : self.comments()
                }),
                dataType: 'json',
                timeout: sessionStorage.getItem("timeInetrval"),
                context: self,
                error: function (xhr, textStatus, errorThrown) {
                    if(textStatus == 'timeout'){
                        document.querySelector('#openPostShiftProgress').close();
                        document.querySelector('#Timeout').open();
                    }
                },
                success: function (data) {
                    console.log(data)
                    document.querySelector('#openPostShiftProgress').close();
                    location.reload()
                }
            })
        }
    }

    self.editPostedShift = function (event,data) {
        //alert(self.selectedShift())  
        //alert(self.selected_job_role())
        console.log(data) 
        self.selected_job_role('')
        self.selectedShift(0) 
        var clickedRowId = data.data.id
        console.log(clickedRowId)
        sessionStorage.setItem("postedShiftId", clickedRowId);
        self.actionVal('Update')
        if(clickedRowId !=undefined){
            // self.selected_job_role('')
            // self.selectedShift(0) 
            document.querySelector('#openPostNewShiftDialog').open();
            $.ajax({
                url: BaseURL + "/jpEditPostedShiftDetails",
                type: 'POST',
                data: JSON.stringify({
                    rowId : clickedRowId
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
                    var data = JSON.parse(result);
                    console.log(data)
                    self.client_name(data[0][0]) 
                    // self.selectedShift(data[0][1])  
                    self.selectedShift(data[0][13])  
                    self.department_name(data[0][14])
                    self.selected_job_role(data[0][3])
                    self.selectShiftDate(data[0][4])
                    if(data[0][5].split(':')[0].length==1){
                        self.startTime('T0'+data[0][5]+'+05:30')
                    }else if(data[0][5].split(':')[0].length==2){
                        self.startTime('T'+data[0][5]+'+05:30')
                    }
                    if(data[0][6].split(':')[0].length==1){
                        self.endTime('T0'+data[0][6]+'+05:30')
                    }else if(data[0][6].split(':')[0].length==2){
                        self.endTime('T'+data[0][6]+'+05:30')
                    }
                    self.required_staff(data[0][7])
                    self.requested_by(data[0][8])
                    self.gender(data[0][9])
                    self.staff_extra_pay(data[0][10])
                    self.client_extra_pay(data[0][11])
                    self.comments(data[0][12]) 
                    self.selected_shift_type(data[0][15]) 
            }
            })
            

        }         
    }
    self.postShiftUpdate = function (event,data) {
        var validPostSec1 = self._checkValidationGroup("postShiftSec1");
        var validPostSec2 = self._checkValidationGroup("postShiftSec2");
        if (validPostSec1 && validPostSec2) {
            if(self.staff_extra_pay() == undefined){
                self.staff_extra_pay('')
            }
            if(self.client_extra_pay() == undefined){
                self.client_extra_pay('')
            }
            if(self.comments() == undefined){
                self.comments('')
            }
            const startTime = self.startTime().split("+")[0];
            const endTime = self.endTime().split("+")[0];
            document.querySelector('#openPostNewShiftDialog').close();
            document.querySelector('#openUpdatePostShiftProgress').open();
        $.ajax({
            url: BaseURL + "/jpPostShiftUpdate",
            type: 'POST',
            data: JSON.stringify({
                rowId : sessionStorage.getItem("postedShiftId"),
                clientID : self.client_name(),
                shiftId : self.selectedShift(),
                departmentId : self.department_name(),
                jobRole : self.selected_job_role(),
                shiftType : self.selected_shift_type(),
                shiftDate : self.selectShiftDate(),
                startTime : startTime,
                endTime : endTime,
                required_staff : self.required_staff(),
                requested_by : self.requested_by(),
                gender : self.gender(),
                staff_extra_pay : self.staff_extra_pay(),
                client_extra_pay : self.client_extra_pay(),
                comments : self.comments()
            }),
            dataType: 'json',
            timeout: sessionStorage.getItem("timeInetrval"),
            context: self,
            error: function (xhr, textStatus, errorThrown) {
                if(textStatus == 'timeout'){
                    document.querySelector('#openUpdatePostShiftProgress').close();
                    document.querySelector('#Timeout').open();
                }
            },
            success: function (data) {
                console.log(data)
                document.querySelector('#openUpdatePostShiftProgress').close();
                location.reload()
            }
        })
    }
}
            function refresh(){  
                self.client_name('')  
                self.selectedShift('')  
                self.department_name('')
                self.selected_job_role('')
                self.selected_shift_type('')
                self.selectShiftDate('')
                self.startTime('')
                self.endTime('')
                self.required_staff('')
                self.requested_by('')
                self.gender('')
                self.staff_extra_pay('')
                self.client_extra_pay('')
                self.comments('')  
            }

            self.deleteConfirm = function (event,data) {
                //var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
                var clickedRowId = data.data.id
                sessionStorage.setItem("postedShiftId", clickedRowId);
                console.log(clickedRowId)
                if(clickedRowId !=undefined){
                    document.querySelector('#openDeleteConfirm').open();
                }         
               
            }

            self.deletePostedShiftInfo = function (event,data) {
                // var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
                // sessionStorage.setItem("postedShiftId", clickedRowId);
                var clickedRowId = sessionStorage.getItem("postedShiftId");
                console.log(clickedRowId)
                var BaseURL = sessionStorage.getItem("BaseURL");
                if(clickedRowId !=undefined){
                    document.querySelector('#openDeleteConfirm').close();
                    document.querySelector('#openDeletePostedShiftProgress').open();
                     $.ajax({
                        url: BaseURL + "/jpDeletePostedShiftDetails",
                        type: 'POST',
                        data: JSON.stringify({
                            rowId : clickedRowId
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
                            document.querySelector('#openDeletePostedShiftProgress').close();
                            location.reload()
                            /* document.querySelector('#openAddClientResult').open();
                            self.addClientMsg(data[0]);
                            console.log("success") */
                    }
                    })  
    
                }         
               
            }

            
            self.allocateStaff = function (event,data) {
                var clickedRowId = data.data.id
                console.log(clickedRowId)
                sessionStorage.setItem("postedShiftId", clickedRowId);
                self.router.go({path:'staffAllocation'})
            }

            self.approveAllocation = function (event,data) {
                var clickedRowId = data.data.id
                console.log(clickedRowId)
                sessionStorage.setItem("postedShiftId", clickedRowId);
                self.router.go({path:'approveShifts'})
            }

            self.goToProfile = function (event,data) {
                var clickedClientId = data.data.client_id
                console.log(clickedClientId)
                sessionStorage.setItem("clientId", clickedClientId);
                self.router.go({path:'clientManager'})
    
            }; 
        }
        
    }
    return ShiftManagerViewModel;
});