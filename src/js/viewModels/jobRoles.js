define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class JobRolesModel {
        constructor(context) {
                var self = this;
                self.DepName = context.routerState.detail.dep_url;
                self.CancelBehaviorOpt = ko.observable('icon');
                self.jobRole = ko.observableArray([]);
                var BaseURL = sessionStorage.getItem("BaseURL")
                self.clientActionBtn = ko.observable();

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({ path: 'signin' });
                    }
                    else {
                       app.onAppSuccess();
                       getJobRoles();
                    }
                };
                function getJobRoles() {
                    $.ajax({
                       url: BaseURL + "/jpGetJobRole",
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
                           if(data==''){
                               self.clientActionBtn('Add')
                           }else{
                               self.clientActionBtn('Update')
                               self.jobRole.push(data[0][2])
                               console.log(self.jobRole())
                               var myArray = self.jobRole()[0].split(",");
                               self.jobRole(myArray);
                           }  
                   }
                   }) 
               }
                self.clientRoleSave = function (event,data) {
                    document.querySelector('#openAddClientProgress').open();
                    $.ajax({
                        url: BaseURL + "/jpClientRoleUpdate",
                        type: 'POST',
                        data: JSON.stringify({
                            clientId : sessionStorage.getItem("clientId"),
                            jobRole : self.jobRole()
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
            
            
          }
            return  JobRolesModel;

        });
