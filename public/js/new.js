(function () {
    const checkbox = $("#enableSecurity");
    const securityOptions = $("#securityOptions");

    securityOptions.hide();
    checkbox.prop("checked", false);

    checkbox.on("click", function () {
        if ($(this).is(":checked")) {
            securityOptions.show();
        } else {
            securityOptions.hide();
        }
    });

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
})();