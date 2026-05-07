import CryptoJS from 'crypto-js';

// Constant signature to identify our "Spy" files
const MAGIC_HEADER = "1010101011110000";

export const encryptText = (text, password) => {
  return CryptoJS.AES.encrypt(text, password).toString();
};

export const decryptText = (ciphertext, password) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, password);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText || null;
  } catch (e) {
    return null; 
  }
};

export const textToBinary = (text) => {
  return text.split('').map(char => {
    return char.charCodeAt(0).toString(2).padStart(8, '0');
  }).join('');
};

export const hideDataInPixels = (pixelData, binaryMsg) => {
  // Prepend header and append null terminator
  const messageWithEnd = MAGIC_HEADER + binaryMsg + '00000000'; 
  
  for (let i = 0; i < messageWithEnd.length; i++) {
    if (messageWithEnd[i] === "1") {
      pixelData[i] = pixelData[i] | 1;
    } else {
      pixelData[i] = pixelData[i] & ~1;
    }
  }
  return pixelData;
};

export const extractDataFromPixels = (pixelData) => {
  let binaryMsg = "";
  for (let i = 0; i < pixelData.length; i++) {
    binaryMsg += (pixelData[i] & 1).toString();
    
    // Check for "Spy" signature at bit 16
    if (binaryMsg.length === 16 && binaryMsg !== MAGIC_HEADER) {
      return "ERROR_NO_PAYLOAD";
    }

    if (binaryMsg.length % 8 === 0 && binaryMsg.slice(-8) === "00000000") {
      break;
    }
  }

  if (binaryMsg === "ERROR_NO_PAYLOAD") return null;

  let text = "";
  // Slice off the header (first 16) and terminator (last 8)
  let actualContent = binaryMsg.slice(16, -8); 
  for (let i = 0; i < actualContent.length; i += 8) {
    let charCode = parseInt(actualContent.substr(i, 8), 2);
    text += String.fromCharCode(charCode);
  }
  return text;
};