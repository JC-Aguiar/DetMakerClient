import { IonApp, IonHeader, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Intro from './pages/Intro';
import "./App.css";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { useState } from 'react';
import { document, checkbox, settings, documentText } from 'ionicons/icons';
import Login from './pages/Login';
import CarregarJobs from './pages/CarregarJobs';
import EscolherJobs from './pages/EscolherJobs';
import ConfigurarJobs from './pages/ConfigurarJobs';
import { JobInfoDTO } from './data/JobInfoDTO';
import { JobConfigDTO } from './data/JobExecute';
import { RootState } from './Store/ReduxStore';
import Det from './pages/Det';

/* Recursos de uso comum */

setupIonicReact();

export interface AgendaParaPilha {
    add: boolean,
    job: JobInfoDTO
}

export const dataFormato: Intl.DateTimeFormatOptions = {
    dateStyle: 'short', //Utiliza o formato de data curta com separador "/"
};

/* Componente <App> */
const App = () => {
    const [boasVindas, setBoasVindas] = useState(false);
    //const location = useLocation();
    //const hideTabBarRoutes = ['/det-maker/evidence', '/signup'];
    //setMenuOn(hideTabBarRoutes.some(route => location.pathname.includes(route)));
    const menuTabOn: boolean = useSelector((state: RootState) => state.store.tabMenu);
    const pilha: JobConfigDTO[] = useSelector((state: RootState) => state.store.pilhaJobs.value);
    const escolherJobsOpt: boolean = pilha.length > 0;
    const jobsCount: number = pilha.filter((itemPilha) => itemPilha.job.checked).length;
    const configurarJobsOpt: boolean = jobsCount > 0;
    const executarJobsOpt: boolean = false;
    const evidenciaPag: boolean = useSelector((state: RootState) => state.store.evidenciaJobs);

    function animationEnd() {
        setBoasVindas(true);
    }

    function contadorConfigJobs() {
        if (jobsCount === 0) return null;
        return (
            <span className='badge bg-primary config-job-count'>{jobsCount}</span>
        );
    }

    function intro() {
        return (
            <>
                <Route path="/intro" exact>
                    <Intro callBack={animationEnd} />
                </Route>
                <Redirect from='/*' to="/intro" />
            </>
        );
    }

    function menu() {
        return (
            <div className='banner h-100'>

                {/* Logo */}
                <IonHeader id='ppw-titulo' className='text-center' hidden={!menuTabOn}>
                    <div className="navbar-brand disabled text-white fs-1 m-0 lh-1" >
                        Peopleware
                        {/*<div className="fs-6">joao.aguiar@gmail.com</div>*/}
                    </div>
                </IonHeader>

                {/* Rotas Url */}
                <IonTabs>
                    <IonRouterOutlet>
                        <Route path="/det-maker/open" exact> <CarregarJobs /> </Route>
                        <Route path="/det-maker/select" exact> <EscolherJobs /> </Route>
                        <Route path="/det-maker/config" exact> <ConfigurarJobs /> </Route>
                        <Route path="/det-maker/evidence" exact> <Det /> </Route>
                        <Route> <Redirect to="/det-maker/open" /> </Route>
                    </IonRouterOutlet>

                    {/* Links no menu */}
                    <IonTabBar slot="top" className='pt-4 pb-1 mx-0 mx-md-1 bg-transparent mt-1 border-gold' hidden={!menuTabOn}>
                        {/* Carregar Jobs */}
                        <IonTabButton tab="open" href="/det-maker/open"
                            className='pt-1 bg-transparent fw-bold'
                        >
                            <IonIcon icon={document} />
                            <IonLabel>Carregar Jobs</IonLabel>
                        </IonTabButton>

                        {/* Escolher Jobs */}
                        <IonTabButton tab="select" href="/det-maker/select/"
                            className='pt-2 bg-transparent fw-bold'
                            disabled={!escolherJobsOpt}
                        >
                            <IonIcon icon={checkbox} />
                            <IonLabel>Escolher Jobs</IonLabel>
                        </IonTabButton>

                        {/* Configurar Jobs */}
                        <IonTabButton tab="config" href="/det-maker/config"
                            className='pt-2 bg-transparent fw-bold'
                            disabled={!configurarJobsOpt}
                        >
                            <IonIcon icon={settings} />
                            <IonLabel>Configurar Jobs {contadorConfigJobs()} </IonLabel>
                        </IonTabButton>


                        {/* Evidencia */}
                        <IonTabButton tab="evidence" href="/det-maker/evidence"
                            className='pt-2 bg-transparent fw-bold'
                            disabled={!configurarJobsOpt}
                        >
                            <IonIcon icon={documentText} />
                            <IonLabel>Evidencia</IonLabel>
                        </IonTabButton>
                    </IonTabBar>
                </IonTabs>
            </div>
        );
    }

    function principal() {
        //if login
        if (true) return menu();
        else return <Login />;
    }

    function rotasDeAcesso() {
        //if boasVindas
        if (true) return principal();
        else return intro();
    }

    return (
        <IonApp>
            <IonReactRouter>
                {rotasDeAcesso()}
            </IonReactRouter>
        </IonApp>
    );
};

export default App;

/* BACKUP
<Redirect exact path="/" to="/home" />
<IonRouterOutlet id="main">
    <Route path="/det-maker/open" exact><Page page={page} /></Route>
    <Route path="/det-maker/select" exact><Page page={page} /></Route>
    <Route path="/det-maker/config" exact><Page page={page} /></Route>
    <Route path="/det-maker/run" exact><Page page={page} /></Route>
    <Route><Redirect to="/det-maker/open" /></Route>
</IonRouterOutlet>
*/
