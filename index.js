const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputFolder = './input_images'; // Den aktuelle mappe, hvor scriptet og billederne ligger
const outputFolder = '.'; // Mappen til outputbilleder

// Sørg for, at output-mappen eksisterer
if (!fs.existsSync(outputFolder)){
    fs.mkdirSync(outputFolder);
}

// Læs alle filer i input-mappen
fs.readdir(inputFolder, (err, files) => {
    if (err) {
        console.error('Kunne ikke læse mappen:', err);
        return;
    }

    files.forEach(file => {
        const inputFilePath = path.join(inputFolder, file);
        const outputFilePath = path.join(outputFolder, file);

        // Tjek om filen er et billede (forenklet tjek baseret på filtypenavn)
        if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
            // Brug sharp til at læse billedet
            sharp(inputFilePath)
                .metadata()
                .then(metadata => {
                    const size = Math.max(metadata.width, metadata.height);

                    // Skaler billedet og indsæt det på en hvid kvadratisk baggrund
                    return sharp(inputFilePath)
                        .resize(size, size, {
                            fit: 'contain',
                            background: { r: 255, g: 255, b: 255, alpha: 1 }
                        })
                        .toFile(outputFilePath);
                })
                .then(() => {
                    console.log(`Billedet ${file} er blevet ændret til et kvadratisk format og gemt i output-mappen.`);
                })
                .catch(err => {
                    console.error(`Fejl ved behandling af billedet ${file}:`, err);
                });
        } else {
            console.log(`Fil ${file} springes over, da den ikke er et billede.`);
        }
    });
});
