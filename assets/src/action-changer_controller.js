import { Controller } from '@hotwired/stimulus';

class actionChanger extends Controller {
   
   onClick(e) {
      const url = e.currentTarget.dataset.url;
      const form = document.querySelector('form');
      form.action=url;
      form.submit();
   }
}

export { actionChanger };