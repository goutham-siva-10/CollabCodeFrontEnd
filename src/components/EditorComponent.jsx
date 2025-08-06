import Editor from "@monaco-editor/react";

export default function EditorComponent({
    height,
    width,
    language,
    value,
    onChange,
    theme
}) {
    return (
        <Editor
            height={height}
            width={width}
            language={language}
            value={value}
            onChange={onChange}
            theme={theme}
        />
    );
}
