/**
 * Created by Hammer on 30-May-18.
 */
chrome.runtime.onMessage.addListener(
    function (arg, sender, sendResponse) {
        if (arg.msg != undefined && arg.msg == "download") {
            if (arg.links != undefined) {
                for (var i in arg.links) {
                    // magnet links are not downloadable
                    if (arg.links[i].indexOf('magnet') == 0) {
                        chrome.tabs.create({
                            url: arg.links[i]
                        }, function(tab) {
                            setTimeout(function(){
                                closeCompletedTabs(tab);
                            }, 1000);
                        });
                    } else {
                        chrome.downloads.download({
                            url: arg.links[i],
                            conflictAction: 'uniquify',
                        }, function (id) {
                            //console.log(id + " downloaded")
                        });
                    }
                }
            }
        }
    }
);

function closeCompletedTabs(tab) {
    if (tab.status == 'complete') {
        chrome.tabs.remove(tab.id);
    } else {
        chrome.tabs.get(tab.id, function(newTab){
            setTimeout(function(){
                closeCompletedTabs(newTab);
            }, 1000);
        });
    }
}