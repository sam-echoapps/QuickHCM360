define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class StaffAllocationModel {
        constructor(context) {
                var self = this;
                self.startOpened = ko.observable(true);
                self.startToggle = () => self.startOpened(!self.startOpened());
                self.staffDet = ko.observableArray([]);  
                var BaseURL = sessionStorage.getItem("BaseURL")
                self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();
                self.selectedClientId = ko.observable();
                self.shiftDate = ko.observable();
                self.jobRole = ko.observable();
                self.shiftName = ko.observable();
                self.clientName = ko.observable();
                self.startTime = ko.observable();
                self.endTime = ko.observable();
                self.requiredStaff = ko.observable();
                self.allocateStaff = ko.observable();
                self.shiftId = ko.observable();

                self.CancelBehaviorOpt = ko.observable('icon'); 
                self.name = ko.observable();
                self.jobRoleStaff = ko.observable();
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
                var allocateStaffs;
                self.allocatedStaffs = ko.observableArray([]);
                self.allocatedCount = ko.observable();
                self.actionVal = ko.observable();
                self.choiceList = ko.observableArray([]);  
                self.choiceList.push(
                    {'value' : 'Yes', 'label' : 'Yes'},
                    {'value' : 'No', 'label' : 'No'},  
                    {'value' : 'Any', 'label' : 'Any'},  
                );
                self.choiceListDP = new ArrayDataProvider(self.choiceList, {keyAttributes: 'value'});
                self.checkPreferredList = ko.observable();  
                self.checkTransportation = ko.observable();  
                self.visTypeList = ko.observableArray([]);  
                self.visTypeList.push(
                    {'value' : 'All', 'label' : 'All'}, 
                    {'value' : 'Dependant Visa', 'label' : 'Dependant Visa'},
                    {'value' : 'EU Settlement Scheme (EUSS)', 'label' : 'EU Settlement Scheme (EUSS)'},
                    {'value' : 'Graduate Visa', 'label' : 'Graduate Visa'},
                    {'value' : 'High Potential Individual (HPI) visa', 'label' : 'High Potential Individual (HPI) visa'},
                    {'value' : 'Not Applicable', 'label' : 'Not Applicable'},
                    {'value' : 'Other', 'label' : 'Other'},
                    {'value' : 'Right of Abode', 'label' : 'Right of Abode'},
                    {'value' : 'Start-up or Innovator Visa', 'label' : 'Start-up or Innovator Visa'},
                    {'value' : 'Student Visa', 'label' : 'Student Visa'},
                    {'value' : 'UK Ancestry visa', 'label' : 'UK Ancestry visa'},
                    {'value' : 'Work Visa', 'label' : 'Work Visa'},
                );
                self.visaTypeListDP = new ArrayDataProvider(self.visTypeList, {keyAttributes: 'value'});
                self.visa_type = ko.observable();  

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({ path: 'signin' });
                    }
                    else {
                       app.onAppSuccess();
                       getStaffInfo();
                    }
                };
                self.context = context;
                self.router = self.context.parentRouter;

                function getStaffInfo(){
                    $.ajax({
                        url: BaseURL + "/jpGetStaffToAllocate",
                        type: 'POST',
                        data: JSON.stringify({
                            rowId : sessionStorage.getItem("postedShiftId")
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
                            var result = JSON.parse(data[0]);
                            console.log(result)
                            self.shiftDate(result[0])
                            self.jobRole(result[1])
                            self.selectedClientId(result[2])
                            const StartTimeString = result[3];
                            const StartTimeParts = StartTimeString.split(":");
                            const startHours = parseInt(StartTimeParts[0], 10);
                            const startMinutes = parseInt(StartTimeParts[1], 10);
                            const startSeconds = parseInt(StartTimeParts[2], 10);

                            const startDate = new Date();
                            startDate.setHours(startHours);
                            startDate.setMinutes(startMinutes);
                            startDate.setSeconds(startSeconds);

                            const formattedStartTime = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

                            console.log(formattedStartTime);
                            self.startTime(formattedStartTime)

                            const EndTimeString = result[4];
                            const EndTimeParts = EndTimeString.split(":");
                            const endHours = parseInt(EndTimeParts[0], 10);
                            const endMinutes = parseInt(EndTimeParts[1], 10);
                            const endSeconds = parseInt(EndTimeParts[2], 10);

                            const endDate = new Date();
                            endDate.setHours(endHours);
                            endDate.setMinutes(endMinutes);
                            endDate.setSeconds(endSeconds);

                            const formattedEndTime = endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

                            console.log(formattedEndTime);
                            self.endTime(formattedEndTime)
                            self.shiftName(result[5])
                            self.clientName(result[6])
                            self.requiredStaff(result[7])
                            self.shiftId(result[8])
                            for (var i = 0; i < data[1].length; i++) {
                                self.staffDet.push({'staff_name' : data[1][i][0],'client_id' : data[1][i][1],'visa_status' : data[1][i][2],'transportation' : data[1][i][3],'staff_id' : data[1][i][4],'allocation_status' :data[1][i][5],'allocation_id' :data[1][i][6]});
                             }
                             for (var i = 0; i < data[2].length; i++) {
                                self.allocatedStaffs.push(data[2][i][0]);
                             }
                             console.log(self.allocatedStaffs().length)
                             self.allocatedCount(self.allocatedStaffs().length+"/"+self.requiredStaff())
                             if(self.allocatedStaffs().length < self.requiredStaff()){
                                self.actionVal(true)
                                $.ajax({
                                    url: BaseURL + "/jpBookingStatusDefault",
                                    type: 'POST',
                                    data: JSON.stringify({
                                        rowId : sessionStorage.getItem("postedShiftId"),
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
                                        console.log(data)
                                        document.querySelector('#openAllocationProgress').close();
                                    }
                                })  
                             }else{
                                $.ajax({
                                    url: BaseURL + "/jpBookingStatusUpdate",
                                    type: 'POST',
                                    data: JSON.stringify({
                                        rowId : sessionStorage.getItem("postedShiftId"),
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
                                        console.log(data)
                                        document.querySelector('#openAllocationProgress').close();
                                    }
                                })  
                             }
                             console.log(self.actionVal())
                    }
                    }) 
                }
                
                self.filterStaff = function (event,data) {
                    if(self.checkPreferredList() == undefined){
                        self.checkPreferredList('Any')
                    }
                    if(self.checkTransportation() == undefined){
                        self.checkTransportation('Any')
                    }
                    if(self.visa_type() == undefined){
                        self.visa_type([''])
                    }
                    self.staffDet([]);
                     $.ajax({
                       url: BaseURL + "/jpGetFilteredStaffToAllocate",
                       type: 'POST',
                       data: JSON.stringify({
                            rowId : sessionStorage.getItem("postedShiftId"),
                            checkPreferredList : self.checkPreferredList(),
                            checkTransportation : self.checkTransportation(),
                            checkVisaType : self.visa_type()
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
                            for (var i = 0; i < data[0].length; i++) {
                                self.staffDet.push({'staff_name' : data[0][i][0],'client_id' : data[0][i][1],'visa_status' : data[0][i][2],'transportation' : data[0][i][3],'staff_id' : data[0][i][4],'allocation_status' :data[0][i][5],'allocation_id' :data[0][i][6]});
                             }
                    }
                        self.staffDet.valueHasMutated();
                        return self;                    
                    }
                   }) 
            }
                self.dataProvider1 = new ArrayDataProvider(self.staffDet, {keyAttributes: 'value'});
                
                self.goToProfile = function (event,data) {
                    var clickedStaffId = data.data.staff_id
                    console.log(clickedStaffId)
                    sessionStorage.setItem("staffId", clickedStaffId);
                    //self.router.go({path:'staffManagerView'})  
                    self.router.go({path:'staffCalenderView'})
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
                           console.log(data)
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
                           console.log(result[14])
                           var container = document.getElementById("pic-print");
                           var imgElement = document.createElement("img");
                           imgElement.src = 'data:image/jpeg;base64,' + result[14];
                           imgElement.width = 80; // Remove the quotes
                           imgElement.height = 80; // Remove the quotes
                           container.appendChild(imgElement);
                           self.profilePhoto('data:image/jpeg;base64,'+result[14])
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

                self.handleSelectedChanged = (event,data) => {
                    var staffList = event.detail.value._keys;
                    var staffListArray = Array.from(staffList);
                    allocateStaffs = staffListArray.join(', ');
                    console.log(allocateStaffs);
                };

                self.allocateStaff = function (event,data) {
                    var clickedRowId = data.data.staff_id
                        document.querySelector('#openAllocationProgress').open();
                        $.ajax({
                            url: BaseURL + "/jpStaffAllocate",
                            type: 'POST',
                            data: JSON.stringify({
                                clientId : self.selectedClientId(),
                                shiftId : self.shiftId(),
                                postedShiftId : sessionStorage.getItem("postedShiftId"),
                                staffId : clickedRowId
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
                
                self.ReallocateStaff = function (event,data) {
                    var clickedRowId = data.data.staff_id
                        document.querySelector('#openAllocationProgress').open();
                        $.ajax({
                            url: BaseURL + "/jpStaffReAllocation",
                            type: 'POST',
                            data: JSON.stringify({
                                clientId : self.selectedClientId(),
                                shiftId : self.shiftId(),
                                postedShiftId : sessionStorage.getItem("postedShiftId"),
                                staffId : clickedRowId
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
                                console.log(data)
                                document.querySelector('#openAllocationProgress').close();
                                location.reload()
                            }
                        })  
                }; 

                self.confirmAllocation = function (event,data) {
                    var clickedRowId = data.data.allocation_id
                        document.querySelector('#openAllocationProgress').open();
                        $.ajax({
                            url: BaseURL + "/jpStaffConfirmAllocation",
                            type: 'POST',
                            data: JSON.stringify({
                                rowId : clickedRowId,
                                staffId : data.data.staff_id
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

                self.downloadProfile = function (event,data) {
                    //document.title = "Print page title";
                    var printContents = document.getElementById('DownloadProfile').innerHTML;
                    document.body.innerHTML = "<html><head><title></title></head><body>" + printContents + "</body>";
                    window.print(); 

                    location.reload()
                }
            }
            
            
          }
            return  StaffAllocationModel;

        });
