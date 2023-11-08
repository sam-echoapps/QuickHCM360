define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojconverterutils-i18n","ojs/ojarraydataprovider", 
    "ojs/ojknockout", "ojs/ojswitch", "ojs/ojdatetimepicker", 'ojs/ojvalidationgroup', "ojs/ojselectsingle"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider) {

    class Induction {
        constructor(context) {
            var self = this;
            
            self.day = ko.observable(ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(new Date()));
            self.inductionId = ko.observable();
            self.dates = ko.observable();
            self.time = ko.observable();
            self.timeSlots = ko.observable();
            self.inductionValid = ko.observable();
            self.userCheck = ko.observable('Not available');
            self.bookedDate = ko.observable();
            self.bookedTime = ko.observable();
 
            var BaseURL = sessionStorage.getItem("BaseURL")

            self.checkUserInductionBooked = ()=>{
                $.ajax({
                    url: BaseURL + "/checkUserExistInduction",
                    method: "POST",
                    data: JSON.stringify({
                        userId: sessionStorage.getItem("userId"),
                    }),
                    success: function(data){
                        data = JSON.parse(data)
                        if(data[0]==null){
                            self.userCheck("Not available");    
                        }
                        else{
                            self.userCheck(data[0][0]);

                            const date = new Date(data[0][2]);
                            const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                            const formattedDate = formatter.format(date);
                            self.bookedDate(formattedDate)
                            
                            const timeArr = data[0][3].split(':')
                            let time = new Date('2013','04','18',timeArr[0],timeArr[1]);
                            let hours = time.getHours();
                            const minutes = time.getMinutes().toString().padStart(2, '0');
                            const seconds = time.getSeconds();
                            let suffix = "AM";
                            if (hours >= 12) {
                                suffix = 'PM';
                                hours -= 12;
                            }
                            if (hours === 0) {
                                hours = 12;
                            }
                            self.bookedTime(`${hours}:${minutes} ${suffix}`)
                        }
                        // self.userCheck("Rejected")
                    },
                    error: function(xhr, status, error) {
                        console.log(xhr.statusText);
                        console.log(status);
                        console.log(error);
                    }
                })
            }
            self.checkUserInductionBooked()

            self.getInductionDates = ()=>{
                $.ajax({
                    url: BaseURL + "/getInductionDates",
                    method: 'GET',
                    success: function(data) {
                        data = JSON.parse(data)
                        self.dates(data)
                    },
                    error: function(xhr, status, error) {
                        console.log(xhr.responseText);
                        console.log(status);
                        console.log(error);
                    }
                }) 
            }

            self.getInductionDates()
            
            self.dayFormatter = ko.observable((dateInfo) => {
                let month = dateInfo.month;
                let date = dateInfo.date;
                let fullYear = dateInfo.fullYear;
                let len = self.dates().length;
                for(var i=0;i<len;i++){
                    let da = self.dates()[i][0];
                    let d = new Date(Date.parse(da));
                    var mont = d.getMonth()+1;
                    var year = d.getFullYear();
                    var day = d.getDate();
                    
                    if (month == mont && date == day) {
                        return {
                            className: 'induction-day',
                            tooltip: 'Induction seats available'
                        };
                    } 
                }          
                return null;
            });
            
            self.showTime = ()=>{
                $.ajax({
                    url: BaseURL + "/getInductionTimes",
                    method: 'POST',
                    data: JSON.stringify({
                        inductionDate : self.day(),
                    }),
                    success: function(data) {
                        data = JSON.parse(data);
                        console.log(data);
                        let len = data.length;
                        if(len != 0){
                            document.getElementById("timeSlots").style.display = "block";
                            document.getElementById("submitBtn").style.display = "block"
                        }
                        else{
                            document.getElementById("timeSlots").style.display = "none";
                            document.getElementById("submitBtn").style.display = "none"
                        }
                        let times = []
                        for(var i=0;i<len;i++){
                            const timeArr = data[i][0].split(':')
                            let time = new Date('2013','04','18',timeArr[0],timeArr[1]);
                            let hours = time.getHours();
                            const minutes = time.getMinutes().toString().padStart(2, '0');
                            const seconds = time.getSeconds();
                            let suffix = "AM";
                            if (hours >= 12) {
                                suffix = 'PM';
                                hours -= 12;
                            }
                            if (hours === 0) {
                                hours = 12;
                            }
                            times.push({ value: `${data[i][1]}`, label: `${hours}:${minutes} ${suffix}`})
                        }
                        self.time(times)
                        self.timeSlots(new ArrayDataProvider(self.time(), {
                            keyAttributes: "value",
                        }));
                    },
                    error: function(xhr, status, error) {
                        console.log(xhr.responseText);
                        console.log(status);
                        console.log(error);
                    }
                })
            }
            
            self.showTime()
            
            self.inductionSubmit = ()=>{
                var validInductionDet = self._checkValidationGroup("inductionUpdate");
                if(validInductionDet){
                    $.ajax({
                        url: BaseURL + "/saveInduction",
                        method: 'POST',
                        data: JSON.stringify({
                            userId : sessionStorage.getItem("userId"),
                            inductionId : self.inductionId(),
                            status : "Requested",
                        }),
                        success: function(data) {
                            location.reload()
                        },
                        error: function(xhr, status, error) {
                            console.log(status);
                            console.log(error);
                        }
                    }) 
                }
            }

            self.inductionUpdate = ()=>{
                var validInductionDet = self._checkValidationGroup("inductionUpdate1");
                if(validInductionDet){
                    $.ajax({
                        url: BaseURL + "/updateInduction",
                        method: 'POST',
                        data: JSON.stringify({
                            userId : sessionStorage.getItem("userId"),
                            inductionId : self.inductionId(),
                            status : "Requested",
                        }),
                        success: function(data) {
                            location.reload()
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
