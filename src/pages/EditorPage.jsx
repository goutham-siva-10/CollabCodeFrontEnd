import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import api from "../utils/axiosConfig";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import './EditorPage.css';

export default function EditorPage() {
    const [content, setContent] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [output, setOutput] = useState("");
    const [stdin, setStdin] = useState("");
    const [isRunning, setIsRunning] = useState(false);

    const stompClient = useRef(null);
    const isConnected = useRef(false);
    const debounceRef = useRef(null);
    const { id } = useParams();

    useEffect(() => {
        api.get(`/documents/${id}`)
            .then(res => {
                setContent(res.data.content);
                setLanguage(res.data.language || "javascript");
            })
            .catch(err => console.error("Failed to fetch document:", err));

        const socket = new SockJS("http://localhost:8080/ws");
        const stomp = Stomp.over(socket);

        stomp.connect({}, () => {
            console.log("Connected to STOMP");
            isConnected.current = true;

            stomp.subscribe("/topic/updates", message => {
                const payload = JSON.parse(message.body);
                if (payload.documentId === id) {
                    setContent(payload.content);
                }
            });
        });

        stompClient.current = stomp;

        return () => {
            if (isConnected.current && stompClient.current) {
                stompClient.current.disconnect(() => {
                    console.log("Disconnected cleanly");
                });
            } else if (stompClient.current) {
                socket.close();
                console.log("Socket forcibly closed");
            }
        };
    }, [id]);

    const handleEditorChange = (value) => {
        setContent(value);
        if (stompClient.current && isConnected.current) {
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                stompClient.current.send("/app/edit", {}, JSON.stringify({
                    documentId: id,
                    content: value
                }));
            }, 300);
        }
    };

    const runCode = async () => {
        setIsRunning(true);
        setOutput("Running...");
        try {
            const response = await api.post("/execute", {
                language,
                code: content,
                stdin
            });
            setOutput(response.data.output);
        } catch (err) {
            const errorMessage = err.response?.data?.output || err.message || "Error executing code";
            setOutput(errorMessage);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="editor-container">
            <div className="editor-header">
                <h1>Collaborative Code Editor</h1>
                <div className="controls">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="dropdown"
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="c">C</option>
                    </select>
                    <button
                        onClick={runCode}
                        disabled={isRunning}
                        className="run-button"
                    >
                        {isRunning ? "Running..." : "Run"}
                    </button>
                </div>
            </div>

            <div className="editor-main">
                <div className="code-editor">
                    <Editor
                        height="100%"
                        width="100%"
                        language={language}
                        value={content}
                        onChange={handleEditorChange}
                        theme="vs-dark"
                        options={{
                            minimap: { enabled: false },
                            fontSize: 16,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                        }}
                    />
                </div>

                <div className="side-panel">
                    <div className="panel-section">
                        <h3>Input (STDIN)</h3>
                        <textarea
                            value={stdin}
                            onChange={(e) => setStdin(e.target.value)}
                            className="input-box"
                            rows={5}
                            placeholder="Enter input here..."
                        />
                    </div>
                    <div className="panel-section">
                        <h3>Output</h3>
                        <pre className="output-box">
                            {output || "Output will appear here..."}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
