import { IonCol, IonRow, IonCard, IonGrid, IonIcon, IonTitle, IonBadge } from "@ionic/react";
import { massaColunaTipos } from "../data/MassaColunaTipo";
import { personCircle } from "ionicons/icons";

const ModalTiposDeMassa: React.FC = () => {

    const tag = (texto: string) => {
        return <IonBadge className="mx-1 font-monospace fs-6 mb-0 pb-0" style={{ transform: 'translate(0px, 3px)' }} color="medium">
            {texto}
        </IonBadge>
    };

    const usaPessoaIcon = (grande: boolean = true) => <IonIcon 
        icon={personCircle} 
        size={grande ? "large" : undefined} 
        style={{ transform: grande ? 'translate(0px, 8px)' : 'translate(0px, 3px)' }}
    />;

    //Renderização do componente
    return (
        <div className="row justify-content-center px-3 mx-0">
            <div className='h5 py-1 mb-2 rounded-top rounded-top-2 text-center'>
                <IonTitle className="mt-2">
                    <p className="text-wrap">
                        A opção {tag("Dados Da Mesma Pessoa")} indica que existem colunas na tabela referentes a 
                        um mesmo indivíduo. <br/>
                        Quando ativado, tais colunas serão preenchidas de forma mais fidedigna. <br/>
                        Os tipos de geração de valor que usam {tag("Dados Da Mesma Pessoa")} estão marcados com 
                        o símbolo: {usaPessoaIcon()}
                    </p>
                    <p className="text-wrap small fs-6">
                        Exemplo: temos a massa de uma tabela com essa opção ativada, a coluna {tag("TB_NOME")} 
                        é do tipo {tag("NOME")} e coluna {tag("TB_MAIL")} é do tipo {tag("EMAIL")}.<br/> 
                        O resultado será {tag("TB_NOME: Osvaldo Aranha")} e {tag("TB_MAIL: osvaldo.aranha248@gmail.com")}.
                    </p>
                </IonTitle>
            </div>
            <IonCard className="glass ">
                <IonGrid className="glass-content text-primary p-0 m-0 w-100 h-100" >
                    <IonRow className='text-dark' style={{ backgroundColor: `var(--ion-color-primary-shade)`}}>
                        <IonCol size='3' className="text-center"><strong>TIPO</strong></IonCol>
                        <IonCol size='9' className="text-start"><strong>DESCRIÇÃO</strong></IonCol>
                    </IonRow>
                    {
                        massaColunaTipos.map((tipo, index) => {
                            const color = index % 2 === 0 ? 'medium' : 'none';
                            const icon = tipo.usaPessoa ? usaPessoaIcon(false) : <></>;
                            return (
                                <IonRow key={index} 
                                    className="py-2 ion-justify-content-center ion-aling-items-center text-white"
                                    style={{ backgroundColor: `var(--ion-color-${color})` }} 
                                >
                                    <IonCol size='3' className="ion-aling-items-center">
                                        <IonTitle className="text-center">
                                            {tipo.nomeTipo}{icon}
                                        </IonTitle>
                                    </IonCol>
                                    <IonCol size='9' className="ion-aling-items-center">
                                        <pre className="">{tipo.descricao}</pre>
                                    </IonCol>
                                </IonRow>
                            )
                        })
                    }
                </IonGrid>
            </IonCard>
            <div className="my-3" /> 
        </div>
    );
}

export default ModalTiposDeMassa;