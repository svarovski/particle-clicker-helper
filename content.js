$(document).find("button:contains('Research'), button:contains('Hire')")
    .click(updateRatioButton).each(updateRatioButton);

function updateRatioButton(e) {
    var button = $(this);
    if(button.text().indexOf("Research") >= 0) {
        updateRatio(button, button.parent().prev().text(), button.text());
        updateBestMark("Research");
    }
    if(button.text().indexOf("Hire") >= 0) {
        updateRatio(button, button.prev().text(), button.text());
        updateBestMark("Hire");
    }
}

function str2num(s) {
    var n = parseFloat(s[1]);
    if(s[2] == "k") n = n * 1000;
    if(s[2] == "M") n = n * 1000000;
    return n;
}

function num2str(n) {
    if(n > 1000) return (n/1000).toFixed(2) + "k";
    if(n > 1000000) return (n/1000000).toFixed(2) + "M";
}

function updateRatio(button, text1, text2) {
    var amountStr = text1.match(/(\d+[\d\.]*)(.)/);
    var priceStr = text2.match(/(\d+[\d\.]*)(.)/);
    if(amountStr.length >= 2 && priceStr.length >= 2) {
        var parent = button.parents(".media-body");
        var x = parent.find(".ratio");
        if (x.length == 0) {
            parent.append("<span class='ratio'>zzz</span>");
            x = parent.find(".ratio");
        }
        x.text(num2str(str2num(priceStr)/str2num(amountStr)));
    }
}

function updateBestMark(tag) {
    $(document).find("button:contains('" + tag + "')").parents(".media-body").find(".ratio:visible")
        .removeClass("ratio-best").sort(function(a,b) {
            return str2num($(a).text().match(/(\d+[\d\.]*)(.)/)) - str2num($(b).text().match(/(\d+[\d\.]*)(.)/));
        }).first().addClass("ratio-best");
}
