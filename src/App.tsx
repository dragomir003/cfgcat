import { useState } from "react";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { open, save } from "@tauri-apps/api/dialog"
import { homeDir } from "@tauri-apps/api/path"

import { Files, File } from "./Files"

import "./App.css";

function App() {
    let [files, setFiles] = useState<File[]>([]);

    const appendFile = async () => {
        const path = await open({
            filters: [{ name: "*", extensions: ["ecdc"] }]
        });
        if (typeof path === "string") {
            const newFiles = [...files, path];
            setFiles(newFiles);
        }
    };

    const removeFile = (idx: number) => {
        const left = files.slice(0, idx);
        const right = files.slice(idx + 1);
        setFiles(left.concat(right));
    }

    const catFiles = async () => {
        let contents = files.map(async path => await readTextFile(path, { dir: BaseDirectory.Home }));

        let c = [];
        for (let content of contents) {
            let data = await content;
            c.push(data);
        }

        const result = c.join('').replace(/\n\n+/g, '\n');

        let resultPath = await save({ defaultPath: await homeDir() });
        let endsEcdc = resultPath.match(/^.*\.ecdc$/g);
        if (endsEcdc === null || endsEcdc.length === 0)
            resultPath += ".ecdc";

        await writeTextFile(resultPath, result);

        setFiles([]);
    }

    return (
        <div className="main">
            <h1 className="title">Welcome to cfgcat</h1>

            <div className="content">
                <Files files={files} removeFile={removeFile}/>
                <button onClick={async _ => await appendFile() }>Add file</button>
                <button onClick={async _ => await catFiles() }>Save</button>
            </div>
        </div>
    );
}

export default App;
