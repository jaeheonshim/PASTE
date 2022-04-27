(function () {
    const checkbox = $("#enableSecurity");
    const securityOptions = $("#securityOptions");
    const passphrase = $("#pastePassword");

    securityOptions.hide();
    passphrase.prop("required", false);
    checkbox.prop("checked", false);

    checkbox.on("click", function () {
        if ($(this).is(":checked")) {
            securityOptions.show();
            passphrase.prop("required", true);
        } else {
            securityOptions.hide();
            passphrase.prop("required", false);
        }
    });

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
})();