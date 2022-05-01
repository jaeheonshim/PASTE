$(function() {
    $('textarea').each(function() {
        $(this).height($(this).prop('scrollHeight'));
    });

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    hljs.highlightAll();
});