define(['knockout', 'jquery','appController',  "gridDataProvider/DemoArrayDataGridProvider", 'ojs/ojarraydataprovider' ,"ojs/ojarraytreedataprovider", "ojs/ojdatagridprovider", "ojs/ojresponsiveknockoututils", "ojs/ojresponsiveutils",
"ojs/ojconverter-number", "text!gridDataProvider/population.json","ojs/ojknockout", "ojs/ojdatagrid",'ojs/ojcollectiondatagriddatasource', "ojs/ojbutton","ojs/ojtable","ojs/ojgauge",'ojs/ojformlayout', 'ojs/ojinputtext', 'ojs/ojselectsingle', 'ojs/ojinputnumber'],
        function (ko, $,app,DemoArrayDataGridProvider_1,ArrayDataProvider, ArrayTreeDataProvider,ojdatagridprovider_1,ResponsiveKnockoutUtils, ResponsiveUtils, ojconverter_number_1,jsonData) {

            class InitialLoadViewModel {
 
                constructor(args) {
                var self = this;
                self.DepName = args.routerState.detail.dep_url;
                self.vcpu = ko.observable(0);
                self.memory = ko.observable(0);    
                self.isFormReadonly = ko.observable(false); 
                self.currentAWSRegion = ko.observable();
                self.awsInstances = ko.observableArray([]);
                self.currentOS = ko.observable();
                self.currentSW = ko.observable('NA');


                // this.jsonData = JSON.parse(jsonData);

                // this.rowHeaders = [
                //     this.jsonData.map((item) => {
                //         return item.index;
                //     })
                // ];
                // this.columnHeaders = [
                //     Object.keys(this.jsonData[0]).filter((key) => {
                //         return key !== 'index';
                //     })
                // ];
                // this.data = this.jsonData.map((item) => {
                //     return this.columnHeaders[0].map((header) => {
                //         return { data: item[header] };
                //     });
                // });


self.data = ko.observable();

self.rowHeaders = ko.observable();
self.columnHeaders = ko.observable();

                self.SelectSRCDeployment = (event,data) =>{
                    document.querySelector('#SelectSchemaDialog').open();
                    $.ajax({
                      url: self.DepName() + "/awspricing",
                      type: 'POST',
                      data: JSON.stringify({
                        region : self.currentAWSRegion(),
                        req_vcpu : self.vcpu(),
                        req_memory : self.memory() ,
                        os : self.currentOS(),
                        sw : self.currentSW()
                    }),
                      dataType: 'json',
                      timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            if(textStatus == 'timeout' || textStatus == 'error'){
                //                document.querySelector('#TimeoutInLoad').open();
                            }
                        },
                      success: function (data) {
                        let i =0 ;
                        var awsInstances = [];

                           for (var key in data[0]){
                               if (data[0][key].OnDemandPrice > 0){
                                   if (!data[0][key].ReservedstandardAllUpfront3yrQuantity) {
                                    data[0][key].ReservedstandardAllUpfront3yrQuantity = 'NA'
                                   }
                                  if (!data[0][key].ReservedstandardAllUpfront3yrHrs){
                                    data[0][key].ReservedstandardAllUpfront3yrHrs = 'NA'
                                   }
                                   if (!data[0][key].ReservedstandardPartialUpfront3yrQuantity){
                                    data[0][key].ReservedstandardPartialUpfront3yrQuantity = 'NA'
                                   }
                                  if (!data[0][key].ReservedstandardPartialUpfront3yrHrs){
                                    data[0][key].ReservedstandardPartialUpfront3yrHrs='NA'
                                   }
                                    if (!data[0][key].ReservedstandardNoUpfront3yrHrs){
                                        data[0][key].ReservedstandardNoUpfront3yrHrs='NA'
                                     }
                                   if (!data[0][key].ReservedstandardAllUpfront1yrQuantity)
                                     {
                                        data[0][key].ReservedstandardAllUpfront1yrQuantity='NA'
                                     }
                                    if (!data[0][key].ReservedstandardAllUpfront1yrHrs){
                                        data[0][key].ReservedstandardAllUpfront1yrHrs ='NA'
                                     }
                                  if (!data[0][key].ReservedstandardPartialUpfront1yrQuantity){
                                        data[0][key].ReservedstandardPartialUpfront1yrQuantity='NA'
                                    }
                                   if (!data[0][key].ReservedstandardPartialUpfront1yrHrs)
                                    {
                                        data[0][key].ReservedstandardPartialUpfront1yrHrs='NA'
                                    }
                                   if (!data[0][key].ReservedstandardNoUpfront1yrHrs){
                                        data[0][key].ReservedstandardNoUpfront1yrHrs ='NA'
                                    }
                                  if (!data[0][key].ReservedconvertibleAllUpfront3yrQuantity)
                                    {
                                        data[0][key].ReservedconvertibleAllUpfront3yrQuantity='NA'
                                    }
                                   if (!data[0][key].ReservedconvertibleAllUpfront3yrHrs)
                                    {
                                        data[0][key].ReservedconvertibleAllUpfront3yrHrs = 'NA'
                                    }                                                  
                                   if (!data[0][key].ReservedconvertiblePartialUpfront3yrQuantity)
                                    {
                                        data[0][key].ReservedconvertiblePartialUpfront3yrQuantity = 'NA'
                                    }
                                   if (!data[0][key].ReservedconvertiblePartialUpfront3yrHrs)
                                    {
                                        data[0][key].ReservedconvertiblePartialUpfront3yrHrs = 'NA'
                                    }
                                   if (!data[0][key].ReservedconvertibleNoUpfront3yrHrs)
                                    {
                                        data[0][key].ReservedconvertibleNoUpfront3yrHrs = 'NA'
                                    }
                                    if (!data[0][key].ReservedconvertibleAllUpfront1yrQuantity)
                                    {
                                        data[0][key].ReservedconvertibleAllUpfront1yrQuantity = 'NA'
                                    }
                                   if (!data[0][key].ReservedconvertibleAllUpfront1yrHrs){
                                        data[0][key].ReservedconvertibleAllUpfront1yrHrs = 'NA'
                                    }
                                   if (!data[0][key].ReservedconvertiblePartialUpfront1yrQuantity){
                                        data[0][key].ReservedconvertiblePartialUpfront1yrQuantity = 'NA'
                                    }
                                   if (!data[0][key].ReservedconvertiblePartialUpfront1yrHrs){
                                        data[0][key].ReservedconvertiblePartialUpfront1yrHrs = 'NA'
                                    }
                                    if (!data[0][key].ReservedconvertibleNoUpfront1yrHrs){
                                        data[0][key].ReservedconvertibleNoUpfront1yrHrs = 'NA'
                                    }
                                    awsInstances.push({'index' : i ,'Instance Type': key , 
                                                    'Memory' : data[0][key].memory  ,
                                                    'VCPU': data[0][key].vcpu,
                                                    'Network BW' : data[0][key].nwb , 
                                                    'Ondemand Price' : data[0][key].OnDemandPrice,
                                                    'Software' : data[0][key].sw,
                                                    'Architecture' :  data[0][key].arch,  
                                                    'ReservedstandardAllUpfront3yrQuantity' :  data[0][key].ReservedstandardAllUpfront3yrQuantity,
                                                    'ReservedstandardAllUpfront3yrHrs' : data[0][key].ReservedstandardAllUpfront3yrHrs,
                                                    'ReservedstandardPartialUpfront3yrQuantity' : data[0][key].ReservedstandardPartialUpfront3yrQuantity,
                                                    'ReservedstandardPartialUpfront3yrHrs' : data[0][key].ReservedstandardPartialUpfront3yrHrs ,
                                                    'ReservedstandardNoUpfront3yrHrs' :  data[0][key].ReservedstandardNoUpfront3yrHrs,
                                                    'ReservedstandardAllUpfront1yrQuantity' : data[0][key].ReservedstandardAllUpfront1yrQuantity,
                                                    'ReservedstandardAllUpfront1yrHrs' :  data[0][key].ReservedstandardAllUpfront1yrHrs,
                                                    'ReservedstandardPartialUpfront1yrQuantity' : data[0][key].ReservedstandardPartialUpfront1yrQuantity,
                                                    'ReservedstandardPartialUpfront1yrHrs' : data[0][key].ReservedstandardPartialUpfront1yrHrs,
                                                    'ReservedstandardNoUpfront1yrHrs' : data[0][key].ReservedstandardNoUpfront1yrHrs,
                                                    'ReservedconvertibleAllUpfront3yrQuantity' : data[0][key].ReservedconvertibleAllUpfront3yrQuantity,
                                                    'ReservedconvertibleAllUpfront3yrHrs' : data[0][key].ReservedconvertibleAllUpfront3yrHrs,                                                   
                                                    'ReservedconvertiblePartialUpfront3yrQuantity' : data[0][key].ReservedconvertiblePartialUpfront3yrQuantity,
                                                    'ReservedconvertiblePartialUpfront3yrHrs' : data[0][key].ReservedconvertiblePartialUpfront3yrHrs,
                                                    'ReservedconvertibleNoUpfront3yrHrs' : data[0][key].ReservedconvertibleNoUpfront3yrHrs,
                                                    'ReservedconvertibleAllUpfront1yrQuantity' : data[0][key].ReservedconvertibleAllUpfront1yrQuantity,
                                                    'ReservedconvertibleAllUpfront1yrHrs' : data[0][key].ReservedconvertibleAllUpfront1yrHrs,
                                                    'ReservedconvertiblePartialUpfront1yrQuantity' : data[0][key].ReservedconvertiblePartialUpfront1yrQuantity,
                                                    'ReservedconvertiblePartialUpfront1yrHrs' : data[0][key].ReservedconvertiblePartialUpfront1yrHrs,
                                                    'ReservedconvertibleNoUpfront1yrHrs' : data[0][key].ReservedconvertibleNoUpfront1yrHrs
                                                    });
                                                    i = i  + 1 ;
                                                }
                                                }
                                 //               console.log(self.awsInstances)

                    var rowTemp = [] 
                    rowTemp.push(awsInstances.map((item) => {
                        return item.index;
                    }))    
                    self.rowHeaders = rowTemp;

                    var colTemp = [] 
 colTemp.push(Object.keys(awsInstances[0]).filter((key) => {
        return key  !== 'index' ;
    }));
    self.columnHeaders = colTemp;

var data = []

data = awsInstances.map((item) => {
    return colTemp[0].map((header) => {
        return { data : item[header] };
    });
});

self.data = data

self.NewdataGridProvider(new DemoArrayDataGridProvider_1.DemoArrayDataGridProvider({ data : self.data, rowHeader: self.rowHeaders, columnHeader : self.columnHeaders  }, {columnSortable: true},{}));
//document.getElementById('attributeDatagrid').refresh();

//self.NewdataGridProvider().dispatchEvent(new ojdatagridprovider_1.DataGridProviderRefreshEvent());
let firstRowValues = Object.values(this.data[0]);
this.numericIndexes = firstRowValues.reduce((numeric, data, index) => {
    if (!isNaN(data.data) || !isNaN(Date.parse(data.data))) {
        numeric.push(index);
    }
    return numeric;
}, []);

this.rowHeaderStyle = (headerContext) => {
        return 'width:4.25em';
};
document.querySelector('#SelectSchemaDialog').close();
                          return self;
                      }
                  })
              
                 };





self.NewdataGridProvider = ko.observable(new DemoArrayDataGridProvider_1.DemoArrayDataGridProvider({ data : self.data, rowHeader: self.rowHeaders, columnHeader : self.columnHeaders  }, {columnSortable: true},{}));

console.log(self);


this.handleSortRequest = (event) => {
    let axis = event.detail.axis;
    let index = event.detail.item.index;
    let direction = event.detail.direction;
    if (axis === 'column') {
        let sortedArrays = this.data
            .map((value, index) => {
            return { data: value, rowHeader: this.rowHeaders[0][index] };
        })
            .sort((a, b) => {
            let aVal = a.data[index].data;
            let bVal = b.data[index].data;
            if (aVal < bVal) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (aVal > bVal) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        this.data = sortedArrays.map((value) => {
            return value.data;
        });
        this.rowHeaders = [
            sortedArrays.map((value) => {
                return value.rowHeader;
            })
        ];
        let sortParams = {
            sortValue: { axis: axis, direction: direction, index: index },
            columnSortable: true
        };
        let dataParams = {
            data: this.data,
            rowHeader: this.rowHeaders,
            columnHeader: this.columnHeaders,
            rowHeaderLabel: this.rowLabel,
            columnHeaderLabel: this.columnLabel
        };
        this.NewdataGridProvider().setSortParameters(sortParams);
        this.NewdataGridProvider().setDataParameters(dataParams);
        this.NewdataGridProvider().dispatchEvent(new ojdatagridprovider_1.DataGridProviderRefreshEvent());
    }
};

self.numberConverter = new ojconverter_number_1.IntlNumberConverter({
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol'
});


self.formatColumnHeader = (headerContext) => {
    const data = headerContext.item.data;
    return data.replace(/([A-Z])/g, '$1').replace(/^./, function (str) {
        return str.toUpperCase();
    });
};


self.getColumnHeaderStyle = (headerContext) => {
    const columnIndex = headerContext.index;
    console.log(columnIndex)
    if (columnIndex === 0) {
        return 'width:150px;font-weight:bold;';
    }
    else if (columnIndex === 2) {
        return 'width:80px;font-weight:bold;';
    }
    else if (columnIndex === 3 || columnIndex === 5 || columnIndex === 16) {
        return 'width:170px';
    }
    else if (columnIndex === 4) {
        return 'width:125px;';
    }
    else if (columnIndex === 9 || columnIndex === 11 || columnIndex === 13) {
        return 'width:250px;';
    }
    return 'width:125px;';
};


self.getColumnHeaderClassName = (headerContext) => {
    return self.getAlignmentClassNameByIndex(headerContext.index);
};


self.getCellClassName = (cellContext) => {
    return self.getAlignmentClassNameByIndex(cellContext.indexes.column);
};

self.getAlignmentClassNameByIndex = (index) => {
    if (self.numericIndexes.includes(index) || index === 15) {
        return 'oj-helper-justify-content-right oj-helper-text-align-right';
    }
    return 'oj-sm-justify-content-flex-start oj-sm-text-align-start';
};



this.columnForTable = [
    {
        headerText: 'Row Start Index',
        field: 'rowStartIndex',
        resizable: 'enabled'
    },
    {
        headerText: 'Column Start Index',
        field: 'columnStartIndex',
        resizable: 'enabled'
    },
    {
        headerText: 'Row End Index',
        field: 'rowEndIndex',
        resizable: 'enabled'
    },
    {
        headerText: 'Column End Index',
        field: 'columnEndIndex',
        resizable: 'enabled'
    }
];
this.groupData = new ArrayTreeDataProvider([
    {
        value: 'cell',
        label: 'Cell',
        children: [
            {
                value: 'cell_multiple',
                label: 'Multiple Cells'
            },
            {
                value: 'cell_single',
                label: 'Single Cell'
            }
        ]
    },
    {
        value: 'row',
        label: 'Row',
        children: [
            {
                value: 'row_multiple',
                label: 'Multiple Rows'
            },
            {
                value: 'row_single',
                label: 'Single Row'
            }
        ]
    }
], {
    keyAttributes: 'value'
});
this.selectValue = ko.observable('cell_multiple');
this.selectionMode = ko.pureComputed(() => {
    const selectionModeValue = this.selectValue().split('_');
    const key = selectionModeValue[0];
    const value = selectionModeValue[1];
    return {
        [key]: value
    };
});
this.selectedRows = ko.observableArray([]);
this.dataprovider = new ArrayDataProvider(this.selectedRows, {
    keyAttributes: '@index'
});

this.getItemByIndex = function (data, rowIndex, columnIndex) {
    return data.find((item) => {
        let itemRowIndex = item.rowIndex;
        let itemRowExtent = item.rowExtent;
        let itemColumnIndex = item.columnIndex;
        let itemColumnExtent = item.columnExtent;
        if (rowIndex >= itemRowIndex &&
            rowIndex < itemRowIndex + itemRowExtent &&
            columnIndex >= itemColumnIndex &&
            columnIndex < itemColumnIndex + itemColumnExtent) {
            return true;
        }
        return false;
    });
};

this.getDataFromRange = (range) => __awaiter(this, void 0, void 0, function* () {
    let startRow = range.startIndex.row;
    let startColumn = range.startIndex.column;
    let endRow = range.endIndex.row === -1 ? this.dataArray.length - 1 : range.endIndex.row;
    let endColumn = range.endIndex.column === -1 ? this.dataArray[0].length - 1 : range.endIndex.column;
    let data = yield this.getItemsInRange(range);
    let dataMatrix = [];
    let rowArray = [];
    for (var i = startRow; i <= endRow; i++) {
        for (var j = startColumn; j <= endColumn; j++) {
            let item = this.getItemByIndex(data, i, j);
            rowArray.push(item.data);
        }
        dataMatrix.push(rowArray);
        rowArray = [];
    }
    return dataMatrix;
});

this.selectionChangedListener = (event) => {
    this.selectedRows.removeAll();
    if (event.detail.value.length) {
        event.detail.value.forEach((selection) => {
            const startRow = selection.startIndex['row'] >= 0 ? selection.startIndex['row'] : -1;
            const startColumn = selection.startIndex['column'] >= 0 ? selection.startIndex['column'] : -1;
            const endRow = selection.endIndex['row'] >= 0 ? selection.endIndex['row'] : -1;
            const endColumn = selection.endIndex['column'] >= 0 ? selection.endIndex['column'] : -1;
            const tableObj = {
                rowStartIndex: startRow,
                rowEndIndex: endRow,
                columnStartIndex: startColumn,
                columnEndIndex: endColumn
            };
            for (var i = startRow; i <= endRow; i++) {
                for (var j = startColumn; j <= endColumn; j++) {
                    let item = this.getItemByIndex(data, i, j);
                    console.log(item)
                }
            }
            this.selectedRows.push(tableObj);
        });
    }
    const table = document.getElementById('table');
    table.refresh();

};


             


                 self.awsPricingcolumnArray = [{headerText: 'EC2 Instance Type',
                 field: 'INSTANCETYPE'},
                 {headerText: 'Available Memory',
                 field: 'MEMORY'},
                 {headerText: 'Available VCPUs',
                 field: 'VCPU'},
                 {headerText: 'Network Bandwidth',
                 field: 'NWB'},
                 {headerText: 'Process Architecture',
                 field: 'ARCH'},  
                 {headerText: 'Reserved Standard All Up front 3yr Quantity',
                 field: 'ReservedstandardAllUpfront3yrQuantity',
                 resizable: "enabled"},  
                 {headerText: 'Reserved Standard Partial Up front 3yr Quantity',
                 field: 'ReservedstandardPartialUpfront3yrQuantity'},  
                 {headerText: 'Reserved Standard Partial Up front 3yr Hours',
                 field: 'ReservedstandardPartialUpfront3yrHrs'},  
                 {headerText: 'Reserved Standard No Up front 3yr Hours',
                 field: 'ReservedstandardNoUpfront3yrHrs'},  
                 {headerText: 'OnDemand Price',
                 field: 'PRICE'},  
                 {headerText: 'Preinstalled Software',
                 field: 'SW'},                   
                 {headerText: 'Description',
                 field: 'DESC'} 
              ]
 
 //             self.awsInstancesDP = ko.observable(new PagingDataProviderView(new ArrayDataProvider(self.awsInstances, {idAttribute: 'DESC'})));   

                 var AWSRegions = [{label : 'US East (Ohio)' ,value : 'us-east-2  $US East (Ohio)'},
                                   {label : 'US East (N. Virginia)' ,value : 'us-east-1$US East (N. Virginia)'},
                                   {label : 'US West (N. California)' ,value : 'us-west-1$US West (N. California)'},
                                   {label : 'US West (Oregon)' ,value : 'us-west-2$US West (Oregon)'},
                                   {label : 'Europe (Frankfurt)' ,value : 'eu-central-1$Europe (Frankfurt)'},
                                   {label : 'Europe (Ireland)' ,value : 'eu-west-1$Europe (Ireland)'},
                                   {label : 'Europe (London)' ,value : 'eu-west-2$Europe (London)'},
                                   {label : 'Europe (Milan)' ,value : 'eu-south-1$Europe (Milan)'},
                                   {label : 'Europe (Paris)' ,value : 'eu-west-3$Europe (Paris)'},
                                   {label : 'Europe (Stockholm)' ,value : 'eu-north-1$Europe (Stockholm)'},
                                   {label : 'Africa (Cape Town)' ,value : 'af-south-1$Africa (Cape Town)'},
                                   {label : 'Asia Pacific (Hong Kong)' ,value : 'ap-east-1$Asia Pacific (Hong Kong)'},
                                   {label : 'Asia Pacific (Mumbai)' ,value : 'ap-south-1$Asia Pacific (Mumbai)'},
                                   {label : 'Asia Pacific (Osaka)' ,value : 'ap-northeast-3$Asia Pacific (Osaka)'},
                                   {label : 'Asia Pacific (Seoul)' ,value : 'ap-northeast-2$Asia Pacific (Seoul)'},
                                   {label : 'Asia Pacific (Singapore)' ,value : 'ap-southeast-1$Asia Pacific (Singapore)'},
                                   {label : 'Asia Pacific (Sydney)' ,value : 'ap-southeast-2$Asia Pacific (Sydney)'},
                                   {label : 'Asia Pacific (Tokyo)' ,value : 'ap-northeast-1$Asia Pacific (Tokyo)'},
                                   {label : 'Canada (Central)' ,value : 'ca-central-1$Canada (Central)'},
                                   {label : 'Middle East (Bahrain)' ,value : 'me-south-1$Middle East (Bahrain)'},
                                   {label : 'South America (São Paulo)' ,value : 'sa-east-1$South America (São Paulo)'},
                                   {label : 'AWS GovCloud (US-East)' ,value : 'us-gov-east-1$AWS GovCloud (US-East)'},
                                   {label : 'AWS GovCloud (US-West)' ,value : 'us-gov-west-1$AWS GovCloud (US-West)'},
                                ]

                                self.AWSRegionsDP = new ArrayDataProvider(AWSRegions , {keyAttributes: 'value'});    
                 var OperatingSystems = [{label : 'Linux' ,value : 'Linux'},
                                        {label : 'SUSE' ,value : 'SUSE'},
                             {label : 'Red Hat Enterprise Linux with HA' ,value : 'Red Hat Enterprise Linux with HA'},
                             {label : 'Windows' ,value : 'Windows'},
                             {label : 'RHEL' ,value : 'RHEL'},
                             {label : 'Linux' ,value : 'Linux'}]  

                             self.OperatingSystemsDP = new ArrayDataProvider(OperatingSystems , {keyAttributes: 'value'});    



                             var PreInsSWList = [
                                {label : 'NA' ,value : 'NA'}, 
                                {label : 'SQL Server Web' ,value : 'SQL Web'},
                             {label : 'SQL Server Standard' ,value : 'SQL Std'},
                  {label : 'SQL Server Enterprise' ,value : 'SQL Ent'}]

                  self.PreInsSWListDP = new ArrayDataProvider(PreInsSWList , {keyAttributes: 'value'});    



                  self.connected = function () { 
                    if (sessionStorage.getItem("userName")==null) {
                        self.router.go({path : 'signin'});
                    }
                    else
                    {
                    app.onAppSuccess();
                    }
                    }
                

                /**
                 * Optional ViewModel method invoked after the View is disconnected from the DOM.
                 */
                self.disconnected = function () {

                    // Implement if needed
                };

                /**
                 * Optional ViewModel method invoked after transition to the new View is complete.
                 * That includes any possible animation between the old and the new View.
                 */
                self.transitionCompleted = function () {

                };
        }
    }
            return  InitialLoadViewModel;
        }
);