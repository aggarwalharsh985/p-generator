const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const symbolCheck = document.querySelector("#symbols");
const numberCheck = document.querySelector("#numbers");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbol = '~`!@#$%^&*()_+-={[]}:./< > ? ;,';

let password = "";
let passwordLength = "10";
let checkcount = "0";
handleSlider();
setIndicatorColor("#ccc");

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%";
}
function setIndicatorColor(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow =  `0px 0px 12px 1px ${color}`;
}
function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min ;
}
function getRandomNumber(){
    return getRndInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function generateSymbol(){
    const randNum = getRndInteger(0,symbol.length);
    return symbol.charAt(randNum);
}
function calcStrength(){
    hasUpper = false;
    hasLower = false;
    hasSym = false;
    hasNum = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(uppercaseCheck.checked) hasLower = true;
    if(uppercaseCheck.checked) hasSym = true;
    if(uppercaseCheck.checked) hasNum = true;

    if(hasUpper && hasLower && (hasSym || hasNum) && passwordLength >= 8){
        setIndicatorColor('#0f0');
    }else if(
        (hasLower || hasUpper)&&
        (hasSym || hasNum)&&
        passwordLength >=6
    ){
        setIndicatorColor('#ff0');
    }
    else{
        setIndicatorColor('#f00');
    }
}

async function copycontent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText("failed");
    }
    // to make span vissible
    copyMsg.classList.add("active");

    setTimeout(() =>{
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassowrd(array){
    // Fisher yates method
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBox() {
    checkcount = 0;
    allCheckBox.forEach((checkBox) => {
        if(checkBox.checked){
            checkcount++;
        }
    });
    // special case
    if(passwordLength < checkcount){
        passwordLength = checkcount
        handleSlider();
    }
}

allCheckBox.forEach((checkBox) => {
    checkBox.addEventListener('change' , handleCheckBox);
});

inputSlider.addEventListener('input' ,(e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click' , () => {
    if(passwordDisplay.value){
        copycontent();
        console.log("he");
    }
});

generateBtn.addEventListener('click',() =>{
    if(checkcount ==0 ){
        return ;
    }
    if(passwordLength<checkcount){
        passwordLength = checkcount;
        handleSlider();
    }
    password = "";
    
    let funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(symbolCheck.checked){
        funcArr.push(generateSymbol);
    }
    if(numberCheck.checked){
        funcArr.push(getRandomNumber);
    }

    for(let i = 0 ; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    for(i=0 ; i<passwordLength-funcArr.length ; i++){
        let randomIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randomIndex]();
    }
    password = shufflePassowrd(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();
    // console.log("hi");
})