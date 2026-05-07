# Stego-Cipher v1.1

A high-security Steganography tool built with **React** and **CryptoJS**. This application allows users to hide AES-256 encrypted messages within the pixel data of PNG images using LSB (Least Significant Bit) manipulation.

## Features
- **AES-256 Encryption:** Payloads are encrypted before being hidden.
- **LSB Steganography:** Data is layered into the image without visible quality loss.
- **Protocol Verification:** Uses a 16-bit Magic Header to verify stego-payloads.
- **Cyber-Noir UI:** A responsive, high-tech dashboard built with Tailwind CSS.

##  Tech Stack
- **Frontend:** React.js, Tailwind CSS
- **Icons:** Lucide-React
- **Security:** Crypto-JS (AES Standards)
- **Processing:** HTML5 Canvas API

## How it Works
1. **Encoder:** Encrypts text -> Converts to Binary -> Modifies pixel LSBs.
2. **Decoder:** Extracts LSBs -> Verifies Magic Header -> Decrypts via Master Key.