define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {
    class CompanyCalendarViewModel {
        constructor(args) {
            var self = this            
            self.router = args.parentRouter;

            self.dates = ko.observable();
            self.selectHolidayDate = ko.observable();
            self.CancelBehaviorOpt = ko.observable('icon');
            self.groupValid = ko.observable(); 
            self.holidayType = ko.observable(); 
            self.holidayTypeList = ko.observableArray([]);
            self.holidayTypeList.push({'value' : 'Bank Holiday', 'label' : 'Bank Holiday'},{'value' : 'Special Holiday', 'label' : 'Special Holiday'});
            self.holidayTypeDP = new ArrayDataProvider(self.holidayTypeList, {keyAttributes: 'value'});
            self.comments = ko.observable(); 
            var BaseURL = sessionStorage.getItem("BaseURL");
            self.companyHolidayDet = ko.observableArray([]);
            self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();
            self.checkVal = ko.observable(); 
            self.listData = ko.observable(); 
            self.currentDate = ko.observable(); 
            self.holidayName = ko.observable();

            self.connected = function () {
                if (sessionStorage.getItem("userName") == null) {
                    self.router.go({path : 'signin'});
                }
                else {
                    app.onAppSuccess();
                    getCompanyHoliday()
                }
            }
            
            function getCompanyHoliday() {
                self.companyHolidayDet([]);
                var BaseURL = sessionStorage.getItem("BaseURL")
                $.ajax({
                    url: BaseURL + "/jpCompanyHolidayGet",
                    type: 'GET',
                   /*  data: JSON.stringify({
                        staffId : sessionStorage.getItem("staffId"),
                    }), */
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
                         var holidayDateData = []
                     for (var i = 0; i < data.length; i++) {
                             holidayDateData.push({'holiday_type': data[i][2], 'holiday_date': data[i][3]});
                            //console.log(data[i][2])
                            var valuesAsString = JSON.stringify(holidayDateData);
                        sessionStorage.setItem('holidayDateData', valuesAsString);
                        self.companyHolidayDet.push({'id': data[i][0], 'holiday_name': data[i][1], 'holiday_type': data[i][2], 'holiday_date' : data[i][3], 'comments' : data[i][4] }); 
                    } 
                    const CurrentDate = new Date(); 
                    let currentYear= CurrentDate.getFullYear(); 
                    let currentMonth= CurrentDate.getMonth()+1; 
                    let currentDay= CurrentDate.getDate(); 
                    //console.log(CurrentDate); 
                    
                    if(currentMonth<10){
                        currentMonth = '0'+currentMonth;
                    }       
                    if(currentDay<10){
                        currentDay = '0'+currentDay;
                    }
                    self.currentDate(currentYear+'-'+currentMonth+'-'+currentDay)
        
                    //console.log(self.currentDate())
                    self.dates(currentYear+'-'+currentMonth+'-'+currentDay)

                    self.companyHolidayDet.valueHasMutated();
                    return self;  
                }else{
                    const CurrentDate = new Date(); 
                    let currentYear= CurrentDate.getFullYear(); 
                    let currentMonth= CurrentDate.getMonth()+1; 
                    let currentDay= CurrentDate.getDate(); 
                    //console.log(CurrentDate); 
                    
                    if(currentMonth<10){
                        currentMonth = '0'+currentMonth;
                    }       
                    if(currentDay<10){
                        currentDay = '0'+currentDay;
                    }
                    self.currentDate(currentYear+'-'+currentMonth+'-'+currentDay)
        
                    //console.log(self.currentDate())
                }
            }
                })
            }
            self.dataProvider1 = new ArrayDataProvider(self.companyHolidayDet, { keyAttributes: "id"});

            self.availableDate = function (event,data) {
                
            }
            self.HolidayDateAdd = function (event,data) {
                document.querySelector('#openAddHoliday').open();
                self.checkVal(true)
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
            self.confirmHoliday = function (event,data) {
                var validSec = self._checkValidationGroup("holidaySec");
                if(validSec){
                    document.querySelector('#openAddHoliday').close();
                    document.querySelector('#openSaveConfirm').open();
            }
            }

            self.saveHoliday = function (event,data) {
               if(self.comments() ==undefined){
                    self.comments('')
               }
                document.querySelector('#openSaveConfirm').close();
                document.querySelector('#openAddHolidayProgress').open();
                $.ajax({
                    url: BaseURL + "/jpCompanyHolidaySave",
                    type: 'POST',
                    data: JSON.stringify({
                        holiday_date : self.selectHolidayDate(),
                        holiday_type : self.holidayType(),
                        holiday_name : self.holidayName(),
                        comments : self.comments()
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openAddHolidayProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                        document.querySelector('#openAddHolidayProgress').close();
                        location.reload()
                    }
                })  
            }
            self.editAvailability = function (event,data) {
                var clickedRowId = data.data.id
                //console.log(clickedRowId)
                sessionStorage.setItem("holidayId", clickedRowId);
                self.checkVal(false)
                if(clickedRowId !=undefined){
                    document.querySelector('#openAddHoliday').open();
                    $.ajax({
                        url: BaseURL + "/jpEditHolidayDetails",
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
                            self.selectHolidayDate(data[0][3])
                            self.holidayType(data[0][2])
                            self.holidayName(data[0][1])
                            self.comments(data[0][4])
                    }
                    })
    
                }         
            }
            self.confirmHolidayUpdate = function (event,data) {
                var validSec = self._checkValidationGroup("holidaySec");
                if(validSec){
                    document.querySelector('#openAddHoliday').close();
                    document.querySelector('#openUpdateConfirm').open();
            }
            }
            self.updateHoliday = function (event,data) {
                if(self.comments() ==undefined){
                     self.comments('')
                }
                 document.querySelector('#openUpdateConfirm').close();
                 document.querySelector('#openAddHolidayProgress').open();
                 $.ajax({
                     url: BaseURL + "/jpCompanyHolidateUpdate",
                     type: 'POST',
                     data: JSON.stringify({
                         rowId : sessionStorage.getItem("holidayId"),
                         holiday_date : self.selectHolidayDate(),
                         holiday_type : self.holidayType(),
                         holiday_name : self.holidayName(),
                         comments : self.comments()
                     }),
                     dataType: 'json',
                     timeout: sessionStorage.getItem("timeInetrval"),
                     context: self,
                     error: function (xhr, textStatus, errorThrown) {
                         if(textStatus == 'timeout'){
                             document.querySelector('#openAddHolidayProgress').close();
                             document.querySelector('#Timeout').open();
                         }
                     },
                     success: function (data) {
                         document.querySelector('#openAddHolidayProgress').close();
                         location.reload()
                     }
                 })  
             }
             self.deleteConfirm = function (event,data) {
                var clickedRowId = data.data.id
                sessionStorage.setItem("holidayId", clickedRowId);
                //console.log(clickedRowId)
                if(clickedRowId !=undefined){
                    document.querySelector('#openDeleteConfirm').open();
                }         
               
            }
            self.deleteHoliday = function (event,data) {
                    document.querySelector('#openDeleteConfirm').close();
                    document.querySelector('#openDeleteHolidayProgress').open();
                     $.ajax({
                        url: BaseURL + "/jpDeleteCompanyHoliday",
                        type: 'POST',
                        data: JSON.stringify({
                            rowId : sessionStorage.getItem("holidayId")
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
                            document.querySelector('#openDeleteHolidayProgress').close();
                            sessionStorage.removeItem('holidayDateData')
                            location.reload()
                    }
                    })           
               
            }
            self.dayFormatter = ko.observable((dateInfo) => {
                //console.log(dateInfo)
                let month = dateInfo.month;
                let date = dateInfo.date;
                let fullYear = dateInfo.fullYear;
                console.log(sessionStorage.getItem("holidayDateData"))
                var getValue = sessionStorage.getItem('holidayDateData');
                var holidayDateDataList = JSON.parse(getValue);
                console.log(holidayDateDataList)
                if(holidayDateDataList != null){
                var len =holidayDateDataList.length;
                for(var i=0;i<len;i++){
                    let da = holidayDateDataList[i].holiday_date;
                    let d = new Date(Date.parse(da));
                    var mont = d.getMonth()+1;
                    var year = d.getFullYear();
                    var day = d.getDate();
                    var dates = new Date(holidayDateDataList[i].holiday_date);

                    var holidayDay = dates.getDate();
                    var holidayMonth = dates.getMonth() + 1; // Month value starts from 0 (January)
                    var year1 = dates.getFullYear();
                    
                    if (month == holidayMonth && date == holidayDay) {
                       if(holidayDateDataList[i].holiday_type == 'Bank Holiday'){
                        return {
                            className: 'bank-holiday',
                            tooltip: holidayDateDataList[i].holiday_type
                        };
                    } 
                    if(holidayDateDataList[i].holiday_type == 'Special Holiday'){
                        return {
                            className: 'special-holiday',
                            tooltip: holidayDateDataList[i].holiday_type
                        };
                    } 
                }
                }          
            
               
                
               /*  if (fullYear == 2014 && month == 1 && date != 1) {
                    return { disabled: true };
                } */
                //return null; 
            }
            });

            self.dayFormatterInput = ko.observable((dateInfo) => {
                let month = dateInfo.month;
                let date = dateInfo.date;
                let fullYear = dateInfo.fullYear;
                console.log(sessionStorage.getItem("holidayDateData"))
                var getValue = sessionStorage.getItem('holidayDateData');
                var holidayDateDataList = JSON.parse(getValue);
                if(holidayDateDataList != null){
                var len =holidayDateDataList.length;
                for(var i=0;i<len;i++){
                    let da = holidayDateDataList[i].holiday_date;
                    let d = new Date(Date.parse(da));
                    var mont = d.getMonth()+1;
                    var year = d.getFullYear();
                    var day = d.getDate();
                    var dates = new Date(holidayDateDataList[i].holiday_date);

                    var holidayDay = dates.getDate();
                    var holidayMonth = dates.getMonth() + 1; // Month value starts from 0 (January)
                    var year1 = dates.getFullYear();
                    if (month == holidayMonth && date == holidayDay) {
                        return { disabled: true };
                    }
                    /* if (month == availableMonth && date == availableDay) {
                        return {
                            className: 'available-day',
                            tooltip: 'Available Day'
                        };
                    }  */
                }          
            
               
               /*  if (fullYear <= currentYear && date <= 10) {
                    return { disabled: true };
                }
                return null;  */
            }
            });
        }
        
    }
    return CompanyCalendarViewModel;
});