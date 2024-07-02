import { IonRow, IonCol, IonIcon, IonInput, IonButton, IonLabel } from "@ionic/react";
import { lockClosed, trash, addCircle } from "ionicons/icons";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/ReduxStore";
import { JobConfig } from "../../data/JobConfigDTO";


export interface PipelineVarProps {
    id: number,
    nome: string,
    valor: string,
    editavel: boolean,
}

//Componente <ListaVariaveisPipeline>
const ListaVariaveisPipeline: React.FC = () => {

    //Atributos do componente
    const mainPip: JobConfig[] = useSelector((state: RootState) => state.store.configAtividade.mainJobs);
    const mainJobs: JobConfig[] = useSelector((state: RootState) => state.store.configAtividade.mainJobs);
    const [variaveisGlobais, setVariaveisGlobais] = useState<PipelineVarProps[]>(
        identificarJobsVariaveis(mainJobs)
    );

    //Identifica as variáveis glovais (campo 'configuracoes') mínimas obrigatórias com base nas variáveis dos Jobs selecionados
    function identificarJobsVariaveis(jobs: JobConfig[]): PipelineVarProps[] {
        return jobs.flatMap(item => Object.entries(item.variaveis))
            .map((entry, index) => ({
                id: index,
                nome: entry[0],
                valor: entry[1],
                editavel: false,
            }))
    }

    //Acionamento automático sempre que os Jobs selecionados forem alterados
    useEffect(() => {
        setVariaveisGlobais(identificarJobsVariaveis(mainJobs));
    }, [mainJobs]);

    //Renderização visual do componente
    return <>
        {
            variaveisGlobais.map((item, index) =>
                <IonRow key={index} className='p-0 m-0 w-100 border-bottom'>
                    <IonCol size='4' className='p-0 m-0 border-end'>
                        <IonRow hidden={item.editavel}
                            className='ion-align-items-center text-white ion-justify-content-between h-100 small p-0 ps-2 m-0'
                        >
                            {item.nome}
                            <IonIcon icon={lockClosed} size='small' className='me-2' />
                        </IonRow>
                        <IonInput type='text'
                            typeof='text'
                            color='light'
                            placeholder={`Variável-${index + 1}`}
                            className='small p-0 m-0'
                            value={item.nome}
                            hidden={!item.editavel}
                            onIonChange={(e) => setVariaveisGlobais(atual => {
                                const index = atual.findIndex(vars => vars.id === item.id);
                                if (index !== -1 && e.detail.value)
                                    atual[index].valor = e.detail.value;
                                return atual;
                            })}
                        />
                    </IonCol>
                    <IonCol size='8' className='m-0 p-0 d-flex'>
                        <IonInput type='text'
                            typeof='text'
                            color='light'
                            placeholder='Valor'
                            className='small p-0 m-0'
                            value={item.valor}
                        />
                        <IonButton fill="clear"
                            shape="round"
                            onClick={() => null}
                            disabled={!item.editavel}
                        >
                            <IonIcon icon={trash} color='light' size='small' />
                        </IonButton>
                    </IonCol>
                </IonRow>
            )
        }
        <IonRow className="m-0 p-0">
            <IonButton color='primary'
                fill="clear"
                expand='full'
                size='small'
                className="m-0 p-0 w-100 opacity-50"
                style={{ backgroundColor: `transparent` }}
                onClick={() => setVariaveisGlobais(
                    [...variaveisGlobais, {
                        id: variaveisGlobais.length,
                        nome: '',
                        valor: '',
                        editavel: true,
                    }]
                )}
            >
                <IonIcon icon={addCircle} size="small" className='m-0' />
                <IonLabel className='small w-100 text-start'>Adicionar variável</IonLabel>
            </IonButton>
        </IonRow>
    </>;
}

export default ListaVariaveisPipeline;