(function () {
    $("#markdown").html(marked.parse(pasteContent));

    const displayMarkdown = () => {
        $("#markdown").show();
        $("#content").hide();

        $("#display-md").addClass("active");
        $("#display-code").removeClass("active");
    };

    const displayCode = () => {
        $("#markdown").hide();
        $("#content").show();

        $("#display-md").removeClass("active");
        $("#display-code").addClass("active");
    }

    $("#display-md").click(displayMarkdown);
    $("#display-code").click(displayCode);

    displayMarkdown();
})();