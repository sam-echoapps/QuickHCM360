define(['ojs/ojcore', 'knockout', 'jquery', 'appController', "ojs/ojmodulerouter-adapter", "ojs/ojarraydataprovider", 'ojs/ojknockout-keyset', "ojs/ojlistitemlayout",
    "ojs/ojknockout", "ojs/ojlistview", "ojs/ojmodule-element"], 
    function (oj, ko, $, app, ModuleRouterAdapter, ArrayDataProvider,ojknockout_keyset_1) {
    "use strict";
    class CompletedShiftsModel {
        constructor(args) {
            var self = this

            self.record = ko.observable();
            self.router = args.parentRouter;

            var BaseURL = sessionStorage.getItem("BaseURL");
            self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();
            self.ShiftPostDet = ko.observableArray([]);  

            self.connected = function () {
                if (sessionStorage.getItem("userName") == null) {
                    self.router.go({path : 'signin'});
                }
                else {
                    app.onAppSuccess();
                    getShiftsInfo()
                }
            }

            function getShiftsInfo(){
                self.ShiftPostDet([]);
                $.ajax({
                    url: BaseURL + "/jpGetCompletedShifts",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId : sessionStorage.getItem("userId")
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
                        var data = JSON.parse(result);
                        console.log(data)
                        if(data.length !=0){ 
                            for (var i = 0; i < data.length; i++) {
                                const StartTimeString = data[i][6]
                                const StartTimeParts = StartTimeString.split(":");
                                const startHours = parseInt(StartTimeParts[0], 10);
                                const startMinutes = parseInt(StartTimeParts[1], 10);
                                const startSeconds = parseInt(StartTimeParts[2], 10);
                                const startDate = new Date();
                                startDate.setHours(startHours);
                                startDate.setMinutes(startMinutes);
                                startDate.setSeconds(startSeconds);
                                const formattedStartTime = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

                                const EndTimeString = data[i][7];
                                const EndTimeParts = EndTimeString.split(":");
                                const endHours = parseInt(EndTimeParts[0], 10);
                                const endMinutes = parseInt(EndTimeParts[1], 10);
                                const endSeconds = parseInt(EndTimeParts[2], 10);
                                const endDate = new Date();
                                endDate.setHours(endHours);
                                endDate.setMinutes(endMinutes);
                                endDate.setSeconds(endSeconds);
                                const formattedEndTime = endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    
                                self.ShiftPostDet.push({'id': data[i][0],'client_name': data[i][3],'shift_name': data[i][4], 'shift_date' : data[i][5], 'start_time': formattedStartTime, 'end_time' : formattedEndTime, 'shift_status' : data[i][8] });
                            }
                        }
                }
                }) 
            }
            self.dataProvider1 = new ArrayDataProvider(self.ShiftPostDet, {keyAttributes: 'value'});

            self.confirmAllocation = function (event,data) {
                var clickedRowId = data.data.id
                    document.querySelector('#openAllocationProgress').open();
                    $.ajax({
                        url: BaseURL + "/jpStaffConfirmAllocation",
                        type: 'POST',
                        data: JSON.stringify({
                            rowId : clickedRowId,
                            staffId : sessionStorage.getItem("userId")
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            if(textStatus == 'timeout'){
                                document.querySelector('#openAllocationProgress').close();
                                document.querySelector('#Timeout').open();
                            }
                        },
                        success: function (data) {
                            document.querySelector('#openAllocationProgress').close();
                            location.reload()
                        }
                    })  
            };
            
        }
        
    }
    return CompletedShiftsModel;
});