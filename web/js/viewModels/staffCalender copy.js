define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {
    class StaffCalenderViewModel {
        constructor(args) {
            var self = this

            self.DepName = args.routerState.detail.dep_url;
            self.DepType = args.routerState.detail.dep_type;
            self.record = ko.observable();
            self.profileStatus = ko.observable();
                
            self.router = args.parentRouter;

            self.dates = ko.observable();
            self.selectAvailableDate = ko.observable();
            self.CancelBehaviorOpt = ko.observable('icon');
            self.groupValid = ko.observable(); 
            self.shiftType = ko.observable(); 
            self.shiftTypeList = ko.observableArray([]);
            self.shiftTypeList.push({'value' : 'Day Shift', 'label' : 'Day Shift'},{'value' : 'Night Shift', 'label' : 'Night Shift'});
            self.shiftTypeDP = new ArrayDataProvider(self.shiftTypeList, {keyAttributes: 'value'});
            self.comments = ko.observable(); 
            var BaseURL = sessionStorage.getItem("BaseURL");
            self.staffAvailabilityDet = ko.observableArray([]);
            self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();
            self.checkVal = ko.observable(); 
            self.listData = ko.observable(); 

            self.connected = function () {
                if (sessionStorage.getItem("userName") == null) {
                    self.router.go({path : 'signin'});
                }
                else {
                    app.onAppSuccess();
                    getStaffAvailability()
                }
            }
            
            function getStaffAvailability() {
                self.staffAvailabilityDet([]);
                var BaseURL = sessionStorage.getItem("BaseURL")
                $.ajax({
                    url: BaseURL + "/jpStaffAvailabilityGet",
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
                    success: function (result) {
                        var data = JSON.parse(result);
                        if(data.length !=0){
                            self.listData('Yes')
                         var availableDateData = []
                     for (var i = 0; i < data.length; i++) {
                            availableDateData.push(data[i][2]);
                            //console.log(data[i][2])
                            var valuesAsString = JSON.stringify(availableDateData);
                        sessionStorage.setItem('availableDateData', valuesAsString);
                        self.staffAvailabilityDet.push({'id': data[i][0], 'staff_id' : data[i][1],'availability_date': data[i][2], 'shift_type' : data[i][3], 'comments' : data[i][4] }); 
                    } 
                    self.staffAvailabilityDet.valueHasMutated();
                    return self;  
                }
            }
                })
            }
            self.dataProvider1 = new ArrayDataProvider(self.staffAvailabilityDet, { keyAttributes: "id"});

            self.availableDate = function (event,data) {
                if(event.detail.value){
                self.shiftType('')
                self.comments('')
                self.checkVal(true)
                document.querySelector('#openAddAvailability').open();
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
            self.confirmAvailability = function (event,data) {
                var validSec = self._checkValidationGroup("availabilitySec");
                if(validSec){
                    document.querySelector('#openAddAvailability').close();
                    document.querySelector('#openSaveConfirm').open();
            }
            }

            self.saveAvailability = function (event,data) {
               if(self.comments() ==undefined){
                    self.comments('')
               }
                document.querySelector('#openSaveConfirm').close();
                document.querySelector('#openAddAvailabilityProgress').open();
                $.ajax({
                    url: BaseURL + "/jpStaffAvailabilitySave",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId : sessionStorage.getItem("staffId"),
                        available_date : self.dates(),
                        shift_type : self.shiftType(),
                        comments : self.comments()
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openAddAvailabilityProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                        document.querySelector('#openAddAvailabilityProgress').close();
                        location.reload()
                    }
                })  
            }
            self.editAvailability = function (event,data) {
                var clickedRowId = data.data.id
                //console.log(clickedRowId)
                sessionStorage.setItem("availabilityId", clickedRowId);
                self.checkVal(false)
                if(clickedRowId !=undefined){
                    document.querySelector('#openAddAvailability').open();
                    $.ajax({
                        url: BaseURL + "/jpEditAvailabilityDetails",
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
                            //console.log(data)
                            self.selectAvailableDate(data[0][2])
                            self.shiftType(data[0][3])
                            self.comments(data[0][4])
                    }
                    })
    
                }         
            }
            self.confirmAvailabilityUpdate = function (event,data) {
                var validSec = self._checkValidationGroup("availabilitySec");
                if(validSec){
                    document.querySelector('#openAddAvailability').close();
                    document.querySelector('#openUpdateConfirm').open();
            }
            }
            self.updateAvailability = function (event,data) {
                if(self.comments() ==undefined){
                     self.comments('')
                }
                 document.querySelector('#openUpdateConfirm').close();
                 document.querySelector('#openAddAvailabilityProgress').open();
                 $.ajax({
                     url: BaseURL + "/jpStaffAvailabilityUpdate",
                     type: 'POST',
                     data: JSON.stringify({
                         rowId : sessionStorage.getItem("availabilityId"),
                         available_date : self.selectAvailableDate(),
                         shift_type : self.shiftType(),
                         comments : self.comments()
                     }),
                     dataType: 'json',
                     timeout: sessionStorage.getItem("timeInetrval"),
                     context: self,
                     error: function (xhr, textStatus, errorThrown) {
                         if(textStatus == 'timeout'){
                             document.querySelector('#openAddAvailabilityProgress').close();
                             document.querySelector('#Timeout').open();
                         }
                     },
                     success: function (data) {
                         document.querySelector('#openAddAvailabilityProgress').close();
                         location.reload()
                     }
                 })  
             }
             self.deleteConfirm = function (event,data) {
                var clickedRowId = data.data.id
                sessionStorage.setItem("availabilityId", clickedRowId);
                //console.log(clickedRowId)
                if(clickedRowId !=undefined){
                    document.querySelector('#openDeleteConfirm').open();
                }         
               
            }
            self.deleteAvailability = function (event,data) {
                    document.querySelector('#openDeleteConfirm').close();
                    document.querySelector('#openDeleteAvailabilityProgress').open();
                     $.ajax({
                        url: BaseURL + "/jpDeleteStaffAvailability",
                        type: 'POST',
                        data: JSON.stringify({
                            rowId : sessionStorage.getItem("availabilityId")
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
                            document.querySelector('#openDeleteAvailabilityProgress').close();
                            location.reload()
                    }
                    })           
               
            }
            self.dayFormatter = ko.observable((dateInfo) => {
                let month = dateInfo.month;
                let date = dateInfo.date;
                let fullYear = dateInfo.fullYear;
                console.log(sessionStorage.getItem("availableDateData"))
                var getValue = sessionStorage.getItem('availableDateData');
                var availableDateList = JSON.parse(getValue);
                if(availableDateList != null){
                var len =availableDateList.length;
                for(var i=0;i<len;i++){
                    let da = availableDateList[i][0];
                    let d = new Date(Date.parse(da));
                    var mont = d.getMonth()+1;
                    var year = d.getFullYear();
                    var day = d.getDate();
                    var dates = new Date(availableDateList[i]);

                    var availableDay = dates.getDate();
                    var availableMonth = dates.getMonth() + 1; // Month value starts from 0 (January)
                    var year1 = dates.getFullYear();

                    if (month == availableMonth && date == availableDay) {
                        return {
                            className: 'available-day',
                            tooltip: 'Available Day'
                        };
                    } 
                }          
            
               
                
               /*  if (fullYear == 2014 && month == 1 && date != 1) {
                    return { disabled: true };
                } */
                //return null; 
            }
            });
        }
        
    }
    return StaffCalenderViewModel;
});