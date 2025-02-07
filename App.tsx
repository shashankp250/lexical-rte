/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListNode, ListItemNode } from '@lexical/list';
import { EditorState, LexicalEditor } from 'lexical';
import { useEffect, useState } from 'react';

import EditorTheme from './EditorTheme';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import TableCellResizer from './plugins/TableCellResizer';
import TableHoverActionsPlugin from './plugins/TableHoverActionsPlugin';
import { MaxLengthPlugin } from './plugins/MaxLengthPlugin';

const initialConfig = {
  editorState: undefined,
  namespace: 'Editor',
 nodes: [TableNode, TableCellNode, TableRowNode, ListNode, ListItemNode],
  // Handling of errors during update
  onError(error: Error) {
    console.log(error);
    throw error;
  },
  // The editor theme
  theme: EditorTheme,
};

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

export default function App() {
  //const isEditable = useLexicalEditable();
  //const [editor] = useLexicalComposerContext();
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  //const [activeEditor, setActiveEditor] = useState(editor);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <ToolbarPlugin />

        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <div className="editor-scroller">
                <div className="editor" ref={onRef}>
                  <ContentEditable className="editor-input" />
                </div>
              </div>
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <MaxLengthPlugin maxLength={200} />
          <TabIndentationPlugin maxIndent={7} />
          <HistoryPlugin />
          <TablePlugin />
          <TableCellResizer />
          {floatingAnchorElem && (
            <>
              <TableHoverActionsPlugin anchorElem={floatingAnchorElem} />
            </>
          )}
        </div>
      </div>
    </LexicalComposer>
  );
}
