define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {
 "use strict";
    class ShiftsTimeSheetModel {
        constructor(args) {
            var self = this

            self.record = ko.observable();
            self.router = args.parentRouter;

            self.ClientDet = ko.observableArray([]);   
            self.client_name = ko.observable();
            var BaseURL = sessionStorage.getItem("BaseURL")
            self.selectedShift = ko.observable('');
            self.shiftDet = ko.observableArray([]);  
            self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();
            self.clientNameCap = ko.observable(); 
            self.currentDate = ko.observable(); 
            this.formatValues = [
                { id: "ongoing", label: "Today's Shifts" },
                { id: "completed", label: "Completed Shifts" },
            ]; 
            self.shiftList = ko.observable('ongoing');  
            self.ShiftOngoingDet = ko.observableArray([]);  
            self.ShiftCompletedDet = ko.observableArray([]);  
            self.connected = function () {
                if (sessionStorage.getItem("userName") == null) {
                    self.router.go({path : 'signin'});
                }
                else {
                    app.onAppSuccess();
                    //convertImageToText()
                    getCompletedShifts()
                }
            }
            function convertImageToText() {
                $.ajax({
                    // url: BaseURL + "/jpConvertImageToText",
                    type: 'GET',
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
                }
                })
            }

            function getCompletedShifts() {
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
                $.ajax({
                    url: BaseURL  + "/jpGetStaffTimesheetShifts",
                    type: 'POST',
                    data: JSON.stringify({
                        clientId : sessionStorage.getItem("clientId"),
                        currentTime : formattedTime,
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
                        for (var i = 0; i < data.length; i++) {
                            self.ShiftOngoingDet.push({'id': data[i][0],'shift_name': data[i][1], 'department_name' : data[i][2], 'job_role' : data[i][3], 'shift_date' : data[i][4], 'start_time': data[i][5], 'end_time' : data[i][6], 'required_staff' : data[i][7], 'requested_by' : data[i][8], 'gender' : data[i][9], 'staff_extra_pay' : data[i][10], 'client_extra_pay' : data[i][11], 'comments' : data[i][12], 'client_name' : data[i][13], 'shift_id' : data[i][14], 'shift_status' : data[i][15], 'booking_status' : data[i][16]  });
                        }
                }
                var data = JSON.parse(result[2]);
                console.log(data)
                if(data.length !=0){ 
                    for (var i = 0; i < data.length; i++) {
                        self.ShiftCompletedDet.push({'id': data[i][0],'shift_name': data[i][1], 'department_name' : data[i][2], 'job_role' : data[i][3], 'shift_date' : data[i][4], 'start_time': data[i][5], 'end_time' : data[i][6], 'required_staff' : data[i][7], 'requested_by' : data[i][8], 'gender' : data[i][9], 'staff_extra_pay' : data[i][10], 'client_extra_pay' : data[i][11], 'comments' : data[i][12], 'client_name' : data[i][13], 'shift_id' : data[i][14], 'shift_status' : data[i][15], 'booking_status' : data[i][16]  });
                    }
            }
                self.clientNameCap(result[3][0][0].toUpperCase())
                    self.ShiftOngoingDet.valueHasMutated();
                    self.ShiftCompletedDet.valueHasMutated();
                    self.ClientDet.valueHasMutated();
                    return self; 
                }
                })
            }
            self.ClientDetDP = new ArrayDataProvider(self.ClientDet, {keyAttributes: 'value'});
            self.dataProvider1 = new ArrayDataProvider(this.ShiftOngoingDet, { keyAttributes: "id"});
            self.dataProvider2 = new ArrayDataProvider(this.ShiftCompletedDet, { keyAttributes: "id"});

            self.generateOngoingTimesheet = function (event,data) {
                var clickedRowId = data.data.id
                console.log(clickedRowId)
                sessionStorage.setItem("postedShiftId", clickedRowId);
                self.router.go({path:'myOngoingTimesheet'})
            }

            self.generateTimesheet = function (event,data) {
                var clickedRowId = data.data.id
                console.log(clickedRowId)
                sessionStorage.setItem("postedShiftId", clickedRowId);
                self.router.go({path:'myTimesheet'})
            }
            
        }
        
    }
    return ShiftsTimeSheetModel;
});