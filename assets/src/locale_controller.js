import { Controller } from '@hotwired/stimulus';

class locale extends Controller {
    static targets = [];

    locale = null;
    connect() {
        this.locale = global.locale ?? document.getElementsByTagName("html")[0].getAttribute('lang');
        console.log('Locale: ' + this.locale);
    }

    changeLocale(event) {
        event.preventDefault();
        if ( this.locale === event.currentTarget.innerHTML) {
            return;
        } else {
            let location = window.location.href;
            let location_new = location.replace("/" + this.locale + "/", "/" + event.currentTarget.innerHTML + "/");
            window.location.href = location_new;
        }
    }
}

export { locale }; 
