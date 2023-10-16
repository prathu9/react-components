import Editor from "@monaco-editor/react"

export const MonacoEditor = () => {
    return(
        <Editor 
            height="90vh"
            defaultLanguage="javascript"
            defaultValue="no code"
        />
    )
}