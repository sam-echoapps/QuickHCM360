define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class ClientPasswordModel {
        constructor(context) {
                var self = this;
                self.DepName = context.routerState.detail.dep_url;
                self.CancelBehaviorOpt = ko.observable('icon');
                self.userName = ko.observable();
                self.password = ko.observable();
                self.newPassword = ko.observable();
                self.confirmPassword = ko.observable();
                self.passwordError = ko.observable();
                var BaseURL = sessionStorage.getItem("BaseURL")
                self.clientActionBtn = ko.observable();
                self.groupValid = ko.observable();

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({ path: 'signin' });
                    }
                    else {
                       app.onAppSuccess();
                       getClientCredential();
                    }
                };
                function getClientCredential() {
                    $.ajax({
                       url: BaseURL + "/jpGetClientCredential",
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
                           self.userName(data[0])
                           self.password(data[1])
                   }
                   }) 
               }
                self.clientCredentialUpdate = function (event,data) {
                    var validSec = self._checkValidationGroup("passwordSec");
                    if(validSec && self.passwordError()==''){
                    document.querySelector('#openAddClientProgress').open();
                    $.ajax({
                        url: BaseURL + "/jpClientCredentialUpdate",
                        type: 'POST',
                        data: JSON.stringify({
                            clientId : sessionStorage.getItem("clientId"),
                            password : self.confirmPassword()
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            if(textStatus == 'timeout'){
                                document.querySelector('#openAddClientProgress').close();
                                document.querySelector('#Timeout').open();
                            }
                        },
                        success: function (data) {
                            document.querySelector('#openAddClientProgress').close();
                            location.reload()
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
            }
            
            
          }
            return  ClientPasswordModel;

        });
