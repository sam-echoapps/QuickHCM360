define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojDiagram/viewModels/ggLayout', 'ojs/ojknockout-keyset',
'ojs/ojattributegrouphandler', 'ojs/ojconverter-number', 'ojs/ojconverterutils-i18n', 'ojs/ojconverter-datetime',
'ojs/ojarraydataprovider', 'ojs/ojarraytreedataprovider',"ojs/ojpagingdataproviderview", 'ojs/ojinputnumber', 'ojs/ojdatetimepicker', 'ojs/ojinputtext', 'ojs/ojformlayout',
'ojs/ojknockout', 'ojs/ojactioncard', 'ojs/ojdiagram', 'ojs/ojdialog', 'ojs/ojprogress-bar', 'ojs/ojselectcombobox', 'ojs/ojtable',
'ojs/ojselectsingle', 'ojs/ojradioset', "ojs/ojinputsearch" ,"ojs/ojcollapsible","ojs/ojpagingcontrol",'ojs/ojbutton', 'ojs/ojvalidationgroup'],
function (oj, ko, $, app, layout, keySet, attributeGroupHandler, NumberConverter, ConverterUtilsI18n, DateTimeConverter,ArrayDataProvider, ArrayTreeDataProvider,PagingDataProviderView,ojButtonEventMap) {

  class InitManageViewModel {
    constructor(args) {
      //console.log(args)
      var self = this;
      self.DepName = args.routerState.detail.dep_url;
      self.enableExpdp = ko.observable(false);
      self.title = ko.observable();
      self.groupValid = ko.observable();
      self.phpProgressValue = ko.observable(-1)
      self.progressBarMake = ko.observable(-1)
      self.progressBarInsatll = ko.observable(-1)
      self.progressBarApache = ko.observable(-1)
      self.progressBarMySql = ko.observable(-1)
      self.progressBarNginx = ko.observable(-1)
      self.outPutString = ko.observable();
      self.action = ko.observable();

      self.args = args;
      // Create a child router with one default path
      self.router = self.args.parentRouter;

      self.installOperation = (operationArray) =>{
        //const operationArray = args.params.operation.split(",");
        console.log(operationArray);
        document.getElementById('enableExpdpPanel'+operationArray[0]).style.display = "block";
        
        $.ajax({
            url: "http://echoapps360.ddns.net:8080/operation",
            type: 'POST',
            data: JSON.stringify({
             operation : operationArray,
             phpVersion : args.params.phpVersion,
             MysqlVersion : args.params.mysqlVersion,
             apacheVersion : args.params.apacheVersion
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
                console.log(data)

                if(data['operation']=='nginx'){
                  if(data['result']=='Success'){
                    self.progressBarNginx(100)
                    arrayShift(operationArray,data['info']);
                    // document.getElementById('outputBox').innerHTML = data['info'];
                    // if(operationArray.length > 1){
                    //   operationArray.shift();
                    //   self.installOperation(operationArray);
                    // }
                  }
                }

                if(data['operation']=='apache'){
                  if(data['result']=='Success'){
                    self.progressBarApache(100)
                    arrayShift(operationArray,data['info']);
                    // document.getElementById('outputBox').innerHTML = data['info'];
                    // if(operationArray.length > 1){
                    //   operationArray.shift();
                    //   self.installOperation(operationArray);
                    // }
                  }
                }

                if(data['operation']=='MySql'){
                  if(data['result']=='Success'){
                    self.progressBarMySql(100)
                    arrayShift(operationArray,data['info']);
                    // document.getElementById('outputBox').innerHTML = data['info'];
                    // if(operationArray.length > 1){
                    //   operationArray.shift();
                    //   self.installOperation(operationArray);
                    // }
                  }
                }

                if(data['operation'] == "PHP"){
                  if(data['result']=='Configure'){
                  self.phpProgressValue(100)
                  document.getElementById('outputBox').innerHTML = "Configuring completed... Now relinking";
                  document.getElementById('progressBarMakeId').style.display = "block";
                  var command = 'make';
                  self.invokeOperation(command);
                  }
                }
                
                //self.outPutString(data[0])
            }
        })             
     };

     function arrayShift(operationArray,info){

        document.getElementById('outputBox').innerHTML = info;
        if(operationArray.length > 1){
          operationArray.shift();
          self.installOperation(operationArray);
        }

    }
    

     self.invokeOperation = (command) =>{
      
      $.ajax({
          url: "http://echoapps360.ddns.net:8080/invokeOperation",
          type: 'POST',
          data: JSON.stringify({
           command : command
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
              console.log(data)
              if(data == "make"){
                document.getElementById('outputBox').innerHTML = "Make completed... Now Make Install";
                self.progressBarMake(100)
                document.getElementById('progressBarInsatllId').style.display = "block";
                var command = 'make install';
                  self.invokeOperation(command);
              }
              else if(data == "install"){
                console.log("finished")
                document.getElementById('outputBox').innerHTML = "PHP installed successfully";
                if(operationArray.length > 1){
                  operationArray.shift();
                  self.installOperation();
                }
              }
          }
      })             
   };

   
   self.nginxInstallReportAction = () => {
    self.action("nginx")
    phpInstallReportAction();
  };

     self.phpInstallReportAction = () => {
      self.action("PHP")
      phpInstallReportAction();
    };

    self.apacheInstallReportAction = () => {
      self.action("apache")
      phpInstallReportAction();
    };

    self.MySqlInstallReportAction = () => {
      self.action("mySQL")
      phpInstallReportAction();
    };

    function phpInstallReportAction(){
      $.ajax({
        url: 'http://echoapps360.ddns.net:8080/readLog',
        type: 'POST',
        data: JSON.stringify({
          action : self.action()
      }),
        timeout: sessionStorage.getItem("timeInetrval"),
        error: function (xhr, textStatus, errorThrown) {
        
        },
        success: function (data) {
          document.getElementById('outputBox').innerHTML = "";
          document.getElementById('outputBox').innerHTML = data;
        }
      })
    }


      self.connected = function () {
        if (sessionStorage.getItem("userName") == null) {
          self.router.go('signin');
        }
        else {
          app.onAppSuccess();
          var operationArray = args.params.operation.split(",");
          self.installOperation(operationArray);
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
  /*
   * Returns a constructor for the ViewModel so that the ViewModel is constructed
   * each time the view is displayed.  Return an instance of the ViewModel if
   * only one instance of the ViewModel is needed.
   */
  return InitManageViewModel;
}
);