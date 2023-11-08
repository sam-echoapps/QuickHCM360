define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class ClientAddressModel {
        constructor(context) {
                var self = this;
                self.postcode = ko.observable();
                self.address1 = ko.observable();
                self.address2 = ko.observable();
                self.city = ko.observable();
                self.address3 = ko.observable();
                self.addressLine1Error = ko.observable('');
                self.addressLine2Error = ko.observable('');
                self.townError = ko.observable('');
                self.postcodeError = ko.observable('');
                self.groupValid = ko.observable();
                var BaseURL = sessionStorage.getItem("BaseURL")
                self.clientActionBtn = ko.observable();

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({ path: 'signin' });
                    }
                    else {
                       app.onAppSuccess();
                       getClientAddress();
                    }
                };

                function getClientAddress() {
                     $.ajax({
                        url: BaseURL + "/jpClientAddress",
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
                             if(data[0].length==0){
                                self.clientActionBtn('Add')
                            }else{
                                self.clientActionBtn('Update')
                                var addressLine1 = document.getElementById("line_1");
                                addressLine1.value = data[0][0][3]
                                var addressLine2 = document.getElementById("line_2");
                                addressLine2.value = data[0][0][4]
                                var addressLine3 = document.getElementById("line_3");
                                addressLine3.value = data[0][0][6]
                                var post_town = document.getElementById("post_town");
                                post_town.value = data[0][0][5]
                                var postcode = document.getElementById("postcode");
                                postcode.value = data[0][0][2]
                            } 
                    }
                    }) 
                }
                self.clientAddressSave = function (event,data) {
                    var addressLine1 = document.getElementById("line_1");
                    if(addressLine1.value != ""){
                        self.address1(addressLine1.value);
                        self.addressLine1Error('');
                    }
                    else{
                        self.addressLine1Error("Please fill the address")
                    }

                /*     var addressLine2 = document.getElementById("line_2");
                    if(addressLine2.value != ""){
                        self.address2(addressLine2.value);
                        self.addressLine2Error('');
                    }
                    else{
                        self.addressLine2Error("Please fill the address")
                    } */
                    var addressLine2 = document.getElementById("line_2");
                    if(addressLine2.value != ""){
                        self.address2(addressLine2.value);
                    }else{
                        self.address2('');
                    }
                    var addressLine3 = document.getElementById("line_3");
                    if(addressLine3.value != ""){
                        self.address3(addressLine3.value);
                    }else{
                        self.address3('');
                    }
                    var postTown = document.getElementById("post_town");
                    if(postTown.value != ""){
                        self.city(postTown.value);
                        self.townError('');
                    }
                    else{
                        self.townError("Please enter your town")
                    }
                    var postcode = document.getElementById("postcode");
                    if(postcode.value != ""){
                        self.postcode(postcode.value);
                        self.postcodeError('');
                    }
                    else{
                        self.postcodeError("Please enter your postcode");
                    }
                    var validAddress = self._checkValidationGroup("clientAddSec");
                    if (validAddress  && self.addressLine1Error() == '' && self.townError() == '' && self.postcodeError() == '') {
                     document.querySelector('#openAddClientProgress').open();
                     $.ajax({
                        url: BaseURL + "/jpclientAddressUpdate",
                        type: 'POST',
                        data: JSON.stringify({
                            clientId : sessionStorage.getItem("clientId"),
                            postcode : self.postcode(),
                            address1 : self.address1(),
                            address2 : self.address2(),
                            city : self.city(),
                            address3 : self.address3(),
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
                            console.log(data)
                           document.querySelector('#openAddClientProgress').close();  
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
    
    
            }
            
            
          }
            return  ClientAddressModel;

        });
