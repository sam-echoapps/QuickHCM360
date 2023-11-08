define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider", 
    "ojs/ojknockout", "ojs/ojswitch", "ojs/ojdatetimepicker", 'ojs/ojvalidationgroup', 
    "ojs/ojcheckboxset", "ojs/ojselectsingle","ojs/ojprogress-circle"], 
function (oj,ko,$, app, ArrayDataProvider) {

    class Contract {
        constructor(context) {
            var self = this;

            self.staff_name = ko.observable();
            self.commencement_date = ko.observable();

            self.requiredSec1 = ko.observable(true);
            self.requiredSec2 = ko.observable();
            self.weekday_longday_type = ko.observable();
            self.weekday_night_type = ko.observable();
            self.weekend_longday_type = ko.observable();
            self.bank_holiday_type = ko.observable();
            self.weekend_night_type = ko.observable();
            
            self.sub_post = ko.observable();

            self.kitchen_weekday_longday = ko.observable();
            self.kitchen_weekday_night = ko.observable();
            self.kitchen_bank_holiday = ko.observable();
            self.kitchen_weekend_longday = ko.observable();
            self.kitchen_weekend_night = ko.observable();

            self.domestic_weekday_longday = ko.observable();
            self.domestic_weekday_night = ko.observable();
            self.domestic_bank_holiday = ko.observable();
            self.domestic_weekend_longday = ko.observable();
            self.domestic_weekend_night = ko.observable();

            self.care_weekday_longday = ko.observable();
            self.care_weekday_night = ko.observable();
            self.care_bank_holiday = ko.observable();
            self.care_weekend_longday = ko.observable();
            self.care_weekend_night = ko.observable();

            self.living_weekday_longday = ko.observable();
            self.living_weekday_night = ko.observable();
            self.living_bank_holiday = ko.observable();
            self.living_weekend_longday = ko.observable();
            self.living_weekend_night = ko.observable();

            self.name = ko.observable();
            self.esignature = ko.observable();
            self.declaration = ko.observable();
            self.date = ko.observable()
            self.contractValid = ko.observable();

            self.status = ko.observable();
            var BaseURL = sessionStorage.getItem("BaseURL")
            self.contractStatus = ko.observable();
            function getCotractInfo() {
                $.ajax({
                    url: BaseURL + "/jpStaffContractGet",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId : sessionStorage.getItem("userId"),
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                        console.log(errorThrown);
                    },
                    success: function (data) {
                        var result = JSON.parse(data[1]);
                        if(result==null){
                            self.status("Contract not sent")
                        }
                        else{
                            self.status(result[28]);
                            self.contractStatus(result[29]);
                        }
                        self.staff_name(data[0][0] + " " + data[0][1]);
                        if(data[0][2]=="Nurse" || data[0][2]=="Care Assistant" || data[0][2]=="Senior Care Assistant" || data[0][2]=="Domiciliary Care"){
                            self.requiredSec1(true)
                        }
                        if(data[0][2]=="Kitchen Assistant" || data[0][2]=="Chefs" || data[0][2]=="Domestic Care"){
                            self.requiredSec2(true)
                        }
                        if(data[0][3]=="kitchen_assistant"){
                            self.sub_post("Kitchen Assistant");
                            self.kitchenSec(true)
                        }
                        if(data[0][3]=="domestic_care"){
                            self.sub_post("Domestic Care");
                            self.domesticSec(true)
                        }
                        if(data[0][3]=="kitchen_assistant,domestic_care"){
                            self.sub_post("Kitchen Assistant,Domestic Care");
                            self.kitchenSec(true)
                            self.domesticSec(true)
                        }
                        if(data[0][3]=="care_assistant"){
                            self.sub_post("Care Assistant");
                            self.careSec(true)
                        }
                        if(data[0][3]=="living_care"){
                            self.sub_post("Living Care");
                            self.livingSec(true)
                        }
                        if(result){
                            self.commencement_date(result[2])
                            self.weekday_longday_type(Number(result[3]))
                            self.weekday_night_type(Number(result[4]))
                            self.bank_holiday_type(Number(result[5]))
                            self.weekend_longday_type(Number(result[6]))
                            self.weekend_night_type(Number(result[7]))
                            self.kitchen_weekday_longday(Number(result[8]))
                            self.kitchen_weekday_night(Number(result[9]))
                            self.kitchen_bank_holiday(Number(result[10]))
                            self.kitchen_weekend_longday(Number(result[11]))
                            self.kitchen_weekend_night(Number(result[12]))
                            self.domestic_weekday_longday(Number(result[13]))
                            self.domestic_weekday_night(Number(result[14]))
                            self.domestic_bank_holiday(Number(result[15]))
                            self.domestic_weekend_longday(Number(result[16]))
                            self.domestic_weekend_night(Number(result[17]))
                            self.care_weekday_longday(Number(result[18]))
                            self.care_weekday_night(Number(result[19]))
                            self.care_bank_holiday(Number(result[20]))
                            self.care_weekend_longday(Number(result[21]))
                            self.care_weekend_night(Number(result[22]))
                            self.living_weekday_longday(Number(result[23]))
                            self.living_weekday_night(Number(result[24]))
                            self.living_bank_holiday(Number(result[25]))
                            self.living_weekend_longday(Number(result[26]))
                            self.living_weekend_night(Number(result[27]))
                        }
                    }
                })
            }

            getCotractInfo();

            self.createSignature = ()=>{
                self.esignature(self.name());
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

            self.contractSubmit = ()=>{
                var validContract = self._checkValidationGroup("contaratcValidation");
                if(validContract){
                    let popup = document.getElementById("popup1");
                    popup.open();
                    $.ajax({
                        url: BaseURL + "/jpStaffContractSubmit",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("userId"),
                            contract_submitter : self.name(),
                            contract_signature : self.esignature(),
                            contract_submitted_date : self.date()
                        }),
                        dataType: 'json',
                        error: function (xhr, textStatus, errorThrown) {
                            let popup = document.getElementById("popup1");
                            popup.close();
                            console.log(textStatus);
                            console.log(errorThrown);
                        },
                        success: function (data) {
                            let popup = document.getElementById("popup1");
                            popup.close();
                            location.reload()
                        }
                    })
                }
            }
        }
            
    }
    return  Contract;

});
