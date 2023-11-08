define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class AddReferenceModel {
        constructor(context) {
                var self = this;
                self.DepName = context.routerState.detail.dep_url;
                self.startOpened = ko.observable(true);
                self.startToggle = () => self.startOpened(!self.startOpened());
                self.CancelBehaviorOpt = ko.observable('icon'); 
                
                self.buttonClick = ko.observable(true);
                self.ReferenceDet = ko.observableArray([]);
                
                self.DialogTitle=ko.observable('Add Reference Details')
                self.EditReferenceDet = ko.observableArray([]);
                self.typeError = ko.observable();
                self.progressText = ko.observable('');
                self.ResultTitle = ko.observable('');
                var BaseURL = sessionStorage.getItem("BaseURL")

                self.refer_name = ko.observable();
                self.jobList = ko.observableArray([]);
                self.refer_job = ko.observable();
                self.jobList.push(
                    {'value' : 'Administrator', 'label' : 'Administrator'},
                    {'value' : 'Colleague', 'label' : 'Colleague'},
                    {'value' : 'Employer', 'label' : 'Employer'},
                    {'value' : 'Manager', 'label' : 'Manager'},
                    {'value' : 'Professional Person', 'label' : 'Professional Person'}
                );
                self.jobListDP = new ArrayDataProvider(self.jobList, {keyAttributes: 'value'});
                self.refer_address = ko.observable();
                self.refer_company = ko.observable();
                self.refer_email = ko.observable();
                self.refer_contact = ko.observable();

                self.emailError = ko.observable();
                self.contactError = ko.observable();
                self.groupValid = ko.observable();  
                self.saveReferenceMsg = ko.observable();
                self.referenceActionBtn = ko.observable();
                self.referenceStatus = ko.observable('');

                self.userName = ko.observable();
                self.referenceFileText = ko.observable('Reference');
                self.referenceCustomText = ko.observable('Please upload your reference document');
                self.filePath = ko.observable();


                self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({ path: 'signin' });
                    }
                    else {
                       app.onAppSuccess();
                       getReference();
                    }
                };

                function getReference() {
                    self.ReferenceDet([]);
                    var BaseURL = sessionStorage.getItem("BaseURL")
                    $.ajax({
                        url: BaseURL + "/jpStaffReferenceGet",
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
                            if(data[0].length > 1){
                                document.getElementById('showAddBtn').style.display='none';
                            }else{
                                document.getElementById('showAddBtn').style.display='block';  
                            }

                                for (var i = 0; i < data[0].length; i++) {
                                self.ReferenceDet.push({'id': data[0][i][0], 'staff_id' : data[0][i][1], 'refer_name' : data[0][i][2] , 'refer_job' : data[0][i][3] , 'refer_address' :data[0][i][4], 'refer_company' : data[0][i][5] , 'refer_email' : data[0][i][6] , 'refer_contact' :data[0][i][7], 'referrer_status' :data[0][i][9], 'document' :data[0][i][10], 'file' :data[1][i]});   
                        } 
                        if(data[0][0][8] == "Pending") {
                            self.referenceStatus('Pending');
                        }else if(data[0][0][8] == "Audited") {
                            self.referenceStatus('Audited');
                        }  
                        self.ReferenceDet.valueHasMutated(); 
                        return self; 
                    }
                    })
                }
                this.dataProvider1 = new ArrayDataProvider(this.ReferenceDet, { keyAttributes: "id"});

                
                self.openAddReferenceDialog = function (data, event) {
                    self.referenceActionBtn('Add')
                    document.querySelector('#openAddReferenceDialog').open();
                    refresh();
                }
                self.referenceInfoSave = function (event,data) {
                    self.ResultTitle('Add Reference Details')
                    var validReferenceSave1 = self._checkValidationGroup("referAddSec1"); 
                    var validReferenceSave2 = self._checkValidationGroup("referAddSec2"); 
                    //alert(self.DepName())
                    var BaseURL = sessionStorage.getItem("BaseURL")
                    if (validReferenceSave1 && validReferenceSave2) {
                    document.querySelector('#openAddReferenceProgress').open();
                    self.saveReferenceMsg('');
                    $.ajax({
                        //url: self.DepName() + "/jpStaffProfilePhoto",
                        url: BaseURL + "/jpAddReferenceInfo",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("userId"),
                            refer_name : self.refer_name(),
                            refer_job : self.refer_job(),
                            refer_address : self.refer_address(),
                            refer_company : self.refer_company(),
                            refer_email : self.refer_email(),
                            refer_contact : self.refer_contact()
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            if(textStatus == 'timeout'){
                                document.querySelector('#openAddReferenceProgress').close();
                                document.querySelector('#Timeout').open();
                            }
                        },
                        success: function (data) {
                            document.querySelector('#openAddReferenceProgress').close();
                            document.querySelector('#openReferenceSaveResult').open();
                            self.saveReferenceMsg(data[0]);
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
                document.querySelector('#openReferenceSaveResult').close();
                document.querySelector('#openAddReferenceDialog').close();
                location.reload()
                getWork()
            };

            self.selectListener = function (event,data) {
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
                document.querySelector('#openAddUploadingProgress').open();
                self.typeError('')
                const reader = new FileReader();
                reader.readAsDataURL(files);
                
                reader.onload = ()=>{
                    $.ajax({
                        url: BaseURL + "/jpStaffFileUplaod",
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
                            document.querySelector('#openAddUploadingProgress').close();
                        }
                    })
                }
            }
            else{
                self.typeError('The document must be a file of type: pdf')
            }
          }

          self.editReferenceInfo = function (event,data) {
            refresh();
            self.DialogTitle('Update Reference Details')
            self.referenceActionBtn('Update')
            //var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
            var clickedRowId = data.data.id
            sessionStorage.setItem("referenceId", clickedRowId);
            console.log(clickedRowId)
            var BaseURL = sessionStorage.getItem("BaseURL")
            if(clickedRowId !=undefined){
                document.querySelector('#openAddReferenceDialog').open();
                self.EditReferenceDet([]);
                $.ajax({
                    url: BaseURL + "/jpEditReferenceInfo",
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
                        self.refer_name(data[0][2])
                        self.refer_job(data[0][3])
                        self.refer_address(data[0][4]) 
                        self.refer_company(data[0][5])
                        self.refer_email(data[0][6])
                        self.refer_contact(data[0][7]) 
                }
                })

            }         
           
        }

        self.referenceInfoUpdate = function (event,data) {
            self.ResultTitle('Update Reference Details')
            var validReferenceSave1 = self._checkValidationGroup("referAddSec1");
            var validReferenceSave2 = self._checkValidationGroup("referAddSec2");
            var BaseURL = sessionStorage.getItem("BaseURL")
            if (validReferenceSave1 && validReferenceSave2) {
                document.querySelector('#openAddReferenceProgress').open();
                self.saveReferenceMsg('');
                $.ajax({
                    //url: self.DepName() + "/jpStaffProfilePhoto",
                    url: BaseURL + "/jpReferenceUpdate",
                    type: 'POST',
                    data: JSON.stringify({
                        referenceId : sessionStorage.getItem("referenceId"),
                        refer_name : self.refer_name(),
                        refer_job : self.refer_job(),
                        refer_address : self.refer_address(),
                        refer_company : self.refer_company(),
                        refer_email : self.refer_email(),
                        refer_contact : self.refer_contact()
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openAddReferenceProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                        document.querySelector('#openAddReferenceProgress').close();
                        document.querySelector('#openReferenceSaveResult').open();
                        self.saveReferenceMsg(data[0]);
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
            self.refer_name('');
            self.refer_company('');
            self.refer_email('');
            self.refer_address('');
            self.refer_job('');
            self.refer_contact('');
            self.DialogTitle('Add Reference Details');
        }
        self.deleteConfirm = function (event,data) {
            //var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
            var clickedRowId = data.data.id
            console.log(clickedRowId)
            if(clickedRowId !=undefined){
                document.querySelector('#openDeleteConfirm').open();
            }         
           
        }
        self.deleteReferenceInfo = function (event,data) {
            var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
            self.ResultTitle('Delete Reference Details')
            console.log(clickedRowId)
            if(clickedRowId !=undefined){
                document.querySelector('#openDeleteConfirm').close();
                self.progressText('Please wait!Deleteing....')
                document.querySelector('#openAddUploadingProgress').open();
                 $.ajax({
                    url: BaseURL + "/jpDeleteReferenceDetails",
                    type: 'POST',
                    data: JSON.stringify({
                        referenceId : self.getDisplayValue(self.selectorSelectedItems())[0]
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
                        document.querySelector('#openReferenceSaveResult').open();
                        self.saveReferenceMsg(data[0]);
                        console.log("success")
                }
                })  

            }         
           
        }
        self.updateReferenceStatus = function (event,data) {
            var BaseURL = sessionStorage.getItem("BaseURL")
            $.ajax({
                url: BaseURL+ "/jpStaffUpdateReferenceStatus",
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
                   if(sessionStorage.getItem('reference_status')=="Pending"){
                    sessionStorage.setItem('reference_status','Audited');
                   }else if(sessionStorage.getItem('reference_status')=="Audited"){
                    sessionStorage.setItem('reference_status','Pending');
                   }
                   location.reload();
                }
            })  

        }

        self.emailPatternValidator= function(event,data) {
            console.log(self.refer_email())  
            var inputText=self.refer_email()
            var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if(inputText.match(mailformat))
            {
                self.emailError('')
            }else if(self.emailError() ==undefined){
                self.emailError('');
            }
            else
            {
                self.emailError("Should enter a valid email address.");
                return false;
            }   
         }

         self.onlyNumberKey= function(event,data) {
            console.log(event.detail.value)
            var ASCIICode= event.detail.value
            if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57) && ASCIICode.length==10){
                self.contactError('')
            }else if(self.contactError() ==undefined){
                self.contactError('');
            }
            else{
                self.contactError("Invalid phone number.");
            }
         }
         self.sendEmailConfirm = function (event,data) {
            //var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
            var clickedRowId = data.data.id
            console.log(clickedRowId)
            if(clickedRowId !=undefined){
                document.querySelector('#openSendConfirm').open();
            }         
           
        }
        self.sendEmailAction = function (event,data) {
            var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
            self.ResultTitle('Send Referrer Form')
            console.log(clickedRowId)
            if(clickedRowId !=undefined){
                document.querySelector('#openSendConfirm').close();
                self.progressText('Please wait!Email Sending....')
                document.querySelector('#openAddUploadingProgress').open();
                  $.ajax({
                    url: BaseURL + "/jpSendReferrerForm",
                    type: 'POST',
                    data: JSON.stringify({
                        referenceId : self.getDisplayValue(self.selectorSelectedItems())[0]
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
                        document.querySelector('#openReferenceSaveResult').open();
                        self.saveReferenceMsg(data[0]);
                        console.log("success")
                }
                })  
 
            }         
           
        }

        const getUserName = ()=>{
            $.ajax({                   
                url: BaseURL + "/jpEditStaffDetails",
                type: 'POST',
                data: JSON.stringify({
                    staffId : sessionStorage.getItem("userId"),
                }),
                dataType: 'json',
                success: function (data) {
                    self.userName(`${data[0][2]} ${data[0][3]}`)
                }
            })
        }

        getUserName()

        self.referName = ko.observable();
        self.relationShip = ko.observable();
        self.organisationName = ko.observable();
        self.jobTitle = ko.observable();
        self.logKnownCandidate = ko.observable();
        self.trustWorthy = ko.observable();
        self.anyCircumstance = ko.observable();
        self.otherInformation = ko.observable();
        
        self.viewFormDetails = function (event,data) {
            var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
            if(clickedRowId !=undefined){
                $.ajax({
                    url: BaseURL + "/getReferenceDetails",
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
                        let data = JSON.parse(result);
                        console.log(data);
                        self.DialogTitle(`Charater Reference Details For ${self.userName()}`)
                        self.referName(data[0][2])
                        self.relationShip(data[0][9])
                        self.logKnownCandidate(`${data[0][11]} - ${data[0][12]}`)
                        self.organisationName(data[0][13])
                        self.jobTitle(data[0][14])
                        self.trustWorthy(data[0][15])
                        self.anyCircumstance(data[0][17])
                        self.otherInformation(data[0][21])
                        document.querySelector('#openViewReferenceDialog').open();
                }
                })

            }
            
        }

        self.UploadDocument = function (event,data) {
            var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
            sessionStorage.setItem("referenceId", clickedRowId);
            console.log(clickedRowId)
            document.querySelector('#openFileUpload').open();
        }

        self.referenceDocUpload = function (event,data) {
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
            document.querySelector('#openAddUploadingProgress').open();
            self.typeError('')
            const reader = new FileReader();
            reader.readAsDataURL(files);
            
            reader.onload = ()=>{
                $.ajax({
                    url: BaseURL + "/jpStaffReferenceDocUplaod",
                    type: 'POST',
                    data: JSON.stringify({
                        file : reader.result,
                        file_name : fileName,
                        referenceId : sessionStorage.getItem("referenceId"),
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
                        document.querySelector('#openFileUpload').close();
                        getReference()

                    }
                })
            }
        }
        else{
            self.typeError('The document must be a file of type: pdf')
        }
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
            return  AddReferenceModel;

        });
