   
let listURL = "http://api.coinlayer.com/api/list";
let accessKey = "?access_key=4d04f68f0b1bbe70e5870147f7d83ee1";

let rateURL = "https://api.coinlayer.com/api/live"

const cryptoKey = document.getElementById("cryptoKey");
const fiatKey = document.getElementById("fiatKey");
const qtyKey = document.getElementById("qtyKey");

let cryptoArr = {};

const qtyInput = '';
const cryptoInput = '';
const fiatInput = '';

const convertBtn = document.getElementById("convertBtn");

const leftCol = document.querySelector(".leftCol");
const cryptoIcon = document.getElementById("cryptoIcon");

const rightCol = document.querySelector(".rightCol");
const fiatIcon = document.getElementById("fiatIcon");

let rateAlert = document.getElementById("rateAlert");
let atRateAlert = document.getElementById("atRateAlert");

function startPage() {
fetch(listURL + accessKey)
.then(function(results) {
    return results.json();
})
.then(function(data) {
    loadList(data);
});

    function loadList (data) {
        console.log(data);
    for (syms in data.crypto) {
        let option = document.createElement("option");
        let node = document.createTextNode(data.crypto[syms].name);
        option.value = data.crypto[syms].name;
        option.appendChild(node);
        cryptoKey.appendChild(option);
    }

    for (currs in data.fiat) {
        let option = document.createElement("option");
        let node = document.createTextNode(data.fiat[currs]);
        option.value = data.fiat[currs];
        option.appendChild(node);
        fiatKey.appendChild(option);
    }

    let changedCryptoText = document.getElementById("cryptoChange");
    function listCryptoType() {
        for (syms in data.crypto) {
            if (`${data.crypto[syms].name}` == this.value){
                changedCryptoText.textContent = syms;   
            }
        }
    }
    document.getElementById("cryptoKey").onchange = listCryptoType;
    
    let changedFiatText = document.getElementById("fiatChange");
    function listFiatType() {
        for (titles in data.fiat) {
            if (`${data.fiat[titles]}` == this.value){
                changedFiatText.textContent = titles;   
            }
        }
    }
    document.getElementById("fiatKey").onchange = listFiatType;

    convertBtn.addEventListener("click", e => submitForRate(data));

    function submitForRate (data) {

        let qtyInput = qtyKey.value;
        let cryptoInput = changedCryptoText.textContent;
        let fiatInput = changedFiatText.innerText;


        fetch(rateURL + accessKey + `&target=${fiatInput}&symbols=${cryptoInput}`)
        .then(function(results) {
            return results.json();
        })
        .then(function(rateData) {
            popConvert(rateData);
        })

        function popConvert (rateData) {
            
            console.log(rateData);
            let rate = rateData.rates[`${cryptoInput}`]; 
            console.log(rate);

            let conversion = (qtyInput * rate).toFixed(2); 
            console.log(conversion);


           let cryptoAmt = document.createElement("h3");
            cryptoAmt.setAttribute("class","convertAmt");
            cryptoAmt.innerText = qtyInput;
            cryptoIcon.appendChild(cryptoAmt);
            
          
            let fiatAmt = document.createElement("h3");
            fiatAmt.setAttribute("class","convertAmt");
            fiatAmt.innerText = conversion;
            fiatIcon.appendChild(fiatAmt);
            
            
            rateAlert.innerText = `${cryptoInput}'s current rate is ${rate.toFixed(5)}`;
            atRateAlert.innerText = `Your ${qtyInput} ${cryptoInput} are worth ${conversion} ${fiatInput}s.`

        }
    }
    
}
}

startPage();