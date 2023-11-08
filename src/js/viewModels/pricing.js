define(['knockout', 'jquery','appController',  'ojs/ojasyncvalidator-regexp', 'ojs/ojconverterutils-i18n', 'ojs/ojconverter-datetime', 
'ojs/ojconverter-number',"ojs/ojpagingdataproviderview",'ojs/ojarraydataprovider',"ojs/ojlistdataproviderview","ojs/ojkeyset", "ojs/ojconverter-number",
'ojs/ojknockout', 'ojs/ojtrain', 'ojs/ojradioset', 'ojs/ojbutton', 'ojs/ojlabelvalue', 'ojs/ojdatetimepicker', 'ojs/ojlabel',"ojs/ojlistview", "ojs/ojlistitemlayout",
 'ojs/ojformlayout', 'ojs/ojinputtext', 'ojs/ojselectsingle', 'ojs/ojinputnumber', 'ojs/ojvalidationgroup', 'ojs/ojselectcombobox', 
 'ojs/ojdialog', 'ojs/ojswitch','ojs/ojcheckboxset','ojs/ojprogress-bar','ojs/ojtable','ojs/ojhighlighttext',"ojs/ojpagingcontrol","ojs/ojgauge"],
        function (ko, $,app,AsyncRegExpValidator, ConverterUtilsI18n, DateTimeConverter, NumberConverter, PagingDataProviderView,ArrayDataProvider,ListDataProviderView,ojkeyset_1,ojconverter_number_1) {

            class  PricingViewModel {
 
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

                self.numberConverter = new ojconverter_number_1.IntlNumberConverter({
                    style: 'currency',
                    currency: 'USD',
                    currencyDisplay: 'symbol'
                });
                

                self.ReservedstandardAllUpfront3yrQuantity = ko.observable();
                self.ReservedstandardAllUpfront1yrQuantity = ko.observable();
                self.ReservedstandardPartialUpfront3yrQuantity = ko.observable();
                self.ReservedstandardPartialUpfront1yrQuantity = ko.observable();
                self.ReservedconvertibleAllUpfront3yrQuantity = ko.observable();
                self.ReservedconvertibleAllUpfront1yrQuantity = ko.observable();
                self.ReservedstandardPartialUpfront1yrHrs = ko.observable();
                self.ReservedstandardPartialUpfront3yrHrs = ko.observable();
                self.ReservedconvertibleAllUpfront1yrQuantityTot = ko.observable();
                self.ReservedconvertibleAllUpfront3yrQuantityTot = ko.observable();
                self.ReservedconvertiblePartialUpfront1yrQuantity = ko.observable();
                self.ReservedconvertiblePartialUpfront3yrQuantity = ko.observable();
                self.ReservedconvertiblePartialUpfront1yrHrs = ko.observable();
                self.ReservedconvertiblePartialUpfront3yrHrs = ko.observable();
                self.ReservedconvertiblePartialUpfront1yrQuantityTot = ko.observable();
                self.ReservedconvertiblePartialUpfront3yrQuantityTot = ko.observable();
                self.ReservedconvertibleNoUpfront1yrHrs = ko.observable();
                self.ReservedconvertibleNoUpfront3yrHrs = ko.observable();
                self.ReservedstandardNoUpfront1yrHrs = ko.observable();
                self.ReservedstandardNoUpfront3yrHrs = ko.observable();
                self.demandPrice = ko.observable();
                self.demandPrice1Yr = ko.observable();
                self.demandPrice3Yr = ko.observable();

                self.SelectSRCDeployment = (event,data) =>{
                    document.querySelector('#SelectSchemaDialog').open();
                    self.awsInstances([]);
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
                                document.querySelector('#TimeoutInLoad').open();
                            }
                        },
                      success: function (data) {

                                console.log(data[0])

                                var minCost = [];
                                var resStdUpFront3Yr = [];
                                var resStdPartialUpFront3Yr = [];

                                var ReservedstandardAllUpfront3yrQuantity;
                                var ReservedstandardAllUpfront3yrHrs;
                                var ReservedstandardPartialUpfront3yrQuantity;
                                var ReservedstandardPartialUpfront3yrHrs;
                                var ReservedstandardNoUpfront3yrHrs;
                                var OnDemandPrice;

                            for(var key in data[0]){

                                
                                
                                if(data[0][key].OnDemandPrice > 0){

                                    //get largets cost
                                    minCost.push(data[0][key].OnDemandPrice);

                                    resStdUpFront3Yr.push(data[0][key].ReservedstandardAllUpfront3yrQuantity);
                                    resStdPartialUpFront3Yr.push(data[0][key].ReservedstandardPartialUpfront3yrHrs);

                                    if(data[0][key].ReservedstandardAllUpfront3yrQuantity){
                                        ReservedstandardAllUpfront3yrQuantity = '$ '+data[0][key].ReservedstandardAllUpfront3yrQuantity
                                    }else{
                                        ReservedstandardAllUpfront3yrQuantity = data[0][key].ReservedstandardAllUpfront3yrQuantity
                                    }

                                    if(data[0][key].ReservedstandardAllUpfront3yrHrs){
                                        ReservedstandardAllUpfront3yrHrs = '$'+data[0][key].ReservedstandardAllUpfront3yrHrs
                                    }else{
                                        ReservedstandardAllUpfront3yrHrs = data[0][key].ReservedstandardAllUpfront3yrHrs
                                    }

                                    if(data[0][key].ReservedstandardPartialUpfront3yrQuantity){
                                        ReservedstandardPartialUpfront3yrQuantity = '$'+data[0][key].ReservedstandardPartialUpfront3yrQuantity
                                    }else{
                                        ReservedstandardPartialUpfront3yrQuantity = data[0][key].ReservedstandardPartialUpfront3yrQuantity
                                    }

                                    if(data[0][key].ReservedstandardPartialUpfront3yrHrs){
                                        ReservedstandardPartialUpfront3yrHrs = '$'+data[0][key].ReservedstandardPartialUpfront3yrHrs
                                    }else{
                                        ReservedstandardPartialUpfront3yrHrs = data[0][key].ReservedstandardPartialUpfront3yrHrs
                                    }

                                    if(data[0][key].ReservedstandardNoUpfront3yrHrs){
                                        ReservedstandardNoUpfront3yrHrs = '$'+data[0][key].ReservedstandardNoUpfront3yrHrs
                                    }else{
                                        ReservedstandardNoUpfront3yrHrs = data[0][key].ReservedstandardNoUpfront3yrHrs
                                    }

                                    if(data[0][key].OnDemandPrice){
                                        OnDemandPrice = '$ '+data[0][key].OnDemandPrice
                                    }else{
                                        OnDemandPrice = data[0][key].OnDemandPrice
                                    }

                                self.awsInstances.push({'INSTANCETYPE': key , 'MEMORY' : data[0][key].memory  ,'VCPU': data[0][key].vcpu,'NWB' : data[0][key].nwb , 'DESC' : data[0][key].Desc ,'PRICE' : OnDemandPrice,'SW' : data[0][key].sw,
                                'ARCH' :  data[0][key].arch,  
                                'ReservedstandardAllUpfront3yrQuantity' :  ReservedstandardAllUpfront3yrQuantity,
                                'ReservedstandardAllUpfront3yrHrs' : ReservedstandardAllUpfront3yrHrs,
                                'ReservedstandardPartialUpfront3yrQuantity' : ReservedstandardPartialUpfront3yrQuantity,
                                'ReservedstandardPartialUpfront3yrHrs' : ReservedstandardPartialUpfront3yrHrs ,
                                'ReservedstandardNoUpfront3yrHrs' :  ReservedstandardNoUpfront3yrHrs,
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
                            }
                            
                            }
                 //   console.log(data[0][key])
                 minCost.sort(function(a, b) {
                    return a - b;
                  });

                  resStdUpFront3Yr.sort(function(a, b) {
                    return a - b;
                  });





                  //get array of min demand price

                  var __FOUND = -1;
                  for(var key in data[0]) {
                    if(data[0][key].OnDemandPrice == minCost[0]){
                        document.getElementById("OPtions").style.display="block";
                        var demandPrice1Yr = minCost[0]*24*365;
                        var demandPrice3Yr =minCost[0]*24*365*3;
                        self.ReservedstandardAllUpfront3yrQuantity(data[0][key]['ReservedstandardAllUpfront3yrQuantity']);
                        self.ReservedstandardAllUpfront1yrQuantity(data[0][key]['ReservedstandardAllUpfront1yrQuantity']);
                        self.ReservedstandardPartialUpfront3yrQuantity(data[0][key]['ReservedstandardPartialUpfront3yrQuantity']);
                        self.ReservedstandardPartialUpfront1yrQuantity(data[0][key]['ReservedstandardPartialUpfront1yrQuantity']);
                        self.ReservedconvertibleAllUpfront3yrQuantity(data[0][key]['ReservedconvertibleAllUpfront3yrQuantity']);
                        self.ReservedconvertibleAllUpfront1yrQuantity(data[0][key]['ReservedconvertibleAllUpfront1yrQuantity']);
                        self.ReservedstandardPartialUpfront1yrHrs(data[0][key]['ReservedstandardPartialUpfront1yrHrs']);
                        self.ReservedstandardPartialUpfront3yrHrs(data[0][key]['ReservedstandardPartialUpfront3yrHrs']);
                        
                        var ReservedconvertibleAllUpfront3yrQuantityTot = data[0][key]['ReservedstandardPartialUpfront3yrQuantity']+ (data[0][key]['ReservedstandardPartialUpfront3yrHrs']*24 * 365 * 3);
                        var ReservedconvertibleAllUpfront1yrQuantityTot = data[0][key]['ReservedstandardPartialUpfront1yrQuantity']+ (data[0][key]['ReservedstandardPartialUpfront1yrHrs']* 24 * 365);
                       
                        self.ReservedconvertibleAllUpfront1yrQuantityTot(ReservedconvertibleAllUpfront1yrQuantityTot);
                        self.ReservedconvertibleAllUpfront3yrQuantityTot(ReservedconvertibleAllUpfront3yrQuantityTot);
                        
                        self.ReservedconvertiblePartialUpfront1yrQuantity(data[0][key]['ReservedconvertiblePartialUpfront1yrQuantity']);
                        self.ReservedconvertiblePartialUpfront3yrQuantity(data[0][key]['ReservedconvertiblePartialUpfront3yrQuantity']);
                        self.ReservedconvertiblePartialUpfront1yrHrs(data[0][key]['ReservedconvertiblePartialUpfront1yrHrs']);
                        self.ReservedconvertiblePartialUpfront3yrHrs(data[0][key]['ReservedconvertiblePartialUpfront3yrHrs']);


                        var ReservedconvertiblePartialUpfront1yrQuantityTot = data[0][key]['ReservedconvertiblePartialUpfront1yrQuantity']+ (data[0][key]['ReservedconvertiblePartialUpfront1yrHrs']* 24 * 365);;
                        var ReservedconvertiblePartialUpfront3yrQuantityTot =  data[0][key]['ReservedconvertiblePartialUpfront3yrQuantity']+ (data[0][key]['ReservedconvertiblePartialUpfront3yrHrs']*24 * 365 * 3);

                        self.ReservedconvertiblePartialUpfront1yrQuantityTot(ReservedconvertiblePartialUpfront1yrQuantityTot);
                        self.ReservedconvertiblePartialUpfront3yrQuantityTot(ReservedconvertiblePartialUpfront3yrQuantityTot);

                        var ReservedconvertibleNoUpfront1yrHrs = data[0][key]['ReservedconvertibleNoUpfront1yrHrs']* 24 * 365;
                        var ReservedconvertibleNoUpfront3yrHrs = data[0][key]['ReservedconvertibleNoUpfront3yrHrs']* 24 * 365 *3;
                        var ReservedstandardNoUpfront1yrHrs = data[0][key]['ReservedstandardNoUpfront1yrHrs']* 24 * 365;
                        var ReservedstandardNoUpfront3yrHrs =  data[0][key]['ReservedstandardNoUpfront3yrHrs']* 24 * 365 *3;

                        self.ReservedconvertibleNoUpfront1yrHrs(ReservedconvertibleNoUpfront1yrHrs);
                        self.ReservedconvertibleNoUpfront3yrHrs(ReservedconvertibleNoUpfront3yrHrs);
                        self.ReservedstandardNoUpfront1yrHrs(ReservedstandardNoUpfront1yrHrs);
                        self.ReservedstandardNoUpfront3yrHrs(ReservedstandardNoUpfront3yrHrs);
                        
                        self.demandPrice(minCost[0]);
                        self.demandPrice1Yr(demandPrice1Yr);
                        self.demandPrice3Yr(demandPrice3Yr);
		break;
	}
}


                 console.log(minCost[0]);
                 console.log("for  1yr on this pice"+minCost[0]*24*365)
                 console.log("for  3yr on this pice"+minCost[0]*24*365*3)
                    self.awsInstances.valueHasMutated();
                          document.querySelector('#SelectSchemaDialog').close();
                          return self;
                      }
                  })
              
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
                 {headerText: 'Reserved Standard All Up front 3yr Qunatity',
                 field: 'ReservedstandardAllUpfront3yrQuantity'}, 
                 {headerText: 'Reserved Standard All Up front 3yr Hours',
                 field: 'ReservedstandardAllUpfront3yrHrs'},  
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
 
              self.awsInstancesDP = ko.observable(new PagingDataProviderView(new ArrayDataProvider(self.awsInstances, {idAttribute: 'DESC'})));   

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
            return  PricingViewModel;
        }
);