import { Controller } from '@hotwired/stimulus';

import './css/datetimepicker.css';
import { TempusDominus, extend } from '@eonasdan/tempus-dominus';
import customDateFormat from '@eonasdan/tempus-dominus/dist/plugins/customDateFormat';

class datetimepicker extends Controller {

   locale = null;
   connect() {
      this.locale = global.locale ?? document.getElementsByTagName("html")[0].getAttribute('lang');
      extend(customDateFormat);
      new TempusDominus(this.element,{
         display: {
           buttons: {
             close: true,
             clear: true,
           },
           components: {
             useTwentyfourHour: true,
             decades: false,
             year: true,
             month: true,
             date: true,
             clock: false,
           },
         },
         debug: true,
         localization: {
           locale: this.locale+'-'+this.locale.toUpperCase(),
           dayViewHeaderFormat: { month: 'long', year: 'numeric' },
           format: 'yyyy-MM-dd HH:mm',
         },
     });
   }
}

export { datetimepicker };