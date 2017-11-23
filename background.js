var ID = "LOR-NC";
var target = 'https://www.linux.org.ru/notifications-count';
var XHR = new XMLHttpRequest();

function notificount(callback) {
    XHR.open("GET", target, true);
    var timeout = setTimeout(function() { XHR.abort(); }, 10000);
    XHR.onreadystatechange = function() { clearTimeout(timeout); callback(XHR); };
    XHR.send(null);
};

function note(title, message) {
    chrome.notifications.create(
        ID,
        {
            "type": "basic",
            //"iconUrl": chrome.extension.getURL("icons/good-penguin.png"),
            "title": title,
            "message": message
        }
    );
    setTimeout(function() { chrome.notifications.clear(ID); }, 3000);
}

function checkNotifications(xhr) {
    if( xhr.readyState == 4 ) {
        if(xhr.status == 200) {
            n = xhr.responseText;
            if(parseInt(n) == 0) {
                chrome.browserAction.setBadgeText({ text: "" });
                note("Новых уведомлений нет", "");
            } else {
                chrome.browserAction.setBadgeText({ text: n });
                note("Новые уведомления: " + n, "");
            };
        };
    };
};

function onCreated(tab) {}

function onError(error) {
  note("Ошибка!", "Не удалось открыть вкладку с уведомлениями");
}

chrome.browserAction.onClicked.addListener(function() { notificount(checkNotifications); });
chrome.commands.onCommand.addListener(function(command) {
    if (command == "open-lor-notifications") {
        var creating = chrome.tabs.create({
          url:"https://www.linux.org.ru/notifications"
        });
        creating.then(onCreated, onError);
    }
});
