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

    updateTotal();
}

function updateTotal() {
    const suma = polozky.reduce((acc, curr) => acc + curr, 0);
    total.innerText = suma + ' €';
    cartBtn.innerHTML = `<i></i> Objednaj (${suma} €)`;

}


function summary() {
    updateTotal(); 
    const suma = polozky.reduce((acc, curr) => acc + curr, 0);
  
    if (suma === 0) {
      // Keď ešte nie je v košíku žiadna položka
      outputs.innerHTML = '<p><strong>Košík je prázdny:</strong> Vyber prosím nejaké produkty.</p>';
    } else {
      // Bežný výsledok nákupu
      outputs.innerHTML = outputsText;
    }
    
    outputs.classList.add('fade');
  }
