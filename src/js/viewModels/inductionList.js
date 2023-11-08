define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {
    
    class InductionListModel {
        constructor(context) {
            var self = this;
            self.DepName = context.routerState.detail.dep_url;
            self.induction_time = ko.observable(ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIso(new Date(2013, 0, 1)));
            self.induction_date = ko.observable();
            self.induction_limit = ko.observable();
            self.progressDialog = ko.observable('Saving Induction Details');
            self.addInductionMsg = ko.observable();
            self.ResultTitle = ko.observable();
            self.groupValid = ko.observable();  
            var BaseURL = sessionStorage.getItem("BaseURL")
            self.InductionUsersDet = ko.observableArray([]);
            self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();
            self.CancelBehaviorOpt = ko.observable('icon'); 
            self.inductionFileText = ko.observable('Induction Document');
            self.inductionCustomText = ko.observable('Please choose one');
            self.filePath = ko.observable();
            self.progressText = ko.observable('');
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

            self.connected = function () {
                if (sessionStorage.getItem("userName") == null) {
                    self.router.go({ path: 'signin' });
                }
                else {
                   app.onAppSuccess();
                   getInductionUsers();
                }
            };
            
            function getInductionUsers() {
                self.InductionUsersDet([]);
                var BaseURL = sessionStorage.getItem("BaseURL")
                $.ajax({
                    url: BaseURL + "/jpInductionUsersInfoGet",
                    type: 'POST',
                    data: JSON.stringify({
                       // staffId : sessionStorage.getItem("staffId"),
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
                    for (var i = 0; i < data.length; i++) {
                        self.InductionUsersDet.push({'id': data[i][0], 'staff_id' : data[i][1],'name': data[i][14] +" "+ data[i][15], 'induction_date' : data[i][9], 'induction_time' : data[i][10], 'status' : data[i][3], 'document_status' : data[i][6], 'document' : data[i][5] }); 
                    } 
                    self.InductionUsersDet.valueHasMutated();
                    return self; 
                }
                })
            }
            this.dataProvider1 = new ArrayDataProvider(this.InductionUsersDet, { keyAttributes: "id"});

            //Validation 
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
                
                if(checkFormat == 'pdf' || checkFormat =="doc"){
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
                            inductionId : sessionStorage.getItem("inductionId"),
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
                self.typeError('The certificate must be a file of type: pdf, doc')
            }
          }
    
          self.previewClick = function (event) {
            console.log(event.srcElement.id)  
            var clickedId=event.srcElement.id
            var file=clickedId.replace(/\s/g,'%20');
            document.getElementById(clickedId).href = file;
    
        }; 

        self.getInductionForm = (event)=>{
            var clickedId=event.srcElement.id
            $.ajax({
                url: BaseURL + "/getInductionCheck",
                method: 'POST',
                data: JSON.stringify({
                    userId : clickedId,
                }),
                success: function(data) {
                    data = JSON.parse(data);
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

        self.profileView = function (event) {
            console.log(event.srcElement.id)  
            var clickedId=event.srcElement.id
            sessionStorage.setItem("staffId", clickedId);
           window.location.href = "?ojr=staffView%2FbookInduction%3Bindex%3D11"
        }; 
        }
    }
    return  InductionListModel;
});