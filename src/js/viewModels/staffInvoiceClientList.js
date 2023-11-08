define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {
    
    class StaffInvoiceClientListViewModel {
        constructor(args) {
            var self = this;
            self.ClientDet = ko.observableArray([]);
            self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();
            var BaseURL = sessionStorage.getItem("BaseURL");
            self.router = args.parentRouter;

            self.connected = function () {
                if (sessionStorage.getItem("userName") == null) {
                    self.router.go({ path: 'signin' });
                }
                else {
                   app.onAppSuccess();
                   getClient();
                }
            };

            function getClient() {
                sessionStorage.removeItem("invoiceId") 
                sessionStorage.removeItem("draft")   
                self.ClientDet([]);
                $.ajax({
                    url: BaseURL + "/jpclientdetget",
                    type: 'GET',
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
                        //alert(data[2][1][1])
                        for (var i = 0; i < data[0].length; i++) {
                            self.ClientDet.push({'id': data[0][i][0], 'name' : data[0][i][1], 'BU' : data[0][i][2].business_unit , 'ClientType' : data[0][i][3] , 'Department' :data[0][i][4] , 'ClientGroup' : data[0][i][5] , 
                              'PContact' : data[0][i][6] , 'PEmail' : data[0][i][7] ,'PPhone' : data[0][i][17] + " " + data[0][i][8] ,'PPos' : data[0][i][9] , 'status' : data[0][i][15], 'count' : data[0][i][16] });

                    }

  
                    self.ClientDet.valueHasMutated();
                    return self;
                }
                })
            }
            this.dataProvider1 = new ArrayDataProvider(this.ClientDet, { keyAttributes: "id"});

            self.approvedTimesheet  = function (event,data) {
                var clickedRowId = data.data.id
                console.log(clickedRowId)
                sessionStorage.setItem("clientId", clickedRowId);
                self.router.go({path:'approvedTimeSheet'})
            }
            self.draftInvoiceList  = function (event,data) {
                var clickedRowId = data.data.id
                console.log(clickedRowId)
                sessionStorage.setItem("clientId", clickedRowId);
                self.router.go({path:'draftInvoiceList'})
            }
            self.publishInvoiceList  = function (event,data) {
                var clickedRowId = data.data.id
                console.log(clickedRowId)
                sessionStorage.setItem("clientId", clickedRowId);
                self.router.go({path:'publishInvoiceList'})
            }
            self.paidInvoiceList  = function (event,data) {
                var clickedRowId = data.data.id
                console.log(clickedRowId)
                sessionStorage.setItem("clientId", clickedRowId);
                self.router.go({path:'paidInvoiceList'})
            }
        }
    }
    return  StaffInvoiceClientListViewModel;
});