import React, { useState } from 'react'
import RichTextEditor from './RichTextEditor'
import { EditorState } from 'lexical'

function App() {
  const [editorState, setEditorState] = useState<EditorState | null>(null);

  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Rich Text Editor</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <RichTextEditor value={editorState} onChange={handleEditorChange} />
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Editor State:</h2>
          <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96 text-sm">
            {JSON.stringify(editorState, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default App