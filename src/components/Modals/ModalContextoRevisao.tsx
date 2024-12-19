import { IonInput, IonLabel, IonItem, IonTextarea, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from "@ionic/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addMensagem, atualizarMensagem } from "../../Store/Reducer/ReducerAtividade";
import { RelatorioComplementoDTO } from "../../data/RelatorioComplementoDTO";
import Botao from "../Core/Botao";


//Interface das propriedades do componente <ModalContextoRevisao>
export interface ModalContextoRevisaoProps {
    relatorioId: number | null,
    apply: (contexto: RelatorioComplementoDTO) => void;
}

//Componente <ModalContextoRevisao>
const ModalContextoRevisao: React.FC<ModalContextoRevisaoProps> = (props) => {

    //Atributos do componente
    const dispatch = useDispatch();
    const [inputProjetoId, setInputProjetoId] = useState<string>("");
    const [inputProjetoNome, setInputProjetoNome] = useState<string>("");
    const [inputAtividade, setInputAtividade] = useState<string>("");
    const [inputConsideracoes, setInputConsideracoes] = useState<string>("");

    //Validando os campos obrigatórios
    const complementoValido = () => inputProjetoId.trim().length > 0 
            && inputProjetoNome.trim().length > 0
            && inputAtividade.trim().length > 0;

    //Aplicando campos do Projeto e da Atividade
    const definirContexto = async () => {
        const mensagemId = `Set_ReviewContext@${Date.now()}`;
        if (!props.relatorioId) {
            dispatch(addMensagem({ 
                id: mensagemId, 
                texto: `Relatório sem ID válido.`,
                status: 'ERROR'
            }));
            return;
        }
        if (!complementoValido()) {
            dispatch(addMensagem({ 
                id: mensagemId, 
                texto: `A identificação do Relatório possui campos pendente.`,
                status: 'ERROR'
            }));
            return;
        }
        const contexto: RelatorioComplementoDTO = {
            id: props.relatorioId,
            idProjeto: inputProjetoId,
            nomeProjeto: inputProjetoNome,
            nomeAtividade: inputAtividade,
            consideracoes: inputConsideracoes,
        };
        props.apply(contexto);
    };

    //Renderização visual do componente
    return <div className="mx-4">
        <IonCard className="shadow-none p-0 m-0 my-2">
            <IonCardHeader className="py-1">
                <IonCardTitle>PROJETO</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="p-0 m-0">
                <IonItem lines="none" className="ion-align-items-center">
                    <IonLabel>ID</IonLabel>
                    <IonInput
                        color="primary"
                        className='glass m-2'
                        type='text'
                        style={{ maxWidth: '88px' }}
                        inputmode='text'
                        maxlength={7}
                        value={inputProjetoId}
                        onIonChange={e => {
                            const novoid = e.detail.value; 
                            setInputProjetoId(novoid ? novoid : "");
                        }}
                    />
                    <IonLabel className='ms-3'>NOME</IonLabel>
                    <IonInput
                        color="primary"
                        className='glass mx-2'
                        type='text'
                        inputmode='text'
                        maxlength={200}
                        value={inputProjetoNome}
                        onIonChange={e => {
                            const novonome = e.detail.value; 
                            setInputProjetoNome(novonome ? novonome : "");
                        }}
                    />
                </IonItem>
            </IonCardContent>
        </IonCard>
        <IonCard className="shadow-none p-0 m-0 my-3">
            <IonCardHeader className="py-1">
                <IonCardTitle>ATIVIDADE</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="p-0 m-0">
                <IonItem lines="none" className="ion-align-items-center">
                    <IonLabel>NOME</IonLabel>
                    <IonInput
                        color="primary"
                        className='glass m-2'
                        type='text'
                        inputmode='text'
                        maxlength={300}
                        value={inputAtividade}
                        onIonChange={e => {
                            const novatividade = e.detail.value; 
                            setInputAtividade(novatividade ? novatividade : "");
                        }}
                    />
                </IonItem>
            </IonCardContent>
        </IonCard>
        <IonCard className="shadow-none p-0 m-0 my-3">
            <IonCardHeader className="py-1">
                <IonCardTitle>CONSIDERAÇÕES ADICIONAIS</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonTextarea
                    rows={4}
                    color="primary"
                    value={inputConsideracoes} 
                    inputmode='text'
                    maxlength={500}
                    className='glass ps-2 my-2'
                    style={{ innerHeight: '300px' }}
                    onIonChange={e => {
                        const texto = e.detail.value; 
                        setInputConsideracoes(texto ? texto : "");
                    }}
                />
            </IonCardContent>
        </IonCard>
        <IonRow className="ion-justify-content-end">
            <Botao text="Definir" handler={definirContexto} />
        </IonRow>
    </div>;
};

export default ModalContextoRevisao;