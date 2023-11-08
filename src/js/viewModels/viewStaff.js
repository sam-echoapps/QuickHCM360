define(['ojs/ojcore',"knockout","jquery","appController","ojs/ojconverterutils-i18n", "ojs/ojarraydataprovider",'ojs/ojknockout-keyset', "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojlistitemlayout", "ojs/ojtrain",
        "ojs/ojlistview","ojs/ojradioset","ojs/ojlabelvalue","ojs/ojlabel" ,"ojs/ojselectcombobox","ojs/ojbutton" ,"ojs/ojprogress-bar", "ojs/ojdatetimepicker", 'ojs/ojtable', 'ojs/ojswitch', 'ojs/ojvalidationgroup','ojs/ojselector','ojs/ojtoolbar','ojs/ojfilepicker','ojs/ojcheckboxset', "ojs/ojavatar","ojs/ojdrawerlayout"], 
function (oj,ko,$, app, ojconverterutils_i18n_1, ArrayDataProvider,  ojknockout_keyset_1,ResponsiveUtils, ResponsiveKnockoutUtils, AsyncRegExpValidator) {

    class AdminViewModel {
        constructor(context) {
                var self = this;
                self.startOpened = ko.observable(true);
                self.startToggle = () => self.startOpened(!self.startOpened());
                
                self.title = ko.observable();
                self.titleList = ko.observableArray([]);
                self.titleList.push(
                    {'value' : 'Mr', 'label' : 'Mr.'},
                    {'value' : 'Mrs', 'label' : 'Mrs.'},
                    {'value' : 'Miss', 'label' : 'Miss.'}
                );
                self.titleListDP = new ArrayDataProvider(self.titleList, {keyAttributes: 'value'});
                self.mainPostList = ko.observableArray([]);
                self.mainPostList.push(
                    {'value' : 'Nurse', 'label' : 'Nurse (RGN)'},
                    {'value' : 'Care Assistant', 'label' : 'Care Assistant'},
                    {'value' : 'Senior Care Assistant', 'label' : 'Senior Care Assistant'},
                    {'value' : 'Domiciliary Care', 'label' : 'Domiciliary Care'},
                    {'value' : 'Chefs', 'label' : 'Chefs'},
                    {'value' : 'Kitchen Assistant', 'label' : 'Kitchen Assistant'},
                    {'value' : 'Domestic Care', 'label' : 'Domestic Care'}
                );
                self.mainPostListDP = new ArrayDataProvider(self.mainPostList, {keyAttributes: 'value'});
                self.statusList = ko.observableArray([]);
                self.statusList.push(
                    {'value' : 'Fresher', 'label' : 'Fresher'},
                    {'value' : 'Experienced', 'label' : 'Experienced'}
                );
                self.statusDP = new ArrayDataProvider(self.statusList, {keyAttributes: 'value'});
                self.firstName = ko.observable();
                self.lastName = ko.observable();
                self.mainPost = ko.observable();
                self.status = ko.observable();
                self.address1 = ko.observable();
                self.address2 = ko.observable();
                self.postTown = ko.observable();
                self.postCode = ko.observable();
                self.contactEmail = ko.observable();
                self.contactEmailCheck = ko.observable();
                self.contactNumber = ko.observable();
                self.whatsappNumber = ko.observable();
                self.primaryCustomText = ko.observable('Profile Photo');
                self.secondaryCustomText = ko.observable();
                self.username = ko.observable();
                self.password = ko.observable();
                self.subpost = ko.observableArray();
                self.StaffDet = ko.observableArray([]);
                self.updateStaffMsg = ko.observable();
                self.primaryCustomText = ko.observable('Profile Photo');
                self.secondaryCustomText = ko.observable('Please upload profile photo');
                self.emailError = ko.observable();
                self.contactError = ko.observable();
                self.typeError = ko.observable('');
                self.groupValid = ko.observable();
                self.profileStatus = ko.observable();
                self.profilePhoto = ko.observable();
                self.uploadDocumentMsg = ko.observable();

                self.mainPostList = ko.observableArray([]);
                self.mainPostList.push(
                    {'value' : 'Nurse', 'label' : 'Nurse (RGN)'},
                    {'value' : 'Care Assistant', 'label' : 'Care Assistant'},
                    {'value' : 'Senior Care Assistant', 'label' : 'Senior Care Assistant'},
                    {'value' : 'Domiciliary Care', 'label' : 'Domiciliary Care'},
                    {'value' : 'Chefs', 'label' : 'Chefs'},
                    {'value' : 'Kitchen Assistant', 'label' : 'Kitchen Assistant'},
                    {'value' : 'Domestic Care', 'label' : 'Domestic Care'}
                );
                self.mainPostListDP = new ArrayDataProvider(self.mainPostList, {keyAttributes: 'value'});
                self.choiceList = ko.observableArray([]);  
                self.choiceList.push(
                    {'value' : 'Yes', 'label' : 'Yes'},
                    {'value' : 'No', 'label' : 'No'},  
                );
                self.choiceListDP = new ArrayDataProvider(self.choiceList, {keyAttributes: 'value'});
                self.have_transportation = ko.observable();
                self.countryCode = ko.observable('');
                self.countryCodes = ko.observableArray([]);
                self.countryCodes.push(
                    {"label":"Afghanistan(+93)","value":"+93"},
                    {"label":"Albania(+355)","value":"+355"},
                    {"label":"Algeria(+213)","value":"+213"},
                    {"label":"American Samoa(+1684)","value":"+1684"},
                    {"label":"Andorra(+376)","value":"+376"},
                    {"label":"Angola(+244)","value":"+244"},
                    {"label":"Anguilla(+1264)","value":"+1264"},
                    {"label":"Antarctica(+672)","value":"+672"},
                    {"label":"Antigua and Barbuda(+1268)","value":"+1268"},
                    {"label":"Argentina(+54)","value":"+54"},
                    {"label":"Armenia(+374)","value":"+374"},
                    {"label":"Aruba(+297)","value":"+297"},
                    {"label":"Australia(+61)","value":"+61"},
                    {"label":"Austria(+43)","value":"+43"},
                    {"label":"Azerbaijan(+994)","value":"+994"},
                    {"label":"Bahamas(+1242)","value":"+1242"},
                    {"label":"Bahrain(+973)","value":"+973"},
                    {"label":"Bangladesh(+880)","value":"+880"},
                    {"label":"Barbados(+1246)","value":"+1246"},
                    {"label":"Belarus(+375)","value":"+375"},
                    {"label":"Belgium(+32)","value":"+32"},
                    {"label":"Belize(+501)","value":"+501"},
                    {"label":"Benin(+229)","value":"+229"},
                    {"label":"Bermuda(+1441)","value":"+1441"},
                    {"label":"Bhutan(+975)","value":"+975"},
                    {"label":"Bolivia(+591)","value":"+591"},
                    {"label":"Bosnia and Herzegovina(+387)","value":"+387"},
                    {"label":"Botswana(+267)","value":"+267"},
                    {"label":"Brazil(+55)","value":"+55"},
                    {"label":"British Indian Ocean Territory(+246)","value":"+246"},
                    {"label":"British Virgin Islands(+1284)","value":"+1284"},
                    {"label":"Brunei(+673)","value":"+673"},
                    {"label":"Bulgaria(+359)","value":"+359"},
                    {"label":"Burkina Faso(+226)","value":"+226"},
                    {"label":"Burundi(+257)","value":"+257"},
                    {"label":"Cambodia(+855)","value":"+855"},
                    {"label":"Cameroon(+237)","value":"+237"},
                    {"label":"Canada(+1)","value":"+1"},
                    {"label":"Cape Verde(+238)","value":"+238"},
                    {"label":"Cayman Islands(+1345)","value":"+1345"},
                    {"label":"Central African Republic(+236)","value":"+236"},
                    {"label":"Chad(+235)","value":"+235"},
                    {"label":"Chile(+56)","value":"+56"},
                    {"label":"China(+86)","value":"+86"},
                    {"label":"Christmas Island(+61)","value":"+61"},
                    {"label":"Cocos Islands(+61)","value":"+61"},
                    {"label":"Colombia(+57)","value":"+57"},
                    {"label":"Comoros(+269)","value":"+269"},
                    {"label":"Cook Islands(+682)","value":"+682"},
                    {"label":"Costa Rica(+506)","value":"+506"},
                    {"label":"Croatia(+385)","value":"+385"},
                    {"label":"Cuba(+53)","value":"+53"},
                    {"label":"Curacao(+599)","value":"+599"},
                    {"label":"Cyprus(+357)","value":"+357"},
                    {"label":"Czech Republic(+420)","value":"+420"},
                    {"label":"Democratic Republic of the Congo(+243)","value":"+243"},
                    {"label":"Denmark(+45)","value":"+45"},
                    {"label":"Djibouti(+253)","value":"+253"},
                    {"label":"Dominica(+1767)","value":"+1767"},
                    {"label":"Dominican Republic(+1809)","value":"+1809"},
                    {"label":"East Timor(+670)","value":"+670"},
                    {"label":"Ecuador(+593)","value":"+593"},
                    {"label":"Egypt(+20)","value":"+20"},
                    {"label":"El Salvador(+503)","value":"+503"},
                    {"label":"Equatorial Guinea(+240)","value":"+240"},
                    {"label":"Eritrea(+291)","value":"+291"},
                    {"label":"Estonia(+372)","value":"+372"},
                    {"label":"Ethiopia(+251)","value":"+251"},
                    {"label":"Falkland Islands(+500)","value":"+500"},
                    {"label":"Faroe Islands(+298)","value":"+298"},
                    {"label":"Fiji(+679)","value":"+679"},
                    {"label":"Finland(+358)","value":"+358"},
                    {"label":"France(+33)","value":"+33"},
                    {"label":"French Polynesia(+689)","value":"+689"},
                    {"label":"Gabon(+241)","value":"+241"},
                    {"label":"Gambia(+220)","value":"+220"},
                    {"label":"Georgia(+995)","value":"+995"},
                    {"label":"Germany(+49)","value":"+49"},
                    {"label":"Ghana(+233)","value":"+233"},
                    {"label":"Gibraltar(+350)","value":"+350"},
                    {"label":"Greece(+30)","value":"+30"},
                    {"label":"Greenland(+299)","value":"+299"},
                    {"label":"Grenada(+1473)","value":"+1473"},
                    {"label":"Guam(+1671)","value":"+1671"},
                    {"label":"Guatemala(+502)","value":"+502"},
                    {"label":"Guernsey(+441481)","value":"+441481"},
                    {"label":"Guinea(+224)","value":"+224"},
                    {"label":"Guinea-Bissau(+245)","value":"+245"},
                    {"label":"Guyana(+592)","value":"+592"},
                    {"label":"Haiti(+509)","value":"+509"},
                    {"label":"Honduras(+504)","value":"+504"},
                    {"label":"Hong Kong(+852)","value":"+852"},
                    {"label":"Hungary(+36)","value":"+36"},
                    {"label":"Iceland(+354)","value":"+354"},
                    {"label":"India(+91)","value":"+91"},
                    {"label":"Indonesia(+62)","value":"+62"},
                    {"label":"Iran(+98)","value":"+98"},
                    {"label":"Iraq(+964)","value":"+964"},
                    {"label":"Ireland(+353)","value":"+353"},
                    {"label":"Isle of Man(+441624)","value":"+441624"},
                    {"label":"Israel(+972)","value":"+972"},
                    {"label":"Italy(+39)","value":"+39"},
                    {"label":"Ivory Coast(+225)","value":"+225"},
                    {"label":"Jamaica(+1876)","value":"+1876"},
                    {"label":"Japan(+81)","value":"+81"},
                    {"label":"Jersey(+441534)","value":"+441534"},
                    {"label":"Jordan(+962)","value":"+962"},
                    {"label":"Kazakhstan(+7)","value":"+7"},
                    {"label":"Kenya(+254)","value":"+254"},
                    {"label":"Kiribati(+686)","value":"+686"},
                    {"label":"Kosovo(+383)","value":"+383"},
                    {"label":"Kuwait(+965)","value":"+965"},
                    {"label":"Kyrgyzstan(+996)","value":"+996"},
                    {"label":"Laos(+856)","value":"+856"},
                    {"label":"Latvia(+371)","value":"+371"},
                    {"label":"Lebanon(+961)","value":"+961"},
                    {"label":"Lesotho(+266)","value":"+266"},
                    {"label":"Liberia(+231)","value":"+231"},
                    {"label":"Libya(+218)","value":"+218"},
                    {"label":"Liechtenstein(+423)","value":"+423"},
                    {"label":"Lithuania(+370)","value":"+370"},
                    {"label":"Luxembourg(+352)","value":"+352"},
                    {"label":"Macao(+853)","value":"+853"},
                    {"label":"Macedonia(+389)","value":"+389"},
                    {"label":"Madagascar(+261)","value":"+261"},
                    {"label":"Malawi(+265)","value":"+265"},
                    {"label":"Malaysia(+60)","value":"+60"},
                    {"label":"Maldives(+960)","value":"+960"},
                    {"label":"Mali(+223)","value":"+223"},
                    {"label":"Malta(+356)","value":"+356"},
                    {"label":"Marshall Islands(+692)","value":"+692"},
                    {"label":"Mauritania(+222)","value":"+222"},
                    {"label":"Mauritius(+230)","value":"+230"},
                    {"label":"Mayotte(+262)","value":"+262"},
                    {"label":"Mexico(+52)","value":"+52"},
                    {"label":"Micronesia(+691)","value":"+691"},
                    {"label":"Moldova(+373)","value":"+373"},
                    {"label":"Monaco(+377)","value":"+377"},
                    {"label":"Mongolia(+976)","value":"+976"},
                    {"label":"Montenegro(+382)","value":"+382"},
                    {"label":"Montserrat(+1664)","value":"+1664"},
                    {"label":"Morocco(+212)","value":"+212"},
                    {"label":"Mozambique(+258)","value":"+258"},
                    {"label":"Myanmar(+95)","value":"+95"},
                    {"label":"Namibia(+264)","value":"+264"},
                    {"label":"Nauru(+674)","value":"+674"},
                    {"label":"Nepal(+977)","value":"+977"},
                    {"label":"Netherlands(+31)","value":"+31"},
                    {"label":"Netherlands Antilles(+599)","value":"+599"},
                    {"label":"New Caledonia(+687)","value":"+687"},
                    {"label":"New Zealand(+64)","value":"+64"},
                    {"label":"Nicaragua(+505)","value":"+505"},
                    {"label":"Niger(+227)","value":"+227"},
                    {"label":"Nigeria(+234)","value":"+234"},
                    {"label":"Niue(+683)","value":"+683"},
                    {"label":"North Korea(+850)","value":"+850"},
                    {"label":"Northern Mariana Islands(+1670)","value":"+1670"},
                    {"label":"Norway(+47)","value":"+47"},
                    {"label":"Oman(+968)","value":"+968"},
                    {"label":"Pakistan(+92)","value":"+92"},
                    {"label":"Palau(+680)","value":"+680"},
                    {"label":"Palestine(+970)","value":"+970"},
                    {"label":"Panama(+507)","value":"+507"},
                    {"label":"Papua New Guinea(+675)","value":"+675"},
                    {"label":"Paraguay(+595)","value":"+595"},
                    {"label":"Peru(+51)","value":"+51"},
                    {"label":"Philippines(+63)","value":"+63"},
                    {"label":"Pitcairn(+64)","value":"+64"},
                    {"label":"Poland(+48)","value":"+48"},
                    {"label":"Portugal(+351)","value":"+351"},
                    {"label":"Puerto Rico(+1787)","value":"+1787"},
                    {"label":"Qatar(+974)","value":"+974"},
                    {"label":"Republic of the Congo(+242)","value":"+242"},
                    {"label":"Reunion(+262)","value":"+262"},
                    {"label":"Romania(+40)","value":"+40"},
                    {"label":"Russia(+7)","value":"+7"},
                    {"label":"Rwanda(+250)","value":"+250"},
                    {"label":"Saint Barthelemy(+590)","value":"+590"},
                    {"label":"Saint Helena(+290)","value":"+290"},
                    {"label":"Saint Kitts and Nevis(+1869)","value":"+1869"},
                    {"label":"Saint Lucia(+1758)","value":"+1758"},
                    {"label":"Saint Martin(+590)","value":"+590"},
                    {"label":"Saint Pierre and Miquelon(+508)","value":"+508"},
                    {"label":"Saint Vincent and the Grenadines(+1784)","value":"+1784"},
                    {"label":"Samoa(+685)","value":"+685"},
                    {"label":"San Marino(+378)","value":"+378"},
                    {"label":"Sao Tome and Principe(+239)","value":"+239"},
                    {"label":"Saudi Arabia(+966)","value":"+966"},
                    {"label":"Senegal(+221)","value":"+221"},
                    {"label":"Serbia(+381)","value":"+381"},
                    {"label":"Seychelles(+248)","value":"+248"},
                    {"label":"Sierra Leone(+232)","value":"+232"},
                    {"label":"Singapore(+65)","value":"+65"},
                    {"label":"Sint Maarten(+1721)","value":"+1721"},
                    {"label":"Slovakia(+421)","value":"+421"},
                    {"label":"Slovenia(+386)","value":"+386"},
                    {"label":"Solomon Islands(+677)","value":"+677"},
                    {"label":"Somalia(+252)","value":"+252"},
                    {"label":"South Africa(+27)","value":"+27"},
                    {"label":"South Korea(+82)","value":"+82"},
                    {"label":"South Sudan(+211)","value":"+211"},
                    {"label":"Spain(+34)","value":"+34"},
                    {"label":"Sri Lanka(+94)","value":"+94"},
                    {"label":"Sudan(+249)","value":"+249"},
                    {"label":"Suriname(+597)","value":"+597"},
                    {"label":"Svalbard and Jan Mayen(+47)","value":"+47"},
                    {"label":"Swaziland(+268)","value":"+268"},
                    {"label":"Sweden(+46)","value":"+46"},
                    {"label":"Switzerland(+41)","value":"+41"},
                    {"label":"Syria(+963)","value":"+963"},
                    {"label":"Taiwan(+886)","value":"+886"},
                    {"label":"Tajikistan(+992)","value":"+992"},
                    {"label":"Tanzania(+255)","value":"+255"},
                    {"label":"Thailand(+66)","value":"+66"},
                    {"label":"Togo(+228)","value":"+228"},
                    {"label":"Tokelau(+690)","value":"+690"},
                    {"label":"Tonga(+676)","value":"+676"},
                    {"label":"Trinidad and Tobago(+1868)","value":"+1868"},
                    {"label":"Tunisia(+216)","value":"+216"},
                    {"label":"Turkey(+90)","value":"+90"},
                    {"label":"Turkmenistan(+993)","value":"+993"},
                    {"label":"Turks and Caicos Islands(+1649)","value":"+1649"},
                    {"label":"Tuvalu(+688)","value":"+688"},
                    {"label":"U.S. Virgin Islands(+1340)","value":"+1340"},
                    {"label":"Uganda(+256)","value":"+256"},
                    {"label":"Ukraine(+380)","value":"+380"},
                    {"label":"United Arab Emirates(+971)","value":"+971"},
                    {"label":"United Kingdom(+44)","value":"+44"},
                    {"label":"United States(+1)","value":"+1"},
                    {"label":"Uruguay(+598)","value":"+598"},
                    {"label":"Uzbekistan(+998)","value":"+998"},
                    {"label":"Vanuatu(+678)","value":"+678"},
                    {"label":"Vatican(+379)","value":"+379"},
                    {"label":"Venezuela(+58)","value":"+58"},
                    {"label":"Vietnam(+84)","value":"+84"},
                    {"label":"Wallis and Futuna(+681)","value":"+681"},
                    {"label":"Western Sahara(+212)","value":"+212"},
                    {"label":"Yemen(+967)","value":"+967"},
                    {"label":"Zambia(+260)","value":"+260"},
                    {"label":"Zimbabwe(+263)","value":"+263"}
                );
                self.countryCodes = new ArrayDataProvider(self.countryCodes, {
                    keyAttributes: 'value'
                })
                self.genderList = ko.observableArray([]);  
                self.genderList.push(
                    {'value' : 'Male', 'label' : 'Male'},
                    {'value' : 'Female', 'label' : 'Female'},  
                    {'value' : 'Other', 'label' : 'Other'}
                );
                self.genderListDP = new ArrayDataProvider(self.genderList, {keyAttributes: 'value'});
                self.gender = ko.observable();

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({ path: 'signin' });
                    }
                    else {
                       app.onAppSuccess();
                       getProfile();
                    }
                };
                function getProfile(){
                self.secondaryCustomText('Please upload profile photo')
                self.DepName = context.routerState.detail.dep_url;
                console.log(sessionStorage.getItem("staffId"))
                var BaseURL = sessionStorage.getItem("BaseURL")
                $.ajax({                   
                    url: BaseURL + "/jpEditStaffDetails",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId : sessionStorage.getItem("staffId")
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
                        self.title(data[0][1]);
                        self.firstName(data[0][2]);
                        self.lastName(data[0][3]);
                        self.mainPost(data[0][4]);
                        if(self.mainPost()=='Care Assistant'){
                            document.getElementById('subpost1').style.display='block';
                            document.getElementById('subpost2').style.display='none';
                            document.getElementById('subpost3').style.display='none';
                        }
                        else if(self.mainPost()=='Senior Care Assistant'){
                            document.getElementById('subpost2').style.display='block';
                            document.getElementById('subpost1').style.display='none';
                            document.getElementById('subpost3').style.display='none';
                        }                
                        else if(self.mainPost()=='Domiciliary Care'){
                            document.getElementById('subpost3').style.display='block';
                            document.getElementById('subpost1').style.display='none';
                            document.getElementById('subpost2').style.display='none';      
                        }
                        else{
                            document.getElementById('subpost1').style.display='none';
                            document.getElementById('subpost2').style.display='none';
                            document.getElementById('subpost3').style.display='none';
                        }
                        if(data[0][5]=="Kitchen Assistant")
                        {
                            self.subpost(["Kitchen Assistant"])
                        } 
                        if(data[0][5]=="Domestic Care")
                        {
                            self.subpost(["Domestic Care"])
                        }
                        if(data[0][5]=="Kitchen Assistant,Domestic Care")
                        {
                            self.subpost(["Kitchen Assistant","Domestic Care"])
                        }
                        if(data[0][5]=="Care Assistant")
                        {
                            self.subpost(["Care Assistant"])
                        }
                        if(data[0][5]=="Living Care")
                        {
                            self.subpost(["Living Care"])
                        }
                        self.status(data[0][6]);
                        self.address1(data[0][7]);
                        self.address2(data[0][8]);
                        self.postTown(data[0][9]);
                        self.postCode(data[0][10]);
                        self.contactEmail(data[0][11]);
                        self.contactEmailCheck(data[0][11]);
                        self.countryCode(data[0][20]);
                        self.contactNumber(data[0][12]);
                        self.whatsappNumber(data[0][13]);
                        if(data[0][14] == "Pending") {
                            self.profileStatus('Pending');
                        }else if(data[0][14] == "Audited") {
                            self.profileStatus('Audited');
                        } 
                        if(data[0][15] == '') {
                            // self.profilePhoto(BaseURL + "/css/uploads/defaultUser.png")
                            self.profilePhoto('data:image/jpeg;base64,'+data[1]);                 
                        }else {
                            // self.profilePhoto(BaseURL+"/"+data[0][15]); 
                            // console.log(self.profilePhoto())
                            self.profilePhoto('data:image/jpeg;base64,'+data[1]);                 
                        }
                        self.have_transportation(data[0][19]);
                        self.gender(data[0][21]);
                }
                })
            }

            self.subpostShow = function (event,data) {
                if(self.mainPost()=='Care Assistant'){
                    document.getElementById('subpost1').style.display='block';
                    document.getElementById('subpost2').style.display='none';
                    document.getElementById('subpost3').style.display='none';
                }
                else if(self.mainPost()=='Senior Care Assistant'){
                    document.getElementById('subpost2').style.display='block';
                    document.getElementById('subpost1').style.display='none';
                    document.getElementById('subpost3').style.display='none';
                }                
                else if(self.mainPost()=='Domiciliary Care'){
                    document.getElementById('subpost3').style.display='block';
                    document.getElementById('subpost1').style.display='none';
                    document.getElementById('subpost2').style.display='none';      
                }
                else{
                    document.getElementById('subpost1').style.display='none';
                    document.getElementById('subpost2').style.display='none';
                    document.getElementById('subpost3').style.display='none';
                }
            }

                self.staffInfoUpdate = function (event,data) {
                    if(self.mainPost() == 'Nurse' || self.mainPost() == 'Chefs' || self.mainPost() == 'Kitchen Assistant'){
                    self.subpost([])  
                    }
                    if(self.mainPost() != 'Care Assistant' && (self.subpost() == 'Kitchen Assistant' || self.subpost() == 'Domestic Care' || self.subpost() == 'Kitchen Assistant,Domestic Care')){
                        self.subpost([])  
                    }
                    if(self.mainPost() != 'Domiciliary Care' && (self.subpost() == 'Living Care')){
                        self.subpost([])  
                    }
                    if(self.mainPost() != 'Senior Care Assistant' && (self.subpost() == 'Care Assistant')){
                        self.subpost([])  
                    }
                    var validStaffUpdate1 = self._checkValidationGroup("staffUpdateSec1");
                    var validStaffUpdate2 = self._checkValidationGroup("staffUpdateSec2");  
                    var BaseURL = sessionStorage.getItem("BaseURL")
                    if (validStaffUpdate1 && validStaffUpdate2 && self.emailError() == '' && self.contactError() == ''  && self.typeError() == '') {
                    document.querySelector('#openUpdateStaffProgress').open();
                    self.updateStaffMsg('');
                    $.ajax({
                        url: BaseURL + "/jpStaffInfoUpdate",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("staffId"),
                            title : self.title(),
                            firstName : self.firstName(),
                            lastName : self.lastName(),
                            mainPost : self.mainPost(),
                            subpost : self.subpost(),
                            status : self.status(),
                            address1 : self.address1(),
                            address2 : self.address2(),
                            postTown : self.postTown(),
                            postCode : self.postCode(),
                            contactEmail : self.contactEmail(),
                            countryCode : self.countryCode(),
                            contactNumber : self.contactNumber(),
                            have_transportation : self.have_transportation(),
                            gender : self.gender() 
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
                            document.querySelector('#openUpdateStaffProgress').close();
                            // document.querySelector('#openStaffUpdateResult').open();
                            // self.updateStaffMsg(data[0]);
                            location.reload()
                        }
                    })  
                }
                }

                self.context = context;
                self.router = self.context.parentRouter;
                self.DBErrorOKClose = function (event) {
                    document.querySelector('#openStaffUpdateResult').close();
                    self.startOpened(false);
                    getProfile();
                };
               /*  self.selectListener = function (event,data) {
                    const result = event.detail.files;
                    const files = result[0];
                    const reader = new FileReader();
                    reader.readAsDataURL(files);
                    
                    reader.onload = ()=>{
                        const fileContents = reader.result;
                        const blobUrl = new Blob([fileContents], {type: 'image/png'});
                        console.log(blobUrl);


                        $.ajax({
                            url: BaseURL+ "/jpStaffProfilePhoto",
                            type: 'POST',
                            data: JSON.stringify({
                                staffId : sessionStorage.getItem("staffId"),
                                file : fileContents
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
                               console.log(data)
                            }
                        })  

                    }
                    
                
              } */

              self.selectListener = function (event,data) {
                var BaseURL = sessionStorage.getItem("BaseURL")
                var uploadURL = BaseURL + "/css/uploads/";
                var file = event.detail.files[0];
                //console.log(file)
                const result = event.detail.files;
                const files = result[0];
                var fileName= files.name;
                var filePath= uploadURL+fileName;

                console.log(files)
                var fileFormat =files.name.split(".");
                var checkFormat =fileFormat[1];
                if(checkFormat == 'png' || checkFormat =="jpeg" || checkFormat =="jpg"){
                self.typeError('')
                const reader = new FileReader();
                reader.readAsDataURL(files);
                
                reader.onload = ()=>{
                    document.querySelector('#openAddUploadingProgress').open();
                    self.uploadDocumentMsg('');
                    const fileContent = reader.result;
                    //console.log(fileContent)
                    $.ajax({
                        url: BaseURL + "/jpStaffProfilePhoto",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("staffId"),
                            file_path : filePath,
                            file_name : fileName,
                            file : fileContent
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
                            //console.log(data)
                            console.log("success")
                            self.secondaryCustomText(fileName)
                            document.querySelector('#openAddUploadingProgress').close();
                            /* document.querySelector('#openFileUploadResult').open();
                            self.uploadDocumentMsg(data[0]); */
                            //console.log("Success")
                        }
                    })      
                }
            }
            else{
                self.typeError('The image must be a file of type: jpeg, png, jpg')
            }
          }
              self.emailPatternValidator= function(event,data) {
                var BaseURL = sessionStorage.getItem("BaseURL")
                console.log(self.contactEmail())
                var inputText=self.contactEmail()
                var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if(inputText.match(mailformat))
                {
                    self.emailError('')
                }
                else
                {
                    self.emailError("Should enter a valid email address.");
                    return false;
                }  
               $.ajax({
                    url: BaseURL + '/jpStaffEmailExist',
                    // url: '/jpStaffEmailExist',
                    method: 'POST',
                    data: JSON.stringify({ email: inputText }),
                    success: function(response) {
                        if(response == 1 && self.contactEmail() != self.contactEmailCheck()){
                            self.emailError("Email id already existed")
                        }
                    },
                    error: function(xhr, status, error) {
                      console.log("Error : "+xhr.responseText);
                    }
                  });    
             }
             self.onlyNumberKey= function(event,data) {
                console.log(event.detail.value)
                var ASCIICode= event.detail.value
                if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57) && ASCIICode.length==10){
                    self.contactError('')
                }else{
                    self.contactError("Should be digital and must be 10 digits in length.");
                }
             }
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
            self.updateProfileStatus = function (event,data) {
                var BaseURL = sessionStorage.getItem("BaseURL")
                $.ajax({
                    url: BaseURL+ "/jpStaffUpdateProfileStatus",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId : sessionStorage.getItem("staffId"),
                        auditerName : sessionStorage.getItem("userName")
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
                       if(sessionStorage.getItem('profile_status')=="Pending"){
                        sessionStorage.setItem('profile_status','Audited');
                       }else if(sessionStorage.getItem('profile_status')=="Audited"){
                        sessionStorage.setItem('profile_status','Pending');
                       }
                       location.reload();
                    }
                })  

            }
            

            }
            
            
          }
            return  AdminViewModel;

        });
