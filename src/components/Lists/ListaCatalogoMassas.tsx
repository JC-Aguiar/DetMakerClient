import { InputChangeEventDetail, IonInput, IonList, useIonModal } from "@ionic/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/ReduxStore";
import { open, search } from "ionicons/icons";
import ItemLista from "../Core/ItemLista";
import DynamicModal from "../Core/DynamicModal";
import { MassaTabelaDTO } from "../../data/MassaTabelaDTO";
import ModalConfigMassa from "../Modals/ModalConfigMassa";

const ListaCatalogoMassas: React.FC = () => {
    //Atributos com estado gerenciado via Redux
    const catalogoMassas: MassaTabelaDTO[] = useSelector((state: RootState) => state.store.catalogoMassas.catalogo);

    //Atributos com estado gerenciado via React
    const [massaPesquisada, setMassaPesquisada] = useState<string>("");
    const [massaToView, setMassaToView] = useState<string>("");
    const [modalConfigMassaOn, modalConfigMassaOff] = useIonModal(
        DynamicModal,
        {
            titulo: "Mapeamento de Massa",
            elemento: <ModalConfigMassa massa={catalogoMassas.find(massa => massa.nome === massaToView)} />,
            onDismiss: () => modalConfigMassaOff(),
            //helpContent: <ModalTiposDeMassa />,
        }
    );

    //Tenta encontrar possíveis Jobs para determinada máscara de pesquisa
    const procurarMassa = (e: CustomEvent<InputChangeEventDetail>) => {
        const valor = (e.target as HTMLInputElement).value.trim();
        setMassaPesquisada(valor);
    }

    //Renderizando componente
    return (
        <IonList className='m-0 p-0'>
            <ItemLista texto="" icone={search} >
                <IonInput inputmode='text'
                    maxlength={500}
                    placeholder="Pesquisar Massa"
                    value={massaPesquisada}
                    className='text-white'
                    onIonChange={(e) => procurarMassa(e)}
                    required
                />
            </ItemLista>
            {
                catalogoMassas.filter(item => item.nome.includes(massaPesquisada))
                    .map((item, index) => {
                        const cor = index % 2 === 0 ? 'medium' : 'none';
                        return (
                            <ItemLista key={index} 
                                texto={item.nome} 
                                tag={item.colunas.length} 
                                cor={cor}
                                icone={open}
                                trigger={() => {
                                    setMassaToView(item.nome);
                                    modalConfigMassaOn();
                                }}
                            />
                        );
                })
            }
        </IonList>
    );
};

export default ListaCatalogoMassas;