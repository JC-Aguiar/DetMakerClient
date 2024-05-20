import { TextareaChangeEventDetail, IonTextarea, IonButton, IonIcon } from "@ionic/react";
import { save, shieldCheckmark, close } from "ionicons/icons";
import { useState } from "react";
import { ComandoSQL } from "../../data/ComandoSQL";

export interface ModalConfigQueryProps {
    configQuery: ComandoSQL,
    callback: () => string,
}

const ModalConfigQuery: React.FC<ModalConfigQueryProps> = ({ configQuery, callback }) => {
    const [getSql, setSql] = useState<string>(configQuery.sql);
    const queryTamanhoMin = getSql.trim().length > 15;

    callback = () => getSql;

    //Handler para preencher query
    const preencherSql = (event: CustomEvent<TextareaChangeEventDetail>) => {
        const value = (event.target as HTMLInputElement).value.trim();
        setSql(value);
        //console.log(`[MODAL CONFIG-QUERY] ConfigQuery ID ${query.id} teve sua query alterada para: '${value}'.`);
    }

    //Layout dos botões  
    const layoutButao = (texto: string, icon: string, trigger: () => void) => (
        <IonButton fill='solid' className='w-100'  disabled={!queryTamanhoMin} onClick={trigger}> 
            <IonIcon icon={icon} className='me-2'/>
            {texto}
        </IonButton>
    );

    //Componentes dos botões
    const botoes = [
        layoutButao("Salvar", save, () => null),
        layoutButao("Testar", shieldCheckmark, () => null),
        layoutButao("Cancelar", close, () => null)
    ];

    //Conteúdo visual
    return (
        <div className='position-relative mx-3 px-2'>
            <div className="text-center pb-3">
                {configQuery.descricao}
            </div>
            <IonTextarea className='text-start glass font-monospace'
                inputmode='text'
                rows={9}
                maxlength={900}
                value={getSql}
                onIonChange={(e) => preencherSql(e)}
            />
            <div className='d-flex my-2'>
                {botoes}
            </div>
        </div>
    );
}

export default ModalConfigQuery;