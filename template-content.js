//======================================= Inserindo informações fixas =======================================
window.onload = function () {
    //Ação ao clicar na logo Peopleware
    document.getElementById("ppw").addEventListener("click", (event) => {
        event.preventDefault();
        window.scrollTo(0, 0);
    });
    //Ação ao clicar no menu Identificação
    document.getElementById("menu-identificacao").addEventListener("click", (event) => {
        event.preventDefault();
        document.getElementById("identificacao-titulo").scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
    });
    //Ação ao clicar no menu Detalhamento dos Testes
    document.getElementById("menu-detalhamento").addEventListener("click", (event) => {
        event.preventDefault();
        document.getElementById("detalhamento-titulo").scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
    });
    
    //Texto dos detalhes dos testes
    document.getElementById("assinatura").innerHTML = assinatura;

    //Texto referente o nome da atividade
    document.getElementById("atividade-nome").innerHTML = atividadeNome;

    //Texto referente o nome do projeto
    document.getElementById("projeto-id").innerHTML = projetoId;
    document.getElementById("projeto-nome").innerHTML = projetoNome;

    //Texto referente aos detalhes do teste
    document.getElementById("teste-tipo").innerHTML = testeTipo;
    document.getElementById("teste-sistema").innerHTML = testeSistema;

    //Texto dos envolvidos no teste
    document.getElementById("user-nome-1").innerHTML = userNome;
    document.getElementById("user-cargo-1").innerHTML = userCargo;
    document.getElementById("user-empresa-1").innerHTML = userEmpresa;
    document.getElementById("user-email-1").innerHTML = userEmail;
    document.getElementById("user-phone-1").innerHTML = userPhone;

    //Texto dos detalhes dos testes
    document.getElementById("modulos").innerHTML = detalhesModulos;
    document.getElementById("parametros").innerHTML = detalhesParametros;
    document.getElementById("dados").innerHTML = detalhesDados;
    document.getElementById("configuracao").innerHTML = detalhesConfig;
    document.getElementById("ambiente").innerHTML = detalhesAmbiente;
}
//===========================================================================================================
//============================ Criando modelo de tabela dos test-cases com React ============================
function TabelaTestcase(titulo, nome, descricao, preCondicoes, expectativa, resultadoFinal, status, responsavel, data, listaAnexos) {
    //Título
    const anexosTotais = [];
    listaAnexos.forEach(anexo => {
        const te1 = React.createElement('a', { id: 'list-group-item', className: 'px-2', href: anexo, target: '_blank' }, anexo + "\n");
        anexosTotais.push(te1);
    })
    //Tabela
    return React.createElement('div', { className: 'table-responsive' },
        React.createElement('h3', { id: nome, className: 'pt-3' }, titulo),
        React.createElement('table', { className: 'table table-light table-striped m-0 mb-5 text-start' },
            React.createElement('tbody', null,
                React.createElement('tr', null,
                    React.createElement('th', null, 'Nome do Caso de Teste'),
                    React.createElement('td', null, nome)
                ),
                React.createElement('tr', null,
                    React.createElement('th', null, 'Descrição do Caso de Teste'),
                    React.createElement('td', null, descricao)
                ),
                React.createElement('tr', null,
                    React.createElement('th', null, 'Descrição das Pré-Condições'),
                    React.createElement('td', null, preCondicoes)
                ),
                React.createElement('tr', null,
                    React.createElement('th', null, 'Resultado Esperado'),
                    React.createElement('td', null, expectativa)
                ),
                React.createElement('tr', null,
                    React.createElement('th', null, 'Resultados Obtidos'),
                    React.createElement('td', null, resultadoFinal)
                ),
                React.createElement('tr', null,
                    React.createElement('th', null, 'Projeto/PP - Situação Atual\nINC/PBI/PKE - Detalhe da Falha\nWO - Detalhe da Solicitação'),
                    React.createElement('td', null, status)
                ),
                React.createElement('tr', null,
                    React.createElement('th', null, 'Responsável pelo Teste'),
                    React.createElement('td', null, responsavel)
                ),
                React.createElement('tr', null,
                    React.createElement('th', null, 'Data do Teste'),
                    React.createElement('td', null, data)
                ),
                React.createElement('tr', null,
                    React.createElement('th', null, 'Anexo/Caminho da Evidência'),
                    React.createElement('td', null, anexosTotais)
                )
            )
        )
    );
}
//==========================================================================================================
//=========================== Renderizando tabelas e links nos menus com React =============================
document.addEventListener('DOMContentLoaded', function () {
    //Renderizando Tabelas
    ReactDOM.render(
        React.createElement('div', null, AllTabelasTestecase),
        document.getElementById('tabela-testes')
    );
    //Criando Menu-Links
    let testesLinks = [];
    AllTabelasTestecase.forEach(function (element, index) {
        let testeNome = AllTabelasTestecase[index].props.children[0].props.id + " Titulo";
        testesLinks.push(React.createElement('a', { id: testeNome, className: 'dropdown-item' }, testeNome));
    });
    //Renderizando Menu-Links
    ReactDOM.render(
        React.createElement('li', null, testesLinks),
        document.getElementById('dropdown-testes-itens')
    );
    //Vinculando Tabelas x Menu-Links
    testesLinks.forEach(function (element, index) {
        let testeId = AllTabelasTestecase[index].props.children[0].props.id;
        let testeNome = AllTabelasTestecase[index].props.children[0].props.id + " Titulo";
        const tituloTeste = document.getElementById(testeId);
        const menuTeste = document.getElementById(testeNome);
        menuTeste.addEventListener("click", (event) => {
            event.preventDefault();
            tituloTeste.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
        });
    });
});
//==========================================================================================================
//=========================== Textos a serem usados para preenchimento dinâmico ============================
//Identificação
const assinatura = "Documento gerado automaticamente pela aplicação DET-MAKER<br> Versão v0.1.BETA - yyyy/MM/dd HH:mm:ss";
const atividadeNome = "[PF-9854] Alterando forma de pagamento (dummy title)";
const projetoId = "IN1920";
const projetoNome = "FENIX";
const testeTipo = "Teste Unitário";
const testeSistema = "Cyber Vivo 3";
const userNome = "João Aguiar";
const userCargo = "Desenvolvedor";
const userEmpresa = "PPW";
const userEmail = "joao.aguiar@ppware.com.br";
const userPhone = "";

//Detalhamento dos Testes
const detalhesModulos = "";
const detalhesParametros = "";
const detalhesDados = "";
const detalhesConfig = "";
const detalhesAmbiente = "";

//Evolução dos Tabelas
const AllTabelasTestecase = [
    TabelaTestcase(
        'TESTE TITULO 1',
        'Teste 1',
        'Processando eventos',
        'Apenas executar',
        'Processo completo com commit no banco realizado com sucesso',
        'Processo completo com commit no banco realizado com sucesso',
        'Aprovado',
        'João Aguiar',
        '24/07/2023',
        [
            'EVENTOS_WEB_017_20230524_180401.log',
            'EVENTOS_WEB_017_20230524_180401.log'
        ]
    ),
    TabelaTestcase(
        'TESTE TITULO 2',
        'Teste 2',
        'Processando eventos',
        'Apenas executar',
        'Processo completo com commit no banco realizado com sucesso',
        'Processo completo com commit no banco realizado com sucesso',
        'Aprovado',
        'João Aguiar',
        '24/07/2023',
        [
            'EVENTOS_WEB_017_20230524_180401.log',
            'EVENTOS_WEB_017_20230524_180401.log'
        ]
    )
];
