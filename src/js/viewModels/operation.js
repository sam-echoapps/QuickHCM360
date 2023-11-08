define(['knockout', 'jquery','appController',  'ojs/ojasyncvalidator-regexp', 'ojs/ojconverterutils-i18n', 'ojs/ojconverter-datetime', 
'ojs/ojconverter-number',"ojs/ojpagingdataproviderview",'ojs/ojarraydataprovider', "ojs/ojattributegrouphandler","ojs/ojlistdataproviderview","ojs/ojkeyset", 
'ojs/ojknockout', 'ojs/ojtrain', 'ojs/ojradioset', 'ojs/ojbutton', 'ojs/ojlabelvalue', 'ojs/ojdatetimepicker', 'ojs/ojlabel',"ojs/ojlistview", "ojs/ojlistitemlayout",
 'ojs/ojformlayout', 'ojs/ojinputtext', 'ojs/ojselectsingle', 'ojs/ojinputnumber', 'ojs/ojvalidationgroup', 'ojs/ojselectcombobox', 
 'ojs/ojdialog', 'ojs/ojswitch','ojs/ojcheckboxset','ojs/ojprogress-bar','ojs/ojtable','ojs/ojhighlighttext',"ojs/ojpagingcontrol","ojs/ojgauge","ojs/ojchart", "ojs/ojtoolbar"],
        function (ko, $,app,AsyncRegExpValidator, ConverterUtilsI18n, DateTimeConverter, NumberConverter, PagingDataProviderView,ArrayDataProvider,ojattributegrouphandler_1,ListDataProviderView,ojkeyset_1) {

            class InitialLoadViewModel {
 
                constructor(args) {
                var self = this;
                self.DepName = args.routerState.detail.dep_url;
                self.isFormReadonly = ko.observable(false); 
                self.currentOS = ko.observable();
                self.currentOP = ko.observable();
                self.currentChoice = ko.observableArray([]);;
                self.outPutString = ko.observable();
                self.platformRelease = ko.observable();
                self.platformVer = ko.observable();
                self.distribution =ko.observable();
                self.phpVersion = ko.observable("");
                self.phpVersionList = ko.observableArray([]);
                self.apacheVersion = ko.observable("");
                self.apacheVersionList = ko.observableArray([]);
                self.mysqlVersion = ko.observable("");
                self.mysqlVersionList = ko.observableArray([]);

          

                self.SelectSRCDeployment = (event,data) =>{
                    
                    //document.querySelector('#SelectSchemaDialog').open();
                    //self.awsInstances([]);
                    $.ajax({
                      url: "http://echoapps360.ddns.net:8080/sayooj",
                      type: 'POST',
                      data: JSON.stringify({
                        os : self.currentOS(),
                        operation : self.currentOP()
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
                         // console.log(data)
                      }
                  })
              
                 };

                 self.args = args;
                 // Create a child router with one default path
                 self.router = self.args.parentRouter;

                 self.SelectSRCDeployment1 = (event,data) =>{
                    let operation = self.currentChoice().toString();
                    self.router.go({ path: 'pricing1mon', params: { os : self.currentOS(), operation : operation,MysqlVersion : self.mysqlVersion(),apacheVersion : self.apacheVersion(), phpVersion : self.phpVersion()} })
                    // document.getElementById('outputBox').style.display = "block";
                    
                    // $.ajax({
                    //     url: "http://echoapps360.ddns.net:8080/test1",
                    //     type: 'POST',
                    //     data: JSON.stringify({
                    //       os : self.currentOS(),
                    //       operation : self.currentChoice(),
                    //       phpVersion : self.phpVersion(),
                    //       MysqlVersion : self.mysqlVersion(),
                    //       apacheVersion : self.apacheVersion()
                    //   }),
                    //     dataType: 'json',
                    //     timeout: sessionStorage.getItem("timeInetrval"),
                    //       context: self,
                    //       error: function (xhr, textStatus, errorThrown) {
                    //           if(textStatus == 'timeout' || textStatus == 'error'){
                    //               document.querySelector('#TimeoutInLoad').open();
                    //           }
                    //       },
                    //     success: function (data) {
                    //         console.log(data)
                    //         self.outPutString(data)
                    //     }
                    // })             
                 };

                 self.GetOs = (event,data) =>{
                    // console.log("wwwww")
                     $.ajax({
                        url: self.DepName() + "/platformInfo",
                        type: 'POST',
                        data: JSON.stringify({
                          os : "sayooj",
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
                          //  console.log(data)
                            self.distribution(data.distName[0])
                            self.currentOS(data.platformName);
                            self.platformRelease(data.platformRelease);
                            self.platformVer(data.platformVer);
                        }
                    })
                 };


                 self.SelectDeployment = (event,data) =>{
                   //console.log(self.currentChoice()[0])
                   document.getElementById('PHP').style.display = "none";
                   document.getElementById('apache').style.display = "none"
                   document.getElementById('mySQL').style.display = "none"
                   document.getElementById('oksubButton').style.display = "block";

                   for (var i = 0; i < self.currentChoice().length; i++) {
                   // console.log(self.currentChoice()[i]);
                    //document.getElementById(self.currentChoice()[i]).style.display = "block";
                   }
                 };

                 
                 var OperatingSystems = [{label : 'Linux' ,value : 'Linux'},
                                        {label : 'SUSE' ,value : 'SUSE'},
                             {label : 'Red Hat Enterprise Linux with HA' ,value : 'Red Hat Enterprise Linux with HA'},
                             {label : 'Windows' ,value : 'Windows'},
                             {label : 'RHEL' ,value : 'RHEL'},
                             {label : 'Linux' ,value : 'Linux'}]  
                            
                             //PHP Version Array
                            self.phpVersionList.push({ 'label': '8.1.4', value: '8.1.4' },{ 'label': '8.0.17', value: '8.0.17' },{ 'label': '7.4.28', value: '7.4.28' });

                            //Apache Version Array
                             for (var i = 0; i < 3; i++) {
                                self.apacheVersionList.push({ 'label': '2.4.53', value: '2.4.53' },{ 'label': '2.2', value: '2.2' });
                             }

                             //mysql Version Array
                             for (var i = 0; i < 3; i++) {
                                self.mysqlVersionList.push({ 'label': '8.0.28', value: '8.0.28' });
                             }

                             

                             self.phpVersionListDP = new ArrayDataProvider(self.phpVersionList, { keyAttributes: 'value' });
                             self.apacheVersionListDP = new ArrayDataProvider(self.apacheVersionList, { keyAttributes: 'value' });
                             self.mysqlVersionListDP = new ArrayDataProvider(self.mysqlVersionList, { keyAttributes: 'value' });
                             self.OperatingSystemsDP = new ArrayDataProvider(OperatingSystems , {keyAttributes: 'value'});    



                             var PreInsSWList = [
                                {label : 'Install Apache' ,value : 'apache'},
                             {label : 'Install MySQL Server' ,value : 'mySQL'},
                  {label : 'Install PHP' ,value : 'PHP'}]

                  self.PreInsSWListDP = new ArrayDataProvider(PreInsSWList , {keyAttributes: 'value'});    


                  self.connected = function () { 
                    if (sessionStorage.getItem("userName")==null) {
                        self.router.go({path : 'signin'});
                    }
                    else
                    {
                    app.onAppSuccess();
                    self.GetOs();
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
