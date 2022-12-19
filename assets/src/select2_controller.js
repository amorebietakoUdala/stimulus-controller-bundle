import { Controller } from '@hotwired/stimulus';

import $ from 'jquery';
import './css/select2.css';

import 'select2';

import 'select2/dist/js/i18n/es';
import 'select2/dist/js/i18n/eu';

class select2 extends Controller {
   
   locale = null;
   connect() {
      this.locale = global.locale ?? document.getElementsByTagName("html")[0].getAttribute('lang');
      const options={
         theme: "bootstrap-5",
         language: this.locale,
      }
      $(this.element).select2(options);
   }
}

export { select2 };