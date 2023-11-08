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

      self.ILJobData = ko.observableArray([]);
      self.CancelBehaviorOpt = ko.observable('icon');
      self.expState = ko.observable();
      self.expPercentage = ko.observable(0);
      self.currentILJOb = ko.observable();
      self.isFormReadonly = ko.observable(false);
      self.xfrPercent = ko.observableArray([]);
      self.enableExpdp = ko.observable(true);
      self.enableXFR = ko.observable(false);
      self.enableDownload = ko.observable(false);
      self.enableImpdp = ko.observable(false);
      self.enableSummary = ko.observable(false);
      self.downloadPercent = ko.observableArray([]);
      self.impPercentage = ko.observable(0);
      self.impElapsed = ko.observable();
      self.impState = ko.observable();
      self.summaryData = ko.observableArray([]);
      self.ExpReport = ko.observableArray([]);
      self.ImpReport = ko.observableArray([]);
      self.downloadS3Report = ko.observableArray([]);
      self.flashbackSCN = ko.observable();
      var reportArray=['transferS3Report','downloadS3Report','ExpReport','ImpReport'];
      self.title = ko.observable();
      self.groupValid = ko.observable();

      self.timeRemain = ko.observable();
      self.elapsedTime = ko.observable();
      self.totalElpsedTime = ko.observable();
      self.transMaxElpsedTime = ko.observable();


      //AWS Credentials

self.AWSBucket = ko.observable();
self.AccessKeyID = ko.observable();
self.AccessKey = ko.observable();

      function getILData() {
        self.ILJobData([]);
        $.ajax({
          url: self.DepName() + '/expimpjob',
          type: 'GET',
          dataType: 'json',
          timeout: sessionStorage.getItem("timeInetrval"),
          error: function (xhr, textStatus, errorThrown) {
            if (textStatus == 'timeout' || textStatus == 'error') {
   //           document.querySelector('#TimeoutMon').open();
            }
          },
          success: function (data) {
            for (var i = 0; i < data[0].length; i++) {
              self.ILJobData.push({ 'label': data[0][i] , 'value' :  data[0][i]});
            }
            return self;
          }
        })
      }


      //time conversion

      self._timeConversion = (value) => {
        var remain_num = parseInt(value, 10); // don't forget the second param
        var remain_hours   = Math.floor(remain_num / 3600);
        var remain_minutes = Math.floor((remain_num - (remain_hours * 3600)) / 60);
        var remain_seconds = remain_num - (remain_hours * 3600) - (remain_minutes * 60);

        if (remain_hours   < 10) {remain_hours   = "0"+remain_hours;}
        if (remain_minutes < 10) {remain_minutes = "0"+remain_minutes;}
        if (remain_seconds < 10) {remain_seconds = "0"+remain_seconds;}
        var remainTime  = remain_hours + ':' + remain_minutes + ':' + remain_seconds;
        return remainTime;
    };
    
    self.OPError = ko.observableArray([]);

self.getILTables =    function (event,data)  {
  
  if (self.currentILJOb()){
      $.ajax({
        url: self.DepName() + '/expdpmon',
        type: 'POST',
        data: JSON.stringify({
          jobName : self.currentILJOb()
      }),
        timeout: sessionStorage.getItem("timeInetrval"),
        error: function (xhr, textStatus, errorThrown) {
          if (textStatus == 'timeout' || textStatus == 'error') {

          }
        },
        success: function (data) {
          console.log(data[0])
          if(!data[0].includes('ORA-')){
          var totalElps = 0;
          document.getElementById('enableExpdpPanel').style.display = "block";
          document.getElementById('transer_data').style.display = "none";
          document.getElementById('download_data').style.display = "none";
          document.getElementById('import_data').style.display = "none";
          self.ExpReport([]);
          //self.xfrPercent([]);
          self.OPError([]);
          self.downloadPercent([]);
          self.summaryData([]);
          self.title('');
          self.expPercentage('');
          self.expState('');
          self.flashbackSCN('');
          self.flashbackSCN(data[8]);
          self.AccessKeyID('');
          self.AccessKey('');
          for (var i = 0; i < data[0].length; i++) {
          self.expPercentage(data[0][i].DONE);
          self.expState(data[0][i].STATE);

          ///time conversion
          var remainTime = self._timeConversion(data[0][i].TIME_REMAINING);
          self.timeRemain(remainTime);

            var elapsedTime = self._timeConversion(data[0][i].ELA_TIME);
            self.elapsedTime(elapsedTime);
            totalElps = totalElps + parseInt(data[0][i].ELA_TIME);
            //console.log(totalElps);
           
          }
          if (self.expPercentage()==100 &&  self.expState()=='COMPLETED'){
            var maxTime = 0;
            self.enableExpdp(false);
            self.enableXFR(true);
            self.enableImpdp(false);
            xfrDumpFiles();
            self.xfrPercent([]); 
            document.getElementById("transer_data").style.display="block";
            for (var i = 0; i < data[1].length; i++) {
              var percent = parseInt(data[1][i].Percent,10)
              self.xfrPercent.push({ 'name': data[1][i].fileName ,  'percent':percent , 'elapTime' : self._timeConversion(data[1][i].elapTime) , 'XFRSpeed' : data[1][i].XFRSpeed ,'RemainBytes' : data[1][i].XFRBytes + '/' + data[1][i].TotalBytes  ,'XFReta' : self._timeConversion(data[1][i].XFReta) });
              if(parseInt(data[1][i].elapTime) > maxTime){
                maxTime = parseInt(data[1][i].elapTime);
              }
            }
          
            totalElps = parseInt(totalElps) + parseInt(maxTime);
            maxTime = self._timeConversion(maxTime);
            self.transMaxElpsedTime(maxTime);
           // console.log(totalElps);

          if (self.xfrPercent().percent==100){
            self.downloadPercent([]);
          }

            if (data[3].length==data[4].length){
    //          console.log('Hi')
              downLoadFromS3();
              self.enableXFR(false);
              self.enableDownload(true);
              self.enableImpdp(false);
              //self.downloadPercent([]);
              document.getElementById("download_data").style.display="block";
              for (var i = 0; i < data[2].length; i++) {
                var percent = parseInt(data[2][i].Percent, 10)
                self.downloadPercent.push({ 'name': data[2][i].fileName ,  'percent':percent });
          //      console.log(percent)
            }
//            console.log(data[5].length,data[4].length)
            if (data[5].length==data[4].length){
              ///console.log(data[6]);
            importDp();
            self.enableExpdp(false);
            self.enableXFR(false);
            self.enableDownload(false);
            self.enableImpdp(true);
            document.getElementById("import_data").style.display="block";
            self.impPercentage('');
            self.impState('');
            for (var i = 0; i < data[6].length; i++) {
            self.impPercentage(data[6][i].DONE);
            self.impState(data[6][i].STATE);
            self.impElapsed(self._timeConversion(data[6][i].Elapsed));
            totalElps = parseInt(totalElps) + parseInt(data[6][i].Elapsed);
            var totalElps = self._timeConversion(totalElps);
            self.totalElpsedTime(totalElps);
            console.log(self.totalElpsedTime());
            
            }
//           console.log(self.impPercentage());
            if (self.impPercentage() == 100 && self.impState() == 'COMPLETED' ){
              clearInterval(monAll);
              self.enableExpdp(false);
              self.enableXFR(false);
              self.enableDownload(false);
              self.enableImpdp(false);
              self.enableSummary(true)
              document.getElementById("summary_data").style.display="block";
              self.summaryData([]);
              for (var key in data[7]) {
              self.summaryData.push({'TabName' : key , 'expRows' : data[7][key].ExportRows , 'impRows' : data[7][key].ImportRows})
            }
            self.summaryData.valueHasMutated();
          }
          
        }
        }
        }
      }
      else{
        console.log(data[0])
        document.querySelector('#DBErrDialog').open();
        self.OPError(data[0]);
      }
          return self;
        }
      })
    }
  }

  self.summaryDatacolumnArray = [{headerText: 'Table Name',
  field: 'TabName'},
  {headerText: 'Extracted Rows',
  field: 'expRows'},
  {headerText: 'Loaded Rows',
  field: 'impRows'}
]

  self.XFRDP = ko.observable(new ArrayDataProvider(self.xfrPercent, {keyAttributes: "name"}));

  self.DownloadDP = ko.observable(new ArrayDataProvider(self.downloadPercent, {keyAttributes: "name"}));

  self.summaryDataDP = ko.observable(new PagingDataProviderView(new ArrayDataProvider(self.summaryData, {idAttribute: "TabName"})));

     var monAll;

     self.ILjobDP = ko.observable(new ArrayDataProvider(self.ILJobData, { keyAttributes: 'id' }));

    function xfrDumpFiles() {
      $.ajax({
        url: self.DepName() + '/xfrdumpfiles',
        type: 'POST',
        data: JSON.stringify({
          jobName : self.currentILJOb()
      }),
        timeout: sessionStorage.getItem("timeInetrval"),
        error: function (xhr, textStatus, errorThrown) {
          if (textStatus == 'timeout' || textStatus == 'error') {
   //         document.querySelector('#TimeoutMon').open();
          }
        },
        success: function (data) {
           //     console.log(self.expPercentage())
          return self;
        }
      })

    }

self.clickTshoot = function(){
  importTshoot();
}

    self.impResumableTask = ko.observableArray([]);
    self.impLockStatus = ko.observableArray([]);
    self.impWaitStatus = ko.observableArray([]);
    self.impLongOps = ko.observableArray([]);

   
function importTshoot() {
  if(self.currentILJOb()){
  $.ajax({
    url: self.DepName() + '/tshootimpdp',
    type: 'POST',
    data: JSON.stringify({
      jobName : self.currentILJOb()
  }),
    timeout: sessionStorage.getItem("timeInetrval"),
    error: function (xhr, textStatus, errorThrown) {
      if (textStatus == 'timeout' || textStatus == 'error') {
    //    document.querySelector('#TimeoutMon').open();
      }
    },
    success: function (data) {
      self.title('Monitor Import Session');
      document.getElementById('tshoot').style.display="block";
      document.getElementById('ExpReport').style.display="none";
      self.impResumableTask([]);
      for (var i = 0; i < data[0].length; i++) {
        self.impResumableTask.push({'Session_ID' :  data[0][i].SESSION_ID,'Status' : data[0][i].STATUS, 'Start_Time' :  data[0][i].START_TIME, 'Suspend_Time' : data[0][i].SUSPEND_TIME,'Resume_Time' : data[0][i].RESUME_TIME,'Error_Msg' : data[0][i].ERROR_MSG ,'Sql_Text' : data[0][i].SQL_TEXT})
      }
      self.impResumableTask.valueHasMutated();
      self.impLockStatus([]);
      for (var i = 0; i < data[1].length; i++) {
        self.impLockStatus.push({'Waiting_Session' : data[1][i].WAITING_SESSION,'Holding_Session' :  data[1][i].HOLDING_SESSION,'Serial' : data[1][i].SERIAL, 'Event' :  data[1][i].EVENT, 'W_Program' : data[1][i].WPROGRAM,'B_Program' : data[1][i].BPROGRAM,'W_Module' : data[1][i].WMOD,'B_Module' : data[1][i].BMOD,'Lock_ID': data[1][i].LOCK_ID1})
      }
      self.impLockStatus.valueHasMutated();
      self.impWaitStatus([]);
      for (var i = 0; i < data[2].length; i++) {
        self.impWaitStatus.push({'Session_ID' : data[2][i].SID,'Program' : data[2][i].PROG,'Wait_Sequence' :  data[2][i].SEQ,'Event' : data[2][i].EVENT, 'Wait_Time' :  data[2][i].WAIT_TIME, 'SECONDS_IN_WAIT' : data[2][i].SECONDS_IN_WAIT,'STATE' : data[2][i].STATE,'P1TEXT' : data[2][i].P1TEXT,'P1' : data[2][i].P1,'P2TEXT': data[2][i].P2TEXT ,'P2' : data[2][i].P2 , 'P3TEXT' : data[2][i].P3TEXT , 'P3' :  data[2][i].P3 })
      }
      self.impWaitStatus.valueHasMutated();
      self.impLongOps([]);
      for (var i = 0; i < data[3].length; i++) {
        self.impLongOps.push({'jobName' : data[3][i].JOB_NAME,'State' : data[3][i].STATE,'Workers' : data[3][i].WORKERS,'MESSAGE' :  data[3][i].MESSAGE,'DONE' : data[3][i].DONE,'TIME_REMAINING' : data[3][i].TIME_REMAINING})
      }
      self.impLongOps.valueHasMutated();
      //document.querySelector('#TshootDialog').open();
      return self;
    }
  })
}
}

self.impResumableTaskDP = ko.observable(new PagingDataProviderView(new ArrayDataProvider(self.impResumableTask, {keyAttributes: "Session_ID"})));
self.impLockStatusDP = ko.observable(new PagingDataProviderView(new ArrayDataProvider(self.impLockStatus, {keyAttributes: "Holding_Session"})));
self.impWaitStatusDP = ko.observable(new PagingDataProviderView(new ArrayDataProvider(self.impWaitStatus, {keyAttributes: "Session_ID"})));
self.impLongOpsDP = ko.observable(new PagingDataProviderView(new ArrayDataProvider(self.impLongOps, {keyAttributes: "jobName"})));

self.resumableTaskcolumnArray = [
{headerText: 'Session ID',
field: 'Session_ID'},
{headerText: 'Status',
field: 'Status'},
{headerText: 'Start Time',
field: 'Start_Time'},
{headerText: 'Suspended Time',
field: 'Suspend_Time'},
{headerText: 'Resume Time',
field: 'Resume_Time'},
{headerText: 'Error',
field: 'Error_Msg'},
{headerText: 'SQL Text',
field: 'Sql_Text'}
]

self.impLongOpscolumnArray = [{headerText: 'Job Name',
field: 'jobName'},
{headerText: 'State',
field: 'State'},
{headerText: 'Workers',
field: 'Workers'},
{headerText: 'Message',
field: 'MESSAGE'},
{headerText: 'Percentage Done',
field: 'DONE'},
{headerText: 'Time Remaining',
field: 'TIME_REMAINING'}
]

self.lockStatuscolumnArray = [{headerText: 'Waiting Session',
field: 'Waiting_Session'},
{headerText: 'Holding Session',
field: 'Holding_Session'},
{headerText: 'Serial#',
field: 'Serial'},
{headerText: 'Wait Event',
field: 'Event'},
{headerText: 'Waiting Program',
field: 'W_Program'},
{headerText: 'Blocking Program',
field: 'B_Program'},
{headerText: 'Waiting Module',
field: 'W_Module'},
{headerText: 'Blocking Module',
field: 'B_Module'},
{headerText: 'Lock ID',
field: 'Lock_ID'}
]

self.waitStatuscolumnArray = [{headerText: 'Session ID',
field: 'Session_ID'},
{headerText: 'Program',
field: 'Program'},
{headerText: 'Wait sequence',
field: 'Wait_Sequence'},
{headerText: 'Wait Event',
field: 'Event'},
{headerText: 'Last Wait Time',
field: 'Wait_Time'},
{headerText: 'Seconds in Wait',
field: 'SECONDS_IN_WAIT'},
{headerText: 'State',
field: 'STATE'},
{headerText: 'P1 Text',
field: 'P1TEXT'},
{headerText: 'P1',
field: 'P1'},
{headerText: 'P2 Text',
field: 'P2TEXT'},
{headerText: 'P2',
field: 'P2'},
{headerText: 'P3 Text',
field: 'P3TEXT'},
{headerText: 'P3',
field: 'P3'},
]

    function downLoadFromS3() {
      $.ajax({
        url: self.DepName() + '/downloadfroms3',
        type: 'POST',
        data: JSON.stringify({
          jobName : self.currentILJOb()
      }),
        timeout: sessionStorage.getItem("timeInetrval"),
        error: function (xhr, textStatus, errorThrown) {
          if (textStatus == 'timeout' || textStatus == 'error') {
   //         document.querySelector('#TimeoutMon').open();
          }
        },
        success: function (data) {
    //            console.log('downLoadFromS3')
          return self;
        }
      })

    }


    function importDp() {
      $.ajax({
        url: self.DepName() + '/impdp',
        type: 'POST',
        data: JSON.stringify({
          jobName : self.currentILJOb()
      }),
        timeout: sessionStorage.getItem("timeInetrval"),
        error: function (xhr, textStatus, errorThrown) {
          if (textStatus == 'timeout' || textStatus == 'error') {
//            document.querySelector('#TimeoutMon').open();
          }
        },
        success: function (data) {
  //              console.log(self.expPercentage())
          return self;
        }
      })

    }

    function readExportLog() {
//      document.querySelector('#Working').open();
      $.ajax({
        url: self.DepName() + '/readexportlog',
        type: 'POST',
        data: JSON.stringify({
          jobName : self.currentILJOb()
      }),
        timeout: sessionStorage.getItem("timeInetrval"),
        error: function (xhr, textStatus, errorThrown) {
        
        },
        success: function (data) {
          self.ExpReport([]);
          for(var i = 0; i<data[0].length; i++){
          self.ExpReport.push({'name' : data[0][i]});
          }
          self.ExpReport.valueHasMutated();
          self.title('View Export Log');
          reportView();
 //         document.querySelector('#Working').close();
         // document.querySelector('#ViewExportRptDialog').open();
        }
      })

    }

    function reportView(){
      document.getElementById('tshoot').style.display="none";
      document.getElementById('ExpReport').style.display="block";
    }

    function readImportLog() {
//      document.querySelector('#Working').open();
      $.ajax({
        url: self.DepName() + '/readimportlog',
        type: 'POST',
        data: JSON.stringify({
          jobName : self.currentILJOb()
      }),
        timeout: sessionStorage.getItem("timeInetrval"),
        error: function (xhr, textStatus, errorThrown) {
        
        },
        success: function (data) {
          self.ImpReport([]);
         self.ExpReport([]);
          for(var i = 0; i<data[0].length; i++){
          self.ImpReport.push({'name' : data[0][i]});
          self.ExpReport.push({'name' : data[0][i]});
          }
          self.ImpReport.valueHasMutated();
          self.ExpReport.valueHasMutated();
          reportView();
          self.title('View Import Log');
//              document.querySelector('#Working').close();
             // document.querySelector('#ViewImportRptDialog').open();
        }
      })

    }

    self.exportReportAction = () => {
      readExportLog();
    };

    self.importReportAction = () => {
      readImportLog();
    };

    self.downloadS3ReportAction =  function (data,event) {
      document.querySelector('#Working').open();
      $.ajax({
        url: self.DepName() + '/downloads3log',
        type: 'POST',
        data: JSON.stringify({
          jobName : self.currentILJOb()
      }),
        timeout: sessionStorage.getItem("timeInetrval"),
        error: function (xhr, textStatus, errorThrown) {
          document.querySelector('#Working').close();
        },
        success: function (data) {
          self.downloadS3Report([]);
          self.ExpReport([]);
          for(var i = 0; i<data[0].length; i++){
          self.downloadS3Report.push({'name' : data[0][i].TEXT});
          self.ExpReport.push({'name' : data[0][i].TEXT});
          }
          self.downloadS3Report.valueHasMutated();
          self.ExpReport.valueHasMutated();
          reportView();
          self.title('View Download from S3 to RDS Log');
              document.querySelector('#Working').close();
              //document.querySelector('#ViewDownloadS3RptDialog').open();
        }
      })

    }

    self.transferS3Report = ko.observableArray([]);

    self.S3transferReportAction =  function (data,event) {
      document.querySelector('#Working').open();
      $.ajax({
        url: self.DepName() + '/s3transferlog',
        type: 'POST',
        data: JSON.stringify({
          jobName : self.currentILJOb()
      }),
        timeout: sessionStorage.getItem("timeInetrval"),
        error: function (xhr, textStatus, errorThrown) {
          document.querySelector('#Working').close();
        },
        success: function (data) {
          self.transferS3Report([]);
          self.ExpReport([]);
          for(var i = 0; i<data[0].length; i++){
          self.transferS3Report.push({'name' : data[0][i]});
          self.ExpReport.push({'name' : data[0][i]});
          }
          self.transferS3Report.valueHasMutated();
          self.ExpReport.valueHasMutated();
          reportView();
          self.title('View Transfer to S3 Log');
              document.querySelector('#Working').close();
             // document.querySelector('#transferS3ReportDialog').open();
        }
      })

    }


    self.transferS3RptOKClose =  function (event) {
      document.querySelector('#transferS3ReportDialog').close();
  };

    self.ViewExportRptOKClose = function (event) {
      document.querySelector('#ViewExportRptDialog').close();
  };
  self.ViewImportRptOKClose = function (event) {
    document.querySelector('#ViewImportRptDialog').close();
};

self.ViewDownloadS3RptOKClose = function (event) {
  document.querySelector('#ViewDownloadS3RptDialog').close();
};

self.S3ConfigActionOpen = function (event) {
  document.querySelector('#UpdateS3Config').open();
};

self.UpdateS3ConfigLog = ko.observableArray([]);

self._checkValidationGroup = (value) => {
  var tracker = document.getElementById(value);
  if (tracker.valid === "valid") {
      return true;
  }
  else {
     
      tracker.showMessages();
      tracker.focusOn("@firstInvalidShown");
      return false;
  }
};

self.UpdateS3ConfigOKClose = function (data,event) {
  var valid = self._checkValidationGroup("UpdateS3ConfigForm");
     if (valid) {
  document.querySelector('#Working').open();
  $.ajax({
    url: self.DepName() + '/updates3config',
    type: 'POST',
    data: JSON.stringify({
      jobName : self.currentILJOb(),
      bucketName : self.AWSBucket(),
      aws_access_key_id :  self.AccessKeyID(),
      aws_secret_access_key : self.AccessKey()
  }),
    timeout: sessionStorage.getItem("timeInetrval"),
    error: function (xhr, textStatus, errorThrown) {
    
    },
    success: function (data) {
      self.UpdateS3ConfigLog([]);
      for(var i = 0; i<data[0].length; i++){
      self.UpdateS3ConfigLog.push({'name' : data[0][i]});
      }
      self.UpdateS3ConfigLog.valueHasMutated();
          document.querySelector('#Working').close();
          document.querySelector('#UpdateS3Config').close();
          document.querySelector('#UpdateS3SuccessDialog').open();
    }
  })
}

}

self.transferS3ReportDP = ko.observable(new ArrayDataProvider(self.transferS3Report, {keyAttributes: "name"}));
self.UpdateS3ConfigLogDP = ko.observable(new ArrayDataProvider(self.UpdateS3ConfigLog, {keyAttributes: "name"}));

  self.downloadS3LogDP = ko.observable(new ArrayDataProvider(self.downloadS3Report, {keyAttributes: "name"}));
  self.expLogDP = ko.observable(new ArrayDataProvider(self.ExpReport, {keyAttributes: "name"}));
  self.impLogDP = ko.observable(new ArrayDataProvider(self.ImpReport, {keyAttributes: "name"}));
  
//downlaod to excel

self.downloadCSV = function(){
  console.log(self.summaryData().length);
  //var json_pre = '[{"Id":1,"UserName":"Sam Smith"},{"Id":2,"UserName":"Fred Frankly"},{"Id":1,"UserName":"Zachary Zupers"}]';
    var json = [];
    json.push({"TabName":"Job Name: "+self.currentILJOb()});
    json.push({"":""});

    //for source and target database name
    // json.push({"TabName":"Source Database Name","expRows":self.elapsedTime()});
    // json.push({"TabName":"Target Database Name","expRows":self.elapsedTime()});
    // json.push({"":""});
    

    json.push({"TabName":"TabName","expRows":"Exported Rows","impRows":"Imported Rows"});
  for(var i =0;i<self.summaryData().length;i++){
    json.push({"TabName":self.summaryData()[i].TabName,"expRows":self.summaryData()[i].expRows,"impRows":self.summaryData()[i].impRows});
  }

  json.push({"":""});
  json.push({"TabName":"Export Elapse Time","expRows":self.elapsedTime()});
  json.push({"TabName":"Transfer Elapse Time","expRows":self.transMaxElpsedTime()});
  json.push({"TabName":"Import Elapse Time","expRows":self.impElapsed()});
  json.push({"TabName":"Total Elapse Time","expRows":self.totalElpsedTime()});
  
  //var json = $.parseJSON(json_pre);
  
  var csv = JSON2CSV(json);
  var downloadLink = document.createElement("a");
  var blob = new Blob(["\ufeff", csv]);
  var url = URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = self.currentILJOb()+".csv";
  
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
function JSON2CSV(objArray) {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';
  var line = '';

  if ($("#labels").is(':checked')) {
      var head = array[0];
      if ($("#quote").is(':checked')) {
          for (var index in array[0]) {
              var value = index + "";
              line += '"' + value.replace(/"/g, '""') + '",';
          }
      } else {
          for (var index in array[0]) {
              line += index + ',';
          }
      }

      line = line.slice(0, -1);
      str += line + '\r\n';
  }

  for (var i = 0; i < array.length; i++) {
      var line = '';

      if ($("#quote").is(':checked')) {
          for (var index in array[i]) {
              var value = array[i][index] + "";
              line += '"' + value.replace(/"/g, '""') + '",';
          }
      } else {
          for (var index in array[i]) {
              line += array[i][index] + ',';
          }
      }

      line = line.slice(0, -1);
      str += line + '\r\n';
  }
  return str;
}

     monAll = setInterval(self.getILTables, 25000);
  ////end
      self.args = args;
      // Create a child router with one default path
      self.router = self.args.parentRouter;

      self.connected = function () {
        if (sessionStorage.getItem("userName") == null) {
          self.router.go('signin');
        }
        else {
          app.onAppSuccess();
          self.currentILJOb(args.params.jobName);
          if (self.currentILJOb()){
          self.getILTables();
          }
          getILData();
          
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