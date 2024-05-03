interface MassaColunaTiposType {
    nomeTipo: string,
    comInput: boolean,
    descricao: string,
    usaPessoa: boolean,
}

export const massaColunaTipos: MassaColunaTiposType[] = [
    { 
        nomeTipo: "TEXTO_FIXO",
        comInput: true,
        descricao: "Valor do tipo VARCHAR\n" + "Fixo e pré-definido no campo 'Opção de Valor'",
        usaPessoa: false
    },
    { 
        nomeTipo: "NUMERO_FIXO",
        comInput: true,
        descricao: "Valor do tipo NUMBER\n" + "Fixo e pré-definido no campo 'Opção de Valor'",
        usaPessoa: false
    },
    { 
        nomeTipo: "MULTITEXTO",
        comInput: true,
        descricao: "Valor do tipo VARCHAR\n" + "Será escolhido dentre as opções pré-definidas no campo 'Opção de Valor'\n"
            + "Cada opção deve ser separar por ',' ou ';'",
        usaPessoa: false 
    },
    { 
        nomeTipo: "MULTINUMERICO",
        comInput: true,
        descricao: "Valor do tipo NUMBER\n" + "Será escolhido dentre as opções pré-definidas no campo 'Opção de Valor'\n"
            + "Cada opção deve ser separar por ',' ou ';'",
        usaPessoa: false 
    },
    { 
        nomeTipo: "NOME",
        comInput: false,
        descricao: "Valor do tipo VARCHAR\n" + "Nome de uma pessoa aleatorio",
        usaPessoa: true 
    },
    { 
        nomeTipo: "NOME_MASCULINO",
        comInput: false,
        descricao: "Valor do tipo VARCHAR\n" + "Nome masculino aleatorio",
        usaPessoa: false 
    },
    { 
        nomeTipo: "NOME_FEMININO",
        comInput: false,
        descricao: "Valor do tipo VARCHAR\n" + "Nome feminino aleatorio",
        usaPessoa: false 
    },
    { 
        nomeTipo: "CONTRATO",
        comInput: false,
        descricao: "Valor do tipo VARCHAR\n" + "Composto por números aleatórios, podendo ter o billing '-MOCK' no final\n" 
            + "Se o 'Tamanho' do campo for indicado como abaixo de 7, o billing não será aplciado\n"
            + "Caso contrário, o valor segue a fórmula: ('Tamanho' - 4) + '-MOK'",
        usaPessoa: false 
    },
    { 
        nomeTipo: "CPF",
        comInput: false,
        descricao: "Valor do tipo VARCHAR\n" + "Composto por 11 números aleatórios (sem máscara)",
        usaPessoa: true 
    },
    { 
        nomeTipo: "CNPJ",
        comInput: false,
        descricao: "Valor do tipo VARCHAR\n" + "Composto por 14 números aleatórios (sem máscara)",
        usaPessoa: false 
    },
    { 
        nomeTipo: "TELEFONE",
        comInput: false,
        descricao: "Valor do tipo VARCHAR\n" + "Composto por 8 números aleatórios (sem máscara)",
        usaPessoa: true 
    },
    { 
        nomeTipo: "LOGRADOURO",
        comInput: false,
        descricao: "Valor do tipo VARCHAR\n" + "Representa o nome de uma rua, avenida, praça, etc",
        usaPessoa: false 
    },
    { 
        nomeTipo: "ENDERECO",
        comInput: false,
        descricao: "Valor do tipo VARCHAR\n" + "Representa um endereço completo, composto por logradouro + número",
        usaPessoa: true 
    },
    { 
        nomeTipo: "BAIRRO",
        comInput: false,
        descricao: "Valor do tipo VARCHAR\n" + "Representa um bairro brasileiro aleatório",
        usaPessoa: true 
    },
    { 
        nomeTipo: "CIDADE",
        comInput: false,
        descricao: "Valor do tipo VARCHAR\n" + "Representa uma cidade brasileira aleatória",
        usaPessoa: true 
    },
    { 
        nomeTipo: "ESTADO",
        comInput: false,
        descricao: "Valor do tipo VARCHAR\n" + "Representa o nome de um estado brasileiro aleatório",
        usaPessoa: true  
    },
    { 
        nomeTipo: "ESTADO_UF",
        comInput: false,
        descricao: "Valor do tipo VARCHAR\n" + "Representa as siglas de um estado brasileiro aleatório",
        usaPessoa: true
    },
    { 
        nomeTipo: "CEP",
        comInput: false,
        descricao: "Valor do tipo VARCHAR\n" + "Composto por 8 números aleatórios (com máscara)",
        usaPessoa: true
    },
    { 
        nomeTipo: "DATA_NASCIMENTO",
        comInput: false,
        descricao: "O valor do tipo DATE\n" + "Uma data passada aleatória",
        usaPessoa: true
    },
    { 
        nomeTipo: "GENERO",
        comInput: false,
        descricao: "Valor do tipo VARCHAR\n" + "Texto preenchido com 'Masculino' ou 'Feminino'",
        usaPessoa: true
    },
    { 
        nomeTipo: "GENERO_SIGLA",
        comInput: false,
        descricao: "Valor do tipo VARCHAR\n" + "Caractere único preenchido por 'M' ou 'F'",
        usaPessoa: true 
    },
    { 
        nomeTipo: "EMAIL",
        comInput: false,
        descricao: "Valor do tipo VARCHAR\n" + "Irá compor um endereço válido de e-mail (com máscara)",
        usaPessoa: true
    },
    { 
        nomeTipo: "HASH",
        comInput: false,
        descricao: "Valor do tipo VARCHAR\n" + "Combinação aleatória de letras e números no padrão UUID, "
            + "podendo ser reduzido com base no tamanho-maximo do campo",
        usaPessoa: false 
    },
    { 
        nomeTipo: "TEXTO_NUMERICO",
        comInput: false,
        descricao: "Valor do tipo VARCHAR\n" + "Composto por números aleatórios, cuja quantidade de dígitos "
            + "segue o tamanho-máximo do campo",
        usaPessoa: false 
    },
    { 
        nomeTipo: "NUMERO",
        comInput: false,
        descricao: "Valor do tipo NUMBER\n" + "A quantidade de dígitos segue o tamanho-máximo do campo",
        usaPessoa: false 
    },
    { 
        nomeTipo: "MONETARIO",
        comInput: false,
        descricao: "Valor do tipo NUMBER\n" + "Com 2 decimais e cuja quantidade de dígitos segue o tamanho-máximo do campo",
        usaPessoa: false 
    },
    { 
        nomeTipo: "DIA",
        comInput: false,
        descricao: "Valor do tipo NUMBER\n" + "Número que representa um dia aleatório de um mês aleatório (de 1 a 28)",
        usaPessoa: false 
    },
    { 
        nomeTipo: "HORA",
        comInput: false,
        descricao: "Valor do tipo TIME\n" + "Um horário aleatório",
        usaPessoa: false 
    },
    { 
        nomeTipo: "DATA",
        comInput: false,
        descricao: "Valor do tipo DATE ou TIMESTAMP\n" + "Uma data passada aleatória",
        usaPessoa: false 
    },
    { 
        nomeTipo: "DATA_FUTURA",
        comInput: false,
        descricao: "Valor do tipo DATE ou TIMESTAMP\n" + "Uma data futura aleatória",
        usaPessoa: false 
    },
    { 
        nomeTipo: "DATA_HORA",
        comInput: false,
        descricao: "Valor do tipo DATA ou TIMESTAMP\n" + "Uma data passada aleatória, possuindo também horário",
        usaPessoa: false 
    },
    { 
        nomeTipo: "DATA_HORA_FUTURA",
        comInput: false,
        descricao: "Valor do tipo DATA ou TIMESTAMP\n" + "Uma data futura aleatória, possuindo também horário",
        usaPessoa: false 
    },
];
