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

    const voittoKuvat = ['🍒', '🍋', '🍊', '🍇', '7'];
    const voittoKertoimet = {
        '🍒': 6,
        '🍋': 5,
        '🍊': 4,
        '🍇': 3,
        '7': 10
    };

    let voitto = false;

    for (const kuva of voittoKuvat) {
        const esiintymat = kuvat.filter(k => k === kuva).length;
        if (esiintymat === 4) {
            voitto = true;
            saldo += voittoKertoimet[kuva] * valittuPanos;
            break; // Voitto on löydetty, ei tarvitse tarkistaa muita symboleita
        } else if (esiintymat === 3 && kuva === '7') {
            voitto = true;
            saldo += voittoKertoimet[kuva] * valittuPanos;
        }
    }

    if (voitto) {
        saldoElementti.textContent = saldo;
        näytäVoittoIlmoitus(`Voitit ${voittoKertoimet[kuvat[0]] * valittuPanos} €!`);
    } else {
        tyhjennäVoittoIlmoitus();
    }

    return voitto;
}


pelaaButton.addEventListener('click', () => {

    saldo -= valittuPanos;
    saldoElementti.textContent = saldo;

    // Pyöritä rullat
    pyoraytaRullat();
    const voitto = tarkistaVoitto();
    if (voitto) {
        return;
    }
    // Voiton tarkistus tapahtuu 1 sekunti pyörimisen jälkeen
    if (kuvat.filter(k => k === '7').length === 4) {
        saldo += 10 * valittuPanos;
        saldoElementti.textContent = saldo;
        return true;
    } else if (kuvat.filter(k => k === '🍒').length === 4) {
        saldo += 6 * valittuPanos;
        saldoElementti.textContent = saldo;
        return true;
    } else if (kuvat.filter(k => k === '🍋').length === 4) {
        saldo += 5 * valittuPanos;
        saldoElementti.textContent = saldo;
        return true;
    } else if (kuvat.filter(k => k === '🍊').length === 4) {
        saldo += 4 * valittuPanos;
        saldoElementti.textContent = saldo;
        return true;
    } else if (kuvat.filter(k => k === '🍇').length === 4) {
        saldo += 3 * valittuPanos;
        saldoElementti.textContent = saldo;
        return true;
    } else if (kuvat.filter(k => k === '7').length === 3) {
        saldo += 5 * valittuPanos;
        saldoElementti.textContent = saldo;
        return true;
    }

    return false;

});

const lukitsePainikkeet = document.querySelectorAll('.lukitse');

lukitsePainikkeet.forEach((painike, indeksi) => {
    painike.addEventListener('click', () => {
        lukitutRullat[indeksi] = !lukitutRullat[indeksi];
        rullaElementit[indeksi].style.backgroundColor = lukitutRullat[indeksi] ? 'lightgray' : 'white';

        // Päivitä "Lukitse" ja "Avaa" -tekstit erikseen
        const tilaElement = painike.querySelector('.tila');
        if (lukitutRullat[indeksi]) {
            tilaElement.textContent = "Avaa"; // Muutettu Lukitse -> Avaa
        } else {
            tilaElement.textContent = "Lukitse"; // Muutettu Avaa -> Lukitse
        }
    });
});


const panosPainikkeet = document.querySelectorAll('.panos-painike');

panosPainikkeet.forEach((painike) => {
    painike.addEventListener('click', () => {
        valittuPanos = parseInt(painike.getAttribute('data-panos'));
        panosElementti.textContent = valittuPanos + '€';
    });
});