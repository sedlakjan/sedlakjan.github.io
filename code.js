let total = document.getElementById('display');
let outputs = document.getElementById('output');
let buttons = document.querySelectorAll('.button-21')
let polozky = [];
const outputsText = '<p>Gratulujeme k úspešnému nákupu a vytvoreniu finančného cieľa :) Teraz si toto číslo zapíš na papier. Ďalej si budeš musieť na svoj cieľ zarobiť. Klikni na:  <a href="https://www.brigada.sk/" target="_blank">BRIGADA.SK</a> alebo <a href="https://www.profesia.sk" target="_blank">PROFESIA.SK</a> ,kde si nájdeš brigádu v tvojom okolí. Následne postupuj podľa pokynov na papieri. <br>Veľa štastia :)!</br></p>'; 

buttons.forEach(button=>{
    button.addEventListener('click',calculate);

});
function calculate(createarray) {
    createarray = this.value;
    polozky.push(createarray); 
    this.classList.toggle("button-21");
    this.disabled=true
    console.log(polozky)
}
function summary() {
    const konverziaArr = polozky.map(str =>{
        return Number(str);
}) 
    let element = 0;
for (i = 0; i < konverziaArr.length; i++) {
        element += konverziaArr[i];
}
    if (element == 0) {
        total.innerHTML='<h2><br>Oooops<br>Tvoj košík je prázdny<h2><p>Niečo si kúp a objednaj :)</p>'
    }
    else{
        total.innerText=element + ' €';
        outputs.innerHTML = outputsText;
        outputs.classList.add('fade');
    }

}

