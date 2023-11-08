define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class StaffManagerModel {
        constructor(context) {
                var self = this;
                self.DepName = context.routerState.detail.dep_url;
                self.startOpened = ko.observable(true);
                self.startToggle = () => self.startOpened(!self.startOpened());
                self.StaffDet = ko.observableArray([]);
                self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();
                self.CancelBehaviorOpt = ko.observable('icon');
                self.ListAction = ko.observable('');
                var BaseURL = sessionStorage.getItem("BaseURL");

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({ path: 'signin' });
                    }
                    else {
                       app.onAppSuccess();
                       getActiveStaff();
                    }
                };

                //Validation 
            self._checkValidationGroup = (value) => {
                ////console.log(value)
                var tracker = document.getElementById(value);
                ////console.log(tracker.valid)
                if (tracker.valid === "valid") {
                    return true;
                }
                else {

                    tracker.showMessages();
                    tracker.focusOn("@firstInvalidShown");
                    return false;
                }
            };
            function getActiveStaff() {
                document.getElementById('loaderView').style.display="block";
                self.StaffDet([]);
                $.ajax({
                    url: BaseURL + "/jpActiveStaffGet",
                    type: 'GET',
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout' || textStatus == 'error'){
                            document.querySelector('#TimeoutSup').open();
                        }
                    },
                    success: function (data) {
                        document.getElementById('mainView').style.display="block";
                        document.getElementById('loaderView').style.display="none";
                        console.log(data)
                        var photo;
                         for (var i = 0; i < data[0].length; i++) {
                            if(data[0][i][14] == '') {
                                // self.profilePhoto(BaseURL + "/css/uploads/defaultUser.png")
                                photo = 'data:image/jpeg;base64,'+data[1][i];                 
                            }else {
                                // self.profilePhoto(BaseURL+"/"+data[0][15]); 
                                // console.log(self.profilePhoto())
                                photo ='data:image/jpeg;base64,'+data[1][i];                 
                            }
                            self.StaffDet.push({'id': data[0][i][0], 'title' : data[0][i][1], 'firstName' : data[0][i][2] , 'lastName' : data[0][i][3] , 'name' : data[0][i][2] + " " +data[0][i][3] ,  'mainPostion' :data[0][i][4] , 'subPostion' : data[0][i][5] , 
                              'workStatus' : data[0][i][6] , 'address1' : data[0][i][7] ,'address2' : data[0][i][8] ,'postTown' : data[0][i][9] , 'postCode' : data[0][i][10], 'contactEmail' : data[0][i][11] , 'contactNumber' : data[0][i][15] + " " + data[0][i][12], 'profilePhoto' : photo });

                    }

                    self.ListAction('Active Staffs')

                    self.StaffDet.valueHasMutated();
                    return self; 
                }
                })
            }
            this.dataProvider1 = new ArrayDataProvider(this.StaffDet, { keyAttributes: "id"});

            self.deactivateConfirm = function (event,data) {
                var clickedRowId = data.data.id
                sessionStorage.setItem("staffId", clickedRowId);
                console.log(clickedRowId)
                if(clickedRowId !=undefined){
                    document.querySelector('#openDeactivateConfirm').open();
                }         
               
            }
                self.deactivateStaff = function (event,data) {
                    document.querySelector('#openDeactivateConfirm').close();
                    document.querySelector('#openDeactivateProgress').open();
                    var BaseURL = sessionStorage.getItem("BaseURL")
                    $.ajax({
                        url: BaseURL+ "/jpStaffDeactivate",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("staffId"),
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            if(textStatus == 'timeout'){
                                document.querySelector('#openDeactivateProgress').close();
                                document.querySelector('#Timeout').open();
                            }
                        },
                        success: function (data) {
                            
                           document.querySelector('#openDeactivateProgress').close();
                           console.log("Success")
                           location.reload(); 
                        }
                    })  
    
                }

                self.deactivatedStaffList = function (event,data) {
                    document.getElementById('mainView').style.display="none";
                    document.getElementById('loaderView').style.display="block";
                    self.StaffDet([]);
                    var BaseURL = sessionStorage.getItem("BaseURL")
                    $.ajax({
                        url: BaseURL+ "/jpDeactivatedStaffs",
                        type: 'GET',
                       /*  data: JSON.stringify({
                            staffId : sessionStorage.getItem("staffId"),
                        }), */
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            if(textStatus == 'timeout'){
                                document.querySelector('#openDeactivateProgress').close();
                                document.querySelector('#Timeout').open();
                            }
                        },
                        success: function (data) {
                        document.getElementById('mainView').style.display="block";
                        document.getElementById('loaderView').style.display="none";
                           console.log(data)
                           var photo;
                            for (var i = 0; i < data[0].length; i++) {
                                if(data[0][i][14] == '') {
                                    // self.profilePhoto(BaseURL + "/css/uploads/defaultUser.png")
                                    photo = 'data:image/jpeg;base64,'+data[1][i];                 
                                }else {
                                    // self.profilePhoto(BaseURL+"/"+data[0][15]); 
                                    // console.log(self.profilePhoto())
                                    photo ='data:image/jpeg;base64,'+data[1][i];                 
                                }
                               self.StaffDet.push({'id': data[0][i][0], 'title' : data[0][i][1], 'firstName' : data[0][i][2] , 'lastName' : data[0][i][3] , 'name' : data[0][i][2] + " " +data[0][i][3] ,  'mainPostion' :data[0][i][4] , 'subPostion' : data[0][i][5] , 
                                 'workStatus' : data[0][i][6] , 'address1' : data[0][i][7] ,'address2' : data[0][i][8] ,'postTown' : data[0][i][9] , 'postCode' : data[0][i][10], 'contactEmail' : data[0][i][11] , 'contactNumber' : data[0][i][15] + " " + data[0][i][12], 'profilePhoto' : photo });
   
                       }
   
                           self.ListAction('Inactive Staffs')
                           //location.reload(); 
                        }
                    })  
    
                }

                self.activatedStaffList = function (event,data) {
                    document.getElementById('mainView').style.display="none";
                    document.getElementById('loaderView').style.display="block";
                    getActiveStaff() 
                }
                self.activateConfirm = function (event,data) {
                    var clickedRowId = data.data.id
                    sessionStorage.setItem("staffId", clickedRowId);
                    console.log(clickedRowId)
                    if(clickedRowId !=undefined){
                        document.querySelector('#openActivateConfirm').open();
                    }         
                   
                }
                    self.activateStaff = function (event,data) {
                        document.querySelector('#openActivateConfirm').close();
                        document.querySelector('#openActivateProgress').open();
                        var BaseURL = sessionStorage.getItem("BaseURL")
                        $.ajax({
                            url: BaseURL+ "/jpStaffReActivate",
                            type: 'POST',
                            data: JSON.stringify({
                                staffId : sessionStorage.getItem("staffId"),
                            }),
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                if(textStatus == 'timeout'){
                                    document.querySelector('#openActivateProgress').close();
                                    document.querySelector('#Timeout').open();
                                }
                            },
                            success: function (data) {
                               document.querySelector('#openActivateProgress').close();
                               console.log("Success")
                               location.reload(); 
                            }
                        })  
        
                    }

                    self.context = context;
                    self.router = self.context.parentRouter;

                    self.editStaff = function (event,data) {
                        var clickedStaffId = data.data.id
                        console.log(clickedStaffId)
                        sessionStorage.setItem("staffId", clickedStaffId);
                        // sessionStorage.setItem("BaseURL", BaseURL);
                        console.log(data)
                        self.router.go({path:'staffManagerView'})
                    }

                    self.StaffCalender = function (event,data) {
                        sessionStorage.removeItem('availableDateData')
                        var clickedStaffId = data.data.id
                        console.log(clickedStaffId)
                        sessionStorage.setItem("staffId", clickedStaffId);
                        // sessionStorage.setItem("BaseURL", BaseURL);
                        console.log(data)
                        self.router.go({path:'staffCalenderView'})
                    }
                    self.StaffPreferredList = function (event,data) {
                        var clickedStaffId = data.data.id
                        console.log(clickedStaffId)
                        sessionStorage.setItem("staffId", clickedStaffId);
                        // sessionStorage.setItem("BaseURL", BaseURL);
                        console.log(data)
                        //self.router.go({path:'staffPreferredListView'})
                        window.location = "?ojr=staffCalenderView%2FpreferredListClient%3Bindex%3D1"
                    }
            }
            
            
          }
            return  StaffManagerModel;

        });
