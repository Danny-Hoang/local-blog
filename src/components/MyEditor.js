import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Draft from "draft-js";

import 'draft-js/dist/Draft.css';
import './rich.css'
import { List, Map, Repeat } from 'immutable';
import MyCustomBlock from './MyCustomBlock';

const { Editor, EditorState, RichUtils, genKey, getDefaultKeyBinding, ContentBlock } = Draft;
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
        // debugger;
    }
    const onPaste = (e, data) => {
        // debugger;
    }
    const handlePlastedText = (e, data) => {
    }


    const handlePastedfiles = (e) => {
        console.log(e)
    }

    const save = () => {

    }

    console.log('rerender')


    const addNewBlockAt = (
        editorState,
        pivotBlockKey,
        newBlockType = 'unstyled',
        initialData = new Map({})
    ) => {
        const content = editorState.getCurrentContent();
        const blockMap = content.getBlockMap();
        const block = blockMap.get(pivotBlockKey);

        if (!block) {
            throw new Error(`The pivot key - ${pivotBlockKey} is not present in blockMap.`);
        }

        const blocksBefore = blockMap.toSeq().takeUntil((v) => (v === block));
        const blocksAfter = blockMap.toSeq().skipUntil((v) => (v === block)).rest();
        const newBlockKey = genKey();

        const newBlock = new ContentBlock({
            key: newBlockKey,
            type: newBlockType,
            text: '',
            characterList: new List(),
            depth: 0,
            data: initialData,
        });

        const newBlockMap = blocksBefore.concat(
            [[pivotBlockKey, block], [newBlockKey, newBlock]],
            blocksAfter
        ).toOrderedMap();

        const selection = editorState.getSelection();

        const newContent = content.merge({
            blockMap: newBlockMap,
            selectionBefore: selection,
            selectionAfter: selection.merge({
                anchorKey: newBlockKey,
                anchorOffset: 0,
                focusKey: newBlockKey,
                focusOffset: 0,
                isBackward: false,
            }),
        });

        return EditorState.push(editorState, newContent, 'split-block');
    };

    const onAddCustomBlock = () => {
        const selection = editorState.getSelection();

        setEditorState(addNewBlockAt(
            editorState,
            selection.getAnchorKey(),
            'MyCustomBlock'
        ))
    }
    const blockRenderMap = new Map({
        'MyCustomBlock': {
            // element is used during paste or html conversion to auto match your component;
            // it is also retained as part of this.props.children and not stripped out
            element: 'section',
            wrapper: <MyCustomBlock />,
        }
    });
    // keep support for other draft default block types and add our myCustomBlock type
    const extendedBlockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap);


    const editorRef = React.useRef(null);

    const focus = () => {
        console.log(editorRef)
    }
    let className = "RichEditor-editor";
    return (
        <div className="RichEditor-root">
            {/* <BlockStyleControls
                editorState={editorState}
                onToggle={toggleBlockType}
            />
            <InlineStyleControls
                editorState={editorState}
                onToggle={toggleInlineStyle}
            />
            <button onClick={onAddCustomBlock}>Add custom block</button> */}
            <div className={className} onClick={focus}>
                {/* <textarea 
                    value={value}
                    onPaste={handlePaste}
                />

                <div style={{ margin: '0 auto', width: '50vw'}} dangerouslySetInnerHTML={createMarkup(value)}></div> */}

                <Editor
                    // blockStyleFn={getBlockStyle}
                    customStyleMap={styleMap}
                    editorState={editorState}
                    handleKeyCommand={handleKeyCommand}
                    keyBindingFn={mapKeyToEditorCommand}
                    onPaste={onPaste}
                    blockRenderMap={extendedBlockRenderMap}
                    handleBeforeInput={handleBeforeInput}
                    editorState={editorState}
                    handlePastedFiles={handlePastedfiles}
                    onChange={setEditorState}
                    handlePastedText={handlePlastedText}
                    ref={editorRef}
                />
            </div>
        </div>
    )

}

export default MyEditor;