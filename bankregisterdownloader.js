const xlsx = require('xlsx');
const fs = require('fs')

const outputFilename = "bankregistry.json"
const inputFilename = "bank.xlsx"

const workbook = xlsx.readFile(inputFilename);

const worksheet = workbook.Sheets[workbook.SheetNames[0]]
const arrayOfBankRegistry = xlsx.utils.sheet_to_json(worksheet);
const data = JSON.stringify(arrayOfBankRegistry, null, 2);

fs.writeFile(outputFilename, data, (err) => {
  if (err) {
    throw err
  }
  console.log(`Created bankregister file with filename ${outputFilename}`)
  fs.unlink(inputFilename, (err) => {
    if (err) {
      throw err
    }
    console.log(`Processing file ${inputFilename} deleted`)
  })
})