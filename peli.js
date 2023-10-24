const rullienKuvat = [
    { symbol: '🍒', kerroin: 6 },
    { symbol: '🍋', kerroin: 6 },
    { symbol: '🍊', kerroin: 4 },
    { symbol: '🍇', kerroin: 3 },
    { symbol: '7', kerroin: 10 }
];

let saldo = 100;
let valittuPanos = 1;
let lukitutRullat = [false, false, false, false];

const rullaElementit = document.querySelectorAll('.rulla');
const saldoElementti = document.getElementById('saldo');
const panosElementti = document.getElementById('panos');
const pelaaButton = document.getElementById('pelaa');

const voittoIlmoitusElementti = document.getElementById('voittoIlmoitus');

function näytäVoittoIlmoitus(teksti) {
    voittoIlmoitusElementti.textContent = teksti;
}
function tyhjennäVoittoIlmoitus() {
    voittoIlmoitusElementti.textContent = ''; // Tyhjennä voittoilmoitus
}

function arvoKuva() {
    return rullienKuvat[Math.floor(Math.random() * rullienKuvat.length)].symbol;
}

function pyoraytaRullat() {
    for (let i = 0; i < rullaElementit.length; i++) {
        if (!lukitutRullat[i]) {
            const uusiKuva = arvoKuva();
            rullaElementit[i].textContent = uusiKuva;
        }
    }
}

let kuvat;

function tarkistaVoitto() {
    kuvat = [];
    for (let i = 0; i < rullaElementit.length; i++) {
        kuvat.push(rullaElementit[i].textContent);
    }

    const voittoKuvat = ['🍒', '🍋', '🍊', '🍇', '7', '77'];
    const voittoKertoimet = {
        '🍒': 6,
        '🍋': 5,
        '🍊': 4,
        '🍇': 3,
        '7': 10,
        '77': 5
    };

    let voitto = false;
    let voittokerroin = 0

    for (const kuva of voittoKuvat) {
        const esiintymat = kuvat.filter(k => k === kuva).length;
        if (esiintymat === 4) {
            voitto = true;
            saldo += voittoKertoimet[kuva] * valittuPanos;
            break; // Voitto on löydetty, ei tarvitse tarkistaa muita symboleita
        } else if (esiintymat === 3 && kuva === '7') {
            voitto = true;
            voittokerroin = voittoKertoimet['77'];
            saldo += voittokerroin * valittuPanos;
        }
    }

    if (voitto) {
        saldoElementti.textContent = saldo;
        näytäVoittoIlmoitus(`Voitit ${voittokerroin * valittuPanos} €!`);
        
        // Nollaa rullien lukitukset
        lukitutRullat = [false, false, false, false];
        päivitäRullienTila();

        // Aseta 1 sekunnin viive rullan kuvien vaihtoon
        setTimeout(() => {
            pyoraytaRullat();
        }, 1000);
    } else {
        tyhjennäVoittoIlmoitus();
    }

    return voitto;
}

// Laske voittosumma symbolien perusteella
function laskeVoittosumma() {
    let voittosumma = 0;
    for (const kuva of voittoKuvat) {
        const esiintymat = kuvat.filter(k => k === kuva).length;
        voittosumma += voittoKertoimet[kuva] * valittuPanos * esiintymat;
    }
    return voittosumma;
}

function päivitäRullienTila() {
    rullaElementit.forEach((element, indeksi) => {
        element.style.backgroundColor = lukitutRullat[indeksi] ? 'lightgray' : 'white';
    });
}

/*function päivitäLukitsePainikkeidenTila() {
    lukitsePainikkeet.forEach((painike, indeksi) => {
        const tilaElement = painike.querySelector('.tila');
        if (lukitutRullat[indeksi]) {
            tilaElement.textContent = "Avaa";
        } else {
            tilaElement.textContent = "Lukitse";
        }
    });
}*/
function nollaaRullienLukitukset() {
    lukitutRullat = [false, false, false, false];
    päivitäRullienTila();
}
pelaaButton.addEventListener('click', () => {
    if (valittuPanos === 0) {
        alert('Valitse panos ennen pelaamista.');
        return;
    } /*toimiiko tämä kohta???*/
    
    saldo -= valittuPanos;
    saldoElementti.textContent = saldo;

    // Pyöritä rullat
    pyoraytaRullat();
    const voitto = tarkistaVoitto();

    if (voitto) {
        näytäVoittoIlmoitus(`Voitit ${laskeVoittosumma()} €!`);
        return;
    } else {
        näytäVoittoIlmoitus("Et voittanut tällä kertaa.");
    }

    // Voiton tarkistus tapahtuu 1 sekunti pyörimisen jälkeen
    if (kuvat.filter(k => k === '7').length === 4) {
        saldo += 10 * valittuPanos;
        saldoElementti.textContent = saldo;
        nollaaRullienLukitukset();
    
    } else if (kuvat.filter(k => k === '🍒').length === 4) {
        saldo += 6 * valittuPanos;
        saldoElementti.textContent = saldo;
        nollaaRullienLukitukset();
    
    } else if (kuvat.filter(k => k === '🍋').length === 4) {
        saldo += 5 * valittuPanos;
        saldoElementti.textContent = saldo;
        nollaaRullienLukitukset();
    
    } else if (kuvat.filter(k => k === '🍊').length === 4) {
        saldo += 4 * valittuPanos;
        saldoElementti.textContent = saldo;
        nollaaRullienLukitukset();
    
    } else if (kuvat.filter(k => k === '🍇').length === 4) {
        saldo += 3 * valittuPanos;
        saldoElementti.textContent = saldo;
        nollaaRullienLukitukset();
    
    } else if (kuvat.filter(k => k === '7').length === 3) {
        saldo += 5 * valittuPanos;
        saldoElementti.textContent = saldo;
        nollaaRullienLukitukset();
    
    }



});

const lukitsePainikkeet = document.querySelectorAll('.lukitse');

lukitsePainikkeet.forEach((painike, indeksi) => {
    painike.addEventListener('click', () => {
        lukitutRullat[indeksi] = !lukitutRullat[indeksi];
        rullaElementit[indeksi].style.backgroundColor = lukitutRullat[indeksi] ? 'lightgray' : 'white';
        /*päivitäLukitsePainikkeidenTila(); // Päivitä painikkeiden tekstit

        // Päivitä "Lukitse" ja "Avaa" -tekstit erikseen
        const tilaElement = painike.querySelector('.tila');
        if (lukitutRullat[indeksi]) {
            tilaElement.textContent = "Avaa"; // Muutettu Lukitse -> Avaa
        } else {
            tilaElement.textContent = "Lukitse"; // Muutettu Avaa -> Lukitse
        }*/
    });
});

const panosPainikkeet = document.querySelectorAll('.panos-painike');

panosPainikkeet.forEach((painike) => {
    painike.addEventListener('click', () => {
        valittuPanos = parseInt(painike.getAttribute('data-panos'));
        panosElementti.textContent = valittuPanos + '€';
    });
});

// Funktio asettaa alkukuvat rulliin
function asetaAlkukuvat() {
    for (let i = 0; i < rullaElementit.length; i++) {
        rullaElementit[i].textContent = rullienKuvat[i].symbol;
    }
}

// Kutsu asetaAlkukuvat() pelin alussa
asetaAlkukuvat();


