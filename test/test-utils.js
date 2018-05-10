'use strict';

module.exports = {
    setUserAgent (which) {
        let uaString;
        switch (which) {
            case 'chrome_66':
                uaString = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36';
                break;
            case 'firefox':
                uaString = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:60.0) Gecko/20100101 Firefox/60.0';
                break;
            case 'firefox_mobile':
                uaString = 'Mozilla/5.0 (Android 7.0; Mobile; rv:54.0) Gecko/54.0 Firefox/54.0';
                break;

            default:
                uaString = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36';
        }

        navigator.__defineGetter__('userAgent', function () {
            return uaString;
        });
    }
};
