define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojconverterutils-i18n","ojs/ojarraydataprovider", 
'ojs/ojknockout-keyset',"ojs/ojknockout", "ojs/ojswitch", "ojs/ojdatetimepicker", 'ojs/ojvalidationgroup', "ojs/ojselectsingle","ojs/ojlistitemlayout","ojs/ojlistview","ojs/ojfilepicker"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider, ojknockout_keyset_1) {

    class Induction {
        constructor(context) {
            var self = this;
            
            self.day = ko.observable(ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(new Date()));
            self.inductionId = ko.observable();
            self.dates = ko.observable();
            self.time = ko.observable();
            self.timeSlots = ko.observable();
            self.inductionValid = ko.observable();
            self.userCheck = ko.observable('Not available');
            self.bookedDate = ko.observable();
            self.bookedTime = ko.observable();
            self.inductionStatus = ko.observable();
            self.InductionUsersDet = ko.observableArray([]);
            self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();
            self.CancelBehaviorOpt = ko.observable('icon'); 
            self.progressText = ko.observable('');
            self.ResultTitle = ko.observable();
            self.addInductionMsg = ko.observable();
            self.inductionFileText = ko.observable('Induction Document');
            self.existData = ko.observable();
            self.inductionCustomText = ko.observable('Please upload induction document (Optional)');
            self.document = ko.observable();
            self.documentStatus = ko.observable();
            var BaseURL = sessionStorage.getItem("BaseURL")
            self.filePath = ko.observable();
            self.typeError = ko.observable();

            self.cultureOrganisationVal = ko.observable();
            self.principlesCareVal = ko.observable()
            self.personalitiesVal = ko.observable()
            self.organisationStructureVal = ko.observable()
            self.employeeAgreementVal = ko.observable()
            self.emergencyVal = ko.observable()
            self.policyOnGiftsVal = ko.observable()
            self.equalOpprtVal = ko.observable()
            self.workPlaceVal = ko.observable()
            self.statementTermsVal = ko.observable()
            self.salaryAndPaymentVal = ko.observable()
            self.sicknessVal = ko.observable()
            self.dutyRotasVal = ko.observable()
            self.uniformPolicyVal = ko.observable()
            self.staffAvailabilityVal = ko.observable()
            self.timeSheetVal = ko.observable()
            self.transportationVal = ko.observable()
            self.mobilePhoneVal = ko.observable()
            self.generalDataVal = ko.observable()
            self.disciplinaryVal = ko.observable()
            self.mandatoryTrainingsVal = ko.observable()
            self.personalHygieneVal = ko.observable()
            self.comment = ko.observable()

            self.checkUserInductionBooked = ()=>{
                getInductionUsers()
                $.ajax({
                    url: BaseURL + "/checkUserExistInduction",
                    method: "POST",
                    data: JSON.stringify({
                        userId: sessionStorage.getItem("staffId"),
                    }),
                    success: function(data){
                        data = JSON.parse(data)
                        if(data[0]==null){
                            self.userCheck("Not available");    
                        }
                        else{
                            self.userCheck(data[0][0]);

                            const date = new Date(data[0][2]);
                            const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                            const formattedDate = formatter.format(date);
                            self.bookedDate(formattedDate)
                            
                            const timeArr = data[0][3].split(':')
                            let time = new Date('2013','04','18',timeArr[0],timeArr[1]);
                            let hours = time.getHours();
                            const minutes = time.getMinutes().toString().padStart(2, '0');
                            const seconds = time.getSeconds();
                            let suffix = "AM";
                            if (hours >= 12) {
                                suffix = 'PM';
                                hours -= 12;
                            }
                            if (hours === 0) {
                                hours = 12;
                            }
                            self.bookedTime(`${hours}:${minutes} ${suffix}`)

                            if(data[0][4] == "Pending") {
                                self.inductionStatus('Pending');
                            }else if(data[0][4] == "Audited") {
                                self.inductionStatus('Audited');
                            }  
                        }
                        // self.userCheck("Rejected")
                    },
                    error: function(xhr, status, error) {
                        console.log(xhr.statusText);
                        console.log(status);
                        console.log(error);
                    }
                })
            }
            self.checkUserInductionBooked()
            
            
            self.getInductionDates = ()=>{
                $.ajax({
                    url: BaseURL + "/getInductionDates",
                    method: 'GET',
                    success: function(data) {
                        data = JSON.parse(data)
                        console.log(data)
                        self.dates(data)
                    },
                    error: function(xhr, status, error) {
                        console.log(xhr.responseText);
                        console.log(status);
                        console.log(error);
                    }
                }) 
            }

            self.getInductionDates()
            
            self.dayFormatter = ko.observable((dateInfo) => {
                let month = dateInfo.month;
                let date = dateInfo.date;
                let fullYear = dateInfo.fullYear;
                let len = self.dates().length;
                for(var i=0;i<len;i++){
                    let da = self.dates()[i][0];
                    let d = new Date(Date.parse(da));
                    var mont = d.getMonth()+1;
                    var year = d.getFullYear();
                    var day = d.getDate();
                    
                    if (month == mont && date == day) {
                        return {
                            className: 'induction-day',
                            tooltip: 'Induction seats available'
                        };
                    } 
                }          
                return null;
            });
            
            self.showTime = ()=>{
                $.ajax({
                    url: BaseURL + "/getInductionTimes",
                    method: 'POST',
                    data: JSON.stringify({
                        inductionDate : self.day(),
                    }),
                    success: function(data) {
                        data = JSON.parse(data);
                        console.log(data);
                        let len = data.length;
                        if(len != 0){
                            document.getElementById("timeSlots").style.display = "block";
                            document.getElementById("submitBtn").style.display = "block"
                        }
                        else{
                            document.getElementById("timeSlots").style.display = "none";
                            document.getElementById("submitBtn").style.display = "none"
                        }
                        let times = []
                        for(var i=0;i<len;i++){
                            const timeArr = data[i][0].split(':')
                            let time = new Date('2013','04','18',timeArr[0],timeArr[1]);
                            let hours = time.getHours();
                            const minutes = time.getMinutes().toString().padStart(2, '0');
                            const seconds = time.getSeconds();
                            let suffix = "AM";
                            if (hours >= 12) {
                                suffix = 'PM';
                                hours -= 12;
                            }
                            if (hours === 0) {
                                hours = 12;
                            }
                            times.push({ value: `${data[i][1]}`, label: `${hours}:${minutes} ${suffix}`})
                        }
                        self.time(times)
                        self.timeSlots(new ArrayDataProvider(self.time(), {
                            keyAttributes: "value",
                        }));
                    },
                    error: function(xhr, status, error) {
                        console.log(xhr.responseText);
                        console.log(status);
                        console.log(error);
                    }
                })
            }
            
            self.showTime()
            
            self.inductionSubmit = ()=>{
                var validInductionDet = self._checkValidationGroup("inductionUpdate");
                if(validInductionDet){
                    $.ajax({
                        url: BaseURL + "/saveInduction",
                        method: 'POST',
                        data: JSON.stringify({
                            userId : sessionStorage.getItem("staffId"),
                            inductionId : self.inductionId(),
                            status : "Requested",
                        }),
                        success: function(data) {
                            location.reload()
                        },
                        error: function(xhr, status, error) {
                            console.log(status);
                            console.log(error);
                        }
                    }) 
                }
            }

            self.inductionUpdate = ()=>{
                var validInductionDet = self._checkValidationGroup("inductionUpdate1");
                if(validInductionDet){
                    document.querySelector('#openBookingProgress').open();
                    $.ajax({
                        url: BaseURL + "/updateInduction",
                        method: 'POST',
                        data: JSON.stringify({
                            userId : sessionStorage.getItem("staffId"),
                            inductionId : self.inductionId(),
                            status : "Requested",
                        }),
                        success: function(data) {
                            document.querySelector('#openBookingProgress').close();
                            location.reload()
                        },
                        error: function(xhr, status, error) {
                            console.log(status);
                            console.log(error);
                        }
                    }) 
                }
            }

            self._checkValidationGroup = (value) => {
                var tracker = document.getElementById(value);
                if (tracker.valid === "valid") {
                    return true;
                }
                else {
                    tracker.showMessages();
                    tracker.focusOn("@firstInvalidShown");
                    return false;
                }
            };

            self.updateInductionStatus = function (event,data) {
                var BaseURL = sessionStorage.getItem("BaseURL")
                $.ajax({
                    url: BaseURL+ "/jpStaffUpdateInductionStatus",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId : sessionStorage.getItem("staffId"),
                        auditerName : sessionStorage.getItem("userName")
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openUpdateStaffProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                       console.log("Success")
                       if(sessionStorage.getItem('induction_status')=="Pending"){
                        sessionStorage.setItem('induction_status','Audited');
                       }else if(sessionStorage.getItem('induction_status')=="Audited"){
                        sessionStorage.setItem('induction_status','Pending');
                       }
                       location.reload();
                    }
                })  

            }

            function getInductionUsers() {
                self.InductionUsersDet([]);
                var BaseURL = sessionStorage.getItem("BaseURL")
                $.ajax({
                    url: BaseURL + "/jpInductionStaffInfoGet",
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
                        var data = JSON.parse(result[0]);
                        console.log(data)
                        if(data.length!=0){
                            self.existData('yes')
                    for (var i = 0; i < data.length; i++) {
                        self.InductionUsersDet.push({'id': data[i][0], 'staff_id' : data[i][1],'name': data[i][14] +" "+ data[i][15], 'induction_date' : data[i][9], 'induction_time' : data[i][10], 'status' : data[i][3], 'document_status' : data[i][6], 'document' : result[1] }); 
                    }
                    self.document(result[1]) 
                    self.documentStatus(data[0][6])
                    self.InductionUsersDet.valueHasMutated();
                    return self; 
                }else{
                    self.existData('no')
                }
                }
                })
            }
            self.dataProvider1 = new ArrayDataProvider(this.InductionUsersDet, { keyAttributes: "id"});
           
            self.inductionReject = function (event,data) {
                //var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
                var clickedRowId = data.data.id
                console.log(clickedRowId)
                if(clickedRowId !=undefined){
                    document.querySelector('#openRejectConfirm').open();
                }         
               
            }

            self.getDisplayValue = function (set) {
                var arr = [];
                set.values().forEach(function (key) {
                    arr.push(key);
                });
                return arr;
            };
            self.DBErrorOKClose = function (event) {
                document.querySelector('#openActionResult').close();
                location.reload()
            };

            self.rejectInductionProgram = function (event,data) {
                var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
                self.ResultTitle('Reject Induction Program')
                console.log(clickedRowId)
                if(clickedRowId !=undefined){
                    document.querySelector('#openRejectConfirm').close();
                    document.querySelector('#openRejectProgress').open();
                     $.ajax({
                        url: BaseURL + "/jpInductionReject",
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
                            document.querySelector('#openRejectProgress').close();
                            document.querySelector('#openActionResult').open();
                            self.addInductionMsg(data[0]);
                            console.log("success")
                    }
                    })  
    
                }         
               
            }

            self.inductionConfirm = function (event,data) {
                //var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
                var clickedRowId = data.data.id
                console.log(clickedRowId)
                if(clickedRowId !=undefined){
                    document.querySelector('#openInductionConfirm').open();
                }         
               
            }

            self.confirmInductionRequest = function (event,data) {
                var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
                self.ResultTitle('Confirm Induction Program')
                console.log(clickedRowId)
                if(clickedRowId !=undefined){
                    document.querySelector('#openInductionConfirm').close();
                    document.querySelector('#openConfirmProgress').open();
                     $.ajax({
                        url: BaseURL + "/jpConfirmInduction",
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
                            document.querySelector('#openConfirmProgress').close();
                            document.querySelector('#openActionResult').open();
                            self.addInductionMsg(data[0]);
                            console.log("success")
                    }
                    })  
    
                }         
               
                
            }

            
            self.inductionAttended = function (event,data) {
                //var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
                var clickedRowId = data.data.id
                self.ResultTitle('Attended Induction Program')
                console.log(clickedRowId)
                if(clickedRowId !=undefined){
                    //document.querySelector('#openInductionConfirm').close();
                    document.querySelector('#openConfirmProgress').open();
                     $.ajax({
                        url: BaseURL + "/jpAttendedInduction",
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
                            document.querySelector('#openConfirmProgress').close();
                            document.querySelector('#openActionResult').open();
                            self.addInductionMsg(data[0]);
                            console.log("success")
                    }
                    })  
    
                }         
               
                
            }

            self.UploadDocument = function (event,data) {
                //var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
                var clickedRowId = data.data.id
                sessionStorage.setItem("inductionId", clickedRowId);
                console.log(clickedRowId)
                document.querySelector('#openFileUpload').open();
            }

            self.inductionDocUpload = function (event,data) {
                var uploadURL = BaseURL + "/css/uploads/";
                const result = event.detail.files;
                const files = result[0];
                var fileName= files.name;
                var filePath= uploadURL+fileName;
                self.filePath(filePath);
    
                console.log(files)
                var fileFormat =files.name.split(".");
                var checkFormat =fileFormat[1];
                
                if(checkFormat == 'pdf'){
                self.progressText('Please wait!Uploading....')
                document.querySelector('#openFileUpload').close();
                document.querySelector('#openAddUploadingProgress').open();
                self.typeError('')
                const reader = new FileReader();
                reader.readAsDataURL(files);
                
                reader.onload = ()=>{
                    $.ajax({
                        url: BaseURL + "/jpStaffInductionDocUplaod",
                        type: 'POST',
                        data: JSON.stringify({
                            file : reader.result,
                            file_name : fileName,
                            staffId : sessionStorage.getItem("staffId"),
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
                            //console.log(data)
                            console.log("success")
                            document.querySelector('#openAddUploadingProgress').close();
                            getInductionUsers()
    
                        }
                    })
                }
            }
            else{
                self.typeError('The certificate must be a file of type: pdf')
            }
          }
    
          self.previewClick = function (event) {
            // console.log(event.srcElement.id)  
            // var clickedId=event.srcElement.id
            // var file=clickedId.replace(/\s/g,'%20');
            // document.getElementById(clickedId).href = file;
            var data64=event.srcElement.id;
            // console.log(self.passportShow())
            var pdfDataUri = "data:application/octet-stream;charset=utf-16le;base64,"+data64;
    
            // Create an anchor element
            var downloadLink = document.createElement("a");
            downloadLink.href = pdfDataUri;
            var fileName = "document.pdf";
            // Set the download attribute to specify the file name
            downloadLink.download = fileName;
    
            // Trigger a click event on the anchor element to start the download
            downloadLink.click();
        }; 

        self.getInductionForm = (event)=>{
            var clickedId=event.srcElement.id
            $.ajax({
                url: BaseURL + "/getInductionCheck",
                method: 'POST',
                data: JSON.stringify({
                    userId : clickedId
                }),
                success: function(data) {
                    data = JSON.parse(data);
                    //console.log(data)
                    self.cultureOrganisationVal(data[0][2]);
                    self.principlesCareVal(data[0][3])
                    self.personalitiesVal(data[0][4])
                    self.organisationStructureVal(data[0][5])
                    self.employeeAgreementVal(data[0][6])
                    self.emergencyVal(data[0][7])
                    self.policyOnGiftsVal(data[0][8])
                    self.equalOpprtVal(data[0][9])
                    self.workPlaceVal(data[0][10])
                    self.statementTermsVal(data[0][11])
                    self.salaryAndPaymentVal(data[0][12])
                    self.sicknessVal(data[0][13])
                    self.dutyRotasVal(data[0][14])
                    self.uniformPolicyVal(data[0][15])
                    self.staffAvailabilityVal(data[0][16])
                    self.timeSheetVal(data[0][17])
                    self.transportationVal(data[0][18])
                    self.mobilePhoneVal(data[0][19])
                    self.generalDataVal(data[0][20])
                    self.disciplinaryVal(data[0][21])
                    self.mandatoryTrainingsVal(data[0][22])
                    self.personalHygieneVal(data[0][23])
                    self.comment(data[0][24])
                },
                error: function(xhr, status, error) {
                    console.log(status);
                    console.log(error);
                }
            }) 
        }

        self.handleOpen = (event)=>{
            self.getInductionForm(event);
            document.querySelector("#scrollingDialog").open();
        }

        self.handleOKClose = ()=>{
            document.querySelector("#scrollingDialog").close();
        }
   
        }
            
    }
    return  Induction;

});
