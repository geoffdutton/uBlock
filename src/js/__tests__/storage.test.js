'use strict';
const fs = require('fs');
const path = require('path');
const stevenBlackRaw = fs.readFileSync(path.resolve(__dirname, 'steven_black_example_hosts.txt'), 'utf8');
window.µBlock = {}; // jshint ignore:line
// I can't type µBlock...
const ub = µBlock;

describe('storage', () => {
    beforeAll(() => {
        // self executing .saveLocalSettings
        // @TODO As this gets bigger, move it to a common file
        window.vAPI = {
            setTimeout: jest.fn(),
            storage: {
                get: jest.fn(),
            }
        };
        // Mock these out
        ub.staticNetFilteringEngine = { compile: jest.fn() };
        ub.staticExtFilteringEngine = { compile: jest.fn() };
        // Need CompiledLineWriter
        require('../utils');
        require('../storage');
    });

    it('self executes hidden settings', () => {
        expect(vAPI.storage.get).toHaveBeenCalledWith(
            [ 'hiddenSettings', 'hiddenSettingsString'],
            expect.any(Function)
        );
        expect(vAPI.setTimeout).toHaveBeenCalledWith(expect.any(Function), 4 * 60 * 1000);
    });

    describe('compileFilters()', () => {
        it('handles an empty string', () => {
            expect(ub.compileFilters('  ')).toBe('');
        });

        // Test for https://github.com/gorhill/uBlock/commit/f64d703ba0a2baa9c8366f05117078380675189e
        it('parses Steven Black\'s hosts files correctly', () => {
            const result = ub.compileFilters(stevenBlackRaw);
            expect(result).toBe('');

            // We want to ignore these
            ['ip6-localhost', 'ip6-loopback', 'ff00::0 ip6-mcastprefix', '# Date: May 08 2018'].forEach(arg => {
                expect(ub.staticNetFilteringEngine.compile)
                    .not.toHaveBeenCalledWith(arg, expect.any(Object));
            });

            ['1493361689.rsc.cdn77.org', '30-day-change.com'].forEach(arg => {
                expect(ub.staticNetFilteringEngine.compile)
                    .toHaveBeenCalledWith(arg, expect.any(Object));
            });
        });
    });
});
