// SEARCH BOARD PROCESS
//PASSENGER UP DOWN CONTROLS

// Adult Controls
passengerCountCtrl(document.querySelector('.passenger-adult'));


// Child Controls
passengerCountCtrl(document.querySelector('.passenger-child'));

// Infant Controls 
passengerCountCtrl(document.querySelector('.passenger-infant'));

// Student Controls
passengerCountCtrl(document.querySelector('.passenger-student'));

function passengerCountCtrl(target){
    if(target != document.querySelector('.passenger-infant')){
        target.querySelector('.passenger-count-up').addEventListener('click', () => {
            if(totalPassenger()){
                const count = target.querySelector('.passenger-count');
                count.innerHTML = Number(count.innerHTML)+1;
                passengerInput();
                removeWM();
            }
            else{
                limitWM();
            }
        });
    }
    else{
        target.querySelector('.passenger-count-up').addEventListener('click', () => {
            const adults = document.querySelector('.passenger-adult .passenger-count');
            const infants = target.querySelector('.passenger-count');
            if(Number(adults.innerHTML) > Number(infants.innerHTML)){
                if(totalPassenger()){
                    infants.innerHTML = Number(infants.innerHTML)+1;
                    passengerInput();
                    removeWM();
                 }
                 else{
                    limitWM();
                 }
            }
            else{
                infantWM();
            }  
        });
    }
    target.querySelector('.passenger-count-down').addEventListener('click', () => {
        if(target != document.querySelector('.passenger-adult')){
            const count = target.querySelector('.passenger-count');
            if(Number(count.innerHTML) != 0){
                count.innerHTML = Number(count.innerHTML)-1;
                passengerInput();
                removeWM();
            }
        }
        else{
            const adults = target.querySelector('.passenger-count');
            const infants = document.querySelector('.passenger-infant .passenger-count');
            if(Number(adults.innerHTML)-1 < Number(infants.innerHTML)){
                if(Number(adults.innerHTML) != 0){
                    infantWM();
                }
            }
            else{
                if(Number(adults.innerHTML)> 0){
                    adults.innerHTML = Number(adults.innerHTML)-1;
                    passengerInput();
                    removeWM();
                }
            }
        }
    });
}

//  CLOSE PASSENGER TYPE BLOCK

document.querySelector('.passenger-btn').addEventListener('click', () => {
    closePassengerType();
});

document.querySelector('#board-close-btn').addEventListener('click', () => {
    closePassengerType();
});

// PASSENGER COUNT CONTROLS  HELPED FUNCS

function passengerInput(){
    let target = document.querySelector('.passenger-num span:first-child');
    let total = passengerCounts();
    if(total == 0){
        target.textContent = 1;
    }
    else{
        target.textContent = total;
    }
}

function totalPassenger(){
    let total = passengerCounts(); 
    if(total < 7 && total > -1) return true;
}

function passengerCounts(){
    let total = 0;
    document.querySelectorAll('.passenger-types .passenger-count').forEach(p => {
        total += Number(p.innerHTML);
    });
    return total;
}

// Warning Message Controls
function limitWM(){
    document.querySelector('.ps-type-warning-message').style.display = "block";
    document.querySelector('.ps-type-warning-message').textContent = 'At most 7 seats can be booked.';
}

function infantWM(){
    document.querySelector('.ps-type-warning-message').style.display = "block";
    document.querySelector('.ps-type-warning-message').textContent = 'The numbers of infant and adult to travel should be equal.';
}

function removeWM(){
    document.querySelector('.ps-type-warning-message').style.display = "none";
    document.querySelector('.ps-type-warning-message').textContent = '';
}

// CLOSE İNPUT COUNT

function closePassengerType(){
    document.querySelector('.passenger-types').classList.toggle('display-block');
    if(passengerCounts() == 0){
        document.querySelector('.passenger-adult .passenger-count').innerHTML = "1";
    }
}

// CALENDAR CONTROLS
//DEPARTURE
const months =["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

document.querySelector('#date-departure').placeholder = new Date().getDate() + " " + months[new Date().getMonth()] + "," + new Date().getFullYear();

$(function() {
    $('#date-departure').datepicker({
        autoclose: true,
        todayHighlight: true,
        format: "yy-dd-mm",
        minDate: 0,
        clearBtn: true,
        multidate: false,
        multidateSeparator: ",",
        toggleActive: true,
        onSelect: function(selectedDate) {
            const departure = new Date(selectedDate);
            departure.setDate(departure.getDate() + 1);
            $('#date-return').datepicker('option', 'minDate', departure);
          }
      
    });
});

//RETURN
$(function() {
    $('#date-return').datepicker({
        autoclose: true,
        todayHighlight: true,
        format: "yy-dd-mm",
        minDate: 0,
        clearBtn: true,
        multidate: false,
        multidateSeparator: ",",
        toggleActive: true
    });
});

// ONE-WAY AND RETURN RADİOS

document.querySelector('#one-way').addEventListener('change', (e) => {
    if(e.target.checked){
        document.querySelector('#date-return').disabled = true;
    }
});

document.querySelector('#round-trip').addEventListener('change', (e) => {
    if(e.target.checked){
        document.querySelector('#date-return').disabled = false;
    }
});


// FETCHİNG AİRPORTS AND PUT IN INPUT

suggesInput(document.querySelector('.flight-from'));
suggesInput(document.querySelector('.flight-to'));

function suggesInput(target){
    const inputFrom = target.querySelector('input');
    inputFrom.addEventListener('keyup', async(e) => {
        const suggests = target.querySelector('.suggest-airports');
        if(e.target.value.length >= 3){
            let data = [];
            data = await getAirports(e.target.value);
            if(data.length == 0 || data == undefined) {
                suggests.style.display = "none";
                return;
            }
            else suggests.style.display = "flex";
            suggests.innerHTML = "";
            for(let i=0; i<4; i++){
                if(data[i]?.state != undefined && data[i]?.name){
                    suggests.innerHTML += `<span> ${data[i].name}, ${data[i].state}</span>`;
                }
            }
            select(target);
        }
        else{
            suggests.style.display = "none";
            suggests.innerHTML = "";    
        }
    });
}

function select(target){
    target.querySelectorAll('.suggest-airports span').forEach(elem => {
        elem.addEventListener('click', () => {
            target.querySelector('input').value = elem.innerHTML;
            target.querySelector('.suggest-airports').style.display = "none";
            if(target == document.querySelector('.flight-from')){
                target.querySelector('input').blur();
                document.querySelector('.flight-to input').focus();
            }
            else{
                document.querySelector('#date-departure').focus();
            }
        });
    })
}

async function getAirports(param){
    const apiUrl = `http://localhost:3000/airports${param}`;
    try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
            throw new Error('HTTP hatası: ' + response.status);
        }
        const data = await response.json();
        return data;
      } catch (error) {
            throw new Error('Veri alınamadı: ' + error.message);
      }
}

// CREATE FEED CARDS

document.querySelector('#search-btn').addEventListener('click', () => {
    document.querySelector('.result-container').innerHTML = "";
    const departure = document.querySelector('.flight-from input').value.split(', ')[1];
    const arrival = document.querySelector('.flight-to input').value.split(', ')[1];
    feedGenerate(departure, arrival);
});

function feedGenerate(departure, arrival){
    document.querySelector('.result-container').innerHTML +=
    cardGenerate("06:00", "09:00", departure,arrival, "ekonomi", "10 Kg", "TK 260", 
                 "Directly", "3sa", "220 €", "THY", );

    document.querySelector('.result-container').innerHTML +=
    cardGenerate("16:00", "19:00", departure,arrival, "ekonomi", "15 Kg", "TK 269", 
                "Directly", "3sa", "259 €", "THY", );        
                
    document.querySelector('.result-container').innerHTML +=
    cardGenerate("17:00", "19:00", departure,arrival, "ekonomi", "30 Kg", "TK 171", 
                "Directly", "2sa", "370 €", "THY", );     

    document.querySelector('.result-container').innerHTML +=
    cardGenerate("12:00", "19:00", departure,arrival, "ekonomi", "30 Kg", "TK 151", 
                "Directly", "4sa", "410 €", "THY", );   
}

function cardGenerate(departureTime, arrivalTime, departureCity, arrivalCity,
     clas, luggageCapacity ,flightCode, flightType, flightTime, price, airlineBrand, airlineIcon)
{
    return `
        <div class="card-container"> 
            <div class="airline-block">
                <img src=${airlineIcon}>
                <span>${airlineBrand}</span> 
                <span>${flightCode}</span> 
                <span>${clas}</span> 
                <span>${luggageCapacity}</span> 
            </div>
            <div class="departure-block">
                <span>${departureTime}</span>
                <span>${departureCity}</span>
            </div>
            <div class="flight-block">
                <span> ${flightTime}</span>
                <span> ${flightType}</span>
            </div>
            <div class="arrival-block">
            <span>${arrivalTime}</span>
            <span>${arrivalCity}</span>
            </div>

            <div class="price-block">
            <span> ${price} </span>
            </div>

            <span id="choose-fly">Choose</span>
        </div>
    `;
}