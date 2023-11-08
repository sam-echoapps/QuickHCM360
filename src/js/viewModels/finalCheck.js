define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class FinalCheckModel {
        constructor(context) {
                var self = this;
                self.startOpened = ko.observable(true);
                self.startToggle = () => self.startOpened(!self.startOpened());
                self.profileStatus = ko.observable();
                self.profileAuditer = ko.observable();
                self.referenceStatus = ko.observable();
                self.referenceAuditer = ko.observable();
                self.bankStatus = ko.observable();
                self.bankAuditer = ko.observable();
                self.relativeStatus = ko.observable();
                self.relativeAuditer = ko.observable();
                self.educationStatus = ko.observable();
                self.educationAuditer = ko.observable();
                self.workStatus = ko.observable();
                self.workAuditer = ko.observable();
                self.dbsStatus = ko.observable();
                self.dbsAuditer = ko.observable();
                self.healthStatus = ko.observable();
                self.healthAuditer = ko.observable();
                self.trainingStatus = ko.observable();
                self.trainingAuditer = ko.observable();
                self.rightStatus = ko.observable();
                self.rightAuditer = ko.observable();
                self.staffName = ko.observable();
                self.staffNameCap = ko.observable();
                self.inductionStatus = ko.observable();
                self.inductionAuditer = ko.observable();
                self.contractStatus = ko.observable();
                self.contractAuditer = ko.observable();
                self.starterStatus = ko.observable();   
                self.starterAuditer = ko.observable();

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({ path: 'signin' });
                    }
                    else {
                       app.onAppSuccess();
                       getFinalCheckInfo();
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
                function getFinalCheckInfo() {
                        var BaseURL = sessionStorage.getItem("BaseURL")
                        $.ajax({
                            url: BaseURL + "/jpGetRecruitmentStatus",
                            type: 'POST',
                            data: JSON.stringify({
                                staffId : sessionStorage.getItem("staffId"),
                            }),
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                if(textStatus == 'timeout' || textStatus == 'error'){
                                    document.querySelector('#TimeoutSup').open();
                                }
                            },
                            success: function (data) {
                                console.log(data)  
                                if(data[0].length !=0) {
                                    if(data[0][0][0] == "Pending") {
                                        self.profileStatus('Pending');
                                    }else if(data[0][0][0] == "Audited") {
                                        self.profileStatus('Audited');
                                    }
                                    if(data[0][0][1] == "NULL" || data[0][0][1] == null) {
                                        self.profileAuditer('N/A');
                                    }else if(data[0][0][1] != "NULL") {
                                        self.profileAuditer(data[0][0][1]);
                                    }
                                }
                                else{
                                    self.profileStatus('Pending');
                                    self.profileAuditer('N/A');
                                }
                                if(data[1].length !=0) {  
                                    if(data[1][0][0] == "Pending") {
                                        self.referenceStatus('Pending');
                                    }else if(data[1][0][0] == "Audited") {
                                        self.referenceStatus('Audited');
                                    }
                                    if(data[1][0][1] == "NULL"  || data[1][0][1] == null) {
                                        self.referenceAuditer('N/A');
                                    }else if(data[1][0][1] != "NULL") {
                                        self.referenceAuditer(data[1][0][1]);
                                    }
                                }else{
                                    self.referenceStatus('Pending');
                                    self.referenceAuditer('N/A');
                                } 
                                if(data[2].length !=0) {
                                    if(data[2][0][0] == "Pending") {
                                        self.bankStatus('Pending');
                                    }else if(data[2][0][0] == "Audited") {
                                        self.bankStatus('Audited');
                                    }
                                    if(data[2][0][1] == "NULL"  || data[2][0][1] == null) {
                                        self.bankAuditer('N/A');
                                    }else if(data[2][0][1] != "NULL") {
                                        self.bankAuditer(data[2][0][1]);
                                    }
                                }else{
                                    self.bankStatus('Pending');
                                    self.bankAuditer('N/A');
                                }
                                if(data[3].length !=0) {
                                    if(data[3][0][0] == "Pending") {
                                        self.relativeStatus('Pending');
                                    }else if(data[3][0][0] == "Audited") {
                                        self.relativeStatus('Audited');
                                    }
                                    if(data[3][0][1] == "NULL"  || data[3][0][1] == null) {
                                        self.relativeAuditer('N/A');
                                    }else if(data[3][0][1] != "NULL") {
                                        self.relativeAuditer(data[3][0][1]);
                                    }
                                }else{
                                    self.relativeStatus('Pending');
                                    self.relativeAuditer('N/A');
                                }  
                                if(data[4].length !=0) {
                                    if(data[4][0][0] == "Pending") {
                                        self.educationStatus('Pending');
                                    }else if(data[4][0][0] == "Audited") {
                                        self.educationStatus('Audited');
                                    }
                                    if(data[4][0][1] == "NULL"  || data[4][0][1] == null) {
                                        self.educationAuditer('N/A');
                                    }else if(data[4][0][1] != "NULL") {
                                        self.educationAuditer(data[4][0][1]);
                                    }
                                }else{
                                    self.educationStatus('Pending');
                                    self.educationAuditer('N/A');
                                } 
                                if(data[5].length !=0) {
                                    if(data[5][0][0] == "Pending") {
                                        self.workStatus('Pending');
                                    }else if(data[5][0][0] == "Audited") {
                                        self.workStatus('Audited');
                                    }
                                    if(data[5][0][1] == "NULL"  || data[5][0][1] == null) {
                                        self.workAuditer('N/A');
                                    }else if(data[5][0][1] != "NULL") {
                                        self.workAuditer(data[5][0][1]);
                                    }
                                }else{
                                    self.workStatus('Pending');
                                    self.workAuditer('N/A');
                                } 
        
                                if(data[6].length !=0) {
                                    if(data[6][0][0] == "Pending") {
                                        self.healthStatus('Pending');
                                    }else if(data[6][0][0] == "Audited") {
                                        self.healthStatus('Audited');
                                    }
                                    if(data[6][0][1] == "NULL"  || data[6][0][1] == null) {
                                        self.healthAuditer('N/A');
                                    }else if(data[6][0][1] != "NULL") {
                                        self.healthAuditer(data[6][0][1]);
                                    }
                                }else{
                                    self.healthStatus('Pending');
                                    self.healthAuditer('N/A');
                                } 
        
                                if(data[7].length !=0) {
                                    if(data[7][0][0] == "Pending") {
                                        self.dbsStatus('Pending');
                                    }else if(data[7][0][0] == "Audited") {
                                        self.dbsStatus('Audited');
                                    }
                                    if(data[7][0][1] == "NULL"  || data[7][0][1] == null) {
                                        self.dbsAuditer('N/A');
                                    }else if(data[7][0][1] != "NULL") {
                                        self.dbsAuditer(data[7][0][1]);
                                    }
                                }else{
                                    self.dbsStatus('Pending');
                                    self.dbsAuditer('N/A');
                                } 
        
                                if(data[8].length !=0) {
                                    if(data[8][0][0] == "Pending") {
                                        self.trainingStatus('Pending');
                                    }else if(data[8][0][0] == "Audited") {
                                        self.trainingStatus('Audited');
                                    }
                                    if(data[8][0][1] == "NULL"  || data[8][0][1] == null) {
                                        self.trainingAuditer('N/A');
                                    }else if(data[8][0][1] != "NULL") {
                                        self.trainingAuditer(data[8][0][1]);
                                    }
                                }else{
                                    self.trainingStatus('Pending');
                                    self.trainingAuditer('N/A');
                                } 
        
                                if(data[9].length !=0) {
                                    if(data[9][0][0] == "Pending") {
                                        self.rightStatus('Pending');
                                    }else if(data[9][0][0] == "Audited") {
                                        self.rightStatus('Audited');
                                    }
                                    if(data[9][0][1] == "NULL"  || data[9][0][1] == null) {
                                        self.rightAuditer('N/A');
                                    }else if(data[9][0][1] != "NULL") {
                                        self.rightAuditer(data[9][0][1]);
                                    }
                                }else{
                                    self.rightStatus('Pending');
                                    self.rightAuditer('N/A');
                                } 
        
                                self.staffName(data[10][0][0] + " " + data[10][0][1])
                                self.staffNameCap(self.staffName().toUpperCase());
        
                                if(data[11].length !=0) {
                                    if(data[11][0][0] == "Pending") {
                                        self.inductionStatus('Pending');
                                    }else if(data[11][0][0] == "Audited") {
                                        self.inductionStatus('Audited');
                                    }
                                    if(data[11][0][1] == "NULL"  || data[11][0][1] == null) {
                                        self.inductionAuditer('N/A');
                                    }else if(data[11][0][1] != "NULL") {
                                        self.inductionAuditer(data[11][0][1]);
                                    }
                                }else{
                                    self.inductionStatus('Pending');
                                    self.inductionAuditer('N/A');
                                } 
        
                                if(data[12].length !=0) {
                                    if(data[12][0][0] == "Pending") {
                                        self.contractStatus('Pending');
                                    }else if(data[12][0][0] == "Audited") {
                                        self.contractStatus('Audited');
                                    }
                                    if(data[12][0][1] == "NULL"  || data[12][0][1] == null) {
                                        self.contractAuditer('N/A');
                                    }else if(data[12][0][1] != "NULL") {
                                        self.contractAuditer(data[12][0][1]);
                                    }
                                }else{
                                    self.contractStatus('Pending');
                                    self.contractAuditer('N/A');
                                } 
        
                                if(data[13].length !=0) {
                                    if(data[13][0][0] == "Pending") {
                                        self.starterStatus('Pending');
                                    }else if(data[13][0][0] == "Audited") {
                                        self.starterStatus('Audited');
                                    }
                                    if(data[13][0][1] == "NULL"  || data[13][0][1] == null) {
                                        self.starterAuditer('N/A');
                                    }else if(data[13][0][1] != "NULL") {
                                        self.starterAuditer(data[13][0][1]);
                                    }
                                }else{
                                    self.starterStatus('Pending');
                                    self.starterAuditer('N/A');
                                }           
                        }
                        })
                
                }

                self.staffActivate = function (event,data) {
                    var BaseURL = sessionStorage.getItem("BaseURL")
                    $.ajax({
                        url: BaseURL+ "/jpStaffActivate",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("staffId"),
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            if(textStatus == 'timeout'){
                                document.querySelector('#openUpdateStaffProgress').close();
                                document.querySelector('#Timeout').open();
                            }
                        },
                        success: function (data) {
                           console.log("Success")
                           window.location.href = "?ojr=staffManager"
                           //location.reload(); 
                        }
                    })  
    
                }

            }
            
            
          }
            return  FinalCheckModel;

        });
