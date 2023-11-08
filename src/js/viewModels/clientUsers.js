define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class ManageUsersModel {
        constructor(context) {
                var self = this;
                self.DepName = context.routerState.detail.dep_url;
                self.CancelBehaviorOpt = ko.observable('icon');
                self.username = ko.observable();
                self.groupValid = ko.observable();
                var BaseURL = sessionStorage.getItem("BaseURL")
                self.ClientUsersDet = ko.observableArray([]);
                self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();
                self.contactPhone = ko.observable();
                self.contactEmail = ko.observable();  
                self.contactEmailEdit = ko.observable();
                self.contactPhoneEdit = ko.observable();
                self.emailError = ko.observable();
                self.contactError = ko.observable();
                self.emailErrorEdit = ko.observable();
                self.contactErrorEdit = ko.observable();
                self.user_type = ko.observable();
                self.choiceList = ko.observableArray([]);
                self.choiceList.push(
                    {'value' : 'Manager', 'label' : 'Manager'},
                    {'value' : 'Accounts', 'label' : 'Accounts'},
                );
                self.choiceListDP = new ArrayDataProvider(self.choiceList, {keyAttributes: 'value'});
                self.EditUserTypeDet = ko.observableArray([]);
                self.userName = ko.observable();
                self.password = ko.observable();
                self.newPassword = ko.observable();
                self.confirmPassword = ko.observable();
                self.passwordError = ko.observable();

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({ path: 'signin' });
                    }
                    else {
                       app.onAppSuccess();
                       getClientPortalUsers();
                    }
                };
                function getClientPortalUsers() {
                    self.ClientUsersDet([]);
                    $.ajax({
                       url: BaseURL + "/jpGetClientPortalUsers",
                       type: 'POST',
                       data: JSON.stringify({
                           clientId : sessionStorage.getItem("clientId")
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
                            self.ClientUsersDet.push({'id': data[0][i][0], 'client_id' : data[0][i][1], 'name': data[0][i][2], 'phone' : data[0][i][3], 'email': data[0][i][4], 'user_type' : data[0][i][5], 'status' : data[0][i][6] });
                            }
                    }
                        self.ClientUsersDet.valueHasMutated();
                        return self; 
                   }
                   }) 
               }
               self.dataProvider1 = new ArrayDataProvider(this.ClientUsersDet, { keyAttributes: "id"});
               
               self.getBadgeClass = (status) => {
                switch (status) {
                    case "Pending":
                        return "oj-badge oj-badge-success";
                    case "Deactive":
                        return "oj-badge oj-badge-danger";
                    default:
                        return "oj-badge";
                }
            };
            self.openAddClientUsersDialog = function (data, event) {
                refresh()
                document.querySelector('#openAddClientUsersDialog').open();
            }
            function refresh(){
                self.username('')
                self.contactEmail('')
                self.contactPhone('')
                self.user_type('')
            }
            self.userTypeSave = function (event,data) {
                var validSec = self._checkValidationGroup("usersSec");
                if(validSec && self.emailError() =='' && self.contactError() ==''){
                document.querySelector('#openAddClientUsersDialog').close();
                document.querySelector('#openAddClientUsersProgress').open();
                $.ajax({
                    url: BaseURL + "/jpClientPortalUsersSave",
                    type: 'POST',
                    data: JSON.stringify({
                        client_id : sessionStorage.getItem("clientId"),
                        username : self.username(),
                        phone : self.contactPhone(),
                        email : self.contactEmail(),
                        user_type : self.user_type()
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openAddClientUsersProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                        //console.log(data)
                        document.querySelector('#openAddClientUsersProgress').close();
                        location.reload()
                    }
                }) 
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
            self.deleteConfirm = function (event,data) {
                //var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
                var clickedRowId = data.data.id
                console.log(clickedRowId)
                if(clickedRowId !=undefined){
                    document.querySelector('#openDeleteConfirm').open();
                }         
               
            }
            self.deleteUserType = function (event,data) {
                var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
                console.log(clickedRowId)
                var BaseURL = sessionStorage.getItem("BaseURL");
                if(clickedRowId !=undefined){
                    document.querySelector('#openDeleteConfirm').close();
                    document.querySelector('#openDeleteUserTypeProgress').open();
                     $.ajax({
                        url: BaseURL + "/jpDeleteClientUser",
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
                            document.querySelector('#openDeleteUserTypeProgress').close();
                            location.reload()
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

            self.emailPatternValidator= function(event,data) {
                var BaseURL = sessionStorage.getItem("BaseURL");
                console.log(self.contactEmail())  
                var inputText=self.contactEmail()
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
                $.ajax({
                    url: BaseURL + "/jpStaffEmailExist",
                    method: 'POST',
                    data: JSON.stringify({ email: inputText }),
                    success: function(response) {
                        if(response == 1){
                            self.emailError("Email id already existed")
                        }
                    },
                    error: function(xhr, status, error) {
                      console.log("Error : "+xhr.responseText);
                    }
                  });    
             }

             self.onlyNumberKey= function(event,data) {
                console.log(event.detail.value)
                var ASCIICode= event.detail.value
                if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57) && ASCIICode.length==10){
                    self.contactError('')
                }else if(self.contactError() ==undefined){
                    self.contactError('');
                }else{
                    self.contactError("Invalid phone number.");
                }
             }

             self.onlyNumberKeyEdit= function(event,data) {
                console.log(event.detail.value)
                var ASCIICode= event.detail.value
                if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57) && ASCIICode.length==10){
                    self.contactErrorEdit('')
                }else if(self.contactErrorEdit() ==undefined){
                    self.contactErrorEdit('');
                }else{
                    self.contactErrorEdit("Invalid phone number.");
                }
             }

             self.editUserType = function (event,data) {
                //var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
                var clickedRowId = data.data.id
                sessionStorage.setItem("rowId", clickedRowId);
                console.log(clickedRowId)
                if(clickedRowId !=undefined){
                    document.querySelector('#openEditClientUsersDialog').open();
                    self.EditUserTypeDet([]);
                $.ajax({
                    url: BaseURL + "/jpEditClientPortalUser",
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
                        self.username(data[0][0][2])
                        self.contactPhoneEdit(data[0][0][3])
                        self.contactEmailEdit(data[0][0][4])
                        self.user_type(data[0][0][5])
                }
                })
                }         
               
            }

            self.checkNewPassword= function(event,data) {
                if(self.newPassword() == self.confirmPassword()){
                    self.passwordError('')
                }else{
                    self.passwordError('Password mismatch.')
                }
            }
            
            self.emailPatternValidatorEdit= function(event,data) {
                console.log(self.contactEmailEdit())  
                var inputText=self.contactEmailEdit()
                var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if(inputText.match(mailformat))
                {
                    self.emailErrorEdit('')
                }else if(self.emailErrorEdit() ==undefined){
                    self.emailErrorEdit('');
                }
                else
                {
                    self.emailErrorEdit("Should enter a valid email address.");
                    return false;
                } 
                /* $.ajax({
                    url: 'http://169.197.183.168:8050/jpStaffEmailExist',
                    method: 'POST',
                    data: JSON.stringify({ email: inputText }),
                    success: function(response) {
                        if(response == 1){
                            self.emailError("Email id already existed")
                        }
                    },
                    error: function(xhr, status, error) {
                      console.log("Error : "+xhr.responseText);
                    }
                  });    */
             }

             self.changePassword = function (event,data) {
                //var clickedRowId = self.getDisplayValue(self.selectorSelectedItems())[0];
                var clickedRowId = data.data.id
                console.log(clickedRowId)
                sessionStorage.setItem("rowId", clickedRowId);
                if(clickedRowId !=undefined){
                    document.querySelector('#openChangePasswordDialog').open();
                    $.ajax({
                        url: BaseURL + "/jpGetClientPortalUserCredential",
                        type: 'POST',
                        data: JSON.stringify({
                            clientId : sessionStorage.getItem("clientId"),
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
                            self.userName(data[0])
                            self.password(data[1])
                    }
                    }) 
                }         
               
            }
            self.clientCredentialUpdate = function (event,data) {
                var validSec = self._checkValidationGroup("passwordSec");
                if(validSec && self.passwordError()==''){
                document.querySelector('#openChangePasswordDialog').close();
                document.querySelector('#openUpdateCredentialProgress').open();
                $.ajax({
                    url: BaseURL + "/jpClientUserCredentialUpdate",
                    type: 'POST',
                    data: JSON.stringify({
                        clientId : sessionStorage.getItem("clientId"),
                        password : self.confirmPassword(),
                        rowId : sessionStorage.getItem("rowId")
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openUpdateCredentialProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                        //console.log(data)
                        document.querySelector('#openUpdateCredentialProgress').close();
                        location.reload()
                    }
                }) 
            }
            }
            self.userTypeUpdate = function (event,data) {
                var validSec = self._checkValidationGroup("usersSec");
                if(validSec && self.emailErrorEdit() =='' && self.contactErrorEdit() ==''){
                document.querySelector('#openEditClientUsersDialog').close();
                document.querySelector('#openUpdateClientUsersProgress').open();
                $.ajax({
                    url: BaseURL + "/jpClientPortalUsersUpdate",
                    type: 'POST',
                    data: JSON.stringify({
                        client_id : sessionStorage.getItem("clientId"),
                        username : self.username(),
                        phone : self.contactPhoneEdit(),
                        email : self.contactEmailEdit(),
                        user_type : self.user_type(),
                        rowId : sessionStorage.getItem("rowId")
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openUpdateClientUsersProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                        //console.log(data)
                        document.querySelector('#openUpdateClientUsersProgress').close();
                        location.reload()
                    }
                }) 
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
                if(clickedRowId !=undefined){
                    document.querySelector('#openSendConfirm').close();
                    document.querySelector('#openEmailSendingProgress').open();
                      $.ajax({
                        url: BaseURL + "/jpSendClientUserCredentials",
                        type: 'POST',
                        data: JSON.stringify({
                            client_user_id : clickedRowId
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
                            document.querySelector('#openEmailSendingProgress').close();
                            /* document.querySelector('#openReferenceSaveResult').open();
                            self.saveReferenceMsg(data[0]);
                            console.log("success") */
                            location.reload()
                    }
                    })  
     
                }         
               
            }

            self.deactivateConfirm = function (event,data) {
                var clickedRowId = data.data.id
                sessionStorage.setItem("client_user_id", clickedRowId);
                console.log(clickedRowId)
                if(clickedRowId !=undefined){
                    document.querySelector('#openDeactivateConfirm').open();
                }         
               
            }

            self.deactivatePortalUsers = function (event,data) {
                document.querySelector('#openDeactivateConfirm').close();
                document.querySelector('#openDeactivateProgress').open();
                var BaseURL = sessionStorage.getItem("BaseURL")
                $.ajax({
                    url: BaseURL+ "/jpClientPortalDeactivate",
                    type: 'POST',
                    data: JSON.stringify({
                        client_user_id : sessionStorage.getItem("client_user_id"),
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openDeactivateProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                       document.querySelector('#openDeactivateProgress').close();
                       console.log("Success")
                       location.reload(); 
                    }
                })  

            }
            self.activateConfirm = function (event,data) {
                var clickedRowId = data.data.id
                sessionStorage.setItem("client_user_id", clickedRowId);
                console.log(clickedRowId)
                if(clickedRowId !=undefined){
                    document.querySelector('#openActivateConfirm').open();
                }         
               
            }

            self.activatePortalUsers = function (event,data) {
                document.querySelector('#openActivateConfirm').close();
                document.querySelector('#openActivateProgress').open();
                var BaseURL = sessionStorage.getItem("BaseURL")
                $.ajax({
                    url: BaseURL+ "/jpClientPortalActivate",
                    type: 'POST',
                    data: JSON.stringify({
                        client_user_id : sessionStorage.getItem("client_user_id"),
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openActivateProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                       document.querySelector('#openActivateProgress').close();
                       console.log("Success")
                       location.reload(); 
                    }
                })  

            }
    
            }
            
            
          }
            return  ManageUsersModel;

        });
