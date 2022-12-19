import Swal from 'sweetalert2';

export function showAlert(confirmURL) {
    Swal.fire({
        template: '#confirm'
    }).then(function (result) {
        if (result.value) {
            document.location.href = confirmURL;
        }
    });
}

export function showAlertNoRedirection(title, html, confirmationButtonText, cancelButtonText, confirmURL, method, target) {
    Swal.fire({
        title: title,
        html: html,
        type: 'warning',
        showCancelButton: true,
        cancelButtonText: cancelButtonText,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: confirmationButtonText,
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: confirmURL,
                method: method,
            }).done(function () {
                $(target).remove();
            });
        }
    });
}

export function createConfirmationAlert(confirmURL) {
    Swal.fire({
        template: '#confirm'
    }).then(function (result) {
        if (result.value) {
            document.location.href = confirmURL;
        }
    });
}