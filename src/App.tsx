import { IonApp, IonAvatar, IonHeader, IonIcon, IonImg, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, ToastButton, setupIonicReact, useIonToast } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { show, hide } from './Store/Reducer/ReducerTabMenu';
import dayjs from 'dayjs';
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
import { JobConfigDTO } from './data/JobExecute';
import { RootState } from './Store/ReduxStore';
import Det from './pages/Det';
import { validarJwt } from './data/JwtDTO';
import { validarUser } from './data/UserDTO';
import Avatar from './components/Avatar';
import DynamicPage from './components/DynamicPage';
import { Noticacao } from './components/Noticacao';

/* Recursos de uso comum */

setupIonicReact();

export const URL_BASE = "/det-maker";
export const URL_PIPELINES = `${URL_BASE}/open`;
export const URL_JOBS = `${URL_BASE}/select`;
export const URL_CONFIG = `${URL_BASE}/config`;
export const URL_DET = `${URL_BASE}/evidence`;
export const URL_LOGIN = `${URL_BASE}/login`;

type rotaTYPE = {
    path: string,
    exact: boolean,
    titulo: string,
    subtitulo: string,
    conteudo: JSX.Element,
    icone: string,
    desativado: boolean,
    efeito: JSX.Element | null,
}

export const dataFormato: Intl.DateTimeFormatOptions = {
    dateStyle: 'short', //Utiliza o formato de data curta com separador "/"
};

export function validarExibirData(dataAtualizacao: string): string {
    const date = dayjs(dataAtualizacao);
    if (!dayjs(date).isValid()) return dataAtualizacao;
    return new Intl.DateTimeFormat('pt-BR').format(date.toDate());
}

export function dataParaString(data: Date): string {
    return dayjs(data).format('DD/MM/YYYY HH:mm:ss');
}

/* Componente <App> */
const App = () => {
    const dispatch = useDispatch();
    const [boasVindas, setBoasVindas] = useState(false);
    //const location = useLocation();
    //const hideTabBarRoutes = ['/det-maker/evidence', '/signup'];
    //setMenuOn(hideTabBarRoutes.some(route => location.pathname.includes(route)));
    const {jwt, user} = useSelector((state: RootState) => state.store.login);
    const showMenu: boolean = useSelector((state: RootState) => state.store.tabMenu);
    const pilha: JobConfigDTO[] = useSelector((state: RootState) => state.store.pilhaJobs.value);
    const escolherJobsOpt: boolean = pilha.length > 0;
    const jobsCount: number = pilha.filter((itemPilha) => itemPilha.job.checked).length;
    const configurarJobsOpt: boolean = jobsCount > 0;
    const executarJobsOpt: boolean = false;
    const evidenciaPag: boolean = useSelector((state: RootState) => state.store.relatorios.value) !== null;

    const [toast, toastOff] = useIonToast();
    const closeToast = {
      text: 'X',
      role: 'Close',
      handler: () => toastOff(),
    };
    const toastInfo = (mensagem: string, buttons: ToastButton[]) => {
        buttons.push(closeToast);
        toastOff().then(() =>
            toast({
                message: mensagem,
                duration: 5000,
                position: 'bottom',
                color: 'medium',
                buttons: buttons,
            })
        );
    };
    const toastOk = (mensagem: string, buttons: ToastButton[]) => {
        buttons.push(closeToast);
        toastOff().then(() =>
            toast({
                message: mensagem,
                duration: 5000,
                position: 'bottom',
                color: 'primary',
                buttons: buttons,
            })
        );
    };
    const toastErro = (mensagem: string, buttons: ToastButton[]) => {
        buttons.push(closeToast);
        toastOff().then(() =>
            toast({
                message: mensagem,
                duration: 8000,
                position: 'bottom',
                color: 'warning',
                buttons: buttons,
            })
        );
    };
    const notificacao = { toastInfo: toastInfo, toastOk: toastOk, toastErro: toastErro } as Noticacao;

    const rotas: rotaTYPE[] = [
        {
            path: URL_PIPELINES,
            exact: true,
            titulo: "Carregar Jobs", 
            subtitulo: "Escolha uma das opções abaixo para iniciar uma Pipeline", 
            conteudo: <CarregarJobs {...notificacao} />,
            icone: document,
            desativado: false,
            efeito: null,
        },
        {
            path: URL_JOBS,
            exact: true,
            titulo: "Selecionar Jobs", 
            subtitulo: "Documentação detalhada dos jobs disponíveis", 
            conteudo: <EscolherJobs {...notificacao} />,
            icone: checkbox,
            desativado: !escolherJobsOpt,
            efeito: null, 
        },
        {
            path: URL_CONFIG,
            exact: true,
            titulo: "Configurar Jobs", 
            subtitulo: "", 
            conteudo: <ConfigurarJobs {...notificacao} />,
            icone: settings,
            desativado: !configurarJobsOpt,
            efeito: contadorConfigJobs(),
        },
        {
            path: URL_DET,
            exact: true,
            titulo: "DET", 
            subtitulo: "Revisando o documento de evidência dos testes", 
            conteudo: <Det {...notificacao} />,
            icone: documentText,
            desativado: !evidenciaPag,
            efeito: null,
        },
    ];


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
            <IonTabs>
                <IonRouterOutlet>
                    {
                        rotas.map((r, index) =>
                            <Route path={r.path} exact={r.exact}>    
                                <DynamicPage key={index} titulo={r.titulo} subtitulo={r.subtitulo} elemento={r.conteudo}/> 
                            </Route> 
                        )
                    }
                    <Route> 
                        <Redirect to={URL_PIPELINES} />
                    </Route>
                </IonRouterOutlet>

                {/* Links no menu */}
                <IonTabBar slot="top" className='pt-4 pb-1 mx-0 mx-md-1 bg-transparent mt-1 border-gold' >
                {
                    rotas.map((r, index) => 
                        <IonTabButton key={index} tab={r.titulo} href={r.path}
                            className='pt-1 bg-transparent fw-bold'
                            disabled={r.desativado}
                        >
                            <IonIcon icon={r.icone} />
                            <IonLabel>{r.titulo}{r.efeito}</IonLabel>
                        </IonTabButton>
                    )
                }
                </IonTabBar>
            </IonTabs>
        );
    }

    function principal() {
        if (validarJwt(jwt) && validarUser(user)) return menu();
        return <IonTabs>
            <IonRouterOutlet>
                <Route path={URL_LOGIN} exact> <Login /> </Route>
                <Route> <Redirect to="/det-maker/login" /> </Route>
            </IonRouterOutlet>
            <IonTabBar slot="top" className='pt-4 pb-1 mx-0 mx-md-1 bg-transparent mt-1 border-gold' />
        </IonTabs>
    }

    function rotasDeAcesso() {
        //if boasVindas
        if (true) return principal();
        else return intro();
    }

    return (
        <IonApp>
            <IonReactRouter>
                <div className='banner h-100'>
                    <IonHeader id='ppw-titulo' className='text-center'>
                        <div className="navbar-brand disabled text-white fs-1 m-0 lh-1" >
                            Peopleware
    s                        {/*<div className="fs-6">joao.aguiar@gmail.com</div>*/}
                        </div>
                    </IonHeader>
                    {rotasDeAcesso()}
                    <Avatar picture={user} />
                </div>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
