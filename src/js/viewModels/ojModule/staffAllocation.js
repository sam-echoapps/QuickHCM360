define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider", "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', "ojs/ojswitch"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider, ResponsiveUtils, ResponsiveKnockoutUtils) {
    
    class addClientViewModel {
        constructor(context) {
            var self = this;
            self.DepName = context.DepName;
            self.unallocationDet = ko.observableArray([]);
            self.allocationDet = ko.observableArray([]);
            self.from_date = ko.observable();
            self.to_date = ko.observable();
            self.allocateCheck = ko.observable(false);
            self.isAllocate = ko.observable('allocated');


            this.allocationDetDP = new ArrayDataProvider(this.allocationDet, { keyAttributes: "name"});

            self.getAvailableEmployees = function (event,data) {
                self.unallocationDet([]);
                self.allocationDet([]);
                $.ajax({
                    url: self.DepName() + "/jpRequestedEmployeesGet",
                    type: 'POST',
                    data: JSON.stringify({
                        from_date : self.from_date(),
                        to_date : self.to_date()
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
                    success: function (result) {
                        console.log(result)
                        var data = JSON.parse(result);
                        console.log(data)
                        console.log(data.length)
  
                        for (var i = 0; i < data.length; i++) {
                            self.allocationDet.push({'id' : data[i][0],'surname' : data[i][2] + " " +  data[i][3], 'posts' : data[i][4], 'email' : data[i][18], 'contact_no' : data[i][15], 'allocation_status' : data[i][39]});
                        }  
                         self.allocationDet.valueHasMutated();                          
                    }
                })
            }

            this.requestChecked = (event, context) => {
                var value = allocatedTable.currentRow;
                console.log(value.rowIndex)
                var rowIndex = value.rowIndex;
                const rowData = context.item.data;
                
                console.log(rowData)
                console.log(rowData.id)
                var selectedRowId = rowData.id;
                $.ajax({
                    url: self.DepName() + "/jpAllocateRequestedEmployees",
                    type: 'POST',
                    data: JSON.stringify({
                        from_date : self.from_date(),
                        to_date : self.to_date(),
                        selectedRowId : selectedRowId
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
                    success: function (result) {
                        console.log(result)           
                    }
                })
                getAvailableEmployees();
              }
            function getAvailableEmployees(){
            self.unallocationDet([]);
            self.allocationDet([]);
            $.ajax({
                url: self.DepName() + "/jpRequestedEmployeesGet",
                type: 'POST',
                data: JSON.stringify({
                    from_date : self.from_date(),
                    to_date : self.to_date()
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
                success: function (result) {
                    console.log(result)
                    var data = JSON.parse(result);
                    console.log(data)
                    console.log(data.length)

                    for (var i = 0; i < data.length; i++) {
                        self.allocationDet.push({'id' : data[i][0],'surname' : data[i][2] + " " +  data[i][3], 'posts' : data[i][4], 'email' : data[i][18], 'contact_no' : data[i][15], 'allocation_status' : data[i][39]});
                    }  
                     self.allocationDet.valueHasMutated();                          
                }
            })
        }
            }
    }
    return  addClientViewModel;
});