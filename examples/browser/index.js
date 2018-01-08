/* eslint-disable import/no-extraneous-dependencies */
import 'reflect-metadata';
const { Container } = require('inversify');
import { MonacoEditorProvider} from '@theia/monaco/lib/browser';
import React from 'react';
import { render } from 'react-dom';
// eslint-disable-next-line import/no-unresolved, import/extensions
import MonacoEditor from 'react-monaco-editor';
/* eslint-enable import/no-extraneous-dependencies */

const container = new Container();
function load(raw) {
  return Promise.resolve(raw.default).then(module =>
    container.load(module)
  )
}

function start() {
  const editorProvider = container.get(MonacoEditorProvider);
  console.log(editorProvider);
}


Promise.resolve()
  .then(function () { return Promise.resolve(require('@theia/monaco/lib/browser/monaco-browser-module')).then(load) })
  .then(start).catch(reason => {
    console.error('Failed to start the frontend application.');
    if (reason) {
      console.error(reason);
    }
  });




