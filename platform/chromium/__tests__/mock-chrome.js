'use strict';
const path = require('path');
const LocalStorage = require('node-localstorage').LocalStorage;
// noinspection JSAnnotator
window.localStorage = new LocalStorage(path.resolve(__dirname, '__localstore__'));
const chrome = { // jshint ignore:line
    browserAction: {
        onClicked: {
            addListener: jest.fn()
        }
    },
    runtime: {
        getURL: jest.fn(),
        getManifest: jest.fn(() => ({
            name: 'blah',
            content_scripts: [
                {
                    'matches': [
                        'http://*/*',
                        'https://*/*'
                    ],
                    'js': [
                        'js/contentscript.js'
                    ],
                    'run_at': 'document_start',
                    'all_frames': true
                }
            ]
        }))
    },
    tabs: {
        query: jest.fn(),
        reload: jest.fn(),
        create: jest.fn()
    },
    windows: {
        getAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    },
    webRequest: {},
    storage: {
        local: {}
    },
    i18n: {
        getMessage: jest.fn()
    }
};

window.chrome = chrome;
