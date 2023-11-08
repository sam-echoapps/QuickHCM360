define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {
    
    class InductionViewModel {
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

            self.connected = function () {
                if (sessionStorage.getItem("userName") == null) {
                    self.router.go({ path: 'signin' });
                }
                else {
                   app.onAppSuccess();
                }
            };
            
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

            self.inductionInfoSave = function (event,data) {
                self.ResultTitle('Create Induction Details')
                var validSec = self._checkValidationGroup("inductionCheck");  
                if (validSec) {
                    document.querySelector('#openAddInductionInfoProgress').open();
                    self.addInductionMsg('');
                   $.ajax({
                       url: BaseURL+ "/jpInductionInfoSave",
                       type: 'POST',
                       data: JSON.stringify({
                           induction_date : self.induction_date(),
                           induction_time : self.induction_time(),
                           induction_limit : self.induction_limit()
                       }),
                       dataType: 'json',
                       timeout: sessionStorage.getItem("timeInetrval"),
                       context: self,
                       error: function (xhr, textStatus, errorThrown) {
                           if(textStatus == 'timeout'){
                               document.querySelector('#openAddInductionInfoProgress').close();
                               document.querySelector('#Timeout').open();
                           }
                       },
                       success: function (data) {
                           document.querySelector('#openAddInductionInfoProgress').close();
                           document.querySelector('#openAddInductionInfoResult').open();
                           self.addInductionMsg(data[0]);
                           console.log("Success")
                       }
                   })   
                }
            }

            self.DBErrorOKClose = function (event) {
                document.querySelector('#openAddInductionInfoResult').close();
                //location.reload()
                window.location.href = "?ojr=induction%2FviewInduction%3Bindex%3D1"
            };

        }
    }
    return  InductionViewModel;
});