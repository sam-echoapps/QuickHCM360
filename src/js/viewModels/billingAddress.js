define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class billingAddressModel {
        constructor(context) {
                var self = this;
                self.isChecked = ko.observable(false);
                self.billingAddress1 = ko.observable();
                self.billingAddress2 = ko.observable();
                self.billingAddress3 = ko.observable();
                self.billingPostTown = ko.observable();
                self.billingPostCode = ko.observable();
                self.paymentTerms = ko.observable();
                self.selectedInvoiceDueOn = ko.observable();
                self.selectedHolidayPayType = ko.observable();
                self.supportDocument = ko.observable();
                self.selectedPaymentMode = ko.observable();
                self.addClientPaymentMsg = ko.observable();
                self.checkItem = ko.observable(true);
                self.groupValid = ko.observable();
                var BaseURL = sessionStorage.getItem("BaseURL")
                self.clientActionBtn = ko.observable();

                self.InvoiceDueOn = ko.observableArray([]);

                self.InvoiceDueOnList = ko.observableArray([]);
                self.InvoiceDueOnList.push(
                    {'value' : '7', 'label' : '7 days'},
                    {'value' : '10', 'label' : '10 days'},
                    {'value' : '14', 'label' : '14 days'},
                    {'value' : '30', 'label' : '30 days'},
                    {'value' : '45', 'label' : '45 days'},  
                    {'value' : '60', 'label' : '60 days'},
                    {'value' : '90', 'label' : '90 days'},
                    {'value' : '1000', 'label' : 'End of billing month'},
                    {'value' : '1015', 'label' : '15 days after month end'},
                    {'value' : '1030', 'label' : '30 days after month end'},
                    {'value' : '1045', 'label' : '45 days after month end'},
                    {'value' : '1060', 'label' : '60 days after month end'}
    
                );
                self.InvoiceDueOnListDP = new ArrayDataProvider(self.InvoiceDueOnList, {keyAttributes: 'value'});
    
                self.HolidayPayType = ko.observableArray([]);
                self.HolidayPayTypeList = ko.observableArray([]);
                self.HolidayPayTypeList.push(
                    {'value' : '1', 'label' : '12a-12a Holiday (midnight to midnight) Pay'},
                    {'value' : '2', 'label' : 'Full Holiday Pay. [If shift touches holiday]'},
                    {'value' : '3', 'label' : 'Full Holiday Pay. [If Shift Starting on a holiday]'}
                );
                self.HolidayPayTypeListDP = new ArrayDataProvider(self.HolidayPayTypeList, {keyAttributes: 'value'});

                self.PaymentMode = ko.observableArray([]);
                self.PaymentModeList = ko.observableArray([]);
                self.PaymentModeList.push(
                    {'value' : '1', 'label' : 'Direct Payment'},
                    {'value' : '2', 'label' : 'Factoring Payment'}
                );
                self.PaymentModeListDP = new ArrayDataProvider(self.PaymentModeList, {keyAttributes: 'value'});

                self.postcode = ko.observable();
                self.address1 = ko.observable();
                self.address2 = ko.observable();
                self.city = ko.observable();

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({ path: 'signin' });
                    }
                    else {
                       app.onAppSuccess();
                       getClientPayment();
                    }
                };

                function getClientPayment() {
                    $.ajax({
                       url: BaseURL + "/jpClientPayment",
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
                                self.billingAddress1(data[0][0][2])
                                self.billingAddress2(data[0][0][3])
                                self.billingAddress3(data[0][0][12])
                                self.billingPostTown(data[0][0][4])
                                self.billingPostCode(data[0][0][5])
                                self.paymentTerms(data[0][0][6]) 
                                self.selectedInvoiceDueOn(data[0][0][7]) 
                                self.selectedHolidayPayType(data[0][0][8]) 
                                self.supportDocument(data[0][0][9]) 
                                self.selectedPaymentMode(data[0][0][10])
                                if(data[0][0][11]=="1"){
                                    self.isChecked(true);
                                }
                           } 
                   }
                   }) 
               }

                self.checkedValue = () => {
                    if(self.isChecked() === true){
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
                                if(data[0].length!=0){
                                    self.billingAddress1(data[0][0][3]);
                                    self.billingAddress2(data[0][0][4]);
                                    self.billingAddress3(data[0][0][6]);
                                    self.billingPostTown(data[0][0][5]);
                                    self.billingPostCode(data[0][0][2]);
                                }
                        }
                        }) 
    
                        }else if(self.isChecked() === false){
                            self.billingAddress1('')
                            self.billingAddress2('')
                            self.billingAddress3('')
                            self.billingPostTown('')
                            self.billingPostCode('')
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
                                    if(data[1].length!=0){
                                        self.billingAddress1(data[1][0][2])
                                        self.billingAddress2(data[1][0][3])
                                        self.billingAddress3(data[1][0][12])
                                        self.billingPostTown(data[1][0][4])
                                        self.billingPostCode(data[1][0][5])
                                    }
                            }
                            }) 
                        }
                    }

                self.clientAddPaymentSave = function (event,data) {
                    var validPaySec1 = self._checkValidationGroup("clientPaySec1");
                    var validPaySec2 = self._checkValidationGroup("clientPaySec2");
                    if (validPaySec1&&validPaySec2) {
                        // submit the form would go here
                         //alert('everything is valid; submit the form');
                    
                    //document.querySelector('#openAddClientDialog').close();
                    document.querySelector('#openAddClientProgress').open(); 
                    console.log(self.selectedPaymentMode())
                    console.log(self.selectedPaymentMode()[0]) 
                    self.addClientPaymentMsg('');
                    $.ajax({
                        url: BaseURL + "/jpclientupdatepayment",
                        type: 'POST',
                        data: JSON.stringify({
                            clientId : sessionStorage.getItem("clientId"),
                            billingAddress1 : self.billingAddress1(),
                            billingAddress2 : self.billingAddress2(),
                            billingAddress3 : self.billingAddress3(),
                            billingPostTown : self.billingPostTown(),
                            billingPostCode : self.billingPostCode(),
                            paymentTerms : self.paymentTerms(),
                            selectedInvoiceDueOn : self.selectedInvoiceDueOn(),
                            selectedHolidayPayType : self.selectedHolidayPayType(),
                            supportDocument : self.supportDocument(),
                            selectedPaymentMode : self.selectedPaymentMode(),  
                            address_decision : self.isChecked()
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
                           /* document.querySelector('#openAddClientProgress').close();
                            document.querySelector('#openAddClientPaymentResult').open();
                            self.addClientPaymentMsg(data[0]);
    
                            return self; */
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
            return  billingAddressModel;

        });
