/* 
1. Este archivo solo sirve para hashear una contraseña
2. Despues de definir la contraseña abra la terminal y escriba node "hash.js"
*/
const bcrypt = require('bcrypt');

async function generarHash() {
    const hash = await bcrypt.hash('hola', 10);
    console.log('HASH:', hash);
}

generarHash();