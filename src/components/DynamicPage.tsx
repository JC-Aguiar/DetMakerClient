import { IonPage, IonContent, useIonToast, ToastButton } from "@ionic/react";


export interface DynamicPageProps {
    titulo: string,
    subtitulo: string,
    elemento: JSX.Element
}

const DynamicPage: React.FC<DynamicPageProps> = ({ titulo, subtitulo, elemento }) => {  
    const subtituloTag = () => {
        if (subtitulo.length === 0) return <></>;
        return <h3 className="card-text text-primary m-0 text-center">
            {subtitulo}
        </h3> 
    }

    return (
        <IonPage>
            <IonContent fullscreen={true} scrollEvents={true} >
                <div className='pt-3 pt-md-4' />
                <div className="card border border-2 pt-2 px-5 mx-0 mx-md-5">
                    <h1 className="card-title destaque-low m-0 text-center">
                        {titulo}
                    </h1>
                    {subtituloTag()}
                    {elemento}
                    <div className='py-3 py-md-4' />
                </div>
                <div className='pt-3 pt-md-4' />
            </IonContent>
        </IonPage>
    );
}

export default DynamicPage;