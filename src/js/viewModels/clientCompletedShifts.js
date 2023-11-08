define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {
    class CompletedShiftsViewModel {
        constructor(args) {
            var self = this
                
            self.router = args.parentRouter;

            self.ClientDet = ko.observableArray([]);   
            self.client_name = ko.observable();
            var BaseURL = sessionStorage.getItem("BaseURL")
            self.selectedShift = ko.observable('');
            self.shiftDet = ko.observableArray([]);  
            self.ShiftPostDet = ko.observableArray([]);  
            self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();
            self.clientNameCap = ko.observable(); 
            self.currentDate = ko.observable(); 

            // var routerLength = args.parentRouter._routes.length;
            // if(routerLength!=8){
            //     location.reload();
            // }         

            self.connected = function () {
                if (sessionStorage.getItem("userName") == null) {
                    self.router.go({path : 'signin'});
                }
                else {
                    app.onAppSuccess();
                    getCompletedShifts()
                }
            }
            
            function getCompletedShifts() {
                self.ClientDet([]);
                $.ajax({
                    url: BaseURL  + "/jpClientCompletedShiftGet",
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
                    success: function (result) {
                    console.log(result)
                    const CurrentDate = new Date(); 
                    let currentYear= CurrentDate.getFullYear(); 
                    let currentMonth= CurrentDate.getMonth()+1; 
                    let currentDay= CurrentDate.getDate(); 
                    
                    if(currentMonth<10){
                        currentMonth = '0'+currentMonth;
                    }       
                    if(currentDay<10){
                        currentDay = '0'+currentDay;
                    }
                    self.currentDate(currentYear+'-'+currentMonth+'-'+currentDay)
        
                    for (var i = 0; i < result[0].length; i++) {
                        self.ClientDet.push({'value' : result[0][i][0], 'label' : result[0][i][1]});
                    }
                   //console.log(self.ClientDet())
                   var data = JSON.parse(result[1]);
                    console.log(data)
                    if(data.length !=0){ 
                        for (var i = 0; i < data.length; i++) {
                            self.ShiftPostDet.push({'id': data[i][0],'shift_name': data[i][1], 'department_name' : data[i][2], 'job_role' : data[i][3], 'shift_date' : data[i][4], 'start_time': data[i][5], 'end_time' : data[i][6], 'required_staff' : data[i][7], 'requested_by' : data[i][8], 'gender' : data[i][9], 'staff_extra_pay' : data[i][10], 'client_extra_pay' : data[i][11], 'comments' : data[i][12], 'client_name' : data[i][13], 'shift_id' : data[i][14], 'shift_status' : data[i][15], 'booking_status' : data[i][16]  });
                        }
                }
                self.clientNameCap(result[2][0][0].toUpperCase())
                    self.ShiftPostDet.valueHasMutated();
                    self.ClientDet.valueHasMutated();
                    return self; 
                }
                })
            }
            self.ClientDetDP = new ArrayDataProvider(self.ClientDet, {keyAttributes: 'value'});
            self.dataProvider1 = new ArrayDataProvider(this.ShiftPostDet, { keyAttributes: "id"});

        }
        
    }
    return CompletedShiftsViewModel;
});