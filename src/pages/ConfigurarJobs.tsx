import { IonApp, IonButton, IonContent, IonIcon, IonPage, IonSlide, IonSlides, ScrollDetail, useIonViewDidEnter } from '@ionic/react';
import { useHistory, useParams } from 'react-router';
import { pilha } from '../App';
import JobCard from '../components/JobCard';
import GaleriaFilmes from '../components/GaleriaFilmes';

const ConfigurarJobs = (props: any) => {
    const { name } = useParams<{ name: string }>();
    const history = useHistory();

    useIonViewDidEnter(() => {
        if (pilha.length === 0) {
            console.log(`[CONFIGURAR-JOBS] A pilha está vazia. Retornando página.`);
            history.goBack();
        }
        else {
            console.log(`[CONFIGURAR-JOBS] Carregando cards da pilha dos jobs selecionados.`);
        }
    }, []);

    return (
        <IonPage>
            <IonContent fullscreen={true} scrollEvents={true} >
                <div className='pt-3 pt-md-5'></div>
                <div id="capa-jobs" className="row justify-content-center border border-2 rounded rounded-2 bg-white p-3 p-md-0 mx-0 mx-md-4">
                    <h1 className="card-title destaque lh-1 m-0 text-center">Pilha de Jobs</h1>
                    <h3 className="card-text h3 text-primary ms-2 text-center">Preencha todos os campos de cada job para poder executá-los.</h3>
                    <IonSlides pager={true}>
                        {
                            pilha.map((item, index) => {
                                const dto = item.job;
                                return (
                                    <IonSlide key={index}>
                                        <JobCard dto={item.job} numeroPilha={index} key={index} />
                                    </IonSlide>
                                );
                            })
                        }
                    </IonSlides>
                    <div className='mb-5'></div>
                </div>
                <div className='pt-3 pt-md-5'></div>
            </IonContent>
        </IonPage>
    );
};

export default ConfigurarJobs;
