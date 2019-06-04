const Promise = require('bluebird');
const anpr = Promise.promisifyAll(require('node-openalpr'));
const axios = require('axios);
const fs = require('fs')
                      
module.exports = {
  getNumberPlate: async (filePath) => {
    //anpr.Start(null, null, null, null, 'eu');

    let out;

    try {
      let image = fs.readFileSync(filePath, { encoding: 'base64' });

      out = await axios.post("https://api.openalpr.com/v2/recognize_bytes?recognize_vehicle=1&country=gb&secret_key=" + "sk_4ac6c9248e64083525976471",
                            image)
      // anpr.IdentifyLicenseAsync(filePath);
    } catch (e) {
      throw e;
    }

    if (!out.results.length) {
      throw new Error('Number plate not found');
    }

    const plate = out.results[0].plate;
    let parts = plate.split('');

    parts = parts.map((part) => {
      if (part === 'I') {
        return '1';
      }

      if (part === 'Q') {
        return 'O';
      }

      return part;
    });

    return parts.join('');
  },
}
