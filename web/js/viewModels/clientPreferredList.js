define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class PreferredListStaffModel {
        constructor(context) {
                var self = this;
                self.DepName = context.routerState.detail.dep_url;
                var BaseURL = sessionStorage.getItem("BaseURL")
                self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();
                self.clientDet = ko.observableArray([]);
                self.CancelBehaviorOpt = ko.observable('icon'); 
                self.name = ko.observable();
                self.jobRole = ko.observable();
                self.gender = ko.observable();
                self.profilePhoto = ko.observable();
                self.dbsNumber = ko.observable();
                self.dbsExpiryDate = ko.observable();  
                self.movingFile_expiry_date = ko.observable();
                self.safeguarding_expiry_date = ko.observable();
                self.health_expiry_date = ko.observable();
                self.food_expiry_date = ko.observable();
                self.support_expiry_date = ko.observable();  
                self.coshh_expiry_date = ko.observable();
                self.safety_expiry_date = ko.observable();
                self.behaviour_expiry_date = ko.observable();
                self.epilepsy_expiry_date = ko.observable();
                self.act_expiry_date = ko.observable();
                self.prevention_expiry_date = ko.observable();
                self.disability_expiry_date = ko.observable();
                self.care_expiry_date = ko.observable();

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
                       url: BaseURL + "/jpGetPreferredStaffs",
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
                            self.clientDet.push({'id': data[0][i][0], 'staff_name' : data[0][i][1] + " " + data[0][i][2], 'job_role' : data[0][i][3], 'email' : data[0][i][4], 'phone' : data[0][i][6] + " " + data[0][i][5]  });
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
                    url: BaseURL+ "/jpClientRemovePreferredList",
                    type: 'POST',
                    data: JSON.stringify({
                        rowId : clickedRowId,
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
        
            self.downloadPDF = function (event,data) {
                    //alert("nmnm")

               /*  var clickedRowId = data.data.id
                var job_role=event.srcElement.id
                console.log(event)
                document.querySelector('#openRemovePreferredListProgress').open(); */
                var BaseURL = sessionStorage.getItem("BaseURL")
                $.ajax({
                    url: BaseURL+ "/jpProfilePDFGenerate",
                    type: 'POST',
                    /* data: JSON.stringify({
                        rowId : clickedRowId,
                    }), */
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
                      /*  document.querySelector('#openRemovePreferredListProgress').close();
                       //filterList()
                       location.reload(); */
                    }
                })  
    
            }

            self.profileView = function (event,data) {
                 var clickedRowId = data.data.id
                 var job_role=event.srcElement.id
                 console.log(clickedRowId)
                 document.querySelector('#openUserProfileInfo').open();
                 var BaseURL = sessionStorage.getItem("BaseURL")
                 $.ajax({
                     url: BaseURL+ "/jpStaffProfileGet",
                     type: 'POST',
                     data: JSON.stringify({
                         rowId : clickedRowId,
                     }),
                     dataType: 'json',
                     timeout: sessionStorage.getItem("timeInetrval"),
                     context: self,
                     error: function (xhr, textStatus, errorThrown) {
                         if(textStatus == 'timeout'){
                             document.querySelector('#openUserProfileInfo').close();
                             document.querySelector('#Timeout').open();
                         }
                     },
                     success: function (result) {
                       console.log(result)
                        data = JSON.parse(result[0]);
                        var data1 = JSON.parse(result[1]);
                        if(data1 == null){
                            self.movingFile_expiry_date('N/A')
                        }else{
                            self.movingFile_expiry_date(data1)
                        }
                        var data2 = JSON.parse(result[2]);
                        if(data2 == null){
                            self.safeguarding_expiry_date('N/A')
                        }else{
                            self.safeguarding_expiry_date(data2)
                        }
                        var data3 = JSON.parse(result[3]);
                        if(data3 == null){
                            self.health_expiry_date('N/A')
                        }else{
                            self.health_expiry_date(data3)
                        }
                        var data4 = JSON.parse(result[4]);
                        if(data4 == null){
                            self.food_expiry_date('N/A')
                        }else{
                            self.food_expiry_date(data4)
                        }
                        var data5 = JSON.parse(result[5]);
                        if(data5 == null){
                            self.support_expiry_date('N/A')
                        }else{
                            self.support_expiry_date(data5)
                        }
                        var data6 = JSON.parse(result[6]);
                        if(data6 == null){
                            self.coshh_expiry_date('N/A')
                        }else{
                            self.coshh_expiry_date(data6)
                        }
                        var data7 = JSON.parse(result[7]);
                        if(data7 == null){
                            self.safety_expiry_date('N/A')
                        }else{
                            self.safety_expiry_date(data7)
                        }
                        var data8 = JSON.parse(result[8]);
                        if(data8 == null){
                            self.behaviour_expiry_date('N/A')
                        }else{
                            self.behaviour_expiry_date(data8)
                        }
                        var data9 = JSON.parse(result[9]);
                        if(data9 == null){
                            self.epilepsy_expiry_date('N/A')
                        }else{
                            self.epilepsy_expiry_date(data9)
                        }
                        var data10 = JSON.parse(result[10]);
                        if(data10 == null){
                            self.act_expiry_date('N/A')
                        }else{
                            self.act_expiry_date(data10)
                        }
                        var data11 = JSON.parse(result[11]);
                        if(data11 == null){
                            self.prevention_expiry_date('N/A')
                        }else{
                            self.prevention_expiry_date(data11)
                        }
                        var data12 = JSON.parse(result[12]);
                        if(data12 == null){
                            self.disability_expiry_date('N/A')
                        }else{
                            self.disability_expiry_date(data12)
                        }
                        var data13 = JSON.parse(result[13]);
                        if(data13 == null){
                            self.care_expiry_date('N/A')
                        }else{
                            self.care_expiry_date(data13)
                        }
                        self.name(data[0] + " " + data[1] + " " + data[2])
                        self.jobRole(data[3])
                        self.gender(data[4])
                        self.profilePhoto(data[5])
                        if(data[6] == null){
                        self.dbsNumber('N/A')
                        }else{
                            self.dbsNumber(data[6])
                        }
                        if(data[7] == null){
                            self.dbsExpiryDate('N/A')
                            }else{
                                self.dbsExpiryDate(data[7])
                            }
                        // console.log(self.name())
                       /*  document.querySelector('#openRemovePreferredListProgress').close();
                        //filterList()
                        location.reload(); */
                     }
                 })  
     
             }
             
             self.closeProfile = ()=>{
                document.querySelector("#openUserProfileInfo").close();
            }

            }
            
            
          }
            return  PreferredListStaffModel;

        });
