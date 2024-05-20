import { IonCol, IonRow, IonCard, IonGrid, IonTitle, IonBadge } from "@ionic/react";
import { MapObject, MassaPreparada } from "../../data/MassaPreparada";

export interface ModalTesteMassaProps {
    massa: MassaPreparada[],
}

const ModalTesteMassa: React.FC<ModalTesteMassaProps> = ({massa}) => {
    //Mapeia todos as colunas de uma Massa
    const gerarRegistros = (linha: MapObject): JSX.Element[] => {
        let index = 0;
        const elementos: JSX.Element[] = [];
        for (let [coluna, valor] of Object.entries(linha)) {
            const color = index % 2 === 0 ? 'medium' : 'none';
            elementos.push(gerarColunaValor(color, coluna, valor));
        }
        return elementos;
    }

    //Renderiza o campo e valor de uma coluna da Massa
    const gerarColunaValor = (color: string, coluna: string, valor: any) => {
        return <IonRow className="glass my-2 mx-5 ion-justify-content-center ion-aling-items-center text-center text-white"
            style={{ backgroundColor: `var(--ion-color-${color})` }} 
        >
            <IonCol className="h5">{coluna}</IonCol>
            <IonCol>{valor}</IonCol>
        </IonRow>
                            
    }

    //Renderização do componente
    return (
        <div className="row justify-content-center px-3 mx-0 text-center">
            <IonCard className="glass ">
            {
                massa.map((tabela, tabelaIndex) => {
                    return (
                        <IonGrid key={tabelaIndex} className="glass-content text-primary p-0 m-0 w-100 h-100" >
                            <IonTitle>{tabela.tabela}</IonTitle>
                            <IonRow className='text-dark' style={{ backgroundColor: `var(--ion-color-primary-shade)`}}>
                                <IonTitle>Registros gerados com sucesso</IonTitle>
                            </IonRow>
                            {gerarRegistros(tabela.colunasGeradas)}
                        </IonGrid>
                    );
                })
            }
            {
                massa.map((tabela, tabelaIndex) => {
                    if (Object.keys(tabela.colunasErro).length < 1) return;
                    return (
                        <IonGrid key={tabelaIndex} className="glass-content text-primary p-0 m-0 w-100 h-100" > 
                            <IonRow className='text-dark' style={{ backgroundColor: `var(--ion-color-primary-shade)`}}>
                                <IonTitle>Registros gerados com erro</IonTitle>
                            </IonRow>
                            {gerarRegistros(tabela.colunasErro)}
                        </IonGrid>
                    );
                })
            }
            </IonCard>
        </div>
    );
}

export default ModalTesteMassa;