import { IonLabel, IonItem, IonList, IonSelect, IonSelectOption, IonBadge, IonIcon } from "@ionic/react";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/ReduxStore";
import { MassaTabelaDTO } from "../../data/MassaTabelaDTO";
import { library } from "ionicons/icons";


//Interface das variáveis globais (configurações) da Pipeline
export interface PipelineVarProps {
    id: number,
    nome: string,
    valor: string,
    editavel: boolean,
}

//Interface dos métodos acionáveis via referência do <BotaoMassasPipeline>
export interface BotaoMassasPipelineRef {
    massas: () => MassaTabelaDTO[]
}

//Componente <BotaoMassasPipeline>
const BotaoMassasPipeline = forwardRef<BotaoMassasPipelineRef>((props, ref) => {

    //Atributos do componente
    const massasBanco: MassaTabelaDTO[] = useSelector((state: RootState) => state.store.catalogoMassas.catalogo);
    const [massasSelecionadas, setMassasSelecionadas] = useState<MassaTabelaDTO[]>([]);

    //Disponibilizando os métodos acionáveis via referência 
    useImperativeHandle(ref, () => ({
        massas: () => massasSelecionadas
    }));

    //Acionamento automático sempre que os Jobs selecionados forem alterados
    useEffect(() => {
        setMassasSelecionadas([]);
    }, [massasBanco]);


    //Renderização visual do componente
    return (
        <IonList className="glass mx-2">
            <IonItem disabled={massasBanco.length < 1}>
                <IonIcon icon={library} className='mx-2' />
                <IonSelect 
                    multiple={true}
                    className="select-button text-white me-2"
                    onIonChange={(ev) => setMassasSelecionadas(ev.detail.value)}
                    selectedText={"Escolher Massas"}
                >
                    {
                        //Opções de seleção
                        massasBanco.map((item, index) => 
                            <IonSelectOption key={index} value={item}>
                                {item.nome}
                            </IonSelectOption>
                        )
                    }
                </IonSelect>
                {
                    //Massas selecionadas
                    massasSelecionadas.map(item => item.nome)
                        .map((nome, index) => 
                            <IonBadge key={index} className="mx-1">{nome}</IonBadge>
                        )
                }
            </IonItem>
        </IonList>
    );
});

export default BotaoMassasPipeline;