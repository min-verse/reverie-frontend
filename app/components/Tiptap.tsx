// src/Tiptap.jsx
import { EditorProvider, FloatingMenu, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ListItem from '@tiptap/extension-list-item';
import TiptapMenuBar from './TiptapMenuBar';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';

// define your extension array
const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    // TextStyle.configure({ types: [ListItem.name] }),
    StarterKit.configure({
        bulletList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
    }),
]

interface TiptapProps {
    content: String
}

// const content = '<p>Hello World!</p>'

export default function Tiptap({content}: TiptapProps) {
  return (
    <EditorProvider slotBefore={<TiptapMenuBar />} extensions={extensions} content={content}>
      <FloatingMenu>This is the floating menu</FloatingMenu>
      <BubbleMenu>This is the bubble menu</BubbleMenu>
    </EditorProvider>
  )
};