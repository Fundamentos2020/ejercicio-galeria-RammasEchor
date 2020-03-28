const div_imagenes = document.getElementById('imagenes');
const boton_cargar_galeria = document.getElementById('cargar_galeria');
var imagenes ;
var numPaginas ;

boton_cargar_galeria.addEventListener('click', cargarGaleria );


const boton_izquierda = document.querySelector('#nav_izq');
const boton_derecha = document.querySelector('#nav_der'); 
boton_izquierda.addEventListener('click', moverPaginaIzquierda);
boton_derecha.addEventListener('click', moverPaginaDerecha);

function cargarGaleria() {
    const xhr = new XMLHttpRequest();
    let url = 'https://picsum.photos/v2/list?limit=100';
    xhr.open('GET', url, true );
    xhr.onload = presentarImagenes ;
    xhr.send();
}

function presentarImagenes()    {
    const botones_eliminar = document.querySelectorAll('*[id^="boton_pagina_"]');
    botones_eliminar.forEach( function(boton)   {
        boton.remove();
    } );

    if( this.status != 200 )
        return ;

    numPaginas = Math.round( 100 / document.getElementById('input_num_imagenes').value );
    imagenes = JSON.parse( this.responseText );
    

    const boton_nav_der = document.getElementById('nav_der');
    for( i = 1 ; i <= numPaginas ; ++i )
    {
        const button = document.createElement('button');
        button.id = `boton_pagina_${i}`;
        button.innerHTML = `${i}` ;
        button.value = i - 1 ;
        button.className = 'boton m-2' ;
        button.addEventListener('click', botonPresionado )
        boton_nav_der.parentElement.insertBefore( button, boton_nav_der );
    }

    document.getElementById('boton_pagina_1').className += ' boton_presionado' ;

    var imagenes_pag = imagenes.slice( 0, document.getElementById('input_num_imagenes').value );
    let contenido = '' ;
    imagenes_pag.forEach( function(imagen)  {
        contenido += `
            <div class="img-cards">
                <img src=${imagen.download_url} class="img-fluid">
            </div>
        `;
    } );

    div_imagenes.innerHTML = contenido ;
}

function botonPresionado() {
    const botones = document.getElementsByClassName('boton');
    
    for( i = 0 ; i < botones.length ; ++i )
        botones[i].className = 'boton m-2' ;

    this.className += ' boton_presionado' ;

    const xhr = new XMLHttpRequest();
    let url = 'https://picsum.photos/v2/list?limit=100';
    xhr.open('GET', url, true );
    xhr.onload = cambiarImagenes ;
    xhr.send();
}

function cambiarImagenes( value )  {
    var numImagenesPagina = parseInt( document.getElementById('input_num_imagenes').value );
    imagenes = JSON.parse( this.responseText );

    const boton = document.querySelector('.boton_presionado');
    console.log( boton.value, numImagenesPagina );

    let contenido = '' ;
    for( i = parseInt( boton.value ) * numImagenesPagina ; i < ( parseInt( boton.value ) * numImagenesPagina ) + numImagenesPagina ; ++i )  {
        contenido += `
            <div class="img-cards">
                <img src=${imagenes[i].download_url} class="img-fluid">
            </div>
        `;

        console.log( ( boton.value * numImagenesPagina ) + numImagenesPagina );
    };

    div_imagenes.innerHTML = contenido ;
}

function moverPaginaIzquierda() {
    const boton = document.querySelector('.boton_presionado');
    boton.previousElementSibling.click();
}

function moverPaginaDerecha()   {
    const boton = document.querySelector('.boton_presionado');
    boton.nextElementSibling.click();
}