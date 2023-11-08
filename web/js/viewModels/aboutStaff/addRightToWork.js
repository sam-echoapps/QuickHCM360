define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class RightToWorkViewModel {
        constructor(context) {
                var self = this;
                self.DepName = context.routerState.detail.dep_url;
                self.startOpened = ko.observable(true);
                self.startToggle = () => self.startOpened(!self.startOpened());
                var BaseURL = sessionStorage.getItem("BaseURL")
                self.groupValid = ko.observable();
                self.passportFileText = ko.observable('Passport');
                self.BRPFileText = ko.observable('BRP');
                self.passportCustomText = ko.observable('Please upload passport document');
                self.BRPCustomText = ko.observable('Please upload BRP document (Optional)');
                self.uploadDocumentMsg = ko.observable();
                self.dbsNumber = ko.observable();
                self.requiredDBS = ko.observable();  
                self.uploadError = ko.observable();
                self.choiceList = ko.observableArray([]);  
                self.choiceList.push(
                    {'value' : 'Yes', 'label' : 'Yes'},
                    {'value' : 'No', 'label' : 'No'},  
                );
                self.choiceListDP = new ArrayDataProvider(self.choiceList, {keyAttributes: 'value'});
                self.have_dbs = ko.observable();
                self.dbsSec = ko.observable();  
                self.dbs_expiry_date = ko.observable();
                self.update_expiry_date = ko.observable();
                self.ResultTitle = ko.observable('');
                self.progressDialog =ko.observable('Saving Right To Work Details')
                self.addRightToWorkMsg = ko.observable();  
                self.RightDet = ko.observableArray([]);
                self.RightActionBtn = ko.observable('Add');
                self.dbsStatus = ko.observable('');
                self.dbsFile = ko.observable('');
                self.updateFile = ko.observable('');
                
                self.visa_status = ko.observable();
                self.visaStatusList = ko.observableArray([]);
                self.visaStatusList.push(
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
                    {'value' : 'Work Visa', 'label' : 'Work Visa'}
                );
                self.visaStatusListDP = new ArrayDataProvider(self.visaStatusList, {keyAttributes: 'value'});
                self.visa_expiry_date = ko.observable();
                self.passport_no = ko.observable();
                self.place_of_issue = ko.observable();
                self.issue_date = ko.observable();
                self.expiry_date = ko.observable();  
                self.brp_expiry_date = ko.observable();
                self.have_sharecode = ko.observable();
                self.sharecode = ko.observable();
                self.passportShow = ko.observable();
                self.BRPShow = ko.observable();
                self.rightStatus = ko.observable('');
                self.requiredContent = ko.observable();
                self.typeError = ko.observable();
                self.typeError1 = ko.observable();

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({ path: 'signin' });
                    }
                    else {
                       app.onAppSuccess();
                       getRightToWorkData();
                    }
                };

                function getRightToWorkData(){
                    self.RightDet([]);
                    var BaseURL = sessionStorage.getItem("BaseURL")
                    $.ajax({
                        url: BaseURL + "/jpEditRightToWorkInfo",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("userId"),
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
                             var result1 = JSON.parse(data[0]);
                             console.log(result1) 
                             var result2 = JSON.parse(data[1]);
                             console.log(result2) 
                             if(result1.length !=0){
                                self.RightActionBtn('Update')  
                                self.uploadError('')
                                self.visa_status(result1[0][2])
                                self.visa_expiry_date(result1[0][3])
                                self.passport_no(result1[0][4])
                                self.place_of_issue(result1[0][5])
                                self.issue_date(result1[0][6])
                                self.sharecode(result1[0][7])
                                self.have_sharecode('Yes')
                                self.expiry_date(result2[0][6])
                                document.getElementById('passportPreview').style.display='block';
                                self.passportShow(data[2][0])

                                if(result2.length ==2){
                                self.brp_expiry_date(result2[1][6])
                                document.getElementById('BRPPreview').style.display='block';
                                self.BRPShow(data[2][1])

                                }
                                if(result1[0][8] == "Pending") {
                                    self.rightStatus('Pending');
                                }else if(result1[0][8] == "Audited") {
                                    self.rightStatus('Audited');
                                }

                               /*  
                                self.requiredDBS(true)
                                if(result[0][7] == "Pending") {
                                    self.dbsStatus('Pending');
                                }else if(result[0][7] == "Audited") {
                                    self.dbsStatus('Audited');
                                }   */

                            } else{
                                self.uploadError('*')
                            } 
                              
      
                        self.RightDet.valueHasMutated();
                        return self; 
                    }
                    })                
                }
                self.previewClick = function (event) {
                    //document.getElementById("passportLink").href = self.passportShow()
                    var data64=self.passportShow();
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

                self.previewClickBRP = function (event) {
                    //document.getElementById("BRPLink").href = self.BRPShow()
                    var data64=self.BRPShow();
                    // console.log(self.BRPShow())
                    var pdfDataUri = "data:application/octet-stream;charset=utf-16le;base64,"+data64;
                    var downloadLink = document.createElement("a");
                    downloadLink.href = pdfDataUri;
                    var fileName = "document.pdf";
                    downloadLink.download = fileName;
                    downloadLink.click();
                };

                self.rightToworkSection = function (event,data) {
                    if(self.visa_status()=='Not Applicable' || self.visa_status()=='Other'){
                        self.requiredContent(false)
                        self.uploadError('')
                    }else{
                        self.requiredContent(true) 
                        self.uploadError('*')
                    }
                   
                }
                self.shareCodeSec = function (event,data) {
                    if(self.have_sharecode()=='Yes'){
                        document.getElementById('sharecode_generator').style.display='none';
                        document.getElementById('sharecodeValSec').style.display='block';
                    }else if(self.have_sharecode()=='No'){
                        document.getElementById('sharecode_generator').style.display='block';
                        document.getElementById('sharecodeValSec').style.display='block';
                    }
                   
                }
              self.DBErrorOKClose = function (event) {
                document.querySelector('#openFileUploadResult').close();
                document.querySelector('#openAddRightToWorkResult').close();
            }; 

            self.passportSubmit = function (event,data) {
                var validRightToWork = self._checkValidationGroup("staffRightToWorkCheck");
                if (validRightToWork) {
                self.uploadError('')
                var file = event.detail.files[0];
                //console.log(file)
                const result = event.detail.files;
                const files = result[0];
                var fileName= files.name;
                var uploadURL = BaseURL + "/css/uploads/";
                var filePath= uploadURL+fileName;
                //alert(self.movingFile_expiry_date())
                if(self.expiry_date() == undefined){
                    self.expiry_date('1990-01-01')
                } 
                //console.log(fileName)
                var fileFormat =files.name.split(".");
                var checkFormat =fileFormat[1];
                
                if(checkFormat == 'pdf'){
                const reader = new FileReader();
                reader.readAsDataURL(files);
                self.typeError('')
                
                reader.onload = ()=>{
                    document.querySelector('#openAddUploadingProgress').open();
                    self.uploadDocumentMsg('');
                    const fileContent = reader.result;
                    //console.log(fileContent)
                    $.ajax({
                        url: BaseURL + "/jpStaffFileUplaod",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("userId"),
                            file_name : fileName,
                            file : fileContent,
                            file_type : "Passport", 
                            file_type_additional : "Right To Work",
                            file_path : filePath,
                            expiry_date : self.expiry_date()
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
                            self.passportCustomText(fileName)
                            document.querySelector('#openAddUploadingProgress').close();
                            /* document.querySelector('#openFileUploadResult').open();
                            self.uploadDocumentMsg(data[0]); */
                        }
                    })      
                }
            }
            else{
                self.typeError('The certificate must be a file of type: pdf')
            }
            }
        }

            self.BRPSubmit = function (event,data) {
                var file = event.detail.files[0];
                //console.log(file)
                const result = event.detail.files;
                const files = result[0];
                var fileName= files.name;
                var uploadURL = BaseURL + "/css/uploads/";
                var filePath= uploadURL+fileName;
                if(self.brp_expiry_date() == undefined){
                    self.brp_expiry_date('1990-01-01')
                }                 
                //console.log(fileName)
                var fileFormat =files.name.split(".");
                var checkFormat =fileFormat[1];
                
                if(checkFormat == 'pdf'){
                const reader = new FileReader();
                reader.readAsDataURL(files);
                self.typeError1('')

                reader.onload = ()=>{
                    document.querySelector('#openAddUploadingProgress').open();
                    self.uploadDocumentMsg('');
                    const fileContent = reader.result;
                    //console.log(fileContent)
                    $.ajax({
                        url: BaseURL + "/jpStaffFileUplaod",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("userId"),
                            file_name : fileName,
                            file : fileContent,
                            file_type : "BRP", 
                            file_type_additional : "Right To Work",
                            file_path : filePath,
                            expiry_date : self.brp_expiry_date()
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
                            self.BRPCustomText(fileName)
                            document.querySelector('#openAddUploadingProgress').close();
                            /* document.querySelector('#openFileUploadResult').open();
                            self.uploadDocumentMsg(data[0]); */
                        }
                    })      
                }
            }else{
                self.typeError1('The certificate must be a file of type: pdf')
            }
        }
                //Validation 
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

            self.staffRightToWorkSave = function (event,data) {
                self.ResultTitle('Add Right To Work Details')
                if(self.visa_status() == undefined){
                    self.visa_status('')
                }
                if(self.visa_expiry_date() == undefined){
                    self.visa_expiry_date('1990-01-01')
                }
                if(self.passport_no() == undefined){
                    self.passport_no('')
                }
                if(self.place_of_issue() == undefined){
                    self.place_of_issue('')
                }
                if(self.issue_date() == undefined){
                    self.issue_date('1990-01-01')
                }
                if(self.sharecode() == undefined){
                    self.sharecode('')
                }
                var validSec = self._checkValidationGroup("staffRightToWorkCheck");  
                if (validSec && self.uploadError() =="") {
                    document.querySelector('#openAddRightToWorkProgress').open();
                     self.addRightToWorkMsg('');
                    $.ajax({
                        url: BaseURL+ "/jpStaffRightToWorkAdd",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("userId"),
                            visa_status : self.visa_status(),
                            visa_expiry_date : self.visa_expiry_date(),
                            passport_no : self.passport_no(),
                            place_of_issue : self.place_of_issue(),
                            issue_date : self.issue_date(),
                            sharecode : self.sharecode()
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            if(textStatus == 'timeout'){
                                document.querySelector('#openAddRightToWorkProgress').close();
                                document.querySelector('#Timeout').open();
                            }
                        },
                        success: function (data) {
                            document.querySelector('#openAddRightToWorkProgress').close();
                            document.querySelector('#openAddRightToWorkResult').open();
                            self.addRightToWorkMsg(data[0]);
                            console.log("Success")
                        }
                    })   
                }
          }

          self.staffRightToWorkUpdate = function (event,data) {
            self.ResultTitle('Update Right To Work Details')
            self.progressDialog('Updating Right To Work Details')
            var validSec = self._checkValidationGroup("staffRightToWorkCheck");  
            if (validSec && self.uploadError() == "") {
                document.querySelector('#openAddRightToWorkProgress').open();
                 self.addRightToWorkMsg('');
                 $.ajax({
                    url: BaseURL+ "/jpStaffRightToWorkUpdate",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId : sessionStorage.getItem("userId"),
                        visa_status : self.visa_status(),
                        visa_expiry_date : self.visa_expiry_date(),
                        passport_no : self.passport_no(),
                        place_of_issue : self.place_of_issue(),
                        issue_date : self.issue_date(),
                        sharecode : self.sharecode()
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openAddRightToWorkProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                        document.querySelector('#openAddRightToWorkProgress').close();
                        // document.querySelector('#openAddRightToWorkResult').open();
                        // self.addRightToWorkMsg(data[0]);
                        // console.log("Success")
                        location.reload()
                    }
                })    
            }
      }

      self.updateRightStatus = function (event,data) {
        var BaseURL = sessionStorage.getItem("BaseURL")
        $.ajax({
            url: BaseURL+ "/jpStaffUpdateRightStatus",
            type: 'POST',
            data: JSON.stringify({
                staffId : sessionStorage.getItem("userId"),
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
               if(sessionStorage.getItem('right_status')=="Pending"){
                sessionStorage.setItem('right_status','Audited');
               }else if(sessionStorage.getItem('right_status')=="Audited"){
                sessionStorage.setItem('right_status','Pending');
               }
               location.reload();
            }
        })  

    }
            
            
          }
        }
            return  RightToWorkViewModel;

        });
