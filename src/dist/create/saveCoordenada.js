var createElement = document.getElementById('btnSaveCoordenate');

      createElement.addEventListener("click", function(e){
          e.preventDefault();

          var latitud = document.getElementById('latitud').value;
          var longitud = document.getElementById('longitud').value;
          console.log(latitud);
          console.log(longitud);

            $.ajax({
                dataType: 'json',
                url:   'http://fast.tliapp.com.mx/create.php', //archivo que recibe la peticion
                type:  'POST', //método de envio
                data:  {'latitud': latitud,'longitud': longitud}, //datos que se envian a traves de ajax
                beforeSend: function () {
                        console.log("despues");
                },
                success:  function (response) { //una vez que el archivo recibe el request lo procesa y lo devuelve
                    
                        if(response.status == 'success'){
                            location.reload(true);

                        }
                    
                }
        });

      });