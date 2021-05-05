import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { EditorState, Transaction } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import debounce from 'lodash-es/debounce';
import { getEditorState } from '../utils/codemirror';
import { debounceEvent } from '../utils/wc-events';

import { Lazy, Manifest, UpdateEditorPayload } from '../utils/interfaces';
import { increment } from '../utils/id';

@customElement('code-editor')
export class CodeEditor extends LitElement {
  @property({ type: String }) startManifest: Lazy<string>;

  @state()
  editorState: Lazy<EditorState>;

  @state() editorView: Lazy<EditorView>;

  @state() editorId: Lazy<string>;

  @state() editorEmitter: Lazy<EventTarget>;

  protected static editorIdGenerator = increment();

  static get styles() {
    return [
      css`
        .editor-container {
        }
      `,
    ];
  }

  constructor() {
    super();

    this.editorId = `editor-${CodeEditor.editorIdGenerator.next().value}`;

    this.addEventListener(debounceEvent, function (evt: Event) {
      const event = evt as CustomEvent<UpdateEditorPayload>;
      debounce(() => {
        this.updateEditor();
      }, 3000);
    });
  }

  firstUpdated() {
    this.updateEditor();
  }

  render() {
    return html`
      <div id=${this.editorId} class="editor-container ${this.className}"></div>
    `;
  }

  updateEditor() {
    // TODO [] of extensions
    // this.editorState.facet();
    // this.editorView.plugin

    this.editorState = getEditorState(this.startManifest, 'json');

    if (this.editorView) {
      this.editorView.setState(this.editorState);
    } else {
      this.editorView = new EditorView({
        state: this.editorState,
        root: this.shadowRoot,
        parent: this.shadowRoot.getElementById(this.editorId),
      });
    }
  }
}
