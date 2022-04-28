$(function() {
    $('textarea').each(function() {
        $(this).height($(this).prop('scrollHeight'));
    });
});