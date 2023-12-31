// Obtention des éléments du DOM pour les arrière-plans et caches
var leftBack = document.getElementById('backgroundLeft');
var rightBack = document.getElementById('backgroundRight');
var leftCache = document.getElementById('cacheLeft');
var rightCache = document.getElementById('cacheRight');
var startBackground = document.getElementById('startBackground');

$(document).ready(function() {
    leftBack.hidden = true;
    rightBack.hidden = true;
    leftCache.hidden = true;
    rightCache.hidden = true;

    $('#StartModal').modal({
        keyboard: false,
        backdrop: 'static'
    })
    $('#StartModal').modal('show')
});

// Fonction pour fermer le modal et lancer le jeu
function closeModalAndPlay() {
    $('#StartModal').modal('hide');
    startTimer(5, false); //Démarrer le timer des "manches"
    leftBack.hidden = false;
    leftCache.hidden = false;
    startBackground.hidden = true;


}

// Sélection du joueur en fonction de l'état caché de 'leftBack'
function actualPlayerFunction() {
    var Player;
    leftBack.hidden ? Player = "PlayerOne" : Player = "PlayerTwo"
    return Player;
}

// Fonction pour obtenir la valeur des dés pour un joueur
function GetValueDice(Player) {
    var PlayerDice = document.getElementsByClassName("" + Player);
    PlayerDice = PlayerDice[0].firstElementChild.children;
    var allNumber = [];
    var returnValue = []

    for (let i = 0; i < PlayerDice.length; i++) {
        var number = PlayerDice[i].firstElementChild.firstElementChild.children[1].classList.value;
        allNumber.push(number)
    }
    returnValue.push(Player, allNumber); //Retourne un tableau avec le J1 ou J2 et le tableau des résultat des dès 
    VerificationForGrille(returnValue);
}

function VerificationForGrille(_value) {
    var valueNumber = [];
    // Convertit les valeurs des dés de format texte (ex: 'one', 'two') en nombre
    for (let i = 0; i < _value[1].length; i++) {
        var number = 0;
        switch (_value[1][i]) {
            case 'one':
                number = 1;
                break;
            case 'two':
                number = 2;
                break;
            case 'three':
                number = 3;
                break;
            case 'four':
                number = 4;
                break;
            case 'five':
                number = 5;
                break;
            case 'six':
                number = 6;
                break;
        }
        valueNumber.push(number);
    }
    var value = [_value[0], valueNumber];

    // Création d'un tableau des combinaisons possibles avec leur évaluation
    var _PossibleCase = [
        ["Chance", Chance(value[1])],
        ["Brelan", Brelan(value[1])],
        ["PetiteSuite", PetiteSuite(value[1])],
        ["GrandeSuite", GrandeSuite(value[1])],
        ["Full", Full(value[1])],
        ["Carre", Carre(value[1])],
        ["Yam", Yam(value[1])]
    ]
    var PossibleCase = []

    // Stocker les combinaisons possibles et le joueur actuel
    for (let i = 0; i < _PossibleCase.length; i++) {
        if (_PossibleCase[i][1] == true || Number.isInteger(_PossibleCase[i][1])) {
            PossibleCase.push(_PossibleCase[i]);
        }
    }

    
    var LastValue = [PossibleCase, value[0]];

    // Initialisation des tableaux pour les boutons, entrées et valeurs
    var TableButton = ["CarrePlayerTwoButton", "BrelanPlayerTwoButton", "PetiteSuitePlayerTwoButton", "GrandeSuitePlayerTwoButton", "FullPlayerTwoButton", "YamPlayerTwoButton", "ChancePlayerTwoButton"];
    var TableInput = ["CarreInputPlayerTwo", "BrelanInputPlayerTwo", "PetiteSuiteInputPlayerTwo", "GrandeSuiteInputPlayerTwo", "FullInputPlayerTwo", "YamInputPlayerTwo", "ChanceInputPlayerTwo"];
    var TableDivVal = ["BrelanPointPlayerTwo", "PetiteSuitePointPlayerTwo", "GrandeSuitePointPlayerTwo", "FullPointPlayerTwo", "CarrePointPlayerTwo", "YamPointPlayerTwo", "ChancePointPlayerTwo"];

    // Cacher les boutons
    for (let i = 0; i < TableButton.length; i++) {
        var toHidden = TableButton[i];
        toHidden = document.getElementById(toHidden);
        toHidden.hidden = true;
    }

    // Réinitialiser les valeurs des entrées
    for (let i = 0; i < TableInput.length; i++) {
        var toHidden = TableInput[i];
        toHidden = document.getElementById(toHidden);
        toHidden.value = 0;
    }

    // Effacer le contenu des éléments div si non choisis
    for (let i = 0; i < TableDivVal.length; i++) {
        var toHidden = TableDivVal[i];
        toHidden = document.getElementById(toHidden);
        if (toHidden.classList[1] != "isChoosen")
            toHidden.textContent = "";
    }

    // Mise à jour des points, boutons et entrées en fonction des combinaisons possibles
    for (let i = 0; i < LastValue[0].length; i++) {
        var toChangePoint = document.getElementById(LastValue[0][i][0] + 'Point' + LastValue[1]);
        var toChangeButton = document.getElementById(LastValue[0][i][0] + LastValue[1] + "Button");
        var toChangeInput = document.getElementById(LastValue[0][i][0] + "Input" + LastValue[1]);

        if (toChangePoint.classList[1] != "isChoosen") {
            toChangeButton.hidden = false;
            toChangeInput.value = LastValue[0][i][1];
            if (toChangePoint.textContent == "") toChangePoint.textContent = LastValue[0][i][1];
        }
    }
    TableValue = LastValue;
    console.log(LastValue)
}

function Brelan(_value) {
    var Occurence = [];
    for (let i = 0; i < _value.length; i++) {
        var count = 0;
        for (let y = 0; y < _value.length; y++) {
            if (_value[i] == _value[y]) count += 1;
        }
        if (count >= 3) Occurence.push(_value[i]);
    }
    if (Occurence.length >= 3) {
        var total = 0;
        for (let i = 0; i < Occurence.length; i++) total += Occurence[i];
        return total;
    } else return false;
}

function PetiteSuite(_value) {
    _value.sort();
    var Occurence = [];
    for (let i = 0; i < _value.length; i++) {
        if (_value[i] != 5 || _value[i] != 6 || _value[i] != 4) {
            if (_value.includes(_value[i] + 1) && _value.includes(_value[i] + 2) && _value.includes(_value[i] + 3)) Occurence.push(_value[i]);
        }
    }
    if (Occurence.length != 0) return 20;
    else return false;
}

function GrandeSuite(_value) {
    _value.sort();
    var Occurence = [];
    for (let i = 0; i < _value.length; i++) {
        if (_value[i] == 1 || _value[i] == 2) {
            if (_value.includes(_value[i] + 1) && _value.includes(_value[i] + 2) && _value.includes(_value[i] + 3) && _value.includes(_value[i] + 4)) Occurence.push(_value[i]);
        }
    }
    if (Occurence.length != 0) return 40;
    else return false;
}

function Full(_value) {
    var Occurence = [];
    for (let i = 0; i < _value.length; i++) {
        var count = 0;
        for (let y = 0; y < _value.length; y++) {
            if (_value[i] == _value[y]) count += 1;
        }
        if (count >= 3) Occurence.push(_value[i]);
    }
    if (Occurence.length == 3) {
        for (let i = 0; i < Occurence.length; i++) {
            var Index = _value.indexOf(Occurence[i]);
            _value.splice(Index, 1);
        }
        if (_value[0] == _value[1]) return 25;
        else return false;
    } else return false;
}

function Carre(_value) {
    var Occurence = [];
    for (let i = 0; i < _value.length; i++) {
        var count = 0;
        for (let y = 0; y < _value.length; y++) {
            if (_value[i] == _value[y]) count += 1;
        }
        if (count >= 4) Occurence.push(_value[i]);
    }
    if (Occurence.length >= 4) {
        var total = 0;
        for (let i = 0; i < Occurence.length; i++) total += Occurence[i];
        return total;
    } else return false;
}

function Yam(_value) {
    var Occurence = [];
    for (let i = 0; i < _value.length; i++) {
        var count = 0;
        for (let y = 0; y < _value.length; y++) {
            if (_value[i] == _value[y]) count += 1;
        }
        if (count == 5) Occurence.push(_value[i]);
    }
    if (Occurence.length == 5) return 50;
    else return false;
}

function Chance(_value) {
    var total = 0;
    for (let i = 0; i < _value.length; i++) total += _value[i];
    return total;
}

// Fonction pour ajouter des points à la table
function AddToTable(name, player) {
    var getDiv = document.getElementById(name + "Point" + player)

    getDiv.style.opacity = 1;
    getDiv.classList.add("isChoosen");

    startTimer(0, true);
    clearInterval(ticker);
    var TableButton = ["CarrePlayerTwoButton", "BrelanPlayerTwoButton", "PetiteSuitePlayerTwoButton", "GrandeSuitePlayerTwoButton", "FullPlayerTwoButton", "YamPlayerTwoButton", "ChancePlayerTwoButton"];
    for (let i = 0; i < TableButton.length; i++) {
        var toHidden = TableButton[i];
        toHidden = document.getElementById(toHidden);
        toHidden.hidden = true;
    }
    var TableDivVal = ["BrelanPointPlayerTwo", "PetiteSuitePointPlayerTwo", "GrandeSuitePointPlayerTwo", "FullPointPlayerTwo", "CarrePointPlayerTwo", "YamPointPlayerTwo", "ChancePointPlayerTwo"];
    for (let i = 0; i < TableDivVal.length; i++) {
        var toHidden = TableDivVal[i];
        toHidden = document.getElementById(toHidden);
        if (toHidden.classList[1] != "isChoosen")
            toHidden.textContent = "";
    }
}