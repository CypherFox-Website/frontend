// src/components/cards/LabEditor.jsx
import Editor from "@monaco-editor/react";

export default function LabEditor({
    value,
    language = "python",
    onChange,
    height = "360px",
}) {
    const handleChange = (value) => {
        onChange?.(value ?? "");
    };

    const handleMount = (editor, monaco) => {
        monaco.editor.defineTheme("cypherfox-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [
                { token: "", foreground: "F9F4F4", background: "06040E" },
                { token: "keyword", foreground: "cb4b16", fontStyle: "bold" },
                { token: "identifier", foreground: "b58900" },
                { token: "string", foreground: "468966" },
                { token: "comment", foreground: "586e75", fontStyle: "italic" },
                { token: "number", foreground: "b89859" },
            ],
            colors: {
                "editor.background": "#06040E",
                "editor.foreground": "#F9F4F4",
                "editor.lineHighlightBackground": "#0F0B1F",
                "editorLineNumber.foreground": "#5A4E80",
                "editorLineNumber.activeForeground": "#F9F4F4",
                "editorCursor.foreground": "#E78F41",
                "editor.selectionBackground": "#13824555",
                "editor.inactiveSelectionBackground": "#13824533",
                "editor.focusedStackFrameHighlightBorder": "#E78F41",
                "editorWidget.border": "#E78F4188",
                "minimap.background": "#06040E",
            },
        });

        monaco.editor.setTheme("cypherfox-dark");
    };

    return (
        <div className="cf-lab-monaco-wrapper">
            <Editor
                height={height}
                language={language}
                value={value}
                theme="cypherfox-dark"
                options={{
                    fontFamily: "Menlo, Monaco, 'Courier New', monospace",
                    fontSize: 14,
                    minimap: { enabled: false },
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    cursorBlinking: "smooth",
                }}
                onChange={handleChange}
                onMount={handleMount}
            />
        </div>
    );
}