define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class EducationViewModel {
        constructor(context) {
                var self = this;
                self.DepName = context.routerState.detail.dep_url;
                self.startOpened = ko.observable(true);
                self.startToggle = () => self.startOpened(!self.startOpened());
                self.CancelBehaviorOpt = ko.observable('icon'); 
                self.institution_name = ko.observable();
                self.qualification = ko.observable();
                self.from_date = ko.observable();
                self.to_date = ko.observable();
                self.EducationActionBtn = ko.observable();
                self.groupValid = ko.observable();
                self.addEducationMsg = ko.observable();
                self.EducationDet = ko.observableArray([]);
                self.primaryCustomText = ko.observable('Certificate');
                self.secondaryCustomText = ko.observable('Please upload education certificate');
                self.fileContent = ko.observable();
                self.filePath = ko.observable();
                self.fileName = ko.observable();
                self.DialogTitle =ko.observable('Add Education Details')
                self.progressDialog =ko.observable('Saving Education Details')
                self.typeError = ko.observable();
                self.progressText = ko.observable('');
                self.ResultTitle = ko.observable('');
                self.educationStatus = ko.observable('');
                self.educationFile = ko.observable('');

                self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();
                var BaseURL = sessionStorage.getItem("BaseURL")

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({ path: 'signin' });
                    }
                    else {
                       app.onAppSuccess();
                       getEducation();
                    }
                };

                function getEducation() {
                    self.EducationDet([]);
                    var BaseURL = sessionStorage.getItem("BaseURL")
                    $.ajax({
                        url: BaseURL + "/jpStaffEducationGet",
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
                        success: function (result) {
                            var data = JSON.parse(result[0]);
                            console.log(data)
                            console.log(data.length)

                              for (var i = 0; i < data.length; i++) {
                                if(data[i][7]){
                                self.EducationDet.push({'id': data[i][0], 'staff_id' : data[i][1], 'institution_name' : data[i][2] , 'qualification' : data[i][3] , 'from_date' :data[i][4] , 'to_date' : data[i][5], 'certificate' : data[i][7], 'file' : result[1][i] }); 
                                }else{
                                    self.EducationDet.push({'id': data[i][0], 'staff_id' : data[i][1], 'institution_name' : data[i][2] , 'qualification' : data[i][3] , 'from_date' :data[i][4] , 'to_date' : data[i][5], 'certificate' : "Not Uploaded" }); 
                                }  
                        }
                        if(data[0][6] == "Pending") {
                            self.educationStatus('Pending');
                        }else if(data[0][6] == "Audited") {
                            self.educationStatus('Audited');
                        }  
    
      
                        self.EducationDet.valueHasMutated();
                        return self; 
                    }
                    })
                }
                this.dataProvider1 = new ArrayDataProvider(this.EducationDet, { keyAttributes: "id"});

                
                self.openAddEducationDialog = function (data, event) {
                    self.EducationActionBtn('Add')
                    document.querySelector('#openAddEducationDialog').open();
                    refresh();
                }
                self.staffEducationSave = function (event,data) {
                    self.ResultTitle('Add Education Details')
                    var validSec1 = self._checkValidationGroup("staffEducationSec1");
                    var validSec2 = self._checkValidationGroup("staffEducationSec2");
                    var BaseURL = sessionStorage.getItem("BaseURL")
                    if(self.typeError() == undefined){
                    self.typeError('')
                    }
                    if(self.filePath() == undefined){
                        self.filePath('NULL')
                    }
                    if(self.fileContent() == undefined){
                        self.fileContent('NULL')
                    }
                    if(self.fileName() == undefined){
                        self.fileName('NULL')
                    }
                    if (validSec1 && validSec2 && self.typeError() == '') {
                    document.querySelector('#openAddEducationDialog').close();
                    document.querySelector('#openAddEducationProgress').open();
                     self.addEducationMsg('');
                    $.ajax({
                        url: BaseURL+ "/jpStaffEducationAdd",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("userId"),
                            institution_name : self.institution_name(),
                            qualification : self.qualification(),
                            from_date : self.from_date(),
                            to_date : self.to_date(),
                            file : self.filePath(),
                            fileContent : self.filePath(),
                            fileName : self.fileName()
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            if(textStatus == 'timeout'){
                                document.querySelector('#openAddEducationProgress').close();
                                document.querySelector('#Timeout').open();
                            }
                        },
                        success: function (data) {
                            document.querySelector('#openAddEducationProgress').close();
                            document.querySelector('#openAddEducationResult').open();
                            self.addEducationMsg(data[0]);
                            console.log("Success")
                        }
                    })   
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
            self.context = context;
            self.router = self.context.parentRouter;
            self.DBErrorOKClose = function (event) {
                document.querySelector('#openAddEducationResult').close();
                document.querySelector('#openAddEducationDialog').close();
                getEducation();
            };

            self.selectListener = function (event,data) {
                var uploadURL = BaseURL + "/css/uploads/";
                const result = event.detail.files;
                const files = result[0];
                var fileName= files.name;
                var filePath= uploadURL+fileName;

                console.log(files)
                var fileFormat =files.name.split(".");
                var checkFormat =fileFormat[1];
                
                if(checkFormat == 'pdf'){
                self.progressText('Please wait!Uploading....')
                document.querySelector('#openAddUploadingProgress').open();
                self.typeError('')
                const reader = new FileReader();
                reader.readAsDataURL(files);
                
                reader.onload = ()=>{
                    self.fileContent(reader.result);
                    self.filePath(filePath);
                    self.fileName(fileName);
                    $.ajax({
                        url: BaseURL + "/jpStaffCertificateUpload",
                        type: 'POST',
                        data: JSON.stringify({
                            file : reader.result,
                            file_name : fileName
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
                            self.secondaryCustomText(fileName)
                            document.querySelector('#openAddUploadingProgress').close();
                        }
                    })
                }
            }
            else{
                self.typeError('The certificate must be a file of type: pdf')
            }
          }

          self.editEducationInfo = function (event,data) {
            refresh();
            self.DialogTitle('Update Education Details')
            self.progressDialog('Updating Education Details')
            self.EducationActionBtn('Update')
            //var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
            var clickedRowId = data.data.id
            sessionStorage.setItem("educationId", clickedRowId);
            console.log(clickedRowId)
            if(clickedRowId !=undefined){
                document.querySelector('#openAddEducationDialog').open();
                $.ajax({
                    url: BaseURL + "/jpEditEducationDetails",
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
                        self.institution_name(data[0][2])
                        self.qualification(data[0][3])
                        self.from_date(data[0][4])
                        self.to_date(data[0][5])
                        if(data[0][6]){
                        self.educationFile(data[0][3])
                        document.getElementById("education").href = data[0][6];
                        }
                }
                })

            }         
           
        }

        
        self.getDisplayValue = function (set) {
            var arr = [];
            set.values().forEach(function (key) {
                arr.push(key);
            });
            return arr;
        };

        self.staffEducationUpdate = function (event,data) {
            var validSec1 = self._checkValidationGroup("staffEducationSec1");
            var validSec2 = self._checkValidationGroup("staffEducationSec2");
            var BaseURL = sessionStorage.getItem("BaseURL")
            self.ResultTitle('Update Education Details')
            if(self.typeError() == undefined){
                self.typeError('')
            }
            if(self.filePath() == undefined){
                self.filePath('NULL')
            }
            if(self.fileContent() == undefined){
                self.fileContent('NULL')
            }
            if(self.fileName() == undefined){
                self.fileName('NULL')
            }
            if (validSec1 && validSec2 && self.typeError() == '') {
            document.querySelector('#openAddEducationDialog').close();
            document.querySelector('#openAddEducationProgress').open();
             self.addEducationMsg('');
            $.ajax({
                url: BaseURL+ "/jpStaffEducationUpdate",
                type: 'POST',
                data: JSON.stringify({
                    educationId : sessionStorage.getItem("educationId"),
                    institution_name : self.institution_name(),
                    qualification : self.qualification(),
                    from_date : self.from_date(),
                    to_date : self.to_date(),
                    file : self.filePath(),
                    fileContent : self.fileContent(),
                    fileName : self.fileName()
                }),
                dataType: 'json',
                timeout: sessionStorage.getItem("timeInetrval"),
                context: self,
                error: function (xhr, textStatus, errorThrown) {
                    if(textStatus == 'timeout'){
                        document.querySelector('#openAddEducationProgress').close();
                        document.querySelector('#Timeout').open();
                    }
                },
                success: function (data) {
                    document.querySelector('#openAddEducationProgress').close();
                    document.querySelector('#openAddEducationResult').open();
                    self.addEducationMsg(data[0]);
                    console.log("Success")
                }
            })   
          }
        }
        function refresh(){
            self.institution_name('');
            self.qualification('');
            self.from_date('');
            self.to_date('');
            self.filePath('');
            self.fileName('');
            self.fileContent('');
            self.DialogTitle('Add Education Details');
            self.secondaryCustomText('Please upload education certificate')
        }
    
        self.deleteConfirm = function (event,data) {
            //var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
            var clickedRowId = data.data.id
            sessionStorage.setItem("educationId", clickedRowId);
            console.log(clickedRowId)
            if(clickedRowId !=undefined){
                document.querySelector('#openDeleteConfirm').open();
            }         
           
        }
        self.deleteEducationInfo = function (event,data) {
            var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
            sessionStorage.setItem("educationId", clickedRowId);
            self.ResultTitle('Delete Education Details')
            console.log(clickedRowId)
            if(clickedRowId !=undefined){
                document.querySelector('#openDeleteConfirm').close();
                self.progressText('Please wait!Deleteing....')
                document.querySelector('#openAddUploadingProgress').open();
                 $.ajax({
                    url: BaseURL + "/jpDeleteEducationDetails",
                    type: 'POST',
                    data: JSON.stringify({
                        educationId : self.getDisplayValue(self.selectorSelectedItems())[0]
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
                        document.querySelector('#openAddUploadingProgress').close();
                        document.querySelector('#openAddEducationResult').open();
                        self.addEducationMsg(data[0]);
                        console.log("success")
                }
                })  

            }         
           
        }
        self.updateEducationStatus = function (event,data) {
            var BaseURL = sessionStorage.getItem("BaseURL")
            $.ajax({
                url: BaseURL+ "/jpStaffUpdateEducationStatus",
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
                   if(sessionStorage.getItem('education_status')=="Pending"){
                    sessionStorage.setItem('education_status','Audited');
                   }else if(sessionStorage.getItem('education_status')=="Audited"){
                    sessionStorage.setItem('education_status','Pending');
                   }
                   location.reload();
                }
            })  

        }
        self.previewClick = function (event) {
            // console.log(event.srcElement.id)  
            // var clickedId=event.srcElement.id
            // var file=clickedId.replace(/\s/g,'%20');
            // document.getElementById(clickedId).href = file;
            var data64=event.srcElement.id;
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
            }
            
            
          }
            return  EducationViewModel;

        });
