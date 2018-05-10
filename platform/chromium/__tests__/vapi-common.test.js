'use strict';
const TestUtils = require('../../../test/test-utils');

describe('vAPI Common', () => {
    beforeEach(() => {
        // Force the require statment to re-eval the code
        jest.resetModuleRegistry();
        jest.useFakeTimers();
        TestUtils.setUserAgent();

        require('./mock-chrome');
        window.vAPI = {};
    });

    it('adds .setTimeout to vAPI', () => {
        require('../vapi-common');
        expect(typeof vAPI.setTimeout).toBe('function');
    });

    it('aliases chrome apis', () => {
        require('../vapi-common');
        expect(vAPI.getURL).toBe(chrome.runtime.getURL);
        expect(vAPI.i18n).toBe(chrome.i18n.getMessage);
        expect(vAPI.localStorage).toEqual({
            clear: expect.any(Function),
            getItem: expect.any(Function),
            setItem: expect.any(Function),
            removeItem: expect.any(Function)
        });
    });

    describe('webextFlavor', () => {
        it('sets up webextFlavor', () => {
            require('../vapi-common');
            expect(vAPI.webextFlavor).toEqual({
                major: 59,
                soup: new Set(['ublock', 'webext', 'google', 'chromium'])
            });
        });

        it('flags a dev build', () => {
            chrome.runtime.getManifest.mockReturnValue({ version: '1.1.1.1' });
            require('../vapi-common');
            expect(vAPI.webextFlavor.soup.has('devbuild')).toBe(true);
        });

        it('flags a mobile device', () => {
            TestUtils.setUserAgent('firefox_mobile');
            require('../vapi-common');
            expect(vAPI.webextFlavor.soup.has('mobile')).toBe(true);
        });

        it('flags user_stylesheet if chromium is >= 66', () => {
            TestUtils.setUserAgent('chrome_66');
            require('../vapi-common');
            expect(vAPI.webextFlavor.soup.has('user_stylesheet')).toBe(true);
        });

        it('fires webextFlavor event after 97 ms', done => {
            require('../vapi-common');
            window.addEventListener('webextFlavor', evt => {
                expect(evt.type).toBe('webextFlavor');
                done();
            });
            jest.runAllTimers();
        });

        it('calls getBrowseInfo if browser is defined', done => {
            window.browser = {
                runtime: {
                    getBrowserInfo: jest.fn(() => Promise.resolve({
                        version: '57',
                        vendor: 'Some Vendor',
                        name: 'Crazy Browser'
                    }))
                }
            };
            require('../vapi-common');
            window.addEventListener('webextFlavor', () => {
                expect(vAPI.webextFlavor.soup.has('some vendor'));
                expect(vAPI.webextFlavor.soup.has('crazy browser'));
                expect(vAPI.webextFlavor.soup.has('user_stylesheet'));
                expect(vAPI.webextFlavor.soup.has('html_filtering'));
                done();
            });
        });
    });

    describe('closePopup', () => {
        let openClose;

        beforeEach(() => {
            openClose = jest.fn();
            window.close = jest.fn();
            window.open = jest.fn(() => ({ close: openClose }));
        });

        it('opens _self and closes when not firefox', () => {
            require('../vapi-common');
            vAPI.closePopup();
            expect(window.close).not.toHaveBeenCalled();
            expect(window.open).toHaveBeenCalledWith('', '_self');
            expect(openClose).toHaveBeenCalledTimes(1);
        });

        it('calls close directly when firefox', () => {
            TestUtils.setUserAgent('firefox');
            require('../vapi-common');
            vAPI.closePopup();
            expect(window.close).toHaveBeenCalledTimes(1);
            expect(window.open).not.toHaveBeenCalled();
            expect(openClose).not.toHaveBeenCalled();
        });
    });
});
