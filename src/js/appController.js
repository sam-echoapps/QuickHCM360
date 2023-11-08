define([ 'ojs/ojoffcanvas' , 'knockout', 'ojs/ojmodule-element-utils', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 
         'ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter', 'ojs/ojknockoutrouteradapter', 'ojs/ojurlparamadapter', 
         'ojs/ojarraydataprovider', 'ojs/ojarraytreedataprovider','ojs/ojknockouttemplateutils', 'ojs/ojmodule-element','ojs/ojmodule-element-utils','ojs/ojknockout' ,'ojs/ojbutton',
         'ojs/ojdialog','ojs/ojselectsingle'],
  function( OffcanvasUtils , ko , moduleUtils, ResponsiveUtils, ResponsiveKnockoutUtils, CoreRouter, ModuleRouterAdapter,
    KnockoutRouterAdapter, UrlParamAdapter, ArrayDataProvider, ArrayTreeDataProvider,KnockoutTemplateUtils  ) {
     function ControllerViewModel() {
        var self = this;

      self.KnockoutTemplateUtils = KnockoutTemplateUtils;
      self.CancelBehaviorOpt = ko.observable('icon');
      self.footerLinks = ko.observableArray([]);
      self.onepDepType = ko.observable();
        
        self.drawer = {
          displayMode: 'push',
          selector: '#drawer',
          content: '#main'
        };
  

        self.toggleDrawer = function () {
          return OffcanvasUtils.toggle(self.drawer);
        };
      
        self.username = ko.observable();
        
        self.manner = ko.observable('polite');
        self.message = ko.observable();
        document.getElementById('globalBody').addEventListener('announce', announcementHandler, false);

        function announcementHandler(event) {
          setTimeout(function() {
            self.message(event.detail.message);
            self.manner(event.detail.manner);
          }, 200);
        };

      // Media queries for repsonsive layouts
      var smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

      self.count = ko.observable(3);
      this.selectedItem = ko.observable('addClient');

      if(sessionStorage.getItem('userRole')=='staff'){
        var navData = [
          { path:"" ,redirect : 'signin'},
          { path: 'signin', detail : {label: 'SignIn',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'} },
          { path: 'register', detail : {label: 'Register',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'} },
          { path: 'shiftsTimesheet', detail : {label: 'Time Sheet',iconClass: 'oj-navigationlist-item-icon fa fa-clock'}},
          { path: 'myOngoingTimesheet', detail : {label: 'Staff Ongoing Timesheet',iconClass: 'oj-navigationlist-item-icon fa fa-user'}},
          { path: 'myTimesheet', detail : {label: 'Staff Timesheet',iconClass: 'oj-navigationlist-item-icon fa fa-user'}},
          { path: 'ggadmin', detail : {label: 'Client Manager',iconClass: 'oj-navigationlist-item-icon fa fa-cogs'} },
          { path: 'home', detail : {label: 'Home',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
          { path: 'myprofile', detail : {label: 'My Profile',iconClass: 'oj-navigationlist-item-icon fa fa-user'} },
          { path: 'requestedShiftsUser', detail : {label: 'Requested Shifts',iconClass: 'oj-navigationlist-item-icon fa fa-clock-o'} },
          { path: 'upcomingShifts', detail : {label: 'Upcoming Shifts',iconClass: 'oj-navigationlist-item-icon fa fa-clock-o'} },
          { path: 'completedShifts', detail : {label: 'Completed Shifts',iconClass: 'oj-navigationlist-item-icon fa fa-stop-circle'} },
          { path: 'myworkHistory', detail : {label: 'My Work History',iconClass: 'oj-navigationlist-item-icon fa fa-edit'} },
          { path: 'myCalender', detail : {label: 'My Calendar',iconClass: 'oj-navigationlist-item-icon fa fa-calendar'} },
          { path: 'timeSheetStaff', detail : {label: 'Time Sheet',iconClass: 'oj-navigationlist-item-icon fa fa-clock'}},
          { path: 'help', detail : {label: 'Help',iconClass: 'oj-navigationlist-item-icon fa fa-question-circle'} }
        ];  
      }else if(sessionStorage.getItem('userRole')=='Accounts'){
        var navData = [
          { path:"" ,redirect : 'signin'},
          { path: 'signin', detail : {label: 'SignIn',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'} },
          { path: 'clientProfileAccounts', detail : {label: 'My Profile',iconClass: 'oj-navigationlist-item-icon fa fa-user'} },
          { path: 'homeAccounts', detail : {label: 'Home',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
        ];  
      }
      else if(sessionStorage.getItem('userRole')=='Manager'){
        var navData = [
          { path:"" ,redirect : 'signin'},
          { path: 'signin', detail : {label: 'SignIn',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'} },
          { path: 'clientProfileManager', detail : {label: 'My Profile',iconClass: 'oj-navigationlist-item-icon fa fa-user'} },
          { path: 'approveShifts', detail : {label: 'Approve Shifts',iconClass: 'oj-navigationlist-item-icon fa fa-breifcase'}},
          { path: 'clientProfileManager', detail : {label: 'Home',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
          { path: 'clientShiftManager', detail : {label: 'Shift Manager',iconClass: 'oj-navigationlist-item-icon fa fa-clock'} },
          { path: 'clientUpcomingShifts', detail : {label: 'Upcoming Shifts',iconClass: 'oj-navigationlist-item-icon fa fa-clock'}},
          { path: 'clientCompletedShifts', detail : {label: 'Completed Shifts',iconClass: 'oj-navigationlist-item-icon fa fa-clock'}},
          { path: 'clientPreferredList', detail : {label: 'Preferred List',iconClass: 'oj-navigationlist-item-icon fa fa-star'}},
          { path: 'shiftManager', detail : {label: 'Shift Manager',iconClass: 'oj-navigationlist-item-icon fa fa-clock'}},
          { path: 'timeSheetClient', detail : {label: 'Time Sheet',iconClass: 'oj-navigationlist-item-icon fa fa-clock'}},
          { path: 'staffTimesheetClient', detail : {label: 'Staff Timesheet',iconClass: 'oj-navigationlist-item-icon fa fa-user'}},
          { path: 'staffOngoingTimesheet', detail : {label: 'Staff Ongoing Timesheet',iconClass: 'oj-navigationlist-item-icon fa fa-user'}},
          { path: 'clientPublishInvoiceList', detail : {label: 'Client Publish Invoice List',iconClass: 'oj-navigationlist-item-icon fa fa-user'}},
          { path: 'clientViewPublishInvoice', detail : {label: 'Client View Publish Invoice',iconClass: 'oj-navigationlist-item-icon fa fa-user'}},
          { path: 'clientPaidInvoiceList', detail : {label: 'Client Paid Invoice List',iconClass: 'oj-navigationlist-item-icon fa fa-user'}},
          { path: 'clientViewPaidInvoice', detail : {label: 'Client View Paid Invoice',iconClass: 'oj-navigationlist-item-icon fa fa-user'}},
        ];  
      }
      else{
        var navData = [
          { path:"" ,redirect : 'signin'},
          { path: 'clientProfileAccounts', detail : {label: 'My Profile',iconClass: 'oj-navigationlist-item-icon fa fa-user'} },
          { path: 'clientProfileManager', detail : {label: 'My Profile',iconClass: 'oj-navigationlist-item-icon fa fa-user'} },
          { path: 'clientShiftManager', detail : {label: 'Shift Manager',iconClass: 'oj-navigationlist-item-icon fa fa-clock'} },
          { path: 'clientManagerShift', detail : {label: 'Shift Manager',iconClass: 'oj-navigationlist-item-icon fa fa-clock'} },
          { path: 'timeSheet', detail : {label: 'Time Sheet',iconClass: 'oj-navigationlist-item-icon fa fa-clock'}},
          { path: 'approvedTimeSheet', detail : {label: 'Approved Time Sheet',iconClass: 'oj-navigationlist-item-icon fa fa-clock'}},
          { path: 'staffTimesheet', detail : {label: 'Staff Timesheet',iconClass: 'oj-navigationlist-item-icon fa fa-user'}},
          { path: 'staffOngoingTimesheet', detail : {label: 'Staff Ongoing Timesheet',iconClass: 'oj-navigationlist-item-icon fa fa-user'}},
          { path: 'signin', detail : {label: 'SignIn',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'} },
          { path: 'referenceVerification', detail : {label: 'Reference Verification',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'} },
          { path: 'register', detail : {label: 'Register',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'} },
          { path: 'staffView', detail : {label: 'View Staff',iconClass: 'oj-navigationlist-item-icon fa fa-user'} },
          { path: 'staffManagerView', detail : {label: 'Staff Manager View',iconClass: 'oj-navigationlist-item-icon fa fa-user'}},
          { path: 'staffCalender', detail : {label: 'My Calendar',iconClass: 'oj-navigationlist-item-icon fa fa-calendar'} },
          { path: 'staffCalenderView', detail : {label: 'Staff Calendar View',iconClass: 'oj-navigationlist-item-icon fa fa-calendar'} },
          { path: 'staffPreferredListView', detail : {label: 'Staff Preferred List View',iconClass: 'oj-navigationlist-item-icon fa fa-user'}},
          { path: 'myprofile', detail : {label: 'My Profile',iconClass: 'oj-navigationlist-item-icon fa fa-user'} },
          { path: 'staffAllocation', detail : {label: 'Staff Allocation',iconClass: 'oj-navigationlist-item-icon fa fa-user'}},
          { path: 'approveShifts', detail : {label: 'Approve Shifts',iconClass: 'oj-navigationlist-item-icon fa fa-breifcase'}},
/*        { path: 'ggadmin', detail : {label: 'Client Manager',iconClass: 'oj-navigationlist-item-icon fa fa-cogs'} },
 */       { path: 'clientManager', detail : {label: 'Client Manager',iconClass: 'oj-navigationlist-item-icon fa fa-user'}},
          { path: 'addClient', detail : {label: 'Client Manager',iconClass: 'oj-navigationlist-item-icon fa fa-user'} },
          { path: 'addStaff', detail : {label: 'Recruitment',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
          { path: 'induction', detail : {label: 'Induction',iconClass: 'oj-navigationlist-item-icon fa fa-calendar-alt'} },
          { path: 'staffManager', detail : {label: 'Staff Manager',iconClass: 'oj-navigationlist-item-icon fa fa-user-check'}},
          { path: 'prefferedList', detail : {label: 'Preferred List',iconClass: 'oj-navigationlist-item-icon fa fa-star'}},
          { path: 'companyCalendar', detail : {label: 'Company Calendar',iconClass: 'oj-navigationlist-item-icon fa fa-cogs'}},
          { path: 'shiftManager', detail : {label: 'Shift Manager',iconClass: 'oj-navigationlist-item-icon fa fa-clock'}},  
          { path: 'staffTimesheetClientList', detail : {label: 'Time Sheet',iconClass: 'oj-navigationlist-item-icon fa fa-clock'}},
          { path: 'staffAvailabilityCalender', detail : {label: 'Availability Calender',iconClass: 'oj-navigationlist-item-icon fa fa-calendar-alt'}},
          { path: 'staffInvoiceClientList', detail : {label: 'Invoice',iconClass: 'oj-navigationlist-item-icon fa fa-file-invoice'}},
          { path: 'staffInvoiceCreate', detail : {label: 'Invoice Create',iconClass: 'oj-navigationlist-item-icon fa fa-file-invoice'}},
          { path: 'draftInvoiceList', detail : {label: 'Draft Invoice List',iconClass: 'oj-navigationlist-item-icon fa fa-file-invoice'}},
          { path: 'viewDraftInvoice', detail : {label: 'View Draft Invoice',iconClass: 'oj-navigationlist-item-icon fa fa-file-invoice'}},
          { path: 'publishInvoiceList', detail : {label: 'Publish Invoice List',iconClass: 'oj-navigationlist-item-icon fa fa-file-invoice'}},
          { path: 'viewPublishInvoice', detail : {label: 'View Publish Invoice',iconClass: 'oj-navigationlist-item-icon fa fa-file-invoice'}},
          { path: 'paidInvoiceList', detail : {label: 'Paid Invoice List',iconClass: 'oj-navigationlist-item-icon fa fa-file-invoice'}},
          { path: 'viewPaidInvoice', detail : {label: 'View Paid Invoice',iconClass: 'oj-navigationlist-item-icon fa fa-file-invoice'}},
          { path: 'download', detail : {label: 'Download',iconClass: 'oj-navigationlist-item-icon fa fa-file-invoice'}},
/*           { path: 'postcode', detail : {label: 'Postcode',iconClass: 'oj-navigationlist-item-icon fa fa-calendar'} }
 */
        ];
      }

      if (sessionStorage.getItem("userRole") == "staff") {
       
        self.navMenu = [
/*           {"name": "Home","id": "home","icons": "fa-solid fa fa-home", "path":"home"},
 */          {"name": "My Profile","id": "myprofile","icons": "fa-solid fa fa-user", "path":"myprofile"},
          {"name": "Requested Shifts","id": "requestedShiftsUser","icons": "fa-solid fa fa-clock-o", "path":"requestedShiftsUser"},
          {"name": "Upcoming Shifts","id": "upcomingShifts","icons": "fa-solid fa fa-stop-circle", "path":"upcomingShifts"},
          {"name": "Completed Shifts","id": "completedShifts","icons": "fa-solid fa fa-clock", "path":"completedShifts"},
/*           {"name": "My Work History","id": "myworkHistory","icons": "fa-solid fa fa-edit", "path":"myworkHistory"},
 */          {"name": "My Calendar","id": "myCalender","icons": "fa-solid fa fa-calendar", "path":"myCalender"},
          {"name": "Time Sheet","id": "timeSheetStaff","icons": "fa-solid fa fa-clock", "path":"timeSheetStaff"},
/*           {"name": "Help","id": "help","icons": "fa-solid fa fa-question-circle", "path":"help"},
 */        ]
      }else if (sessionStorage.getItem("userRole") == "Accounts") {
        self.navMenu = [
          {"name": "My Profile","id": "clientProfileAccounts","icons": "fa-solid fa fa-user", "path":"clientProfileAccounts"},
          {"name": "Home","id": "homeAccounts","icons": "fa-solid fa fa-home", "path":"homeAccounts"},
        ]
      }else if (sessionStorage.getItem("userRole") == "Manager") {
        self.navMenu = [
          {"name": "Shift Manager","id": "clientShiftManager","icons": "fa-solid fa fa-clock", "path":"clientShiftManager"},
          {"name": "Upcoming Shifts","id": "clientUpcomingShifts","icons": "fa-solid fa fa-clock", "path":"clientUpcomingShifts"},
          {"name": "Completed Shifts","id": "clientCompletedShifts","icons": "fa-solid fa fa-clock", "path":"clientCompletedShifts"},
          {"name": "Time Sheet","id": "timeSheetClient","icons": "fa-solid fa fa-clock", "path":"timeSheetClient"},
          {"name": "Invoice Manager", "id": "invoice", "icons": "fa-solid fa fa-cogs", 
          "children": [
            {"name": "Published Invoice","id": "clientPublishInvoiceList","icons": "fa-solid fa fa-calendar-alt", "path":"clientPublishInvoiceList"},
            {"name": "Paid Invoice","id": "clientPaidInvoiceList","icons": "fa-solid fa fa-calendar-alt", "path":"clientPaidInvoiceList"},
          ]
        },
          // {"name": "Preferred List","id": "clientPreferredList","icons": "fa-solid fa fa-star", "path":"clientPreferredList"},
        ]
      }else {
        self.navMenu = [
          {"name": "Client Manager","id": "clientManager","icons": "fa-solid fa fa-user", "path":"addClient"},
          {"name": "Staffs", "id": "staff", "icons": "fa-solid fa fa-id-card", 
            "children": [
              {"name": "Recruitment","id": "addStaff","icons": "fa-solid fa fa-id-card", "path":"addStaff"},
              {"name": "Induction","id": "induction","icons": "fa-solid fa fa-calendar-alt", "path":"induction"}
            ]
          },
          {"name": "Staff Manager","id": "staffManager","icons": "fa-solid fa fa-user-check", "path":"staffManager"},
          {"name": "Preferred List","id": "prefferedList","icons": "fa-solid fa fa-star", "path":"prefferedList"},
          {"name": "Shift Manager","id": "shiftManager","icons": "fa-solid fa fa-clock", "path":"shiftManager"},
          {"name": "Time Sheet","id": "staffTimesheetClientList","icons": "fa-solid fa fa-clock", "path":"staffTimesheetClientList"},
          {"name": "Availbility Calender","id": "staffAvailabilityCalender","icons": "fa-solid fa fa-file-invoice", "path":"staffAvailabilityCalender"},
          {"name": "Invoice Manager","id": "staffInvoiceClientList","icons": "fa-solid fa fa-file-invoice", "path":"staffInvoiceClientList"},
          {"name": "Settings", "id": "settings", "icons": "fa-solid fa fa-cogs", 
            "children": [
              {"name": "Company Calendar","id": "companyCalendar","icons": "fa-solid fa fa-calendar-alt", "path":"companyCalendar"},
            ]
          },
          // {"name": "Download","id": "download","icons": "fa-solid fa fa-file-invoice", "path":"download"},
        ]
      }
      self.dataProvider = new ArrayTreeDataProvider(self.navMenu, {
        keyAttributes: 'id'
      });
      self.goToPage = (e)=>{
        if(e.currentTarget.id!=""){
          router.go({path : e.currentTarget.id});
        }
      }
      // Router setup

      let router = new CoreRouter(navData, {
        urlAdapter: new UrlParamAdapter()
      });
      router.sync();

      self.moduleAdapter = new ModuleRouterAdapter(router);

      self.selection = new KnockoutRouterAdapter(router);

      if(sessionStorage.getItem('userRole')=='staff'){
        self.navDataProvider = new ArrayDataProvider(navData.slice(4), {keyAttributes: "path"});  
      }
      else if(sessionStorage.getItem('userRole')=='Accounts'){
        self.navDataProvider = new ArrayDataProvider(navData.slice(3), {keyAttributes: "path"});  
      }else if(sessionStorage.getItem('userRole')=='Manager'){
        self.navDataProvider = new ArrayDataProvider(navData.slice(4), {keyAttributes: "path"});  
      }
      else{
        self.navDataProvider = new ArrayDataProvider(navData.slice(17), {keyAttributes: "path"});
      }
      
      // Header
      // Application Name used in Branding Area
      self.appName = ko.observable();


// User Info used in Global Navigation area


      // Footer
      function footerLink(name, id, linkTarget) {
        this.name = name;
        this.linkId = id;
        this.linkTarget = linkTarget;
      }


     
       self.footerLinksDP = new ArrayDataProvider(self.footerLinks,{keyAttributes: 'name'});

     self.SignIn = ko.observable('N');

     self.goToSignIn = function() {
      router.go({path : 'signin'});
      self.SignIn('N');
      location.reload()
    };
  
    ControllerViewModel.prototype.signIn = function() {
      if (!self.localFlow) {
        self.goToSignIn();
        return;
      }
    }

    

    ControllerViewModel.prototype.onAppSuccess = function() {
      self.username(sessionStorage.getItem("userName"));
      self.SignIn('Y');
    };

    ControllerViewModel.prototype.onLoginSuccess = function() {
      if(sessionStorage.getItem("userRole")=="staff"){
        
        router.go({path : 'myprofile'});
      }else if(sessionStorage.getItem("userRole")=="Accounts"){
  
        router.go({path : 'clientProfileAccounts'});
      }else if(sessionStorage.getItem("userRole")=="Manager"){
  
        router.go({path : 'clientShiftManager'});
      }
      else{
        router.go({path : 'addClient'});
      }
      // self.SignIn('Y');
    };

    self.selectedMenuItem = ko.observable('');
  
    self.menuItemAction = function (event,vm) {
      self.selectedMenuItem(event.target.value);
        //User menu Options
      if (self.selectedMenuItem() == 'out')
      {
        console.log(self.selectedMenuItem())
        self.username('');

        sessionStorage.clear();
      event.preventDefault();
      self.goToSignIn();
      }else if (self.selectedMenuItem() == 'about'){
        document.querySelector('#abtDialog').open();
      }
      else if (self.selectedMenuItem() == 'help'){
        document.querySelector('#helpDialog').open();
      }
    }


  }

     return new ControllerViewModel();
  }
);
