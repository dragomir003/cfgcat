import React from "react";

import './Files.css';

export type File = string;

export interface FilesProps {
    files: File[];
    removeFile: (_: number) => void;
}

export const Files: React.FC<FilesProps> = ({files, removeFile}) => {

    return (
        <ul className="list">
            { files.map((file, idx) => <FileComp key={idx} name={file} remove={() => removeFile(idx)}/>) }
        </ul>
    );
};

interface FileCompProps {
    name: string;
    remove: () => void;
}

const FileComp: React.FC<FileCompProps> = ({name, remove}) => {
    return (
        <li className="list-item">
            <div>
                <span className="name">{name}</span>
                <button onClick={_ => remove()} className="deleter"> 🗑️ </button>
            </div>
        </li>
    );
}
