var target = 'https://www.linux.org.ru/notifications-count';
var XHR = new XMLHttpRequest();

function notificount( callback ) {
    XHR.open("GET", target, true);
    var timeout = setTimeout(() => { XHR.abort(); }, 10000);
    XHR.onreadystatechange = () => {clearTimeout(timeout); callback(XHR);};
    XHR.send(null);
};

function note(title, message) {
    browser.notifications.create({
        "type": "basic",
        //"iconUrl": browser.extension.getURL("icons/good-penguin.png"),
        "title": title,
        "message": message
    });
}

function checkNotifications( xhr ) {
    if( xhr.readyState == 4 ) {
        if(xhr.status == 200) {
            n = xhr.responseText;
            if(parseInt(n) == 0)
                note("Новых уведомлений нет", "");
            else
                note("Новые уведомления: " + n, "");
        };
    };
};

function onCreated(tab) {}

function onError(error) {
  note("Ошибка!", "Не удалось открыть вкладку с уведомлениями");
}

browser.browserAction.onClicked.addListener(() => { notificount(checkNotifications); });
browser.commands.onCommand.addListener((command) => {
    if (command == "check-lor") {
        notificount(checkNotifications);
    } else if (command == "open-lor-notifications") {
        var creating = browser.tabs.create({
          url:"https://www.linux.org.ru/notifications"
        });
        creating.then(onCreated, onError);
    }
});
