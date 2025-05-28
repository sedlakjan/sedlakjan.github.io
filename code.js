let total = document.getElementById('display');
let outputs = document.getElementById('output');
let buttons = document.querySelectorAll('.button-21');
let polozky = [];
let cartBtn   = document.getElementById('vysledok'); // 🚀 nový riadok


const outputsText = '<p>Gratulujeme k úspešnému nákupu a vytvoreniu finančného cieľa :) Teraz si sumu tvojho nákupu zapíš na papier. Ďalej si budeš musieť na svoj cieľ zarobiť. Klikni na: <a href="https://www.brigady.sk" target="_blank">BRIGADY.SK</a> alebo <a href="https://www.profesia.sk" target="_blank">PROFESIA.SK</a>, kde si nájdeš brigádu v tvojom okolí. Následne postupuj podľa pokynov na papieri. <br>Veľa šťastia :)!</br></p>';

buttons.forEach(button => {
    button.addEventListener('click', calculate);
});

function calculate() {
    const value = Number(this.value);
    const index = polozky.indexOf(value);

    if (index === -1) {
        // Pridaj do zoznamu
        polozky.push(value);
        this.classList.add('selected');
    } else {
        // Odstráň zo zoznamu
        polozky.splice(index, 1);
        this.classList.remove('selected');
    }
cartBtn.disabled = false;  // odblokujeme tlačidlo
objednane = false;         // resetujeme flag objednania
    updateTotal();
}

let objednane = false;  // flag, či už bolo objednané

function updateTotal() {
  const suma = polozky.reduce((acc, curr) => acc + curr, 0);
  total.innerText = suma + ' €';

  if (!objednane) {
    cartBtn.innerHTML = `<i></i> Objednaj (${suma} €)`;
  }
}

function summary() {
  const suma = polozky.reduce((acc, curr) => acc + curr, 0);

  if (suma === 0) {
    outputs.innerHTML = '<p><strong>Košík je prázdny:</strong> Vyber prosím nejaké produkty.</p>';
  } else {
    outputs.innerHTML = outputsText;

    objednane = true;
    cartBtn.innerHTML = `✅ Suma na zaplatenie: ${suma} €`;

    polozky = [];
    buttons.forEach(button => button.classList.remove('selected'));

    total.innerText = '0 €';  // nastav na nulu ručne
  }
cartBtn.disabled = true;  // zablokujeme tlačidlo
  outputs.classList.add('fade');
}