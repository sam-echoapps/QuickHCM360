'use strict';
define(['ojs/ojcore', 'knockout', 'appController', 'appUtils',
    'ojs/ojknockout',"ojs/ojlabel", 'ojs/ojcheckboxset', 'ojs/ojinputtext',
    'ojs/ojbutton', 'ojs/ojvalidationgroup',"ojs/ojdatetimepicker","ojs/ojradioset",
    'ojs/ojanimation','ojs/ojformlayout','ojs/ojdialog',"ojs/ojprogress-circle","ojs/ojpopup"], 
    function(oj, ko, app, appUtils) {
        class ReferenceVerification {
            constructor(args) {
                var self = this;
                
                self.releationship = ko.observable();
                self.capacity = ko.observable();
                self.durationFrom = ko.observable();
                self.durationTo = ko.observable();
                self.organisationName = ko.observable();
                self.position = ko.observable();
                self.honest = ko.observable('yes');
                self.noHonestReason = ko.observable('');
                self.disciplinary = ko.observable('no');
                self.yesDisciplinaryDetails = ko.observable('');
                self.acceptableLevels = ko.observable('yes');
                self.noAcceptableLevelsDetails = ko.observable('');
                self.otherInformation = ko.observable();
                self.honestDetailRequired = ko.observable(false);
                self.disciplinaryDetailRequired = ko.observable(false);
                self.acceptableDetailRequired = ko.observable(false);
                
                self.groupValid = ko.observable();
                self.userName = ko.observable();
                self.userId = ko.observable()
                self.referenceId = ko.observable()
                self.referenceStatus = ko.observable()

                const params = new URLSearchParams(window.location.search);
                self.userId(params.get('id'))
                self.referenceId(params.get('rId'))

                const getProfile = ()=>{
                    $.ajax({                   
                    //url: "http://169.197.183.168:8050/jpEditStaffDetails",
                    url: "/jpEditStaffDetails",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId : self.userId()
                        }),
                        dataType: 'json',
                        success: function (data) {
                            self.userName(`${data[0][2]} ${data[0][3]}`)
                        }
                    })
                }

                const getReferenceStatus = ()=>{
                    $.ajax({
                        //url:"http://169.197.183.168:8050/getRefererStatus",
                        url:"/getRefererStatus",
                        type: 'POST',
                        data: JSON.stringify({
                            referenceId : self.referenceId()
                        }),
                        dataType: 'json',
                        success: function(data){
                            self.referenceStatus(data[0][0]);
                        }
                    })
                }
                getProfile()
                getReferenceStatus()

                self.honestAreaShow = ()=>{
                    if(self.honest()=="no"){
                        document.getElementById("honest-detail").style.display = "block";
                        self.honestDetailRequired(true);
                    }
                    else{
                        document.getElementById("honest-detail").style.display = "none";
                        self.honestDetailRequired(false);
                    }
                }
                
                self.disciplinaryDetailsShow = ()=>{
                    if(self.disciplinary()=="yes"){
                        document.getElementById("disciplinary-details").style.display = "block";
                        self.disciplinaryDetailRequired(true)
                    }
                    else{
                        document.getElementById("disciplinary-details").style.display = "none";
                        self.disciplinaryDetailRequired(false)
                    }
                }

                self.acceptableDetailsShow = ()=>{
                    if(self.acceptableLevels()=='no'){
                        document.getElementById("acceptable-detail").style.display = "block";
                        self.acceptableDetailRequired(true);
                    }
                    else{
                        document.getElementById("acceptable-detail").style.display = "none";
                        self.acceptableDetailRequired(false);
                    }
                }
                
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

                self.referneceSubmit = (e)=>{
                    var validRefernceDetails = self._checkValidationGroup("staffUpdateSec1");
                    if(validRefernceDetails){
                        let loaderPopup = document.getElementById("loader");
                        loaderPopup.open();
                        $.ajax({
                            //url: "http://169.197.183.168:8050/ReferenceVerification",
                            url: "/ReferenceVerification",
                            type: 'POST',
                            data: JSON.stringify({
                                userId : self.userId(),
                                referenceId : self.referenceId(),
                                relationShip: self.releationship(),
                                capacity : self.capacity(),
                                durationFrom :  self.durationFrom(),
                                durationTo : self.durationTo(),
                                organisationName : self.organisationName(),
                                position : self.position(),
                                honest : self.honest(),
                                noHonestReason : self.noHonestReason(),
                                disciplinary : self.disciplinary(),
                                yesDisciplinaryDetails : self.yesDisciplinaryDetails(),
                                acceptableLevels : self.acceptableLevels(),
                                noAcceptableLevelsDetails : self.noAcceptableLevelsDetails(),
                                otherInformation : self.otherInformation(),
                            }),
                            dataType: 'json',
                            success: function (data) {
                                loaderPopup.close();
                                location.reload()
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                loaderPopup.close();
                                console.log(textStatus, errorThrown);
                            }
                        })
                    }
                }

            }
        }
        return ReferenceVerification;
    }
);
