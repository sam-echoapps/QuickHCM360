define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar",'ojs/ojtable'], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {
 "use strict";
    class DraftViewModel {
        constructor(args) {
            var self = this

            self.record = ko.observable();
            self.router = args.parentRouter;

            self.ClientDet = ko.observableArray([]);   
            self.name = ko.observable();
            self.clientName = ko.observable();
            var BaseURL = sessionStorage.getItem("BaseURL")
            self.selectedShift = ko.observable('');
            self.shiftDet = ko.observableArray([]);  
            self.selectorSelectedItems = new ojknockout_keyset_1.ObservableKeySet();
            self.clientNameCap = ko.observable(); 
            self.currentDate = ko.observable(); 
            self.TimesheetDet = ko.observableArray([]); 
            self.CancelBehaviorOpt = ko.observable('icon'); 
            self.serialNumber = ko.observable('');
            self.jobRole = ko.observable();
            self.shiftName = ko.observable();
            self.shiftDate = ko.observable();
            self.shiftDay = ko.observable();
            self.checkin = ko.observable();
            self.checkout = ko.observable();
            self.breakTime = ko.observable();
            self.workedHours = ko.observable();
            self.paidHours = ko.observable();
            self.authoriser = ko.observable();
            self.position = ko.observable();
            self.signature = ko.observable();
            self.otherExpenses = ko.observable('');
            self.starRate = ko.observable('');
            self.rating_note = ko.observable('');
            self.selectStartDate = ko.observable('');
            self.selectEndDate = ko.observable('');
            self.groupValid = ko.observable();
            self.selected_status = ko.observable(); 
            self.statusList = ko.observableArray([]);
            self.statusList.push({'value' : 'Approved', 'label' : 'Approved'},{'value' : 'Submitted', 'label' : 'Submitted'});
            self.statusListDP = new ArrayDataProvider(self.statusList, {keyAttributes: 'value'});
            self.grandTotal = ko.observable(); 
            self.timesheetIdList = ko.observableArray([]);
            self.amountAdditional = ko.observable();  
            self.additionalNote = ko.observable();  
            var grandTotal = 0;  
            self.invoiceAdditionalAmount = ko.observableArray([]);
            self.comments = ko.observable('');  
            self.address1 = ko.observable();  
            self.address2 = ko.observable();  
            self.city = ko.observable();  
            self.postcode = ko.observable();  
            self.typeError = ko.observable();
            self.uploadError = ko.observable("*");
            self.invoiceDate = ko.observable(); 
            self.dueDate = ko.observable(); 
            self.invoiceId = ko.observable(); 
            self.downloadTitle = ko.observable(); 


            self.connected = function () {
                if (sessionStorage.getItem("userName") == null) {
                    self.router.go({path : 'signin'});
                }
                else {
                    app.onAppSuccess();
                    getApprovedTimesheet()
                }
            }

            function getApprovedTimesheet() {    
                if(sessionStorage.getItem("draft")=="draft"){
                    document.getElementById('successView').style.display='block';
                    document.getElementById('loaderView').style.display='none';
                }else{
                document.getElementById('loaderView').style.display='block';
                self.TimesheetDet([]);
                $.ajax({
                    url: BaseURL  + "/jpGetDraftInvoiceInfo",
                    type: 'POST',
                    data: JSON.stringify({
                        clientId : sessionStorage.getItem("clientId"),
                        startDate : sessionStorage.getItem("startDate"),
                        endDate : sessionStorage.getItem("endDate"),
                        invoiceId : sessionStorage.getItem("invoiceId")
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout' || textStatus == 'error'){
                            document.querySelector('#TimeoutSup').open();
                        }
                    },
                    success: function (result) {
                    document.getElementById('loaderView').style.display='none';
                    document.getElementById('mainView').style.display='block';
                    document.getElementById('contentView').style.display='block';
                    document.getElementById('invoiceDateSec').style.display='block';
                    console.log(result[0])
                    console.log(result[1])
                    console.log(result[3])
                    console.log(result[5])
                    var data = JSON.parse(result[0]);
                    console.log(data)
                    var shiftType;
                    var rate;
                    var timeString,timeParts,hours,minutes,decimalTime;
                    var holidayType;
                    var rateString;
                    console.log(data)
                    console.log(data.length)
                    if(data.length !=0){ 
                        for (var i = 0; i < data.length; i++) {
                            const parts = data[i][23].split(' ');
                            if (parts.length > 0) {
                                shiftType = parts[0];
                                timeString = data[i][19];
                                timeParts = timeString.split(":");
                                hours = parseInt(timeParts[0], 10);
                                minutes = parseInt(timeParts[1], 10);
                                decimalTime = hours + minutes / 60; 
                            }
                            if(data[i][27] != null){
                            const parts2 = data[i][27].split(' ');
                            if (parts2.length > 0) {
                               
                                rateString = parts2[0];
                            }
                        }
                            
                            holidayType=data[i][25]
                            if(holidayType!=null){
                                if(data[i][26] == "Midnight to Midnight"){
                                const shiftDate = data[i][2]; // Date in yyyy-mm-dd format
                                const checkinTimeStr = data[i][15]; // Check-in time in hh:mm:ss format
                                let checkoutTimeStr = data[i][16]; // Checkout time in hh:mm:ss format
                               // let checkoutTimeStr = "8:00:00"; // Example checkoutTimeStr

                                // Split the time string by ':' to separate hours, minutes, and seconds
                                const parts = checkoutTimeStr.split(':');
                                
                                if (parts.length >= 2) {
                                    let hours = parts[0];
                                    const minutes = parts[1];
                                
                                    // Add a leading zero to hours if it's a single digit
                                    if (hours.length === 1) {
                                        hours = `0${hours}`;
                                    }
                                
                                    // Reconstruct the time string
                                    checkoutTimeStr = `${hours}:${minutes}:${parts[2] || '00'}`;
                                }
                                
                                console.log(checkoutTimeStr); // Output: "08:00:00" (if input was "8:00:00")
                                

                                // const shiftDate = "2023-09-04"; // Date in yyyy-mm-dd format
                                // const checkinTimeStr = "16:00:00"; // Check-in time in hh:mm:ss format
                                // const checkoutTimeStr = "04:00:00"; // Checkout time in hh:mm:ss format

                                // Combine shift_date and checkin/checkout times to create Date objects
                                const checkinDateTime = new Date(`${shiftDate}T${checkinTimeStr}`);
                                const checkoutDateTime = new Date(`${shiftDate}T${checkoutTimeStr}`);

                                // Create a Date object for midnight (00:00:00) on the next day
                                const midnightNextDay = new Date(`${shiftDate}T00:00:00`);
                                midnightNextDay.setDate(midnightNextDay.getDate() + 1); // Increment the date by one day

                                // Check if checkout time is before check-in time (indicating next day)
                                if (checkoutDateTime < checkinDateTime) {

                                    console.log('Diffrentday')
                                    // Set checkoutDateTime to the next day with the same time
                                    checkoutDateTime.setDate(checkoutDateTime.getDate() + 1);

                                     // Calculate the hours from check-in time to midnight on the next day
                                    let hoursFromCheckinToMidnight = (midnightNextDay - checkinDateTime) / (1000 * 60 * 60); // Convert milliseconds to hours

                                    // Calculate the hours from midnight on the next day to checkoutTimeStr
                                    let hoursFromMidnightToCheckout = (checkoutDateTime - midnightNextDay) / (1000 * 60 * 60); // Convert milliseconds to hours
                                    
                                    const date = midnightNextDay;

                                    const year = date.getFullYear(); 
                                    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
                                    const day = date.getDate().toString().padStart(2, '0'); 

                                    const formattedDate = `${year}-${month}-${day}`;
                                    console.log(formattedDate); 
                                    
                     /*                var resultArray = [];

                                    $.ajax({
                                        url: BaseURL  + "/jpCheckHoliday",
                                        type: 'POST',
                                        data: JSON.stringify({
                                            checkDate : formattedDate
                                        }),
                                        dataType: 'json',
                                        timeout: sessionStorage.getItem("timeInetrval"),
                                        context: self,
                                        error: function (xhr, textStatus, errorThrown) {
                                            if(textStatus == 'timeout' || textStatus == 'error'){
                                                document.querySelector('#TimeoutSup').open();
                                            }
                                        },
                                        success: function (result) {
                                            console.log(result)
                                            console.log(result[0]); // Check the value of result[0]

                                            resultArray.push(result[0]);
                                                                                
                                        }
                                    }); */
                                    console.log(`Hours from check-in time to midnight on the next day: ${hoursFromCheckinToMidnight}`);
                                    console.log(`Hours from midnight on the next day to checkout time: ${hoursFromMidnightToCheckout}`);

                                    // Input number
                                    const inputNumber = hoursFromCheckinToMidnight+hoursFromMidnightToCheckout; // Change this to any number you want to format
                                    var formattedTime;
                                    // Check if the number is a whole number (integer) or a floating-point number
                                    if (Number.isInteger(inputNumber)) {
                                    // If it's a whole number, format as "00:00:00"
                                    formattedTime = inputNumber.toString().padStart(2, '0') + ':00:00';
                                    console.log(formattedTime);
                                    } else {
                                    // If it's a floating-point number, split it into integer and fractional parts
                                    const integerPart = Math.floor(inputNumber);
                                    const fractionalPart = (inputNumber - integerPart) * 60; // Convert fractional part to minutes
                                    
                                    // Format as "00:00:00" with fractional minutes
                                    formattedTime = integerPart.toString().padStart(2, '0') + ':' +
                                                        Math.floor(fractionalPart).toString().padStart(2, '0') + ':00';
                                    console.log(formattedTime);
                                    }

                    
                                    // Define the two time strings
                                    const timeString1 = formattedTime;
                                    const timeString2 = data[i][19]

                                    // Split the time strings into hours, minutes, and seconds
                                    const [hours1, minutes1, seconds1] = timeString1.split(':').map(Number);
                                    const [hours2, minutes2] = timeString2.split(':').map(Number);

                                    // Calculate the time difference
                                    let hoursDiff = hours1 - hours2;
                                    let minutesDiff = minutes1 - minutes2;

                                    // Adjust for negative differences
                                    if (minutesDiff < 0) {
                                    hoursDiff -= 1;
                                    minutesDiff += 60;
                                    }

                                    // Format the result as "00:00:00"
                                    const formattedHours = String(hoursDiff).padStart(2, '0');
                                    const formattedMinutes = String(minutesDiff).padStart(2, '0');
                                    const formattedResult = `${formattedHours}:${formattedMinutes}:00`;

                                    // Input number
                                    const inputDecimal = hoursFromCheckinToMidnight; // Change this to any number you want to format
                                    let formattedTime1;

                                    // Check if the number is a whole number (integer) or a floating-point number
                                    if (Number.isInteger(inputDecimal)) {
                                    // If it's a whole number, format as "00:00:00"
                                    formattedTime1 = inputDecimal.toString().padStart(2, '0') + ':00:00';
                                    console.log(formattedTime1);
                                    } else {
                                    // If it's a floating-point number, split it into integer and fractional parts
                                    const integerHours = Math.floor(inputDecimal);
                                    const fractionalHours = (inputDecimal - integerHours) * 60; // Convert fractional part to minutes

                                    // Format as "00:00:00" with fractional minutes
                                    formattedTime1 = integerHours.toString().padStart(2, '0') + ':' +
                                                    Math.floor(fractionalHours).toString().padStart(2, '0') + ':00';
                                    console.log(formattedTime1);
                                    }

                                    console.log(`Time difference: ${formattedResult}`);
                                    const [h1, m1, s1] = formattedTime1.split(':').map(Number);
                                    const [h2, m2, s2] = formattedResult.split(':').map(Number);

                                    const totalSeconds1 = h1 * 3600 + m1 * 60 + s1;
                                    const totalSeconds2 = h2 * 3600 + m2 * 60 + s2;

                                    const differenceInSeconds = totalSeconds1 - totalSeconds2;

                                    const hours = Math.floor(differenceInSeconds / 3600);
                                    const minutes = Math.floor((differenceInSeconds % 3600) / 60);
                                    const seconds = differenceInSeconds % 60;

                                    var resultTotalPaid =`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                                    const [hours3, minutes3, seconds3] = resultTotalPaid.split(':').map(Number);
                                    const totalMinutes3 = hours3 * 60 + minutes3 + seconds3 / 60;
                                    const formattedResultTotalPaid = totalMinutes3 / 60; // Convert total minutes to hours
                                    if(formattedResult!=0){
                                        //console.log(resultArray);
                                        if(result[3][i] == "Yes"){
                                            rate = (formattedResultTotalPaid * parseInt(data[i][24]) * parseFloat(rateString)) + (hoursFromMidnightToCheckout * parseInt(data[i][24])* parseFloat(rateString));
                                        }else{
                                            rate = (formattedResultTotalPaid * parseInt(data[i][24]) * parseFloat(rateString)) + (hoursFromMidnightToCheckout * parseInt(data[i][24]));
                                        }
                                    }else{
                                        if(result[3][i] == "Yes"){
                                            rate = (hoursFromCheckinToMidnight * parseInt(data[i][24]) * parseFloat(rateString)) + (hoursFromMidnightToCheckout * parseInt(data[i][24])* parseFloat(rateString));
                                        }else{
                                            rate = (hoursFromCheckinToMidnight * parseInt(data[i][24]) * parseFloat(rateString)) + (hoursFromMidnightToCheckout * parseInt(data[i][24]));
                                        }
                                    }

                                    /* if(sessionStorage.getItem("checkoutHoliday") == "Yes"){
                                        rate = (hoursFromCheckinToMidnight * parseInt(data[i][24]) * parseFloat(rateString)) + (hoursFromMidnightToCheckout * parseInt(data[i][24])* parseFloat(rateString));
                                    }else{
                                        rate = (hoursFromCheckinToMidnight * parseInt(data[i][24]) * parseFloat(rateString)) + (hoursFromMidnightToCheckout * parseInt(data[i][24]));
                                    } */
                                }else{
                                    console.log('Sameday')
                                    rate = decimalTime * parseInt(data[i][24]) * parseFloat(rateString);
                                }
                            
                            }else{
                                rate = decimalTime * parseInt(data[i][24]) * parseFloat(rateString);
                            }
                        }else{
                                if (shiftType == "Weekday") {
                                    rate = decimalTime * parseInt(data[i][24]);
                                }else if (shiftType == "Weekend") {
                                    //rate = decimalTime * parseInt(data[i][24]) * 1.5;
                                    rate = decimalTime * parseInt(data[i][24]);
                                }
                            }
                            if(data.length !=0){ 
                                grandTotal = grandTotal+rate;
                                document.getElementById('invoiceGenerate').style.display="block"
                                self.TimesheetDet.push({'id': data[i][0],'shift_name': data[i][1], 'shift_date' : data[i][2] + "-" + data[i][14], 'shift_time': data[i][3]+"-"+data[i][4], 'staff_name': data[i][5], 'contactEmail': data[i][6], 'contactNumber' : data[i][7]+" "+data[i][8], 'staff_id': data[i][9], 'serial_no': 7000 + data[i][10], 'document': result[2][i],  'timesheetId': data[i][10], 'timesheet_status': data[i][12], 'approved_by': 'Approved by : '+data[i][13], 'worked_time': data[i][15]+"-"+data[i][16], 'break_time': data[i][17], 'worked_hours': data[i][18], 'total_hours': data[i][19], 'expenses': data[i][20], 'job_role': data[i][21], 'shift_type': shiftType,  'rate': data[i][24], 'amount': rate.toFixed(2), 'holidayType': data[i][25]  });
                                self.timesheetIdList.push(data[i][10]);

                                var table = document.getElementById("myTable").getElementsByTagName('tbody')[0];
                                var invoiceList = [
                                    { shiftName: data[i][1], shiftDate:  data[i][2], workedHours: data[i][18], hourlyRate: data[i][24], amount : rate.toFixed(2) },
                                  ];
                                
                                  invoiceList.forEach(function (item) {
                                    var newRow = table.insertRow(table.rows.length);
                                    var cell1 = newRow.insertCell(0);
                                    var cell2 = newRow.insertCell(1);
                                    var cell3 = newRow.insertCell(2);
                                    var cell4 = newRow.insertCell(3);
                                    var cell5 = newRow.insertCell(4);
                                
                                    cell1.innerHTML = item.shiftName;
                                    cell2.innerHTML = item.shiftDate;
                                    cell3.innerHTML = item.workedHours;
                                    cell4.innerHTML = item.hourlyRate;
                                    cell5.innerHTML = item.amount;

                                    cell1.innerHTML = item.shiftName;
                                    cell1.style.border = "1px solid #000";
                                    cell1.style.padding = "8px";

                                    cell2.innerHTML = item.shiftDate;
                                    cell2.style.border = "1px solid #000";
                                    cell2.style.padding = "8px";

                                    cell3.innerHTML = item.workedHours;
                                    cell3.style.border = "1px solid #000";
                                    cell3.style.padding = "8px";

                                    cell4.innerHTML = item.hourlyRate;
                                    cell4.style.border = "1px solid #000";
                                    cell4.style.padding = "8px";

                                    cell5.innerHTML = item.amount;
                                    cell5.style.border = "1px solid #000";
                                    cell5.style.padding = "8px";
                                  });
                              

                        }
                    }
                }
                 self.clientNameCap(result[1][0][0].toUpperCase())
                 self.address1(result[1][0][1])
                 self.address2(result[1][0][2])
                 self.city(result[1][0][3])
                 self.postcode(result[1][0][4])
                 self.clientName(result[1][0][0])
                 self.invoiceAdditionalAmount([]);
                 if (result[4] !== 'null') {
                    var dataInvoice = JSON.parse(result[4]);
                    console.log(dataInvoice)
                    // if (dataInvoice[5] !== '') {
                    //     var types = dataInvoice[5].split(',');
                    //     var rates = dataInvoice[6].split(',');
                    //     for (var i = 0; i < types.length; i++) {
                    //         if (types[i] !== 'null' && types[i] !== '' && types[i] !== 'Nil' && rates[i] !== 'null' && rates[i] !== 0) {
                    //             self.invoiceAdditionalAmount.push({'id': i,'type': types[i], 'additionalRate': rates[i]});
                    //         }
                    //     }
                    // }
                    const formattedID = dataInvoice[14].replace(/-/g, ''); 
                    console.log(formattedID); 
                    self.invoiceId("INV #INV"+formattedID+sessionStorage.getItem("invoiceId"))
                    self.downloadTitle("Invoice-"+formattedID+sessionStorage.getItem("invoiceId"))
                    self.invoiceDate(dataInvoice[14])
                    self.dueDate(dataInvoice[15])
                    self.comments(dataInvoice[12])
                    self.grandTotal(dataInvoice[7])
                }else{
                    self.grandTotal(grandTotal.toFixed(2))
                }
                if (result[5] !== 'null') {
                    for (var i = 0; i < result[5].length; i++) {
                        self.invoiceAdditionalAmount.push({'id': result[5][i][0],'type': result[5][i][2], 'additionalRate': result[5][i][3]});
                        var table = document.getElementById("extraTable").getElementsByTagName('tbody')[0];
                        var extraList = [
                            { extraType: result[5][i][2], extraRate:  result[5][i][3] },
                          ];
                        
                          extraList.forEach(function (item) {
                            var newRow = table.insertRow(table.rows.length);
                            var cell1 = newRow.insertCell(0);
                            var cell2 = newRow.insertCell(1);
                        
                            cell1.innerHTML = item.extraType;
                            cell2.innerHTML = item.extraRate;
                    
                            cell1.innerHTML = item.extraType;
                            cell1.style.border = "1px solid #000";
                            cell1.style.padding = "8px";

                            cell2.innerHTML = item.extraRate;
                            cell2.style.border = "1px solid #000";
                            cell2.style.padding = "8px";

                          });
                    }
                
                }else{
                    self.grandTotal(grandTotal.toFixed(2))
                }

                 self.TimesheetDet.valueHasMutated();
                 return self; 
                }
                })
            }
            }
            self.ClientDetDP = new ArrayDataProvider(self.ClientDet, {keyAttributes: 'value'});
            self.dataProvider = new ArrayDataProvider(this.TimesheetDet, { keyAttributes: "id"});

            

            this.getBadgeClass = (status) => {
                switch (status) {
                    case "Submitted":
                        return "oj-badge oj-badge-info";
                    case "Approved":
                        return "oj-badge oj-badge-success";
                    default:
                        return "oj-badge";
                }
            };

            self.goToProfile = function (event,data) {
                var clickedStaffId = data.data.staff_id
                console.log(clickedStaffId)
                sessionStorage.setItem("staffId", clickedStaffId);
                self.router.go({path:'staffManagerView'})  
                //self.router.go({path:'staffCalenderView'})
            }; 


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

            self.confirmSaveDraft = function (event,data) {
                    document.querySelector('#openConfirmSaveDraft').open();                
            }

            self.invoiceSave = function (event,data) {
                if(self.additionalNote() == undefined || self.additionalNote() == ''){
                    self.additionalNote('Nil')
                }
                if(self.amountAdditional() == undefined){
                    self.amountAdditional(0)
                }
                self.grandTotal((Number(self.grandTotal())+Number(self.amountAdditional())).toFixed(2))
                document.querySelector('#openConfirmSaveDraft').close();  
                document.querySelector('#openInvoiceSaveProgress').close();              
                console.log(self.timesheetIdList())
                var resultString = self.timesheetIdList().join(',');
                $.ajax({
                    url: BaseURL + "/jpClientInvoiceSave",
                    type: 'POST',
                    data: JSON.stringify({
                        clientId : sessionStorage.getItem("clientId"),
                        timesheet_id : resultString,
                        invoice_start_date : sessionStorage.getItem("startDate"),
                        invoice_end_date : sessionStorage.getItem("endDate"),
                        additional_type : self.additionalNote(),
                        additional_rate : self.amountAdditional(),
                        created_by : sessionStorage.getItem("userName"),
                        grand_total : self.grandTotal(),
                        invoiceId : sessionStorage.getItem("invoiceId"),
                        invoice_date : self.invoiceDate(),
                        payment_due_date : self.dueDate(),
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openInvoiceSaveProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                        console.log(data)
                        document.querySelector('#openInvoiceSaveProgress').close();
                        var lastUpdatedId = data[0][0]
                        sessionStorage.setItem("invoiceId",data[0][0])
                        //getInvoiceDetails(lastUpdatedId)
                        location.reload();
                    }
                })
                
               
            }

            self.invoiceSaveAsDraft = function (event,data) {
        //         var disp_setting="toolbar=yes,location=no,";
        // disp_setting+="directories=yes,menubar=yes,";
        // disp_setting+="scrollbars=yes,width=650, height=600, left=100, top=25";
        //    var content_vlue = document.getElementById('invoice').innerHTML;
        //    var docprint=window.open("","",disp_setting);
        //    docprint.document.open();
        //    docprint.document.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"');
        //    docprint.document.write('"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">');
        //    docprint.document.write('<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">');
        //    docprint.document.write('<head><title>QuickHCM360</title>');
        //    docprint.document.write('<style type="text/css">body{ margin:50px;');
        //    docprint.document.write('font-family:verdana,Arial;color:#000;');
        //    docprint.document.write('font-family:Verdana, Geneva, sans-serif; font-size:12px;}');
        //    docprint.document.write('a{color:#000;text-decoration:none;} </style>');
        //    docprint.document.write('</head><body onLoad="self.print()">');
        //    docprint.document.write(content_vlue);
        //    docprint.document.write('</body></html>');
        //    docprint.document.close();
        //    docprint.focus(); 

                document.querySelector('#openConfirmSaveDraft').close();  
                document.querySelector('#openInvoiceSaveProgress').close();  
                console.log(self.timesheetIdList())
                var resultString = self.timesheetIdList().join(',');
                $.ajax({
                    url: BaseURL + "/jpClientInvoiceSaveAsDraft",
                    type: 'POST',
                    data: JSON.stringify({
                        invoiceId : sessionStorage.getItem("invoiceId"),
                        comments : self.comments()
                        // clientId : sessionStorage.getItem("clientId"),
                        // timesheet_id : resultString,
                        // invoice_start_date : sessionStorage.getItem("startDate"),
                        // invoice_end_date : sessionStorage.getItem("endDate"),
                        // grand_total : self.grandTotal()
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openInvoiceSaveProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                        sessionStorage.setItem("draft","draft")      
                        console.log(data)
                        document.querySelector('#openInvoiceSaveProgress').close();
                        sessionStorage.removeItem("invoiceId")   
                        document.title = self.downloadTitle()   
                        var printContents = document.getElementById('invoice').innerHTML;
                        document.body.innerHTML = "<html><head><title></title></head><body>" + printContents + "</body>";
                        window.print(); 
                        location.reload()
                        //self.router.go({path:'staffInvoiceClientList'})
                    }
                })
                
               
            }

            function getInvoiceDetails(lastUpdatedId){
            $.ajax({
                    url: BaseURL + "/jpGetInvoiceDetails",
                    type: 'POST',
                    data: JSON.stringify({
                        invoiceId : lastUpdatedId
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openInvoiceSaveProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (result) {
                        var data = JSON.parse(result[0]);
                        console.log(result)
                        console.log(data)
                        self.invoiceAdditionalAmount([]);
                       /*  var types = data[5].split(',');
                        var rates = data[6].split(',');
                        for (var i = 0; i < types.length; i++) {
                            if (types[i] !== 'null' && types[i] !== '' && types[i] !== 'Nil' && rates[i] !== 'null' && rates[i] !== 0) {
                                self.invoiceAdditionalAmount.push({'id': i,'type': types[i], 'additionalRate': rates[i]});
                            }
                        } */
                        console.log(result[1].length)
                        for (var i = 0; i < result[1].length; i++) {
                                self.invoiceAdditionalAmount.push({'id': result[1][i][0],'type': result[1][i][2], 'additionalRate': result[1][i][3]});
                        }
                        self.additionalNote('')
                        self.amountAdditional(Number(''))
                        // self.grandTotal(data[0][0])
                        // document.querySelector('#openInvoiceSaveProgress').close();
                    }
                })
            }

            self.dataProvider1 = new ArrayDataProvider(this.invoiceAdditionalAmount, { keyAttributes: "id"});

            self.deleteAdditionalAmount = function (event,data) {
                var typeVal;
                var rateVal;
                if (self.invoiceAdditionalAmount().length == 1) {
                    typeVal = data.data.type;
                    rateVal = data.data.additionalRate;
                } else if (self.invoiceAdditionalAmount().length > 1) {
                    typeVal = data.data.type + ',';
                    rateVal = data.data.additionalRate +',';
                    
                    // Check if the current element is not the last one
                    if (self.invoiceAdditionalAmount().length - 1) {
                        typeVal = data.data.type;
                        rateVal = data.data.additionalRate;
                    }
                }
                document.querySelector('#openDeleteProgress').close();
                     $.ajax({
                        url: BaseURL + "/jpDeleteAdditionalAmount",
                        type: 'POST',
                        data: JSON.stringify({
                           rowId : data.data.id,
                           invoiceId : sessionStorage.getItem("invoiceId"),
                           rate : data.data.additionalRate,
                           type : typeVal,
                        //    rate : rateVal
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
                            document.querySelector('#openDeleteProgress').close();
                            console.log(data)
                            location.reload();
                    }
                    })          
               
            }

            self.timesheetPDFGenerate = function (event,data) {
                //document.title = "Print page title";
                var printContents = document.getElementById('invoice').innerHTML;
                document.body.innerHTML = "<html><head><title></title></head><body>" + printContents + "</body>";
                window.print();    
                
        //         var disp_setting="toolbar=yes,location=no,";
        // disp_setting+="directories=yes,menubar=yes,";
        // disp_setting+="scrollbars=yes,width=650, height=600, left=100, top=25";
        //    var content_vlue = document.getElementById('invoice').innerHTML;
        //    var docprint=window.open("","",disp_setting);
        //    docprint.document.open();
        //    docprint.document.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"');
        //    docprint.document.write('"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">');
        //    docprint.document.write('<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">');
        //    docprint.document.write('<head><title>QuickHCM360</title>');
        //    docprint.document.write('<style type="text/css">body{ margin:50px;');
        //    docprint.document.write('font-family:verdana,Arial;color:#000;');
        //    docprint.document.write('font-family:Verdana, Geneva, sans-serif; font-size:12px;}');
        //    docprint.document.write('a{color:#000;text-decoration:none;} </style>');
        //    docprint.document.write('</head><body onLoad="self.print()">');
        //    docprint.document.write(content_vlue);
        //    docprint.document.write('</body></html>');
        //    docprint.document.close();
        //    docprint.focus(); 

            }

            self.confirmPublish = function (event,data) {
                self.typeError('')
                self.uploadError('*')
                document.querySelector('#openConfirmPublish').open();                
        }


            self.invoicePublish = function (event,data) {
                if (self.uploadError() == '' && self.typeError() == '') {
                    document.querySelector('#openConfirmPublish').close();  
                document.querySelector('#openInvoicePublishProgress').open();  
                console.log(self.timesheetIdList())
                $.ajax({
                    url: BaseURL + "/jpClientInvoicePublish",
                    type: 'POST',
                    data: JSON.stringify({
                        invoiceId : sessionStorage.getItem("invoiceId"),
                        comments : self.comments(),
                        clientId : sessionStorage.getItem("clientId"),
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        if(textStatus == 'timeout'){
                            document.querySelector('#openInvoicePublishProgress').close();
                            document.querySelector('#Timeout').open();
                        }
                    },
                    success: function (data) {
                        console.log(data)
                        document.querySelector('#openInvoicePublishProgress').close();
                        sessionStorage.removeItem("invoiceId")      
                        self.router.go({path:'staffInvoiceClientList'})
                    }
                })
                }
                
                
            }

            self.downloadInvoice = function (event,data) {
                document.title = self.downloadTitle()
                var printContents = document.getElementById('invoice').innerHTML;
                document.body.innerHTML = "<html><head><title></title></head><body>" + printContents + "</body>";
                window.print(); 
                location.reload()
            }

            self.invoiceUplaod = function (event,data) {
                self.uploadError('')        
                var file = event.detail.files[0];
                const result = event.detail.files;
                const files = result[0];
                var InvoiceFileName= files.name;
                var fileFormat =files.name.split(".");
                var checkFormat =fileFormat[1];
            
                if(checkFormat == 'pdf'){
                self.typeError('')
                const reader = new FileReader();
                reader.readAsDataURL(files);
                
                reader.onload = ()=>{
                    document.querySelector('#openAddUploadingProgress').open();
                    const fileContent = reader.result;
                    $.ajax({
                        url: BaseURL + "/jpInvoiceFileUplaod",
                        type: 'POST',
                        data: JSON.stringify({
                            invoiceId : sessionStorage.getItem("invoiceId"),
                            file_name : InvoiceFileName,
                            file : fileContent,
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            if(textStatus == 'timeout'){
                                document.querySelector('#openAddUploadingProgress').close();
                                document.querySelector('#Timeout').open();
                            }
                        },
                        success: function (data) {
                            console.log(data)
                            document.querySelector('#openAddUploadingProgress').close();
                        }
                    })      
                }      
            } else{
                self.typeError('The certificate must be a file of type: pdf')
            }
            }
        }
        
    }
    return DraftViewModel;
});