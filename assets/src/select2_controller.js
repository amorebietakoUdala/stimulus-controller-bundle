import { Controller } from '@hotwired/stimulus';

import $ from 'jquery';
import './css/select2.css';

import 'select2';

import 'select2/dist/js/i18n/es';
import 'select2/dist/js/i18n/eu';

class select2 extends Controller {
   static values = {
      autofocus: { type: Boolean, default: true },
   };   
   locale = null;
   connect() {
      this.locale = global.locale ?? document.getElementsByTagName("html")[0].getAttribute('lang');
      const options={
         theme: "bootstrap-5",
         language: this.locale,
      }
      $(this.element).select2(options);
      if ( this.autofocusValue ) {
         $(this.element).on('select2:open',this.onOpening);
      }
   }

   onOpening(e) {
      document.querySelector('.select2-search__field').focus();
   }
}

export { select2 };