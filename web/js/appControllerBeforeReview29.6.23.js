define([ 'ojs/ojoffcanvas' , 'knockout', 'ojs/ojmodule-element-utils', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 
         'ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter', 'ojs/ojknockoutrouteradapter', 'ojs/ojurlparamadapter', 
         'ojs/ojarraydataprovider', 'ojs/ojknockouttemplateutils', 'ojs/ojmodule-element','ojs/ojmodule-element-utils','ojs/ojknockout' ,'ojs/ojbutton',
         'ojs/ojdialog','ojs/ojselectsingle'],
  function( OffcanvasUtils , ko , moduleUtils, ResponsiveUtils, ResponsiveKnockoutUtils, CoreRouter, ModuleRouterAdapter,
    KnockoutRouterAdapter, UrlParamAdapter, ArrayDataProvider, KnockoutTemplateUtils  ) {
     function ControllerViewModel() {
        var self = this;

      self.KnockoutTemplateUtils = KnockoutTemplateUtils;
      self.onepDeployList = ko.observableArray([]);
      self.DepName = ko.observable();
      self.onepDepName = ko.observable();
      self.onepDepUrl = ko.observable();
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
      
      if(sessionStorage.getItem('userRole')=='staff'){
        var navData = [
          { path:"" ,redirect : 'signin'},
          { path: 'signin', detail : {label: 'SignIn',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24',dep_url : self.onepDepUrl ,dep_type : self.onepDepType} },
          { path: 'register', detail : {label: 'Register',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24',dep_url : self.onepDepUrl ,dep_type : self.onepDepType} },
          { path: 'ggadmin', detail : {label: 'Client Manager',iconClass: 'oj-navigationlist-item-icon fa fa-cogs',dep_url : self.onepDepUrl,dep_type : self.onepDepType} },
          { path: 'home', detail : {label: 'Home',iconClass: 'oj-navigationlist-item-icon fa fa-home',dep_url : self.onepDepUrl,dep_type : self.onepDepType} },
          { path: 'upcomingShifts', detail : {label: 'Upcoming Shifts',iconClass: 'oj-navigationlist-item-icon fa fa-clock-o',dep_url : self.onepDepUrl,dep_type : self.onepDepType} },
          { path: 'completedShifts', detail : {label: 'Completed Shifts',iconClass: 'oj-navigationlist-item-icon fa fa-stop-circle',dep_url : self.onepDepUrl,dep_type : self.onepDepType} },
          { path: 'myworkHistory', detail : {label: 'My Work History',iconClass: 'oj-navigationlist-item-icon fa fa-edit',dep_url : self.onepDepUrl,dep_type : self.onepDepType} },
          { path: 'myCalender', detail : {label: 'My Calendar',iconClass: 'oj-navigationlist-item-icon fa fa-calendar',dep_url : self.onepDepUrl,dep_type : self.onepDepType} },
          { path: 'myprofile', detail : {label: 'My Profile',iconClass: 'oj-navigationlist-item-icon fa fa-user',dep_url : self.onepDepUrl,dep_type : self.onepDepType} },
          { path: 'help', detail : {label: 'Help',iconClass: 'oj-navigationlist-item-icon fa fa-question-circle',dep_url : self.onepDepUrl,dep_type : self.onepDepType} }
        ];  
      }else if(sessionStorage.getItem('userRole')=='Accounts'){
        var navData = [
          { path:"" ,redirect : 'signin'},
          { path: 'signin', detail : {label: 'SignIn',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24',dep_url : self.onepDepUrl ,dep_type : self.onepDepType} },
          { path: 'clientProfileAccounts', detail : {label: 'My Profile',iconClass: 'oj-navigationlist-item-icon fa fa-user',dep_url : self.onepDepUrl,dep_type : self.onepDepType} },
          { path: 'homeAccounts', detail : {label: 'Home',iconClass: 'oj-navigationlist-item-icon fa fa-home',dep_url : self.onepDepUrl,dep_type : self.onepDepType} },
        ];  
      }
      else if(sessionStorage.getItem('userRole')=='Manager'){
        var navData = [
          { path:"" ,redirect : 'signin'},
          { path: 'signin', detail : {label: 'SignIn',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24',dep_url : self.onepDepUrl ,dep_type : self.onepDepType} },
          { path: 'clientProfileManager', detail : {label: 'My Profile',iconClass: 'oj-navigationlist-item-icon fa fa-user',dep_url : self.onepDepUrl,dep_type : self.onepDepType} },
          { path: 'clientProfileManager', detail : {label: 'Home',iconClass: 'oj-navigationlist-item-icon fa fa-home',dep_url : self.onepDepUrl,dep_type : self.onepDepType} },
          { path: 'clientShiftManager', detail : {label: 'Shift Manager',iconClass: 'oj-navigationlist-item-icon fa fa-clock',dep_url : self.onepDepUrl,dep_type : self.onepDepType} },
          { path: 'clientPreferredList', detail : {label: 'Preferred List',iconClass: 'oj-navigationlist-item-icon fa fa-star',dep_url : self.onepDepUrl,dep_type : self.onepDepType}},
        ];  
      }
      else{
        var navData = [
          { path:"" ,redirect : 'signin'},
          { path: 'clientProfileAccounts', detail : {label: 'My Profile',iconClass: 'oj-navigationlist-item-icon fa fa-user',dep_url : self.onepDepUrl,dep_type : self.onepDepType} },
          { path: 'clientProfileManager', detail : {label: 'My Profile',iconClass: 'oj-navigationlist-item-icon fa fa-user',dep_url : self.onepDepUrl,dep_type : self.onepDepType} },
          { path: 'clientShiftManager', detail : {label: 'Shift Manager',iconClass: 'oj-navigationlist-item-icon fa fa-clock',dep_url : self.onepDepUrl,dep_type : self.onepDepType} },
          { path: 'signin', detail : {label: 'SignIn',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24',dep_url : self.onepDepUrl ,dep_type : self.onepDepType} },
          { path: 'referenceVerification', detail : {label: 'Reference Verification',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24',dep_url : self.onepDepUrl ,dep_type : self.onepDepType} },
          { path: 'register', detail : {label: 'Register',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24',dep_url : self.onepDepUrl ,dep_type : self.onepDepType} },
          { path: 'staffView', detail : {label: 'View Staff',iconClass: 'oj-navigationlist-item-icon fa fa-user',dep_url : self.onepDepUrl,dep_type : self.onepDepType} },
          { path: 'staffManagerView', detail : {label: 'Staff Manager View',iconClass: 'oj-navigationlist-item-icon fa fa-user',dep_url : self.onepDepUrl,dep_type : self.onepDepType}},
          { path: 'staffCalender', detail : {label: 'My Calendar',iconClass: 'oj-navigationlist-item-icon fa fa-calendar',dep_url : self.onepDepUrl,dep_type : self.onepDepType} },
          { path: 'staffCalenderView', detail : {label: 'Staff Calendar View',iconClass: 'oj-navigationlist-item-icon fa fa-calendar',dep_url : self.onepDepUrl,dep_type : self.onepDepType} },
          { path: 'staffPreferredListView', detail : {label: 'Staff Preferred List View',iconClass: 'oj-navigationlist-item-icon fa fa-user',dep_url : self.onepDepUrl,dep_type : self.onepDepType}},
          { path: 'myprofile', detail : {label: 'My Profile',iconClass: 'oj-navigationlist-item-icon fa fa-user',dep_url : self.onepDepUrl,dep_type : self.onepDepType} },
/*        { path: 'ggadmin', detail : {label: 'Client Manager',iconClass: 'oj-navigationlist-item-icon fa fa-cogs',dep_url : self.onepDepUrl,dep_type : self.onepDepType} },
 */       { path: 'clientManager', detail : {label: 'Client Manager',iconClass: 'oj-navigationlist-item-icon fa fa-user',dep_url : self.onepDepUrl,dep_type : self.onepDepType}},
          { path: 'addClient', detail : {label: 'Client Manager',iconClass: 'oj-navigationlist-item-icon fa fa-user',dep_url : self.onepDepUrl,dep_type : self.onepDepType} },
          { path: 'addStaff', detail : {label: 'Recruitment',iconClass: 'oj-navigationlist-item-icon fa fa-id-card',dep_url : self.onepDepUrl,dep_type : self.onepDepType} },
          { path: 'induction', detail : {label: 'Induction',iconClass: 'oj-navigationlist-item-icon fa fa-calendar-alt',dep_url : self.onepDepUrl,dep_type : self.onepDepType} },
          { path: 'staffManager', detail : {label: 'Staff Manager',iconClass: 'oj-navigationlist-item-icon fa fa-user-check',dep_url : self.onepDepUrl,dep_type : self.onepDepType}},
          { path: 'prefferedList', detail : {label: 'Preferred List',iconClass: 'oj-navigationlist-item-icon fa fa-star',dep_url : self.onepDepUrl,dep_type : self.onepDepType}},
          { path: 'companyCalendar', detail : {label: 'Company Calendar',iconClass: 'oj-navigationlist-item-icon fa fa-cogs',dep_url : self.onepDepUrl,dep_type : self.onepDepType}},
          { path: 'shiftManager', detail : {label: 'Shift Manager',iconClass: 'oj-navigationlist-item-icon fa fa-clock',dep_url : self.onepDepUrl,dep_type : self.onepDepType}},
/*           { path: 'postcode', detail : {label: 'Postcode',iconClass: 'oj-navigationlist-item-icon fa fa-calendar',dep_url : self.onepDepUrl,dep_type : self.onepDepType} }
 */
        ];
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
        self.navDataProvider = new ArrayDataProvider(navData.slice(3), {keyAttributes: "path"});  
      }
      else{
        self.navDataProvider = new ArrayDataProvider(navData.slice(14), {keyAttributes: "path"});
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
      self.onepDepName(sessionStorage.getItem("Dep_Name"));
      self.onepDepUrl(sessionStorage.getItem("Dep_Url"));
      self.onepDepType(sessionStorage.getItem("Dep_Type"));
      self.SignIn('Y');
      if (self.onepDepType() == 'bda'){
        self.appName('1Place For BigData Targets')
      }
      else if(self.onepDepType() == 'oracle'){
/*         self.appName('Jobs Plus')
 */      }
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
      self.SignIn('Y');
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
      }
      else if (self.selectedMenuItem() == 'seldep'){
        document.querySelector('#RemoteDeploymentDialog').open();
        self.onepDeployList([]);
        $.ajax({
          url: "http://169.197.183.168:8090/onepdep",
          type: 'GET',
          dataType: 'json',
          context: self,
          error: function (e) {
          },
          success: function (data) {
            console.log(data)
              for (var i = 0; i < data[0].length; i++) {
              self.onepDeployList.push({'label' : data[0][i].dep , value :  data[0][i].dep} );
              }
              self.onepDeployList.valueHasMutated();
              return self;
          }
      })
      }else if (self.selectedMenuItem() == 'about'){
        document.querySelector('#abtDialog').open();
      }
      else if (self.selectedMenuItem() == 'help'){
        document.querySelector('#helpDialog').open();
      }
    }

    self.onepDepListDP = new ArrayDataProvider(self.onepDeployList, {keyAttributes: 'value'});

    self.SwitchDeployment = (event) =>{
      self.onepDepUrl('');
      $.ajax({
        url: "http://169.197.183.168:8090/onepdepurl",
        type: 'POST',
        data: JSON.stringify({
          dep: self.DepName()
      }),
        dataType: 'json',
        context: self,
        error: function (e) {
        },
        success: function (data) {
            self.onepDepUrl(data[0]);
            self.onepDepName(self.DepName());
            self.onepDepType(data[2]);
            sessionStorage.setItem("Dep_Name", self.onepDepName());
            sessionStorage.setItem("Dep_Url", self.onepDepUrl());
            sessionStorage.setItem("Dep_Type", self.onepDepType());
            location.reload();
            return self;
        }

    })
   };

  }

     return new ControllerViewModel();
  }
);
