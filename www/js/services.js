angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.service('replace', function(){
  return function(dados){
    var string = dados.replace('ã', 'a');
    var string = string.replace('á', 'a');
    var string = string.replace('â', 'a');
    var string = string.replace('é', 'e');
    var string = string.replace('õ', 'o');
    var string = string.replace('ó', 'o');
    var string = string.replace('ú', 'u');
    var string = string.replace('ç', 'c');
    
    return string;
  }
})

.service('comprovante', function($filter, replace){
  return function(dados){ 
    var ESC = "\u001B";
    var GS = "\u001D";
    var INI = ESC + "@";   //inicializa a impressora
    var NEGRITO = ESC + "E" + "1";  //inicializa o negrito...para finalizar o negrito utilize Ini
    var DOUBLEON = GS + "!" + "\u0001"; //inicializa dobra o tamanho da fonte... para finalizar utilize ini
    var ENTER = String.fromCharCode(0x0A);  //LF funciona para pular a linha
    var CENTRO = ESC + "a" + "1";  //inicializa centralizar para finalizar utilize ini
    var LEFT = ESC + "a" + "0";  //alinha a esquerca
    var REVERSO = GS + "B" + "1";  //fundo negro e letras transparantes
    var SMALL = ESC + "!" + "\u0001";  //fonte menor
    var DATA = new Date();
    
    
    var text = ENTER + CENTRO + NEGRITO + 'COMPROVANTE' + ENTER + INI;

    text += ENTER + NEGRITO + 'CODIGO : ' + dados.sequencia + ENTER + INI;
    text += ENTER + NEGRITO + 'APOSTOU EM : ' + replace(dados.competidor) + ENTER + INI;
    text += ENTER + NEGRITO + 'VALOR : 5,00 Reais' + ENTER + INI;
    text += ENTER + NEGRITO + 'HORARIO : ' + $filter('date')(DATA, 'short') + ENTER + INI;
    text += ENTER + NEGRITO + dados.hash + ENTER + INI;
    text += ENTER + ENTER + ENTER + INI;
    
    return text;
  }
})

