angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $timeout, comprovante) {

  var apostadores = []; 

  $timeout(function(){
    bluetoothSerial.isEnabled(function(){
        bluetoothSerial.isConnected(null, function() {
          if(localStorage.getItem('id')){
            bluetoothSerial.connect(localStorage.getItem('id'));
          }else{
            alert('Por favor conecte-se a uma impressora.');
            window.location.href = '#/tab/account';
          }
        });
      },function(){
        bluetoothSerial.enable(function(){
          bluetoothSerial.isConnected(null, function() {
            if(localStorage.getItem('id')){
              bluetoothSerial.connect(localStorage.getItem('id'));
            }else{
              alert('Por favor conecte-se a uma impressora.');
              window.location.href = '#/tab/account';
            }
          });     
        });
      });
  }, 500);

  $scope.$on('$ionicView.enter', function(){
    $scope.competidores = localStorage.corrida ? JSON.parse(localStorage.corrida) : [];
    $scope.quantidade = localStorage.apostadores ? JSON.parse(localStorage.apostadores).length : 0;

    bluetoothSerial.isEnabled(function(){
        bluetoothSerial.isConnected(null, function() {
          if(localStorage.getItem('id')){
            bluetoothSerial.connect(localStorage.getItem('id'));
          }else{
            alert('Por favor conecte-se a uma impressora.');
            window.location.href = '#/tab/account';
          }
        });
      },function(){
        bluetoothSerial.enable(function(){
          bluetoothSerial.isConnected(null, function() {
            if(localStorage.getItem('id')){
              bluetoothSerial.connect(localStorage.getItem('id'));
            }else{
              alert('Por favor conecte-se a uma impressora.');
              window.location.href = '#/tab/account';
            }
          });     
        });
      });
  });

  $scope.limpar = function(){
    var con = confirm('Tem certeza que deseja remover os apostadores, isso irá remover a sequência?');    
    if(con)
    {
      localStorage.removeItem('apostadores');
      $scope.quantidade = 0;
    }
  }

  $scope.apostar = function(competidor){
    var con = confirm('Tem certeza que deseja apostador nesse competidor ' + competidor.toUpperCase() + '?');    
    if(con)
    {
      apostadores = localStorage.apostadores ? JSON.parse(localStorage.apostadores) : [];
      apostadores.push({ competidor : competidor }); 
      $scope.quantidade = apostadores.length;
      localStorage.apostadores = JSON.stringify(apostadores); 
      var hash = md5(competidor+$scope.quantidade+'corrida');  

      bluetoothSerial.isEnabled(function(){
      bluetoothSerial.write(comprovante({ sequencia : $scope.quantidade, competidor : competidor, hash : hash }), function(){
        $ionicLoading.show({ template: 'Aguarde ...', duration: 5000 });                
      }, function(){                
        alert('Não foi possível emitir o comprovante tente emitir pela página dos apostadores.');
      });
      }, function(){      
        bluetoothSerial.enable(function(){
          alert('O bluetooth estava desligado tente agora.');
        })    
      })
    }
  }
})

.controller('ChatsCtrl', function($scope) {

  $scope.competidores = [];
  $scope.corrida = localStorage.corrida;

  $scope.cadastrar = function(competidor){
    var existe = $scope.competidores.some(function(elemento){ return elemento.nome == competidor; });    
    if(!existe)
    {     
      if(competidor !== undefined)
      {
        $scope.competidores.push({ nome : competidor });           
      } 
    }
    else
    {
        alert('Competidor já existe tente outro nome.');
    }
  }

  $scope.concluir = function(){
    if($scope.corrida === undefined)
    {
      if($scope.competidores.length)
      {
        var con = confirm('Cadastrar essa corrida?');
        if(con)
        {
           localStorage.corrida = JSON.stringify($scope.competidores);
           $scope.corrida = localStorage.corrida;
           if(localStorage.getItem('corrida'))
           {
              $scope.competidores = [];
              alert('Competidores cadastrado com sucesso.');
           }
        }  
      }
          
    }
    else
    {
      var con = confirm('Excluir essa corrida?');
      if(con)
      {
         localStorage.removeItem('corrida');
         localStorage.removeItem('apostadores');
         $scope.competidores = [];
         $scope.corrida = localStorage.corrida; 
      }  
    }
  }

  $scope.excluir = function(competidor){
    var con = confirm('Tem certeza que deseja remover o competidor ' + competidor.nome.toUpperCase());
    if(con)
    {
      $scope.competidores.splice($scope.competidores.indexOf(competidor), 1);      
    }
  }

})


.controller('AccountCtrl', function($scope, $ionicLoading, $timeout) {

  $scope.impressoras = [];

  bluetoothSerial.isEnabled(null,function(){
    bluetoothSerial.enable();
  });

  $scope.conectada = localStorage.getItem('impressora');

  $scope.pesquisar = function(){
    $ionicLoading.show({ template: 'Aguarde ...', duration: 5000 });
    bluetoothSerial.list(function(device){      
      $scope.impressoras = device;
      $timeout(function(){
        $ionicLoading.hide();
        $scope.impressoras = device;
      }, 500);
    }, function(){
      alert('Algo deu errado, tente novamente');
    });   
  }

  $scope.conectar = function(id, impressora){
    localStorage.removeItem('id');
    localStorage.removeItem('impressora');
    bluetoothSerial.disconnect();
    $ionicLoading.show({ template: 'Aguarde ...', duration: 15000 });
    bluetoothSerial.connect(id, function(){     
      alert('Você esta conectado há ' + impressora + ' agora está pronto para fazer impressões.');
      localStorage.setItem('id', id);
      localStorage.setItem('impressora', impressora);
      $scope.conectada = impressora;
      ESC = "\u001B";
      INI = ESC + "@";
      CENTRO = ESC + "a" + "1";
      NEGRITO = ESC + "E" + "1"; 
      ENTER = String.fromCharCode(0x0A); 

      bluetoothSerial.write(ENTER + CENTRO + NEGRITO + 'IMPRESSORA PRONTA' + ENTER + ENTER + ENTER + ENTER + ENTER + INI);
      $ionicLoading.hide();
    }, function(){
      alert('Verifique se a impressora esta ligada, caso esteja e o problema persista ligue e desligue seu aparelho e a impressora.');
      $ionicLoading.hide();
    })
  }

  $scope.desconectar = function(){
    localStorage.removeItem('id');
    localStorage.removeItem('impressora');
    $scope.conectada = null;
    bluetoothSerial.isEnabled(function(){
      bluetoothSerial.disconnect(function(){
        alert('A impressora foi desconectada com sucesso.');
      })
    },function(){
      bluetoothSerial.enable(function(){
        bluetoothSerial.disconnect(function(){
          alert('A impressora foi desconectada com sucesso.');
        })
      });
    });
  }

});
