define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojarraydataprovider", 
    "ojs/ojknockout", "ojs/ojcheckboxset", "ojs/ojpopup","ojs/ojprogress-circle", "ojs/ojdatetimepicker", 
    'ojs/ojvalidationgroup', "ojs/ojselectsingle", "ojs/ojfilepicker"], 
function (oj,ko,$, app, ArrayDataProvider) {

    class Induction {
        constructor(context) {
            var self = this;

            self.title = ko.observable();
            self.firstname = ko.observable();
            self.lastname = ko.observable();
            self.address1 = ko.observable();
            self.address2 = ko.observable();
            self.posttown = ko.observable();
            self.postcode = ko.observable();
            self.nationalInsuranceNo = ko.observable();
            self.employementStartDate = ko.observable();

            self.statement = ko.observable(new Set());
            self.statement1 = ko.observable([]);
            self.statement2 = ko.observable([]);
            self.statement3 = ko.observable([]);

            self.insLength = ko.observable();

            self.selectPs4Val = ko.observable();
            self.selectStudLoanVal = ko.observable();

            var BaseURL = sessionStorage.getItem("BaseURL")

            self.options = [
                { value: 'Yes', label: 'Yes' },
                { value: 'No', label: 'No' }
            ];
            
            self.selectOptions = new ArrayDataProvider(self.options, {
                keyAttributes: 'value'
            });

            self.invalidMessage = ko.observable("");
            
            self.acceptStr = ko.observable("image/*");
            
            self.fileNames = ko.observable([]);
            
            self.ps45FileText = ko.observable('P45 File');
            self.ps45CustomText = ko.observable('Please upload P45 document');
            self.typeError = ko.observable();
            self.typeError1 = ko.observable();


            self.ps45ValueChange = (event) => {
                let ps45Val = event.detail.value;
                if(ps45Val=="Yes"){
                    document.getElementById("file-picker").style.display = "block"
                    document.getElementById("inst").style.display = "none"
                }
                else{
                    document.getElementById("file-picker").style.display = "none"
                    document.getElementById("inst").style.display = "block"
                }
            };

            self.nextPage = (e)=>{
                let childElement = e.target;
                var parentElement = childElement.parentNode.parentNode.parentNode;
                var parentId = parentElement.getAttribute("id");
                document.getElementById(parentId).style.display = "none";
                parentId = parseInt(parentId)
                parentId = parentId+1;
                document.getElementById(parentId).style.display = "block"
            }

            self.insrNoChange = (e)=>{
                if (self.nationalInsuranceNo().length != 9) {
                    self.insLength("Should enter 9 characters")
                    document.getElementById("icon_button2").disabled = true;
                } else {
                    self.insLength("")
                    if(self.employementStartDate() != undefined || self.employementStartDate() != null){
                        document.getElementById("icon_button2").disabled = false;
                    }
                    else{
                        document.getElementById("icon_button2").disabled = true;
                    }
                }
            }

            self.statChange = ()=>{
                if(self.statement1().length == 0){
                    self.statement().delete("A");
                }
                else{
                    self.statement().add("A")
                }

                if(self.statement2().length == 0){
                    self.statement().delete("B");
                }
                else{
                    self.statement().add("B")
                }

                if(self.statement3().length == 0){
                    self.statement().delete("C");
                }
                else{
                    self.statement().add("C")
                }
                if(self.statement().size !=0 ){
                    document.getElementById("icon_button3").disabled = false;
                }
                else{
                    document.getElementById("icon_button3").disabled = true;
                }
            }

            self.studValChanged = (e)=>{
                let studLoanVal = e.detail.value;

                document.getElementById("postgrd-lon").style.display = "block";
                if(studLoanVal=="Yes"){
                    document.getElementById("studies").style.display = "flex"
                }
                else{
                    document.getElementById("studies").style.display = "none"
                }
            }

            self.selectStudiesVal = ko.observable('')
            self.studiesChanged = (e)=>{
                let studies = e.detail.value;
                if(studies=="Yes"){
                    document.getElementById("repayStudLoan").style.display = "flex"
                }
                else{
                    document.getElementById("repayStudLoan").style.display = "none"
                }
            }

            self.repayStudLoanVal = ko.observable('')
            self.repayStudLoanChanged = (e)=>{
                let repayLoanVal = e.detail.value;
                if(repayLoanVal=="Yes"){
                    document.getElementById("typeStudLoan").style.display = "flex"
                }
                else{
                    document.getElementById("typeStudLoan").style.display = "none"
                }
            }

            self.typeLoan = [
                { value: 'Plan 1', label: 'Plan 1' },
                { value: 'Plan 2', label: 'Plan 2' },
                { value: 'Both', label: 'Both' }
            ];
            
            self.typeLoanOptions = new ArrayDataProvider(self.typeLoan, {
                keyAttributes: 'value'
            });
            self.typeStudLoanVal = ko.observable('')

            self.selectPostGrdVal = ko.observable('')
            self.postgrdChanged = (e)=>{
                let postGrdVal = e.detail.value;
                if(postGrdVal=="Yes"){
                    document.getElementById("icon_button4").style.display = "none"
                    document.getElementById("compltPostgrd").style.display = "block"
                }
                else{
                    document.getElementById("icon_button4").style.display = "block"
                    document.getElementById("compltPostgrd").style.display = "none"
                }
            }

            self.compltPostgrdVal = ko.observable('')
            self.compltPostgrdChanged = (e)=>{
                let compltPostVal = e.detail.value;
                if(compltPostVal=="Yes"){
                    document.getElementById("icon_button4").style.display = "none"
                    document.getElementById("repayPostgrd").style.display = "flex"
                }
                else{
                    document.getElementById("icon_button4").style.display = "block"
                    document.getElementById("repayPostgrd").style.display = "none"
                }
            }

            self.repayPostgrdVal = ko.observable('');
            self.repayPostgrdChanged = (e)=>{
                let compltPostVal = e.detail.value;
                if(compltPostVal=="Yes"){
                    document.getElementById("icon_button4").style.display = "block"
                }
                else{
                    document.getElementById("icon_button4").style.display = "block"
                }
            }

            self.declaration = ko.observable()

            self.name = ko.observable()
            self.esignature = ko.observable()
            self.date = ko.observable()

            self.createSignature = ()=>{
                self.esignature(self.name());
            }
            self.checkListValid = ko.observable()

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

            self.userExist = ko.observable();
            self.p45Val = ko.observable();
            self.file = ko.observable();

            self.checkUserExist = ()=>{
                $.ajax({
                    url: BaseURL + "/starterUserExist",
                    type: 'POST',
                    data: JSON.stringify({
                        userId : sessionStorage.getItem("userId"),
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                        console.log(errorThrown);
                    },
                    success: function (data) {
                        var result = data[1]
                        data = JSON.parse(data[0])
                        if(data.length==0){
                            self.userExist(0)
                        }
                        else{
                            self.userExist(1)
                            if(data[0][2]=="Yes"){
                                self.p45Val("Yes")
                                self.file(result);
                            }
                            else{
                                self.p45Val("No")
                            }
                        }
                    }
                })      
            }

            self.checkUserExist();

            self.previewClick = function (event) {
                // document.getElementById("passportLink").href = self.file();
                var data64=self.file();
                var pdfDataUri = "data:application/octet-stream;charset=utf-16le;base64,"+data64;
        
                // Create an anchor element
                var downloadLink = document.createElement("a");
                downloadLink.href = pdfDataUri;
                var fileName = "document.pdf";
                // Set the download attribute to specify the file name
                downloadLink.download = fileName;
        
                // Trigger a click event on the anchor element to start the download
                downloadLink.click();
            };

            self.uploadError = ko.observable();

            self.ps45FileSave = (event, data)=>{
                self.uploadError('')
                document.querySelector('#openAddUploadingProgress').open();
                var file = event.detail.files[0];
                const result = event.detail.files;
                const files = result[0];
                var fileName= files.name;
                var uploadURL = BaseURL + "/css/uploads/";
                var filePath= uploadURL+fileName;

                var fileFormat =files.name.split(".");
                var checkFormat =fileFormat[1];
                
                if(checkFormat == 'pdf'){
                document.querySelector('#openAddUploadingProgress').open();
                const reader = new FileReader();
                reader.readAsDataURL(files);
                self.typeError('');
                    
                reader.onload = ()=>{
                    const fileContent = reader.result;
                    $.ajax({
                        url: BaseURL + "/p45FileUpload",
                        type: 'POST',
                        data: JSON.stringify({
                            userId : sessionStorage.getItem("userId"),
                            file_name : fileName,
                            file : fileContent,
                            file_type : "P45 File", 
                            file_type_additional : "Right To Work",
                            file_path : filePath,
                            p45 : self.selectPs4Val()
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            console.log(errorThrown);
                        },
                        success: function (data) {
                            document.querySelector('#openAddUploadingProgress').close();
                            self.ps45CustomText(fileName)
                            location.reload()
                        }
                    })      
                }
            }else{
                self.typeError('The document must be a file of type: pdf')
            }
        }

            self.getEmployeePersonalDetails = ()=>{
                $.ajax({                   
                    url: BaseURL + "/jpEditStaffDetails",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId : sessionStorage.getItem("userId")
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
                        self.title(data[0][1])
                        self.firstname(data[0][2])
                        self.lastname(data[0][3])
                        self.address1(data[0][7])
                        self.address2(data[0][8])
                        self.posttown(data[0][9])
                        self.postcode(data[0][10])
                    }
                })
            }

            self.getEmployeePersonalDetails();

            self.formSubmit = ()=>{
                var validInductionCheck = self._checkValidationGroup("checkListValidation");
                if(validInductionCheck){
                    let popup = document.getElementById("popup1");
                    popup.open();
                    self.statement(Array.from(self.statement()))
                    $.ajax({
                        url: BaseURL + "/starterFormSubmit",
                        type: 'POST',
                        data: JSON.stringify({
                            userId : sessionStorage.getItem("userId"),
                            p45 : self.selectPs4Val(),
                            nationalInsuranceNo : self.nationalInsuranceNo(),
                            employementStartDate : self.employementStartDate(),
                            statement : self.statement(),
                            studLoan : self.selectStudLoanVal(),
                            studies : self.selectStudiesVal(),
                            repayStudLoan : self.repayStudLoanVal(),
                            typeStudLoan : self.typeStudLoanVal(),
                            postGrad : self.selectPostGrdVal(),
                            completePostgrad : self.compltPostgrdVal(),
                            repayPostgrd : self.repayPostgrdVal(),
                            declaration : self.declaration(),
                            name : self.name(),
                            esignature : self.esignature(),
                            date : self.date()
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
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





            //Edit starter codeee

            self.editStarter = ()=>{
                $.ajax({
                    url: BaseURL + "/starterUserExist",
                    type: 'POST',
                    data: JSON.stringify({
                        userId : sessionStorage.getItem("userId"),
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                        console.log(errorThrown);
                    },
                    success: function (data) {
                        data = JSON.parse(data[0])
                        self.nationalInsuranceNo(data[0][4]);
                        self.employementStartDate(data[0][5]);
                        const statementArr = data[0][6].split(", ");
                        statementArr.forEach(statement => {
                            if(statement=="A"){
                                self.statement1(["A"]);        
                            }
                            else if(statement=="B"){
                                self.statement2(["B"]);
                            }
                            else{
                                self.statement3(["C"]);
                            }
                        });
                        self.statement(new Set(statementArr));
                        self.selectStudLoanVal(data[0][7]);
                        self.selectStudiesVal(data[0][8]);
                        self.repayStudLoanVal(data[0][9]);
                        self.typeStudLoanVal(data[0][10]);
                        self.selectPostGrdVal(data[0][11]);
                        self.compltPostgrdVal(data[0][12]);
                        self.repayPostgrdVal(data[0][13]);
                        self.name(data[0][15]);
                        self.esignature(data[0][16]);
                        self.date(data[0][17]);
                    }
                })
                document.getElementById("msg-div").style.display = "none"
                document.getElementById("inst").style.display = "block"
            }

            self.formUpdate = ()=>{
                var validInductionCheck = self._checkValidationGroup("checkListValidation");
                if(validInductionCheck){
                    let popup = document.getElementById("popup1");
                    popup.open();
                    self.statement(Array.from(self.statement()))
                    $.ajax({
                        url: BaseURL + "/starterFormUpdate",
                        type: 'POST',
                        data: JSON.stringify({
                            userId : sessionStorage.getItem("userId"),
                            p45 : self.selectPs4Val(),
                            nationalInsuranceNo : self.nationalInsuranceNo(),
                            employementStartDate : self.employementStartDate(),
                            statement : self.statement(),
                            studLoan : self.selectStudLoanVal(),
                            studies : self.selectStudiesVal(),
                            repayStudLoan : self.repayStudLoanVal(),
                            typeStudLoan : self.typeStudLoanVal(),
                            postGrad : self.selectPostGrdVal(),
                            completePostgrad : self.compltPostgrdVal(),
                            repayPostgrd : self.repayPostgrdVal(),
                            declaration : self.declaration(),
                            name : self.name(),
                            esignature : self.esignature(),
                            date : self.date()
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
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
            self.ps45FileUpdate = (event, data)=>{
                self.uploadError('')
                document.querySelector('#openAddUploadingProgress').open();
                var file = event.detail.files[0];
                const result = event.detail.files;
                const files = result[0];
                var fileName= files.name;
                var uploadURL = BaseURL + "/css/uploads/";
                var filePath= uploadURL+fileName;

                var fileFormat =files.name.split(".");
                var checkFormat =fileFormat[1];
                
                if(checkFormat == 'pdf'){
                const reader = new FileReader();
                reader.readAsDataURL(files);
                self.typeError1('');
                    
                reader.onload = ()=>{
                    const fileContent = reader.result;
                    $.ajax({
                        url: BaseURL + "/p45FileReUpload",
                        type: 'POST',
                        data: JSON.stringify({
                            userId : sessionStorage.getItem("userId"),
                            file_name : fileName,
                            file : fileContent,
                            file_type : "P45 File", 
                            file_type_additional : "Right To Work",
                            file_path : filePath,
                            p45 : "Yes"
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            console.log(errorThrown);
                        },
                        success: function (data) {
                            document.querySelector('#openAddUploadingProgress').close();
                            self.ps45CustomText(fileName)
                            location.reload()
                        }
                    })      
                }
            }else{
                self.typeError1('The document must be a file of type: pdf')
            }
        }
        }    
    }
    return  Induction;

});
