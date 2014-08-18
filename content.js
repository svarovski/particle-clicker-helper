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
    if(button.text().indexOf("Buy") >= 0) {
        updateBestMark("Research");
    }
}

function str2num(s) {
    var match = s.match(/(\d+[\d\.]*)(.)/);
    if(match == null || match.length < 3)
        return undefined;
    var n = parseFloat(match[1]);
    if(match[2] == "k") n = n * 1000;
    if(match[2] == "M") n = n * 1000000;
    return n;
}

function num2str(n) {
    if(n >    1000) return (n/   1000).toFixed(2) + "k";
    if(n > 1000000) return (n/1000000).toFixed(2) + "M";
}

function updateRatio(button, amountStr, priceStr) {
    var amount = str2num(amountStr);
    var price = str2num(priceStr);
    if(amount !== undefined && price !== undefined) {
        var parent = button.parents(".media-body");
        var x = parent.find(".ratio");
        if (x.length == 0) {
            parent.append("<span class='ratio'>zzz</span>");
            x = parent.find(".ratio");
        }
        x.text(num2str(price/amount));
    }
}

function updateBestMark(tag) {
    $(document).find("button:contains('" + tag + "')").parents(".media-body").find(".ratio:visible")
        .removeClass("ratio-best").sort(function(a,b) {
            return str2num($(a).text()) - str2num($(b).text());
        }).first().addClass("ratio-best");
}

function doFetchUpdate(tag, defer) {
    var val = str2num($("#Status").find(tag).text());
    if(val != undefined) defer.resolve(val);
    else setTimeout(function() { doFetchUpdate(tag, defer); }, 100);
}

function fetchUpdate(tag) {
    var defer = $.Deferred();
    setTimeout(function() { doFetchUpdate(tag, defer); }, 0);
    return defer.promise();
}

function fetchAllTimeLeft() {
    var status = $("#Status");
    var data = str2num(status.find("div:contains('Data')").text());
    var funding = str2num(status.find("div:contains('Funding')").text());

    $.when(fetchUpdate("#update-data"), fetchUpdate("#update-funding"))
        .then(function(dataDelta, fundingDelta) {
            updateAllTimeLeft(data, funding, dataDelta, fundingDelta);
        });
}

function updateAllTimeLeft(data, funding, dataDelta, fundingDelta) {
    $(document).find("button:contains('Research')")
        .each(function(i, o) { updateButtonTimeLeft(o, data, dataDelta); });
    $(document).find("button:contains('Hire'), button:contains('Hire')")
        .each(function(i, o) { updateButtonTimeLeft(o, funding, fundingDelta); });
}

function updateButtonTimeLeft(o, total, delta) {
    var button = $(o);

    var span = button.parents(".media-body").find(".ratio");
    var timeLeft = span.find(".time-left");
    if(timeLeft.length == 0) {
        span.append("<span class='time-left'></span>");
        timeLeft = span.find(".time-left");
    }
    var price = str2num(button.text());
    if(price > total) {
        var seconds = ((price - total) / delta).toFixed(0);
        timeLeft.text(seconds + "s");
    }
}

setInterval(fetchAllTimeLeft, 3000);
