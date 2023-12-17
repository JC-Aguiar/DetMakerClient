import { IonPage, IonContent, IonCard, IonCardContent, IonCardSubtitle, useIonViewWillEnter } from "@ionic/react";
import { useDispatch } from 'react-redux';
import { setButtons } from '../Store/Reducer/ReducerButtons';

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
        return <IonCardSubtitle className="card-text text-primary m-0 text-center">
            {subtitulo}
        </IonCardSubtitle> 
    }

    //Ações ao carregar esta página
    useIonViewWillEnter(() => {  
        dispatch(setButtons([]));
    }, []);

    //Renderização da página
    return (
        <IonPage>
            {recuo}
            <IonContent fullscreen={true} scrollEvents={false}>
                <IonCard className="card my-0 py-0 mx-0 mx-md-2 h-100" >
                    <IonCardContent className="m-0 p-0">
                        {elemento}
                    </IonCardContent>
                </IonCard>
            </IonContent>
            {recuo}
        </IonPage>
    );
}

export default DynamicPage;