import { IonApp, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonLabel, IonMenuToggle, IonPopover, IonRouterOutlet, IonRow, IonSplitPane, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar, setupIonicReact, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';
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
import { playCircle, radio, library, search, document, checkbox, cog, flash, personCircle } from 'ionicons/icons';
import Login from './components/Login';
import AbrirSchedule from './pages/AbrirSchedule';
import EscolherJobs from './pages/EscolherJobs';

setupIonicReact();

export enum UserProfileEnum {
    Visitante,
    Usuário,
    Convidado,
    Criança,
}



const App = () => {
    const [page, setPage] = useState<string>("");
    const [boasVindas, setBoasVindas] = useState(false);

    const [popoverOpen, setPopoverOpen] = useState(false);

    function handleUserButton(e: any) {
        if (e.detail.tab === 'user') {
            setPopoverOpen(true);
        }
    }

    function animationEnd() {
        setBoasVindas(true);
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
                <IonHeader id='ppw-titulo' className='text-center' >
                    <div className="navbar-brand disabled text-white fs-1 m-0 lh-1" >
                        Peopleware
                        {/*<div className="fs-6">joao.aguiar@gmail.com</div>*/}

                    </div>

                </IonHeader>
                <IonTabs>
                    <IonRouterOutlet>
                        <Route path="/det-maker/open"   render={() => <AbrirSchedule />} exact={true} />
                        <Route path="/det-maker/select" render={() => <EscolherJobs />} exact={true} />
                        <Route path="/det-maker/config" render={() => <Page page={page} />} exact={true} />
                        <Route path="/det-maker/run"    render={() => <Page page={page} />} exact={true} />
                        <Route><Redirect to="/det-maker/open" /></Route>
                    </IonRouterOutlet>
                    <IonTabBar slot="top"
                        className='pt-4 pb-1 mx-0 mx-md-1 bg-transparent mt-1 border-gold'
                        onIonTabsWillChange={handleUserButton}
                    >
                        {/* USUÁRIO INFO 
                        <IonTabButton tab="user" className='pt-1 bg-transparent fw-bold'>
                            
                            <IonPopover ref={null} isOpen={popoverOpen} onDidDismiss={() => setPopoverOpen(false)}>
                                <div className="ion-padding px-5">joao.aguiar@gmail.com</div>
                            </IonPopover>

                            <IonIcon icon={personCircle} />
                            <IonLabel>Usuário</IonLabel>
                        </IonTabButton>
                        */}

                        {/* ABRIR SCHEDULE */}
                        <IonTabButton tab="open" href="/det-maker/open" className='pt-1 bg-transparent fw-bold'>
                            <IonIcon icon={document} />
                            <IonLabel>Abrir Schedule</IonLabel>
                        </IonTabButton>
                        {/* SELECIONAR JOBS */}
                        <IonTabButton tab="select" href="/det-maker/select" className='pt-2 bg-transparent fw-bold' >{/*disabled*/}
                            <IonIcon icon={checkbox} />
                            <IonLabel>Escolher Jobs</IonLabel>
                        </IonTabButton>
                        {/* CONFIGURAR JOBS */}
                        <IonTabButton tab="config" href="/det-maker/config" className='pt-2 bg-transparent fw-bold' >
                            <IonIcon icon={cog} />
                            <IonLabel>Configurar Jobs</IonLabel>
                        </IonTabButton>
                        {/* EXECUTAR PILHA */}
                        <IonTabButton tab="run" href="/det-maker/run" className='pt-2 bg-transparent fw-bold' >
                            <IonIcon icon={flash} />
                            <IonLabel>Executar!</IonLabel>
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


function useRef<T>(arg0: null) {
    throw new Error('Function not implemented.');
}
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
