const voittoKuvat = ['🍒', '🍋', '🍊', '🍇', '7'];

const rullienKuvat = [
    { symbol: '🍒', kerroin: 6 },
    { symbol: '🍋', kerroin: 6 },
    { symbol: '🍊', kerroin: 4 },
    { symbol: '🍇', kerroin: 3 },
    { symbol: '7', kerroin: 10 },
    ];

const voittoKertoimet = {
    '🍒': 6,
    '🍋': 5,
    '🍊': 4,
    '🍇': 3,
    '7': 10,
    '77': 5
};

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
            console.log(`Rulla ${i} pyörähti ja näyttää kuvan: ${uusiKuva}`);
            rullaElementit[i].textContent = uusiKuva;
        }
    }
    // Päivitä "Lukitse" ja "Avaa" -tekstit
    päivitäLukitseJaAvaaTekstit();
}

let kuvat;

function tarkistaVoitto() {
    kuvat = [];
    for (let i = 0; i < rullaElementit.length; i++) {
        kuvat.push(rullaElementit[i].textContent);
    }

    let voitto = false;
    let voittosumma = 0;
        
    for (const kuva of voittoKuvat) {
        const esiintymat = kuvat.filter(k => k === kuva).length;
        if (esiintymat === 4) {
            voitto = true;
            voittosumma += voittoKertoimet[kuva] * valittuPanos;
        } else if (esiintymat === 3 && kuva === '7') {
            voitto = true;
            voittosumma += voittoKertoimet['77'] * valittuPanos;
        }
    }

    if (voitto) {
        saldo += voittosumma;
        saldoElementti.textContent = saldo;
        näytäVoittoIlmoitus(`Voitit ${voittosumma} €!`);
        
        // Päivitä Lukitse-painikkeiden tekstit
        lukitsePainikkeet.forEach((painike, indeksi) => {
        const tilaElement = painike.querySelector('.tila');
        tilaElement.textContent = "Lukitse";
        });

        // Nollaa rullien lukitukset
        lukitutRullat = [false, false, false, false];
        päivitäRullienTila();

        /*// Aseta 1 sekunnin viive rullan kuvien vaihtoon
        setTimeout(() => {
            pyoraytaRullat();
        }, 1000);*/
    } else {
        näytäVoittoIlmoitus(`Et voittanut tällä kertaa!`);
    }
}

function päivitäRullienTila() {
    rullaElementit.forEach((element, indeksi) => {
        element.style.backgroundColor = lukitutRullat[indeksi] ? 'lightgray' : 'white';
        console.log(`Rullan ${indeksi} tila päivitetty: ${lukitutRullat[indeksi] ? 'Lukittu' : 'Ei lukittu'}`);

    });
}

function nollaaRullienLukitukset() {
    lukitutRullat = [false, false, false, false];
    console.log("tila ennen", lukitutRullat)
    päivitäRullienTila();
    console.log("Rullien lukitukset nollattu:", lukitutRullat);

}
pelaaButton.addEventListener('click', () => {
    /*if (valittuPanos === 0) {
        alert('Valitse panos ennen pelaamista.');
        return;
    } /*toimiiko tämä kohta???*/
    console.log("Pelaa-paniketta painettiin", lukitutRullat);

    if (valittuPanos > saldo) {
        alert('Panos ei voi olla suurempi kuin saldo.');
        return;
    }

    saldo -= valittuPanos;
    saldoElementti.textContent = saldo;

    // Pyöritä rullat
    pyoraytaRullat();
    console.log("pyöritä rullat", pyoraytaRullat)
    const voitto = tarkistaVoitto();
    console.log("Pelaa-painikkeen käsittely päättyi", lukitutRullat);
    nollaaRullienLukitukset()
    päivitäLukitseJaAvaaTekstit()

});

const lukitsePainikkeet = document.querySelectorAll('.lukitse');

lukitsePainikkeet.forEach((painike, indeksi) => {
    painike.addEventListener('click', () => {
        if (!lukitutRullat[indeksi] && lukitutRullat.filter(lukittu => lukittu).length >= 3) {
            alert('Voit lukita enintään 3 rullaa.');
            return;
        }

        lukitutRullat[indeksi] = !lukitutRullat[indeksi];
        rullaElementit[indeksi].style.backgroundColor = lukitutRullat[indeksi] ? 'lightgray' : 'white'; 
        // Päivitä "Lukitse" ja "Avaa" -tekstit

        if (!voitto) {
            lukitutRullat[indeksi] = !lukitutRullat[indeksi];
            rullaElementit[indeksi].style.backgroundColor = lukitutRullat[indeksi] ? 'lightgray' : 'white'; 
            // Päivitä "Lukitse" ja "Avaa" -tekstit
            const tilaElement = painike.querySelector('.tila');
            if (lukitutRullat[indeksi]) {
                tilaElement.textContent = "Avaa";
                console.log("avaa", lukitutRullat)
            } else {
                tilaElement.textContent = "Lukitse";
                console.log("lukitse", lukitutRullat)
            }
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

// Funktio asettaa alkukuvat rulliin
function asetaAlkukuvat() {
    for (let i = 0; i < rullaElementit.length; i++) {
        rullaElementit[i].textContent = rullienKuvat[i].symbol;
    }
    valittuPanos = 1; // Aseta panos 1€:ksi pelin alussa
    panosElementti.textContent = valittuPanos + '€';
}

// Kutsu asetaAlkukuvat() pelin alussa
asetaAlkukuvat();

function päivitäLukitseJaAvaaTekstit() {
    lukitsePainikkeet.forEach((painike, indeksi) => {
        const tilaElement = painike.querySelector('.tila');
        if (lukitutRullat[indeksi]) {
            tilaElement.textContent = "Avaa";
            console.log("avaa", lukitutRullat);
        } else {
            tilaElement.textContent = "Lukitse";
            console.log("lukitse", lukitutRullat);
        }
    });
}
