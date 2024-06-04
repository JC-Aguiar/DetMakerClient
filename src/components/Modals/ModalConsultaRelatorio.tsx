import { IonIcon, IonRow, IonCol, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, SelectChangeEventDetail } from "@ionic/react";
import { filter, play, search, } from "ionicons/icons";
import { useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import Botao from "../Core/Botao";

export interface ModalConsultaRelatorioProps {
    onSave?: () => void;
}

const ModalConsultaRelatorio: React.FC<ModalConsultaRelatorioProps> = ({ onSave = () => null }) => {
    //Atrbiutos para usar recursos Redux e React
    const dispatch = useDispatch();

    //Atributos de referência para controle interno
    interface OpcoesConsulta {
        nome: string;
        colunaBanco: string,
        tamanho: number;
    }const semFiltro = "Nada";
    const refPaginaIndex = useRef<HTMLIonInputElement>(null);
    const refFiltroValor = useRef<HTMLIonInputElement>(null);
    const [filtroTipo, setFiltroTipo] = useState<OpcoesConsulta>({nome: semFiltro, colunaBanco: "", tamanho: 0});
    const [oredenacao, setOredenacao] = useState<OpcoesConsulta>({nome: semFiltro, colunaBanco: "", tamanho: 0});

    const opcoesConsulta: OpcoesConsulta[] = [
        {nome: "ID Projeto", colunaBanco: "ID_PROJETO", tamanho: 7}, 
        {nome: "Nome Projeto", colunaBanco: "NOME_PROJETO", tamanho: 200}, 
        {nome: "Nome Atividade", colunaBanco: "NOME_ATIVIDADE", tamanho: 300}, 
        {nome: "Nome Pipeline", colunaBanco: "PIPELINE_ID.NOME", tamanho: 200}, 
        {nome: semFiltro, colunaBanco: "", tamanho: 0}, 
    ];

    const definirFiltroTipo = (event: CustomEvent<SelectChangeEventDetail<OpcoesConsulta>>) => {
        const valor = event.detail.value;
        console.log(`[MODAL CONSULTAR RELATÓRIO]: tipo filtro valor = ${valor.nome}.`);
        setFiltroTipo(valor);
    }

    const definirOrdenacao = (event: CustomEvent<SelectChangeEventDetail<OpcoesConsulta>>) => {
        const valor = event.detail.value;
        console.log(`[MODAL CONSULTAR RELATÓRIO]: ordenação valor = ${valor}.`);
        setOredenacao(valor);
    }

    //Renderização do componente
    return <>
        <div className="container justify-content-center mt-1 px-5">
            <div className='px-3 text-center'>
                <div className='h5 text-white py-2 mt-2 mb-2'>
                    Preencha os dados abaixo para configurar a consulta de Relatórios no banco
                </div>
                <div className='text-primary mt-2'>
                    <IonRow>
                        <IonCol size='12' className="glass m-0 my-1 px-1">
                            <IonItem className='m-0 p-0'>
                                <IonIcon icon={play} className="opacity-50 me-2" />
                                <IonLabel>Consultar a página </IonLabel>
                                <IonInput inputmode="numeric"
                                    type="number"
                                    maxlength={3}
                                    min="1"
                                    step="1"
                                    value={refPaginaIndex.current!.value ? refPaginaIndex.current!.value : 1}
                                    ref={refPaginaIndex}
                                    className='glass m-2 text-white text-end px-1'
                                    style={{ maxWidth: '64px', minWidth: '64px' }}
                                    required
                                />
                                <IonLabel> ordenando por </IonLabel>
                                <IonSelect placeholder={oredenacao.nome} 
                                    onIonChange={definirOrdenacao} 
                                    className="glass m-2 p-2 btn btn-primary d-flex">
                                    {
                                        opcoesConsulta.map((item, index) => <IonSelectOption value={item} key={index}>
                                                {item.nome}
                                            </IonSelectOption>
                                        )
                                    }
                                </IonSelect>
                            </IonItem>
                            <IonItem className='m-0 p-0'>
                                <IonIcon icon={filter} className="opacity-50 me-2" />
                                <IonLabel>Filtrando por </IonLabel>
                                <IonSelect placeholder={filtroTipo.nome} 
                                    onIonChange={definirFiltroTipo} 
                                    className="glass m-2 p-2 btn btn-primary d-flex"
                                >
                                    {
                                        opcoesConsulta.map((item, index) => <IonSelectOption value={item} key={index}>
                                                {item.nome}
                                            </IonSelectOption>
                                        )
                                    }
                                </IonSelect>
                                <IonInput inputmode="text"
                                    maxlength={filtroTipo.tamanho}
                                    ref={refFiltroValor}
                                    placeholder={filtroTipo.nome}
                                    className='glass m-2 text-white'
                                    hidden={filtroTipo.nome === semFiltro}
                                />
                            </IonItem>
                        </IonCol>
                        <IonCol size='12' className="glass m-0 my-1 px-1" />
                    </IonRow>
                    <div className="d-flex ion-justify-content-end py-2">
                        <Botao icon={search}
                            text="Consultar"
                            //disabled={nome.trim().length < 2 || ambienteSftpConexao.trim().length < 2} 
                            handler={() => null} 
                        />
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ModalConsultaRelatorio;