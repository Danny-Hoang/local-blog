import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Draft from "draft-js";
import axios from 'axios';
import 'draft-js/dist/Draft.css';
import './rich.css'

const { Editor, EditorState, RichUtils, getDefaultKeyBinding } = Draft;
// Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2
    }
};

function getBlockStyle(block) {
    switch (block.getType()) {
        case "blockquote":
            return "RichEditor-blockquote";
        default:
            return null;
    }
}

const StyleButton = (props) => {

    const onToggle = e => {
        e.preventDefault();
        props.onToggle(props.style);
    };

    let className = "RichEditor-styleButton";
    if (props.active) {
        className += " RichEditor-activeButton";
    }
    return (
        <span className={className} onMouseDown={onToggle}>
            {props.label}
        </span>
    );
}


const BLOCK_TYPES = [
    { label: "H1", style: "header-one" },
    { label: "H2", style: "header-two" },
    { label: "H3", style: "header-three" },
    { label: "H4", style: "header-four" },
    { label: "H5", style: "header-five" },
    { label: "H6", style: "header-six" },
    { label: "Blockquote", style: "blockquote" },
    { label: "UL", style: "unordered-list-item" },
    { label: "OL", style: "ordered-list-item" },
    { label: "Code Block", style: "code-block" }
];

const BlockStyleControls = props => {
    const { editorState } = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map(type => (
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            ))}
        </div>
    );
};

var INLINE_STYLES = [
    { label: "Bold", style: "BOLD" },
    { label: "Italic", style: "ITALIC" },
    { label: "Underline", style: "UNDERLINE" },
    { label: "Monospace", style: "CODE" }
];
const InlineStyleControls = props => {
    const currentStyle = props.editorState.getCurrentInlineStyle();

    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type => (
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            ))}
        </div>
    );
};


function MyEditor() {

    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
    );


    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState);
            return true;
        }
        return false;
    }

    const mapKeyToEditorCommand = (e) => {
        if (e.keyCode === 9 /* TAB */) {
            const newEditorState = RichUtils.onTab(
                e,
                editorState,
                4 /* maxDepth */
            );
            if (newEditorState !== editorState) {
                setEditorState(newEditorState);
            }
            return;
        }
        return getDefaultKeyBinding(e);
    }
    const toggleBlockType = (blockType) => {
        setEditorState(RichUtils.toggleBlockType(editorState, blockType));
    }
    const toggleInlineStyle = (inlineStyle) => {
        setEditorState(
            RichUtils.toggleInlineStyle(editorState, inlineStyle)
        );
    }

    const handleBeforeInput = (e, data) => {
        console.log(e)
    }
    const handlePlastedText = (e, data) => {
        console.log(e)
    }

    const [value, setValue] = useState('');
    const handlePaste = (e, data) => {
        console.log(e)
        const htmlData = e.clipboardData.getData('text/html');
        htmlData.replace(/\<body\>/,'');
        htmlData.replace(/\<\/body\>/,'');
        htmlData.replace(/\<html\>/,'');
        htmlData.replace(/\<\/html\>/,'');
        setValue(htmlData);
    }
    const handlePastedfiles = (e) => {
        console.log(e)
    }

    const save = () => {
        axios.post('/article', {
            content: value
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    function createMarkup(v) {
        return {__html: v};
      }

    const editorRef = React.useRef(null);

    const focus = () => {
        console.log(editorRef)
    }
    let className = "RichEditor-editor";
    return (
        <div className="RichEditor-root">
            <BlockStyleControls
                editorState={editorState}
                onToggle={toggleBlockType}
            />
            <InlineStyleControls
                editorState={editorState}
                onToggle={toggleInlineStyle}
            />
            <button onClick={save}>Save</button>
            <div className={className} onClick={focus}>
                <textarea 
                    value={value}
                    onPaste={handlePaste}
                />

                <div style={{ margin: '0 auto', width: '50vw'}} dangerouslySetInnerHTML={createMarkup(value)}></div>

                {/* <Editor
                    blockStyleFn={getBlockStyle}
                    customStyleMap={styleMap}
                    editorState={editorState}
                    handleKeyCommand={handleKeyCommand}
                    keyBindingFn={mapKeyToEditorCommand}
                    handleBeforeInput={handleBeforeInput}
                    editorState={editorState} 
                    handlePastedFiles={handlePastedfiles}
                    onChange={setEditorState} 
                    handlePastedText={handlePlastedText}
                    ref={editorRef}
                />; */}
            </div>
        </div>
    )

}

export default MyEditor;