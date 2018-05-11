'use strict';

describe('dynamic-net-filtering', () => {
    let ub;

    beforeAll(() => {
        // we want fresh mocks for each test
        window.µBlock = {};
        ub = window.µBlock;
        ub.URI = {};
        require('../dynamic-net-filtering');
    });

    it('attaches Firewall to ublock', () => {
        expect(ub.Firewall).toBeInstanceOf(Function);
        expect(ub.sessionFirewall).toBeInstanceOf(ub.Firewall);
        expect(ub.permanentFirewall).toBeInstanceOf(ub.Firewall);
    });

    describe('validateRuleParts()', () => {
        let fw;

        beforeEach(() => {
            fw = new ub.Firewall();
        });

        it('validates a proper rule', () => {
            const rule = ['behind-the-scene', '*', 'inline-script', 'noop'];
            expect(fw.validateRuleParts(rule)).toBe(rule);
        });

        it('discards rules with invalid hostnames', () => {
            const invalids = [
                ['bad host', '*', 'inline-script', 'noop'],
                ['*', 'bad host', '*', 'noop'],
                // part 1 or part 2 must be a *
                ['*', 'anotherhostname', 'inline-script', 'noop']
            ];

            invalids.forEach(invalid => {
                expect(fw.validateRuleParts(invalid)).toBeUndefined();
            });
        });
    });
});
