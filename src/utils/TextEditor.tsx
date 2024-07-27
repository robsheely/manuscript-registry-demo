import '@wangeditor/editor/dist/css/style.css'

import { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
type Props = {
  placeHolder: string
  html?: string
  setHtml: (html: string) => void
}

const TextEditor = ({ placeHolder, html, setHtml }: Props) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null) // TS syntax

  const toolbarConfig: Partial<IToolbarConfig> = {
    toolbarKeys: [
      'bold',
      'underline',
      'italic',
      '|',
      'bulletedList',
      'numberedList',
      {
        key: 'group-justify',
        title: 'Justify',
        iconSvg:
          '<svg viewBox="0 0 1024 1024"><path d="M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z"></path></svg>',
        menuKeys: [
          'justifyLeft',
          'justifyRight',
          'justifyCenter',
          'justifyJustify'
        ]
      },
      {
        key: 'group-indent',
        title: 'Indent',
        iconSvg:
          '<svg viewBox="0 0 1024 1024"><path d="M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z"></path></svg>',
        menuKeys: ['indent', 'delIndent']
      },
      '|',
      'insertLink'
    ]
  }

  const editorConfig: Partial<IEditorConfig> = {
    placeholder: placeHolder,
    scroll: false,
    onBlur: (editor) => {
      setHtml(editor.getHtml())
    },
    hoverbarKeys: {}
    // other config...
  }

  // Timely destroy editor, important!
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return (
    <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: '1px solid #ccc' }}
      />
      <Editor
        defaultConfig={editorConfig}
        value={html}
        mode="simple"
        onCreated={setEditor}
        style={{ height: '200px', overflowY: 'auto' }}
      />
    </div>
  )
}

export default TextEditor
