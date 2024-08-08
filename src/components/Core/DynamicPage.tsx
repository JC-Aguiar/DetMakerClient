import { IonPage, IonContent, IonFooter } from "@ionic/react";
import { useDispatch } from 'react-redux';
import Informativo from "./Informativo";

export interface DynamicPageProps {
    titulo: string,
    subtitulo: string,
    elemento: JSX.Element
}

const DynamicPage: React.FC<DynamicPageProps> = ({ titulo, subtitulo, elemento }) => {  
    //Atributos gerais
    const dispatch = useDispatch();
    const recuo = <div className='py-1 py-md-2' />;
    const subtituloTag = () => {
        if (subtitulo.length === 0) return <></>;
        return <span className="mx-1 small fw-normal">
            {subtitulo}
        </span> 
    }

    //Conteúdo a ser renderizado dentro da página
    const conteudo = () => {
        try {
            return elemento;
        }
        catch (error) {
            const mensagem = (error instanceof Error) ? error.message : `${error}`;
            return <Informativo status="Erro" mensagem={mensagem} />
        }
    }

    //Renderização da página
    return (
        <IonPage className="mt-2">
            <IonContent scrollEvents={true} className="p-0 m-0" >
                <div className="mx-2" >
                    {conteudo()}
                </div>
            </IonContent>
            <IonFooter className='m-2 opacity-0' />
        </IonPage>
    );
}

export default DynamicPage;