import { IonRow, IonCol, IonIcon, IonInput, IonButton, IonLabel, InputChangeEventDetail, IonItem, IonBadge } from "@ionic/react";
import { lockClosed, trash, addCircle } from "ionicons/icons";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/ReduxStore";
import { JobConfig } from "../../data/JobConfigDTO";
import { VariavelDinamica } from "../../data/VariavelDinamica";


//Interface das variáveis globais (configurações) da Pipeline
export interface PipelineVarProps {
    id: number,
    nome: string,
    valor: string,
    editavel: boolean,
}

//Interface dos métodos acionáveis via referência do <ListaVariaveisPipeline>
export interface ListaVariaveisPipelineRef {
    variaveis: () => VariavelDinamica[]
}

//Componente <ListaVariaveisPipeline>
const ListaVariaveisPipeline = forwardRef<ListaVariaveisPipelineRef>((props, ref) => {

    //Atributos do componente
    const mainPipeline: string = useSelector((state: RootState) => state.store.configAtividade.mainPipeline);
    const mainJobs: JobConfig[] = useSelector((state: RootState) => state.store.configAtividade.mainJobs);
    const queries = useSelector((state: RootState) => state.store.catalogoQueries.catalogo)
        .filter(query => mainJobs.some(job => job.id === query.jobId));
    const [variaveisGlobais, setVariaveisGlobais] = useState<VariavelDinamica[]>(
        identificarJobsVariaveis()
    );

    //Disponibilizando os métodos acionáveis via referência 
    useImperativeHandle(ref, () => ({
        variaveis: () => variaveisGlobais
    }));

    //Identifica as variáveis glovais (campo 'configuracoes') mínimas obrigatórias com base nas variáveis dos Jobs selecionados
    function identificarJobsVariaveis(): VariavelDinamica[] {
        const vars = mainJobs.flatMap(job => job.variaveis);
        queries.flatMap(query => Array.from(query.filtros.entries()))
            .map(([coluna, variavel]) => VariavelDinamica.newQueryFiltro(coluna, variavel))
            .forEach(item => vars.push(item));
        
        return vars.reduce((listaFinal: VariavelDinamica[], v) => {
            const varAlvo = listaFinal.find(item => item.nome === v.nome);
            if (!varAlvo) listaFinal.push(v);
            return listaFinal;
        }, []);
    }

    //Acionamento automático sempre que os Jobs selecionados forem alterados
    useEffect(() => {
        setVariaveisGlobais(identificarJobsVariaveis());
    }, [mainJobs]);

    //Edita o nome da variável para determinado index
    function editarNome(index: number, e: CustomEvent<InputChangeEventDetail>): void {
        setVariaveisGlobais(atual => {
            if (index > -1 && e.detail.value)
                atual[index].nome = e.detail.value;
            return atual;
        });
    }

    //Edita o valor da variável para determinado index
    function editarValor(index: number, e: CustomEvent<InputChangeEventDetail>): void {
        setVariaveisGlobais(atual => {
            if (index > -1 && e.detail.value)
                atual[index] = {...atual[index], valor: e.detail.value};
            return atual;
        });
    }

    //Cria nova variável
    function novaVariavel(): void {
        setVariaveisGlobais([
            ...variaveisGlobais, 
            VariavelDinamica.newDefault(`Nova propriedade da ${mainPipeline}`)
        ]);
    }

    function removerVariavel(index: number): void {
        setVariaveisGlobais(variaveisGlobais.filter((item, itemIndex) => itemIndex !== index));
    }

    //Renderização visual do componente
    return <>
        {
            variaveisGlobais.map((item, index) =>
                <IonRow key={index} className='p-0 m-0 w-100 border-bottom'>
                    <IonCol size='3' className='p-0 m-0 border-end'>
                        <IonRow className='ion-align-items-center ion-justify-content-between p-0 ps-2 m-0'>
                            <div className="text-white small ps-2" hidden={item.removivel}>{item.nome}</div>
                            <IonInput type='text'
                                typeof='text'
                                color='light'
                                placeholder={`Variável-${index + 1}`}
                                className='small p-0 m-0'
                                value={item.nome}
                                hidden={!item.removivel}
                                onIonChange={(e) => editarNome(index, e)}
                            />
                            <IonButton fill="clear"
                                shape="round"
                                onClick={() => removerVariavel(index)}
                                disabled={!item.removivel}
                            >
                                <IonIcon icon={item.removivel ? trash : lockClosed} color='light' size='small' />
                            </IonButton>
                        </IonRow>
                    </IonCol>
                    <IonCol size='9' className='p-0 m-0 d-flex'>
                        <IonItem className="p-0 m-0 w-100" lines="none" >
                            <IonInput type='text'
                                typeof='text'
                                color='light'
                                placeholder={item.descricao}
                                className='small p-0 m-0'
                                value={item.valor}
                                onIonChange={(e) => editarValor(index, e)}
                            />
                            <IonBadge color="primary" >
                                {VariavelDinamica.tipoAlias(item)}
                            </IonBadge>
                        </IonItem>
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
                onClick={() => novaVariavel()}
            >
                <IonIcon icon={addCircle} size="small" className='m-0' />
                <IonLabel className='small w-100 text-start'>Adicionar variável</IonLabel>
            </IonButton>
        </IonRow>
    </>;
});

export default ListaVariaveisPipeline;