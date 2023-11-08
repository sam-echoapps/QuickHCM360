define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider", 
    "ojs/ojknockout", "ojs/ojswitch", "ojs/ojdatetimepicker", 'ojs/ojvalidationgroup', "ojs/ojcheckboxset", "ojs/ojselectsingle"], 
function (oj,ko,$, app, ArrayDataProvider) {

    class Induction {
        constructor(context) {
            var self = this;
            
            
            self.inductionCheckValid = ko.observable();
            
            self.cultureOrganisationVal = ko.observable();
            self.principlesCareVal = ko.observable()
            self.personalitiesVal = ko.observable()
            self.organisationStructureVal = ko.observable()
            self.employeeAgreementVal = ko.observable()
            self.emergencyVal = ko.observable()
            self.policyOnGiftsVal = ko.observable()
            self.equalOpprtVal = ko.observable()
            self.workPlaceVal = ko.observable()
            self.statementTermsVal = ko.observable()
            self.salaryAndPaymentVal = ko.observable()
            self.sicknessVal = ko.observable()
            self.dutyRotasVal = ko.observable()
            self.uniformPolicyVal = ko.observable()
            self.staffAvailabilityVal = ko.observable()
            self.timeSheetVal = ko.observable()
            self.transportationVal = ko.observable()
            self.mobilePhoneVal = ko.observable()
            self.generalDataVal = ko.observable()
            self.disciplinaryVal = ko.observable()
            self.mandatoryTrainingsVal = ko.observable()
            self.personalHygieneVal = ko.observable()
            self.comment = ko.observable()
            self.declarationChecked = ko.observable();
            self.name = ko.observable();
            self.esignature = ko.observable()
            self.date = ko.observable()

            self.valueChangedEventData = ko.observable();
            self.valueActionEventData = ko.observable();

            let BaseURL = sessionStorage.getItem("BaseURL")

            self.options = [
                { value: 'Yes', label: 'Yes' },
                { value: 'No', label: 'No' }
                /* { value: 'N/A', label: 'N/A' } */
            ];
            self.selectOptions = new ArrayDataProvider(self.options, {
                keyAttributes: 'value'
            });

            self.createSignature = ()=>{
                self.esignature(self.name())
            }

            self.checkSubmit = ()=>{
                var validInductionCheck = self._checkValidationGroup("inductionCheck");
                
                if(validInductionCheck){
                    $.ajax({
                        url: BaseURL + "/saveInductionCheck",
                        method: 'POST',
                        data: JSON.stringify({
                            cultureOrganisationVal: self.cultureOrganisationVal(),
                            principlesCareVal: self.principlesCareVal(),
                            personalitiesVal: self.personalitiesVal(),
                            organisationStructureVal: self.organisationStructureVal(),
                            employeeAgreementVal: self.employeeAgreementVal(),
                            emergencyVal: self.emergencyVal(),
                            policyOnGiftsVal: self.policyOnGiftsVal(),
                            equalOpprtVal: self.equalOpprtVal(),
                            workPlaceVal: self.workPlaceVal(),
                            statementTermsVal: self.statementTermsVal(),
                            salaryAndPaymentVal: self.salaryAndPaymentVal(),
                            sicknessVal: self.sicknessVal(),
                            dutyRotasVal: self.dutyRotasVal(),
                            uniformPolicyVal: self.uniformPolicyVal(),
                            staffAvailabilityVal: self.staffAvailabilityVal(),
                            timeSheetVal: self.timeSheetVal(),
                            transportationVal: self.transportationVal(),
                            mobilePhoneVal: self.mobilePhoneVal(),
                            generalDataVal: self.generalDataVal(),
                            disciplinaryVal: self.disciplinaryVal(),
                            mandatoryTrainingsVal: self.mandatoryTrainingsVal(),
                            personalHygieneVal: self.personalHygieneVal(),
                            comment: self.comment(),
                            declarationChecked: self.declarationChecked(),
                            name: self.name(),
                            esignature: self.esignature(),
                            date: self.date(),
                            userId : sessionStorage.getItem("staffId"),
                            status : "Checklist Submitted",
                        }),
                        success: function(data) {
                            window.location.href = "?ojr=staffView%2FbookInduction%3Bindex%3D10"
                        },
                        error: function(xhr, status, error) {
                            console.log(status);
                            console.log(error);
                        }
                    }) 
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
        }
            
    }
    return  Induction;

});
