'use strict';

describe('vAPI init', () => {
    beforeEach(() => {
        delete window.vAPI;
        // Force the require statment to re-eval the code
        jest.resetModuleRegistry();
    });

    afterEach(() => {
        // reset the overrides
        delete document.contentType;
    });

    it('bails if content type is text', () => {
        document.__defineGetter__('contentType', () => 'text/plain');
        require('../vapi');
        expect(window.vAPI).toBeUndefined();
    });

    it('bails if content type is image', () => {
        document.__defineGetter__('contentType', () => 'image/png');
        require('../vapi');
        expect(window.vAPI).toBeUndefined();
    });

    it('initializes the vAPI object if it does not exist', () => {
        require('../vapi');
        expect(vAPI).toEqual({ uBO: true });
    });

    it('does not override an existing vAPI object when uBO is true', () => {
        window.vAPI = { some: 'object', uBO: true };
        require('../vapi');
        expect(window.vAPI).toEqual({ some: 'object', uBO: true });
    });
});
