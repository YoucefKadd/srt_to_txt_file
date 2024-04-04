import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from 'primereact/inputtext';



const SubtitleCleaner = () => {
    const [inputText, setInputText] = useState('');
    const [nameFile, setNameFile] = useState('');

    const cleanAndSplitSubtitles = () => {
        const lines = inputText.split("\n");
        let cleanedText = "";

        for (let i = 0; i < lines.length; i++) {
            // Exclure les lignes de timecode et les numéros de ligne
            if (!/^\d+\s*$/.test(lines[i]) && !/^\d{2}:\d{2}:\d{2},\d{3}\s*-->\s*\d{2}:\d{2}:\d{2},\d{3}\s*$/.test(lines[i])) {
                cleanedText += lines[i] + "\n";
            }
        }

        // Divise le texte nettoyé en phrases
        const sentences = cleanedText.match(/[^.!?]+[.!?]+/g);
        const chunkSize = 10000;
        const textChunks = [];
        let currentChunk = "";

        for (let i = 0; i < sentences.length; i++) {
            const potentialChunk = currentChunk + sentences[i];
            if (potentialChunk.length <= chunkSize) {
                currentChunk = potentialChunk;
            } else {
                if (currentChunk.length > 0) {
                    textChunks.push(currentChunk);
                    currentChunk = sentences[i];
                } else {
                    // Si la phrase elle-même dépasse la limite de la tranche, la diviser en morceaux
                    const words = sentences[i].split(' ');
                    let tempChunk = '';
                    for (let j = 0; j < words.length; j++) {
                        const tempPotentialChunk = tempChunk + words[j] + ' ';
                        if (tempPotentialChunk.length <= chunkSize) {
                            tempChunk = tempPotentialChunk;
                        } else {
                            textChunks.push(tempChunk);
                            tempChunk = words[j] + ' ';
                        }
                    }
                    if (tempChunk.length > 0) {
                        textChunks.push(tempChunk);
                    }
                }
            }
        }

        // Ajouter la dernière tranche
        if (currentChunk.length > 0) {
            textChunks.push(currentChunk);
        }

        // Télécharger chaque tranche en tant que fichier texte séparé
        textChunks.forEach((chunk, index) => {
            downloadFile(chunk, `subtitle_chunk_${index + 1}.txt`);
            downloadFile(chunk, `${nameFile}_${index + 1}.txt`);
        });
    };

    const downloadFile = (text, filename) => {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div style={{ margin: '2em 2em' }}>
            <p>Insérer le contenu du fichier .srt ici :</p>
            <div className="card flex justify-content-center">
                <InputTextarea value={inputText} onChange={(e) => setInputText(e.target.value)} rows={15} cols={30} />
            </div>
            <p>Insérer le préfixe du nom des fichiers :</p>
            <div className="card flex justify-content-center" style={{ margin: '1em 0' }} >
                <InputText value={nameFile} onChange={(e) => setNameFile(e.target.value)}
                    type="text" className="p-inputtext-lg" placeholder="Titre des fichiers"
                />
            </div>
            <div className="card flex justify-content-center" style={{ margin: '1em 0', width: '' }}>

                <Button label="Nettoyer et Diviser" icon="pi pi-check" onClick={cleanAndSplitSubtitles} style={{ width: '20em' }}/>
            </div>
        </div>
    );
};

export default SubtitleCleaner;