import React, { useCallback, useEffect, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { $getRoot, $getSelection, $isRangeSelection } from 'lexical';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND } from 'lexical';
import { AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Table2, Plus } from 'lucide-react';
import {
  TableNode,
  TableCellNode,
  TableRowNode,
  $createTableNodeWithDimensions,
  $isTableNode,
  $getTableNodeFromLexicalNodeOrThrow,
} from '@lexical/table';
import {
  ListNode,
  ListItemNode
} from '@lexical/list';

const initialConfig = {
  namespace: 'RichTextEditor',
  onError: (error) => console.error(error),
  nodes: [
    TableNode,
    TableCellNode,
    TableRowNode,
    ListNode,
    ListItemNode
  ],
  theme: {
    text: {
      bold: 'font-bold',
      italic: 'italic',
      underline: 'underline',
    },
    table: 'editor-table', // Add a class for table styling
    tableCell: 'editor-table-cell', // Add a class for table cell styling
    tableRow: 'editor-table-row', // Add a class for table row styling
    list: {
      ul: 'editor-list-ul', // Add class for unordered lists
      ol: 'editor-list-ol', // Add class for ordered lists
      listitem: 'editor-list-item', // Add class for list items
    },
  },
};

const ToolbarButton = ({ onClick, children, className = '' }) => (
  <button
    onClick={onClick}
    className={`w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded ${className}`}
  >
    {children}
  </button>
);

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // Update toolbar state based on selection
  const updateToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
        setIsUnderline(selection.hasFormat('underline'));
      }
    });
  }, [editor]);

  // Listen for changes in the editor
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const handleBoldClick = useCallback(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  }, [editor]);

  const handleItalicClick = useCallback(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  }, [editor]);

  const handleUnderlineClick = useCallback(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  }, [editor]);

  const handleAlignLeft = useCallback(() => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
  }, [editor]);

  const handleAlignCenter = useCallback(() => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
  }, [editor]);

  const handleAlignRight = useCallback(() => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
  }, [editor]);

  const handleBulletList = useCallback(() => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  }, [editor]);

  const handleNumberedList = useCallback(() => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  }, [editor]);

  const handleInsertTable = useCallback(() => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows: 3, columns: 3 });
  }, [editor]);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center border-r border-gray-200 pr-2 mr-1">
        <ToolbarButton
          onClick={handleBoldClick}
          className={isBold ? 'bg-gray-200' : ''}
        >
          <span className="font-bold">B</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={handleItalicClick}
          className={isItalic ? 'bg-gray-200' : ''}
        >
          <span className="italic">I</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={handleUnderlineClick}
          className={isUnderline ? 'bg-gray-200' : ''}
        >
          <span className="underline">U</span>
        </ToolbarButton>
      </div>
      <div className="flex items-center border-r border-gray-200 pr-2 mr-1">
        <ToolbarButton onClick={handleAlignLeft}>
          <AlignLeft size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={handleAlignCenter}>
          <AlignCenter size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={handleAlignRight}>
          <AlignRight size={18} />
        </ToolbarButton>
      </div>
      <div className="flex items-center border-r border-gray-200 pr-2 mr-1">
        <ToolbarButton onClick={handleBulletList}>
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={handleNumberedList}>
          <ListOrdered size={18} />
        </ToolbarButton>
      </div>
      <div className="flex items-center">
        <ToolbarButton onClick={handleInsertTable}>
          <Table2 size={18} />
        </ToolbarButton>
      </div>
    </div>
  );
};

const TableHoverControls = () => {
  const [editor] = useLexicalComposerContext();

  const handleInsertRow = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if (selection) {
        const tableNode = $getTableNodeFromLexicalNodeOrThrow(selection.anchor.getNode());
        tableNode.insertRowAtSelection();
      }
    });
  }, [editor]);

  const handleInsertColumn = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if (selection) {
        const tableNode = $getTableNodeFromLexicalNodeOrThrow(selection.anchor.getNode());
        tableNode.insertColumnAtSelection();
      }
    });
  }, [editor]);

  return (
    <div className="table-controls">
      <div className="table-row-controls" onMouseEnter={() => console.log('Hover row')}>
        <button onClick={handleInsertRow} className="table-control-button">
          <Plus size={16} />
        </button>
      </div>
      <div className="table-column-controls" onMouseEnter={() => console.log('Hover column')}>
        <button onClick={handleInsertColumn} className="table-control-button">
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};



const RichTextEditor = ({ value, onChange }) => {
  const handleChange = (editorState) => {
    onChange(editorState);
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-1.5 border-b border-gray-200 bg-white">
          <Toolbar />
        </div>
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable 
                className="min-h-[200px] p-4 focus:outline-none" 
              />
            }
            placeholder={
              <div className="absolute top-[1.125rem] left-[1.125rem] text-gray-400">
                Enter some text...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <TableHoverControls />
        </div>
      </div>
      <HistoryPlugin />
      <OnChangePlugin onChange={handleChange} />
      <TablePlugin />
      <ListPlugin />
    </LexicalComposer>
  );
};

export default RichTextEditor;