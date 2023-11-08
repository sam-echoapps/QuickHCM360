define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class PreferredListClientModel {
        constructor(context) {
                var self = this;
                self.DepName = context.routerState.detail.dep_url;
                var BaseURL = sessionStorage.getItem("BaseURL")
                self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();
                self.clientDet = ko.observableArray([]);


                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({ path: 'signin' });
                    }
                    else {
                       app.onAppSuccess();
                       getPreferredClients();
                    }
                };
                function getPreferredClients() {
                    $.ajax({
                       url: BaseURL + "/jpGetPreferredClients",
                       type: 'POST',
                       data: JSON.stringify({
                           staffId : sessionStorage.getItem("staffId")
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
                            self.clientDet.push({'id': data[0][i][0], 'client_name' : data[0][i][1], 'job_role' : data[0][i][2], 'contact': data[0][i][3], 'email' : data[0][i][4], 'phone' : data[0][i][7] + " " + data[0][i][5], 'client_type' : data[0][i][6]  });
                            }
                    }
                        self.clientDet.valueHasMutated();
                        return self;                    }
                   }) 
               }
               self.dataProvider1 = new ArrayDataProvider(this.clientDet, { keyAttributes: "id"});

               self.preferredListView = function (event) {
               window.location.href = "?ojr=prefferedList"
            }; 

            self.removeStaffPreferrdList = function (event,data) {
                var clickedRowId = data.data.id
                var job_role=event.srcElement.id
                console.log(event)
                document.querySelector('#openRemovePreferredListProgress').open();
                var BaseURL = sessionStorage.getItem("BaseURL")
                $.ajax({
                    url: BaseURL+ "/jpStaffRemovePreferredList",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId : sessionStorage.getItem("staffId"),
                        clientId : clickedRowId,
                        jobRole : job_role
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openRemovePreferredListProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                       console.log(data)
                       document.querySelector('#openRemovePreferredListProgress').close();
                       //filterList()
                       location.reload();
                    }
                })  
    
            }


            }
            
            
          }
            return  PreferredListClientModel;

        });
