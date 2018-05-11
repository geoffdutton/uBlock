'use strict';
const TestUtils = require('../../../test/test-utils');
// right Alt + m on unix based systems => µ

const expectedChannels = [
    'popupPanel',
    'contentscript',
    'elementPicker',
    'cloudWidget',
    'dashboard',
    'loggerUI',
    'documentBlocked',
    'scriptlets',
];

describe('messaging', () => {
    let handlers = {};
    let ub;

    beforeAll(() => {
        // we want fresh mocks for each test
        window.µBlock = TestUtils.getMockedUblock();
        ub = window.µBlock;
        window.vAPI = TestUtils.getMockedVAPI();
        require('../messaging');
        // capture the call backs so we can individually test them
        vAPI.messaging.listen.mock.calls.forEach(args => {
            handlers[args[0]] = args[1];
        });
    });

    it('double check our handler setup', () => {
        expect(Object.keys(handlers)).toEqual(expectedChannels);
    });

    // This is more of a safety check for future refactor, not testing anything complex
    it('sets up channel handlers handler on revertFirewallRules', () => {
        expect(vAPI.messaging.setup).toHaveBeenCalledWith(expect.any(Function));

        // First verify it's been called no more and no less
        expect(vAPI.messaging.listen).toHaveBeenCalledTimes(expectedChannels.length);
        expectedChannels.forEach(channel => {
            expect(vAPI.messaging.listen).toHaveBeenCalledWith(channel, expect.any(Function));
        });
    });

    describe('popupPanel', () => {
        let handler;

        beforeAll(() => {
            ub.permanentFirewall = { perm: 'fw' };
            handler = handlers['popupPanel'];
        });

        it('exists', () => {
            expect(handler).toBeInstanceOf(Function);
        });

        // Let's make sure this issue doesn't resurface: https://github.com/gorhill/uBlock/issues/188
        it('removes selector from cache', done => {
            const req = {
                what: 'revertFirewallRules',
                srcHostname: 'source.com',
                desHostnames: 'desthost.com',
                tabId: 99,
            };

            handler(req, {}, () => {
                // We don't really care what these actually does, we just want make sure they are called
                // with the expected args
                expect(ub.sessionFirewall.copyRules).toHaveBeenCalledWith(
                    { perm: 'fw' },
                    'source.com',
                    'desthost.com'
                );
                expect(ub.cosmeticFilteringEngine.removeFromSelectorCache)
                    .toHaveBeenCalledWith('source.com', 'net');
                done();
            });
        });
    });
});
