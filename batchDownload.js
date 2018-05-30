/**
 * Created by Hammer on 30-May-18.
 */

function massDownloadSetup() {
    var enabled = false;

    var resolutionHtml = '<select id="massDownloadResolution"><option value="480p">480p</option><option value="720p">720p</option><option value="1080p">1080p</option></select>';
    var locationHtml = '<select id="massDownloadLocation"><option value="Magnet">Magnet</option><option value="Torrent">Torrent</option><option  value="UL">UL</option><option value="FU">FU</option><option value="UF">UP</option></select>';
    var downloadHtml = '<a href="#" id="massDownloadGo">Download Selected <span id="massDownloadCount"></span></a>';
    var hintHtml = '<a href="#" id="massDownloadControl" style="color: #ff0000;">Mass Download: Disabled</a>';

    var episodeContainerEl = jQuery('.episodecontainer');
    episodeContainerEl.prev().after(hintHtml + ' ' + resolutionHtml + ' ' + locationHtml + ' ' + downloadHtml);

    var countEl = jQuery('#massDownloadCount');

    var controlEl = jQuery('#massDownloadControl');
    controlEl.click(function (e) {
        e.preventDefault();

        if (enabled) {
            enabled = false;
            controlEl.css('color', '#ff0000');
        } else {
            enabled = true;
            controlEl.css('color', '#00aa00');
        }

        controlEl.html('Mass Download: ' + (enabled ? 'Enabled' : 'Disabled'));
    });

    var downloadGoEl = jQuery('#massDownloadGo');
    downloadGoEl.click(function (e) {
        e.preventDefault();

        var selectedForDownload = episodeContainerEl.find('.selected-for-download');

        if (selectedForDownload.length == 0) {
            alert('You must select at least 1 episode for download');
        }

        var resolution = jQuery('#massDownloadResolution').val();
        var location = jQuery('#massDownloadLocation').val();
        var links = [];

        // console.log(resolution);
        // console.log(location);

        var hasEmptyLinks = false;

        jQuery.each(episodeContainerEl.find('.selected-for-download'), function (idx, val) {
            var id = jQuery(val).closest('tr').attr('id');

            var el = episodeContainerEl.find('.' + id + '-' + resolution).find('.dl-link a:contains("' + location + '")');


            if (el.attr('href') == undefined) {
                hasEmptyLinks = true;
            } else {
                links.push(el.attr('href'));
            }
        });

        if (hasEmptyLinks) {
            alert('One or more of the episodes do not have valid links. Pick a different download location. Sorry :(');
        }

        // console.log(links);

        chrome.runtime.sendMessage({"msg": "download", "links": links});
    });


    var lastHoverEl = null;
    jQuery('.hs-shows').mousemove(function (e) {
        if (e.buttons == 0 || enabled == false) {
            return;
        }

        e.preventDefault();

        if (e.target == lastHoverEl) {
            return;
        }
        lastHoverEl = e.target;

        var targetEl = jQuery(e.target);
        if (targetEl.hasClass('rls-label')) {
            if (targetEl.hasClass('selected-for-download')) {
                targetEl.css('background-color', '');
                targetEl.removeClass('selected-for-download');
            } else {
                targetEl.css('background-color', 'orange');
                targetEl.addClass('selected-for-download');
            }
        }

        var count = episodeContainerEl.find('.selected-for-download').length;
        countEl.html(count);
    });
}

massDownloadSetup();
