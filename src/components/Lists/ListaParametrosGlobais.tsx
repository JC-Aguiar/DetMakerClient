import { IonRow, IonCol, IonIcon, IonInput, IonButton, IonLabel, InputChangeEventDetail, IonItem, IonBadge } from "@ionic/react";
import { lockClosed, trash, addCircle } from "ionicons/icons";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/ReduxStore";
import { JobConfig } from "../../data/JobConfig";
import { VariavelDinamica } from "../../data/VariavelDinamica";
import { log } from "console";


//Interface das variáveis globais (configurações) da Pipeline
export interface ParametroGlobalProps {
    id: number,
    nome: string,
    valor: string,
    editavel: boolean,
}

//Interface dos métodos acionáveis via referência do <ListaParametrosGlobais>
export interface ListaParametrosGlobaisRef {
    variaveis: () => VariavelDinamica[]
}

//Componente <ListaParametrosGlobais>
const ListaParametrosGlobais = forwardRef<ListaParametrosGlobaisRef>((props, ref) => {

    //Atributos do componente
    const mainPipeline: string = useSelector((state: RootState) => state.store.configAtividade.mainPipeline);
    const mainPipelineId: number = useSelector((state: RootState) => state.store.configAtividade.mainPipelineId);
    const mainJobs: JobConfig[] = useSelector((state: RootState) => state.store.configAtividade.mainPipelineJobs);
    const queries = useSelector(
        (state: RootState) => state.store.catalogoQueries.catalogo.filter(
            query => mainJobs.some(job => job.id === query.jobId)
        )
    );
    const [variaveisGlobais, setVariaveisGlobais] = useState<VariavelDinamica[]>(
        identificarJobsVariaveis()
    );

    //Disponibilizando os métodos acionáveis via referência 
    useImperativeHandle(ref, () => ({
        variaveis: () => variaveisGlobais
    }));

    //Acionamento automático sempre que os Jobs selecionados forem alterados
    useEffect(() => {
        setVariaveisGlobais(identificarJobsVariaveis());
    }, [mainJobs, mainPipelineId]);

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

    //Edita o nome da variável para determinado index
    function editarNome(index: number, e: CustomEvent<InputChangeEventDetail>): void {
        setVariaveisGlobais(atual => {
            console.log("editarNome.atual: " + JSON.stringify(atual));
            console.log("editarNome.index: " + index + ". value: " + e.detail.value);
            if (index > -1 && e.detail.value)
                atual[index] = {...atual[index], nome: e.detail.value};
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
                <IonRow key={index} className='h-100 w-100 ion-align-items-center ion-justify-content-start p-0 m-0'>
                    <IonCol size='3' className='p-0 m-0'>
                        <IonRow className='ion-align-items-center d-flex'>
                            <IonButton fill="clear"
                                shape="round"
                                size="small"
                                className="m-0 p-0"
                                onClick={() => removerVariavel(index)}
                                disabled={!item.removivel}
                            >
                                <IonIcon icon={item.removivel ? trash : lockClosed} color='light' size='small' />
                            </IonButton>
                            <IonLabel className="text-white small" hidden={item.removivel}>{item.nome}</IonLabel>
                            <IonInput type='text'
                                typeof='text'
                                color='light'
                                placeholder={`Variável-${index + 1}`}
                                className='glass small p-0 m-0'
                                value={item.nome}
                                hidden={!item.removivel}
                                onIonChange={(e) => editarNome(index, e)}
                            />
                        </IonRow>
                    </IonCol>
                    <IonCol size='9' className='p-0 m-0'>
                        <IonItem className="p-0 m-0 ion-align-items-center" lines="none" >
                            <IonInput type='text'
                                typeof='text'
                                color='light'
                                placeholder={item.descricao}
                                className='glass small p-0 m-0 me-1 px-1'
                                value={item.valor}
                                onIonChange={(e) => editarValor(index, e)}
                            />
                            <IonBadge color="primary" className="mt-1 small text-center" >
                                {item.origem} {/*VariavelDinamica.tipoAlias(item)*/}
                            </IonBadge>
                        </IonItem>
                    </IonCol>
                </IonRow>
            )
        }
        <IonRow className="m-0 p-0 ">
            <IonButton color='primary'
                fill="clear"
                expand='full'
                size='small'
                className="m-0 p-0 pt-1 w-100 opacity-75 item-lista"
                style={{ backgroundColor: `transparent` }}
                onClick={() => novaVariavel()}
            >
                <IonIcon icon={addCircle} size="small" className='m-0 me-1' />
                <IonLabel className='small w-100 text-start'>Adicionar variável</IonLabel>
            </IonButton>
        </IonRow>
    </>;
});

export default ListaParametrosGlobais;