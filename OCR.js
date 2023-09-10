const fs = require('fs');
const path = require('path');
const { createWorker } = require('tesseract.js');

const folderPath = './photos';

fs.readdir(folderPath, async (err, files) => {
  if (err) {
    console.error('Error reading folder:', err);
    return;
  }

  const imageFiles = files.filter((file) =>
    ['.jpg', '.png'].includes(
      path.extname(file).toLowerCase()
    )
  );

  console.log('Image files in the folder:');
  console.log(imageFiles);

  const worker = createWorker();

  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');

  let i=1;

  for (const imageFile of imageFiles) {
    const imagePath = path.join(folderPath, imageFile);

    const { data: { text } } = await worker.recognize(imagePath);

    console.log('Extracted Text nr '+ i++ +' from last to first:');
    console.log(text);

    const outputPath = './OCRoutput/'+imageFile.slice(0,-3)+'txt';

    fs.writeFile(outputPath, text, (err) => {
        if (err) {
          console.error('Error writing file:', err);
        } else {
          console.log('File has been written successfully.');
        }
      });



  }

  await worker.terminate();
});



