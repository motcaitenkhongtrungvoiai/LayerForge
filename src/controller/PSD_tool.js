const path = require('path')
const RipperPSD= require('../core/RipperPSD')


//test
const inputFile= path.join(__dirname,'../core/testting.psd')
const outPath = path.join(__dirname,'../../jobs')

const ripperPSD = new RipperPSD(inputFile,outPath)
//ripperPSD.smallerFile();
ripperPSD.RipperPSD()
ripperPSD.ParsePSD()