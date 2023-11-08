'use strict';
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'appUtils', 'ojs/ojarraydataprovider', 
    'ojs/ojknockout','ojs/ojcheckboxset','ojs/ojinputtext',
    'ojs/ojbutton',"ojs/ojprogress-circle", 'ojs/ojdatetimepicker','ojs/ojvalidationgroup',
    'ojs/ojselectsingle','ojs/ojformlayout','ojs/ojdialog',"ojs/ojpopup"],
    function(oj, ko, $, app, appUtils, ArrayDataProvider) {
        class register {
            constructor() {
                var self = this;
                
                self.addressLine1 = ko.observable();
                self.addressLine2 = ko.observable();
                self.addressLine3 = ko.observable();
                self.town = ko.observable();
                self.postcode = ko.observable();
               
                self.addressLine1Error = ko.observable('');
                self.addressLine2Error = ko.observable('');
                self.townError = ko.observable('');
                self.postcodeError = ko.observable('');
            
            }
        }
        return register;
    }
);
