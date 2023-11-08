define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {
 "use strict";
    class PaidInvoiceViewModel {
        constructor(args) {
            var self = this

            self.record = ko.observable();
            self.router = args.parentRouter;
            var BaseURL = sessionStorage.getItem("BaseURL")
            self.CancelBehaviorOpt = ko.observable('icon'); 

            self.PaidInvoiceDet = ko.observableArray([]);
            self.clientNameCap = ko.observable(); 
            self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();


            self.connected = function () {
                if (sessionStorage.getItem("userName") == null) {
                    self.router.go({path : 'signin'});
                }
                else {
                    app.onAppSuccess();
                    getPaidInvoice()
                }
            }

            function getPaidInvoice(){
                document.getElementById('loaderView').style.display='block';
                self.PaidInvoiceDet([]);
                $.ajax({
                    url: BaseURL  + "/jpGetPaidInvoiceList",
                    type: 'POST',
                    data: JSON.stringify({
                        clientId : sessionStorage.getItem("clientId"),
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
                        document.getElementById('loaderView').style.display='none';
                        document.getElementById('mainView').style.display='block';
                        var data = JSON.parse(result[0]);
                        console.log(data)
                        self.clientNameCap(result[1][0][0].toUpperCase())
                        for (var i = 0; i < data.length; i++) {
                            self.PaidInvoiceDet.push({'id': data[i][0],'serial_number': "INV"+(8000+data[i][0]),'start_date': data[i][1], 'end_date': data[i][2], 'grand_total': data[i][3]});
                    }
                    }
                })
                
               
            }
            self.dataProvider = new ArrayDataProvider(this.PaidInvoiceDet, { keyAttributes: "id"});

            self.viewPaidInvoice  = function (event,data) {
                var clickedRowId = data.data.id
                console.log(clickedRowId)
                sessionStorage.setItem("invoiceId", data.data.id);
                sessionStorage.setItem("startDate", data.data.start_date);
                sessionStorage.setItem("endDate", data.data.end_date);
                self.router.go({path:'viewPaidInvoice'})
            }

            self.ConfirmDeleteInvoice = function (event,data) {
                var clickedRowId = data.data.id
                sessionStorage.setItem("invoiceRowId", clickedRowId);
                console.log(clickedRowId)
                if(clickedRowId !=undefined){
                    document.querySelector('#openConfirmDeleteInvoice').open();  
                }          
             }

            self.deleteInvoice  = function (event,data) {
                document.querySelector('#openDeleteProgress').close();
                     $.ajax({
                        url: BaseURL + "/jpDeleteInvoice",
                        type: 'POST',
                        data: JSON.stringify({
                           rowId : sessionStorage.getItem("invoiceRowId")
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
                            document.querySelector('#openDeleteProgress').close();
                            console.log(data)
                            location.reload();
                    }
                    })          
               
            }
            
        }
        
    }
    return PaidInvoiceViewModel;
});