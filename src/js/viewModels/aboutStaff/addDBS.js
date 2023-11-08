define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class DBSViewModel {
        constructor(context) {
                var self = this;
                self.DepName = context.routerState.detail.dep_url;
                self.startOpened = ko.observable(true);
                self.startToggle = () => self.startOpened(!self.startOpened());
                var BaseURL = sessionStorage.getItem("BaseURL")
                self.groupValid = ko.observable();
                self.dbsFileText = ko.observable('DBS');
                self.updateFileText = ko.observable('Update Service');
                self.secondaryCustomText = ko.observable('Please upload Update Service document');
                self.DBSCustomText = ko.observable('Please upload DBS document');
                self.uploadDocumentMsg = ko.observable();
                self.dbsNumber = ko.observable();
                self.requiredDBS = ko.observable();  
                self.uploadError = ko.observable("*");
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
                self.progressDialog =ko.observable('Saving DBS Details')
                self.addDBSMsg = ko.observable();  
                self.DBSDet = ko.observableArray([]);
                self.DBSActionBtn = ko.observable('');
                self.dbsStatus = ko.observable('');
                self.dbsFile = ko.observable('');
                self.updateFile = ko.observable('');
                self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();
                self.CancelBehaviorOpt = ko.observable('icon'); 
                self.dbsRowId = ko.observable();
                self.dbsRequested = ko.observable();
                self.typeError = ko.observable();
                self.typeError1 = ko.observable();


                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({ path: 'signin' });
                    }
                    else {
                       app.onAppSuccess();
                       document.getElementById('listDBS').style.display='none'; 
                       getDBSData();
                    }
                };

                function getDBSData(){
                    self.DBSDet([]);
                    var BaseURL = sessionStorage.getItem("BaseURL")
                    $.ajax({
                        url: BaseURL + "/jpEditDBSInfo",
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
                            console.log(result)
                            var data = JSON.parse(result[1]);
                            console.log(data)
                            if(data.length !=0){ 
                                document.getElementById('listDBS').style.display='block'; 
                                document.getElementById('dbsQuestion').style.display='none'; 
                                document.getElementById('dbsHint').style.display='none'; 
                                document.getElementById('have_dbs').style.display='none'; 
                                self.DBSActionBtn('Update')
                                self.dbs_expiry_date('')
                                self.dbsNumber('')
                                self.dbsSec('')
                            }

                           if(result[0].length ==0){
                                self.DBSActionBtn('Add')
                                document.getElementById('dbsQuestion').style.display='block'; 
                                document.getElementById('dbsHint').style.display='block'; 
                                document.getElementById('listDBS').style.display='none'; 
                            }
                            if(result[0].length!=0){
                                self.dbsRowId(result[0][0][0])
                                self.dbsNumber(result[0][0][2])
                                self.dbs_expiry_date(data[0][6])
                                }
                            if(data.length ==2){
                                self.DBSDet.push({'dbs_number' : result[0][0][2], 'dbs_certificate' : result[3][0], 'update_certificate' : result[3][1], 'expiry_date' : data[0][6] }); 
                            }else if(data.length == 1){
                                self.DBSDet.push({'dbs_number' : result[0][0][2], 'dbs_certificate' : result[3][0], 'update_certificate' : 'Not Uploaded', 'expiry_date' : data[0][6] }); 
                            }
                            if(data.length != 0){
                                if(data[0][7] == "Pending") {
                                    self.dbsStatus('Pending');
                                }else if(data[0][7] == "Audited") {
                                    self.dbsStatus('Audited');
                                }  
                
                           /*  for (var i = 0; i < data.length; i++) {
                                if(data[i][6]){
                                self.DBSDet.push({'id': data[i][0], 'staff_id' : data[i][1], 'file_type' : data[i][2] , 'file_type_additional' : data[i][3] , 'file_name' :data[i][4] ,  'certificate' : data[i][5],'expiry_date' : data[i][6] }); 
                                }else{
                                    self.DBSDet.push({'id': data[i][0], 'staff_id' : data[i][1], 'file_type' : data[i][2] , 'file_type_additional' : data[i][3] , 'file_name' :data[i][4] , 'certificate' : data[i][5],'expiry_date' : data[i][6] }); 
                                }  
                        } */
                        
                        
                       
                    }
                    if(result[2][0][2] == 'Requested'){
                        self.dbsRequested('yes');
                   }
                            /* if(data[0].length !=0){ 
                                document.getElementById('have_dbs').style.display='block'; 
                                document.getElementById('dbsQuestion').style.display='none'; 
                                document.getElementById('dbsHint').style.display='none'; 
                                self.dbsNumber(data[0][0][2])
                                self.dbsFile(result[0][4])
                                self.updateFile(result[1][4])
                                document.getElementById("dbs").href = result[0][5];
                                document.getElementById("update").href = result[1][5];
                                self.dbs_expiry_date(result[0][6])
                                self.uploadError('')
                                self.DBSActionBtn('Update')
                                self.requiredDBS(true)
                                if(result[0][7] == "Pending") {
                                    self.dbsStatus('Pending');
                                }else if(result[0][7] == "Audited") {
                                    self.dbsStatus('Audited');
                                }  

                            }  */
                              
      
                        self.DBSDet.valueHasMutated();
                        return self; 
                    }
                    })                
                }

                this.dataProvider1 = new ArrayDataProvider(this.DBSDet, { keyAttributes: "id"});

              self.DBErrorOKClose = function (event) {
                document.querySelector('#openUpdateDBSDialog').close();
                document.querySelector('#openAddDBSResult').close();
                self.DBSCustomText("Please upload DBS document")
                self.secondaryCustomText("Please upload Update Service document")
                getDBSData();
            };
            self.getDisplayValue = function (set) {
                var arr = [];
                set.values().forEach(function (key) {
                    arr.push(key);
                });
                return arr;
            }; 
            self.DBSSecShow = function (event,data) {
                if(self.dbsSec()=='Yes'){
                    document.getElementById('have_dbs').style.display='block';
                    document.getElementById('no_dbs').style.display='none';
                    self.requiredDBS(true)
                }else if(self.dbsSec()=='No'){
                    document.getElementById('no_dbs').style.display='block';
                    document.getElementById('have_dbs').style.display='none';
                    self.requiredDBS(false)
                }
    
            }

            self.dbsSubmit = function (event,data) {
                self.uploadError('')
                var file = event.detail.files[0];
                //console.log(file)
                const result = event.detail.files;
                const files = result[0];
                var DBSFileName= files.name;
                var uploadURL = BaseURL + "/css/uploads/";
                var filePath= uploadURL+DBSFileName;
                //alert(self.movingFile_expiry_date())
                if(self.dbs_expiry_date() == undefined){
                    self.dbs_expiry_date('1990-01-01')
                } 
                //console.log(DBSFileName)
                var fileFormat =files.name.split(".");
                var checkFormat =fileFormat[1];
            
                if(checkFormat == 'pdf'){
                self.typeError('')
                const reader = new FileReader();
                reader.readAsDataURL(files);
                
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
                            file_name : DBSFileName,
                            file : fileContent,
                            file_type : "DBS", 
                            file_type_additional : "DBS",
                            file_path : filePath,
                            expiry_date : self.dbs_expiry_date()
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
                            self.DBSCustomText(DBSFileName)
                            document.querySelector('#openAddUploadingProgress').close();
                            /* document.querySelector('#openFileUploadResult').open();
                            self.uploadDocumentMsg(data[0]); */
                        }
                    })      
                }
            } else{
                self.typeError('The certificate must be a file of type: pdf')
            }
            }

            self.updateService = function (event,data) {
                var file = event.detail.files[0];
                //console.log(file)
                const result = event.detail.files;
                const files = result[0];
                var fileName= files.name;
                var uploadURL = BaseURL + "/css/uploads/";
                var filePath= uploadURL+fileName;
                //alert(self.movingFile_expiry_date())
                    self.update_expiry_date('1990-01-01')
                
                //console.log(fileName)
                var fileFormat =files.name.split(".");
                var checkFormat =fileFormat[1];
            
                if(checkFormat == 'pdf'){
                self.typeError1('')
                const reader = new FileReader();
                reader.readAsDataURL(files);
                
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
                            file_type : "Update Service", 
                            file_type_additional : "DBS",
                            file_path : filePath,
                            expiry_date : self.update_expiry_date()
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
                            self.secondaryCustomText(fileName)
                            document.querySelector('#openAddUploadingProgress').close();
                            /* document.querySelector('#openFileUploadResult').open();
                            self.uploadDocumentMsg(data[0]); */
                        }
                    })      
                }
            } else{
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

            self.staffDBSSave = function (event,data) {
                self.ResultTitle('Add DBS Details')
                var validSec = self._checkValidationGroup("dbsNumSec");  
                if (validSec && self.uploadError() == '') {
                    document.querySelector('#openAddDBSProgress').open();
                     self.addDBSMsg('');
                    $.ajax({
                        url: BaseURL+ "/jpStaffDBSAdd",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("userId"),
                            dbs_number : self.dbsNumber(),
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            if(textStatus == 'timeout'){
                                document.querySelector('#openAddDBSProgress').close();
                                document.querySelector('#Timeout').open();
                            }
                        },
                        success: function (data) {
                            document.querySelector('#openAddDBSProgress').close();
                            document.querySelector('#openAddDBSResult').open();
                            self.addDBSMsg(data[0]);
                            console.log("Success")
                        }
                    })   
                }
          }

          self.staffDBSUpdate = function (event,data) {
            self.ResultTitle('Update DBS Details')
            var validSec = self._checkValidationGroup("dbsNumSec");
         if (validSec) {     
                document.querySelector('#openAddDBSProgress').open();
                 self.addDBSMsg('');
                $.ajax({
                    url: BaseURL+ "/jpUpdateDBSInfo",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId : sessionStorage.getItem("userId"),
                        dbs_number : self.dbsNumber(),
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openAddDBSProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                        document.querySelector('#openAddDBSProgress').close();
                       /*  document.querySelector('#openAddDBSResult').open();
                        self.addDBSMsg(data[0]); */
                        console.log("Success")
                        location.reload()
                    }
                })   
            }
      }

      self.updateDBSStatus = function (event,data) {
        var BaseURL = sessionStorage.getItem("BaseURL")
        $.ajax({
            url: BaseURL+ "/jpStaffUpdateDBSStatus",
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
               if(sessionStorage.getItem('section_status')=="Pending"){
                sessionStorage.setItem('dbs_status','Audited');
               }else if(sessionStorage.getItem('section_status')=="Audited"){
                sessionStorage.setItem('dbs_status','Pending');
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
        //window.open("data:application/octet-stream;charset=utf-16le;base64,"+data64);

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
    
    self.editDBSInfo = function (event) {
         document.querySelector('#openUpdateDBSDialog').open();
         console.log(event)
    }; 
    self.dbsRequestMailSend = function (event) {
        self.ResultTitle('DBS Request Sent')
        self.progressDialog('Please wait! Rquest Email Sending...')
        document.querySelector('#openAddDBSProgress').open();
        var BaseURL = sessionStorage.getItem("BaseURL")
        $.ajax({
            url: BaseURL+ "/jpStaffRequestMailSend",
            type: 'POST',
            data: JSON.stringify({
                staff_id : sessionStorage.getItem("userId"),
            }),
            dataType: 'json',
            timeout: sessionStorage.getItem("timeInetrval"),
            context: self,
            error: function (xhr, textStatus, errorThrown) {
                if(textStatus == 'timeout'){
                    document.querySelector('#openAddDBSProgress').close();
                    document.querySelector('#Timeout').open();
                }
            },
            success: function (data) {
                document.querySelector('#openAddDBSProgress').close();
                /* document.querySelector('#openAddDBSResult').open();
                self.addDBSMsg(data[0]); */
                location.reload()
            }
        })  

    };  
    
    self.deleteDBSInfo = function (event,data) {
        self.ResultTitle('Delete DBS Details')
            document.querySelector('#openDeleteConfirm').close();
            document.querySelector('#openDeleteDBSProgress').open();
             $.ajax({
                url: BaseURL + "/jpDeleteDBSDetails",
                type: 'POST',
                data: JSON.stringify({
                    staff_id : sessionStorage.getItem("staffId"),
                    dbsId : self.dbsRowId() 
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
                    document.querySelector('#openDeleteDBSProgress').close();
                    document.querySelector('#openAddDBSResult').open();
                    self.addDBSMsg(data[0]);
                    console.log("success")
            }
            })  
        
       
    }

     self.deleteConfirm = function (event,data) {
                document.querySelector('#openDeleteConfirm').open();                   
        }
        
            
          }
        }
            return  DBSViewModel;

        });
