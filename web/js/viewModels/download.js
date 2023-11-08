define(['knockout', 'jquery', 'appController', 'ojs/ojarraydataprovider', "ojs/ojhtmlutils", "ojs/ojknockout", "ojs/ojchart", "ojs/ojtoolbar",
  "ojs/ojbinddom", "ojs/ojformlayout", "ojs/ojmessages","ojs/ojgauge"],
    function (ko, $, app, ArrayDataProvider) {

        class DownloadViewModel {
            constructor(context){
            var self = this;

            self.connected = function () {
                if (sessionStorage.getItem("userName") == null) {
                    self.router.go({path : 'signin'});
                }
                else {
                    app.onAppSuccess();
                    //download()
                }
            }

            self.timesheetPDFGenerate = function (event,data) {
                var printContents = document.getElementById('invoice').innerHTML;
                document.body.innerHTML = "<html><head><title></title></head><body>" + printContents + "</body>";
                window.print();         
            }
            
        }

    }
        /*
         * Returns a constructor for the ViewModel so that the ViewModel is constructed
         * each time the view is displayed.  Return an instance of the ViewModel if
         * only one instance of the ViewModel is needed.
         */
        return DownloadViewModel;
    }
);
