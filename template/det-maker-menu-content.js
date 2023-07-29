//===========================================================================================================
//======================================== Mecânia do menu principal ========================================
window.onload = function () {

    //Controle de qual opção está o menu
    let menuLevel = 1;
    let transicao = 100;
    const loading = document.getElementById("loading");
    const capaAbrir = document.getElementById("capa-abrir");
    const capaSchedule = document.getElementById("capa-schedule");
    const capaJobs = document.getElementById("capa-jobs");
    const capas = [capaAbrir, capaSchedule, capaJobs];

    console.log("Elementos Menus = " + capas);
    console.log("Menu Level = " + menuLevel);

    capas.forEach(function (element, index) {
        if (index == 0) return;
        capas[index].style.opacity = 0;
        capas[index].style.visibility = "hidden";
        capas[index].style.display = "none";
    });

    //Movendo a opção do menu
    function moverMenu(level) {
        //Caso já esteja no mesmo menu-level
        if (level == menuLevel) {
            console.log("Menu Level = " + menuLevel);
            return;
        }
        //Alternando o menu-level
        pause();
        let timer = 0;
        let limite = 50;
        const intervalo = setInterval(() => {
            timer += 1;
            if (timer < limite / 2) {
                transicao -= 4;
                capas[menuLevel-1].style.opacity = transicao / 100;
            }
            else if (timer > limite / 2) {
                transicao += 4;
                capas[level-1].style.opacity = transicao / 100;
            }
            else {
                transicao = 0;
                capas[menuLevel-1].style.visibility = "hidden";
                capas[menuLevel-1].style.display = "none";
                capas[level-1].style.visibility = "visible";
                capas[level-1].style.display = "flex";
            }
            if (timer == limite) {
                clearInterval(intervalo);
                play();
                menuLevel = level;
                console.log("Menu Level = " + menuLevel);
            }
        }, 10);
    }
    //Desabilita todas as funções do mouse
    function pause() {
        document.body.style.pointerEvents = "none";
        document.getElementById("loading").style.visibility = "visible";
    }
    //Habilita todas as funções do mouse
    function play() {
        document.body.style.pointerEvents = "auto";
        document.getElementById("loading").style.visibility = "hidden";
    }
    //Condição para mostrar conteúdos
    /*
    if (menuLevel == 1) {
        document.getElementById("capa-schedule").style.visibility = "visible";
        document.getElementById("capa-jobs").style.opacity = "hidden";
    }
    if (menuLevel == 2) {
        document.getElementById("capa-jobs").style.opacity = "visible";
        document.getElementById("capa-schedule").style.visibility = "hidden";
    }
    document.getElementById("capa-schedule").style.opacity = transicao;
    document.getElementById("capa-jobs").style.opacity = transicao;
    */

    //Ação ao clicar na logo Peopleware
    document.getElementById("ppw").addEventListener("click", (event) => {
        event.preventDefault();
        window.scrollTo(0, 0);
    });
    //Ação ao clicar no menu Abrir Schedule
    document.getElementById("abrir-schedule").addEventListener("click", (event) => {
        event.preventDefault();
        moverMenu(1);
    });
    //Ação ao clicar no menu Escolher Jobs
    document.getElementById("escolher-jobs").addEventListener("click", (event) => {
        event.preventDefault();
        moverMenu(2);
    });
    //Ação ao clicar no menu Configurar Jobs
    document.getElementById("config-jobs").addEventListener("click", (event) => {
        event.preventDefault();
        moverMenu(3);
    });
}
//===========================================================================================================
//============================ Criando modelo de tabela dos test-cases com React ============================

