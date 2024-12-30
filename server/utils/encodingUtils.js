export function strToBase64(inputString) {
    // Convert the string to a Buffer and then to Base64
    const base64String = Buffer.from(inputString, 'utf-8').toString('base64');
    return base64String;
}

export function base64ToStr(base64String) {
    // Convert the Base64 string to a Buffer and then decode it to a string
    const decodedString = Buffer.from(base64String, 'base64').toString('utf-8');
    return decodedString;
}

