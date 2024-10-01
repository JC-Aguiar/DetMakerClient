import { IonPage, IonContent, IonFooter, IonMenu, IonSplitPane } from "@ionic/react";
import { useDispatch } from 'react-redux';
import Informativo from "./Informativo";
import { ListaRetratrilAgrupada } from "./ListaRetratil";

export interface DynamicPageProps {
    titulo: string,
    subtitulo: string,
    elemento: JSX.Element,
    painel?: JSX.Element,
}

const DynamicPage: React.FC<DynamicPageProps> = ({ titulo, subtitulo, elemento, painel }) => {  
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
    // <IonFooter className='m-2 opacity-0' >
    return (
        <IonPage className="mt-2">
            <IonSplitPane when="xs" contentId="pipelineContent" className=''>
                <div className='glass w-25' color='#' hidden={!painel}>
                    <IonContent className='glass-content p-0 m-0'>
                        <div className="ps-2">
                            {painel}
                        </div>
                    </IonContent>
                </div>
                <div className="container" id="pipelineContent" >
                    <IonContent scrollEvents={true} className="p-0 m-0 w-100 h-100">
                        {conteudo()}
                    </IonContent>
                </div>
            </IonSplitPane>
        </IonPage>
    );
}

export default DynamicPage;