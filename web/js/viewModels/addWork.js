define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class WorkViewModel {
        constructor(context) {
                var self = this;
                self.DepName = context.routerState.detail.dep_url;
                self.startOpened = ko.observable(true);
                self.startToggle = () => self.startOpened(!self.startOpened());
                self.CancelBehaviorOpt = ko.observable('icon'); 
                self.employer_name = ko.observable();
                self.business_type = ko.observable();
                self.job_title = ko.observable();
                self.WorkActionBtn = ko.observable();
                self.groupValid = ko.observable();
                self.addWorkMsg = ko.observable();
                self.buttonClick = ko.observable(true);
                self.WorkDet = ko.observableArray([]);
                self.primaryCustomText = ko.observable('Certificate');
                self.secondaryCustomText = ko.observable('Please upload experience certificate');
                self.filePath = ko.observable();
                self.DialogTitle=ko.observable('Add Work Details')
                self.EditWorkDet = ko.observableArray([]);
                self.typeError = ko.observable();
                self.progressText = ko.observable('');
                self.ResultTitle = ko.observable('');
                var BaseURL = sessionStorage.getItem("BaseURL")
                self.workStatus = ko.observable('');
                self.workFile = ko.observable('');

                self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({ path: 'signin' });
                    }
                    else {
                       app.onAppSuccess();
                       getWork();
                    }
                };

                function getWork() {
                    self.WorkDet([]);
                    var BaseURL = sessionStorage.getItem("BaseURL")
                    $.ajax({
                        url: BaseURL + "/jpStaffWorkGet",
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
                        success: function (data) {
                            console.log(data)
 
                        for (var i = 0; i < data[0].length; i++) {
                            if(data[0][i][6]){
                                self.WorkDet.push({'id': data[0][i][0], 'staff_id' : data[0][i][1], 'employer_name' : data[0][i][2] , 'business_type' : data[0][i][3] , 'job_title' :data[0][i][4], 'certificate' : data[0][i][6], 'file' : data[1][i] }); 
                            }else{
                                self.WorkDet.push({'id': data[0][i][0], 'staff_id' : data[0][i][1], 'employer_name' : data[0][i][2] , 'business_type' : data[0][i][3] , 'job_title' :data[0][i][4], 'certificate' : "Not Uploaded" }); 
                            }  
                    }
                        if(data[0][0][5] == "Pending") {
                            self.workStatus('Pending');
                        }else if(data[0][0][5] == "Audited") {
                            self.workStatus('Audited');
                        }  
                        self.WorkDet.valueHasMutated();
                        return self; 
                    }
                    })
                }
                this.dataProvider1 = new ArrayDataProvider(this.WorkDet, { keyAttributes: "id"});

                
                self.openAddWorkDialog = function (data, event) {
                    self.WorkActionBtn('Add')
                    document.querySelector('#openAddWorkDialog').open();
                    refresh();
                }
                self.staffWorkSave = function (event,data) {
                    self.ResultTitle('Add Work Details')
                    var validSec1 = self._checkValidationGroup("staffWorkSec1");
                    var validSec2 = self._checkValidationGroup("staffWorkSec2");
                    var BaseURL = sessionStorage.getItem("BaseURL")
                    if (validSec1 && validSec2) {
                    document.querySelector('#openAddWorkDialog').close();
                    document.querySelector('#openAddWorkProgress').open();
                     self.addWorkMsg('');
                    $.ajax({
                        url: BaseURL+ "/jpStaffWorkAdd",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("staffId"),
                            employer_name : self.employer_name(),
                            business_type : self.business_type(),
                            job_title : self.job_title(),
                            file : self.filePath()
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            if(textStatus == 'timeout'){
                                document.querySelector('#openAddWorkProgress').close();
                                document.querySelector('#Timeout').open();
                            }
                        },
                        success: function (data) {
                            document.querySelector('#openAddWorkProgress').close();
                            document.querySelector('#openAddWorkResult').open();
                            self.addWorkMsg(data[0]);
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

            self.DBErrorOKClose = function (event) {
                document.querySelector('#openAddWorkResult').close();
                document.querySelector('#openAddWorkDialog').close();
                location.reload()
                getWork()
            };

            self.selectListener = function (event,data) {
                var uploadURL = BaseURL + "/css/uploads/";
                const result = event.detail.files;
                const files = result[0];
                var fileName= files.name;
                var filePath= uploadURL+fileName;
                // self.filePath(filePath);
                self.filePath(fileName);

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

          self.editWorkInfo = function (event,data) {
            refresh();
            self.DialogTitle('Update Work Details')
            self.WorkActionBtn('Update')
            //var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
            var clickedRowId = data.data.id
            sessionStorage.setItem("workId", clickedRowId);
            console.log(clickedRowId)
            var BaseURL = sessionStorage.getItem("BaseURL")
            if(clickedRowId !=undefined){
                document.querySelector('#openAddWorkDialog').open();
                self.EditWorkDet([]);
                $.ajax({
                    url: BaseURL + "/jpEditWorkDetails",
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
                        console.log(data)
                        self.employer_name(data[0][2])
                        self.business_type(data[0][3])
                        self.job_title(data[0][4])
                        if(data[0][5]){
                        self.workFile(data[0][3])
                        document.getElementById("work").href = data[0][5];
                        }
                }
                })

            }         
           
        }

        self.staffWorkUpdate = function (event,data) {
            self.ResultTitle('Update Work Details')
            var validSec1 = self._checkValidationGroup("staffWorkSec1");
            var validSec2 = self._checkValidationGroup("staffWorkSec2");
            var BaseURL = sessionStorage.getItem("BaseURL")
            if(self.filePath() == undefined){
                self.filePath('NULL')
            }
            if (validSec1 && validSec2) {
            document.querySelector('#openAddWorkDialog').close();
            document.querySelector('#openAddWorkProgress').open();
            self.addWorkMsg('');
             $.ajax({
                url: BaseURL + "/jpUpdateWorkDetails",
                type: 'POST',
                data: JSON.stringify({
                    workId : sessionStorage.getItem("workId"),
                    employer_name : self.employer_name(),
                    business_type : self.business_type(),
                    job_title : self.job_title(),
                    file : self.filePath()
                }),
                dataType: 'json',
                timeout: sessionStorage.getItem("timeInetrval"),
                context: self,
                error: function (xhr, textStatus, errorThrown) {
                    if(textStatus == 'timeout'){
                        document.querySelector('#openAddWorkProgress').close();
                        document.querySelector('#Timeout').open();
                    }
                },
                success: function (data) {
                    console.log(data)
                   document.querySelector('#openAddWorkProgress').close();
                   document.querySelector('#openAddWorkResult').open();
                   self.addWorkMsg(data[0]);
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
        function refresh(){
            self.employer_name('');
            self.business_type('');
            self.job_title('');
            self.filePath('');
            self.DialogTitle('Add Work Details');
            self.secondaryCustomText('Please upload experience certificate')
        }
        self.deleteConfirm = function (event,data) {
            //var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
            var clickedRowId = data.data.id
            sessionStorage.setItem("workId", clickedRowId);
            console.log(clickedRowId)
            if(clickedRowId !=undefined){
                document.querySelector('#openDeleteConfirm').open();
            }         
           
        }
        self.deleteWorkInfo = function (event,data) {
            var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
            sessionStorage.setItem("workId", clickedRowId);
            self.ResultTitle('Delete Work Details')
            console.log(clickedRowId)
            if(clickedRowId !=undefined){
                document.querySelector('#openDeleteConfirm').close();
                self.progressText('Please wait!Deleteing....')
                document.querySelector('#openAddUploadingProgress').open();
                 $.ajax({
                    url: BaseURL + "/jpDeleteWorkDetails",
                    type: 'POST',
                    data: JSON.stringify({
                        workId : self.getDisplayValue(self.selectorSelectedItems())[0]
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
                        document.querySelector('#openAddWorkResult').open();
                        self.addWorkMsg(data[0]);
                        console.log("success")
                }
                })  

            }         
           
        }
        self.updateWorkStatus = function (event,data) {
            var BaseURL = sessionStorage.getItem("BaseURL")
            $.ajax({
                url: BaseURL+ "/jpStaffUpdateWorkStatus",
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
                   if(sessionStorage.getItem('work_status')=="Pending"){
                    sessionStorage.setItem('work_status','Audited');
                   }else if(sessionStorage.getItem('work_status')=="Audited"){
                    sessionStorage.setItem('work_status','Pending');
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
            return  WorkViewModel;

        });
