import { IonPage, IonContent, IonCard, IonCardContent, IonCardSubtitle, useIonViewWillEnter, IonBadge, IonIcon, IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import { useDispatch } from 'react-redux';
import { setButtons } from '../Store/Reducer/ReducerButtons';
import { radioButtonOn } from "ionicons/icons";
import Fundo from "./Fundo";

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

    //Ações ao carregar esta página
    useIonViewWillEnter(() => {  
        //dispatch(setButtons([]));
    }, []);

    //Renderização da página
    return (
        <IonPage>
            <IonContent fullscreen={true} scrollEvents={true} className="p-0 m-0">
                <p className="text-start p-0 m-0 pt-2">
                    <IonBadge color="#" className="bg-transparent text-light text-start px-0 p-0 mx-3 border-bottom rounded rounded-0">
                        <span className="h6 lh-1">
                            {titulo} - 
                        </span>
                        {subtituloTag()}
                    </IonBadge>
                </p>
                <div className="pe-2 me-5">{elemento}</div>
            </IonContent>
        </IonPage>
    );
}

export default DynamicPage;