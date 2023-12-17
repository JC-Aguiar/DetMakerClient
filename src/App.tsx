import { IonApp, IonHeader, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, ToastButton, setupIonicReact, useIonToast } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
//import { show, hide } from './Store/Reducer/ReducerTabMenu';
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
import { document, checkbox, settings, documentText, cube, layers, receipt, checkmarkCircle, cogOutline, logoGoogle, closeCircleOutline } from 'ionicons/icons';
import Login from './pages/Login';
import EscolherPipelines from './pages/EscolherPipelines';
import EscolherJobs from './pages/EscolherJobs';
import ConfigurarJobs from './pages/ConfigurarJobs';
import { JobConfigDTO } from './data/JobConfigDTO';
import { RootState } from './Store/ReduxStore';
import RevisarRelatorio from './pages/RevisarRelatorio';
import { validarJwt } from './data/JwtDTO';
import { validarUser } from './data/UserDTO';
import Avatar from './components/Avatar';
import DynamicPage from './components/DynamicPage';
import { Noticacao } from './components/Noticacao';
import { URL_PIPELINES, URL_JOBS, URL_CONFIG, URL_DET, URL_LOGIN } from './data/AxiosRequest';
import { createBrowserHistory } from "history";
import DynamicButtons from './components/DynamicButtons';
import { JobInfoDTO } from './data/JobInfoDTO';

/* Recursos de uso comum */

setupIonicReact();

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
    const history = createBrowserHistory();
    const [boasVindas, setBoasVindas] = useState(false);
    //const location = useLocation();
    //const hideTabBarRoutes = ['/det-maker/evidence', '/signup'];
    //setMenuOn(hideTabBarRoutes.some(route => location.pathname.includes(route)));
    const {jwt, user} = useSelector((state: RootState) => state.store.login);
    //const showMenu: boolean = useSelector((state: RootState) => state.store.tabMenu);
    const catalagoJobs: JobInfoDTO[] = useSelector((state: RootState) => state.store.pilhaJobs.catalago);
    const escolherJobsOpt: boolean = catalagoJobs.length > 0;
    //const jobsCount: number = catalagoJobs.filter((item) => item.job.checked).length;
    //const configurarJobsOpt: boolean = jobsCount > 0;
    //const executarJobsOpt: boolean = false;
    const evidenciaPag: boolean = useSelector((state: RootState) => state.store.relatorios.value) !== null;

    const [toast, toastOff] = useIonToast();
    const closeToast = {
      text: 'x',
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
            titulo: "Pipelines", 
            subtitulo: "Escolha ou crie uma Pipeline para iniciar um fluxo de execução", 
            conteudo: <EscolherPipelines {...notificacao} />,
            icone: layers,
            desativado: false,
            efeito: null,
        },
        {
            path: URL_JOBS,
            exact: true,
            titulo: "Jobs", 
            subtitulo: "Documentação detalhada dos Jobs disponíveis", 
            conteudo: <EscolherJobs {...notificacao} />,
            icone: cube,
            desativado: !escolherJobsOpt,
            efeito: null, 
        },
        {
            path: URL_CONFIG,
            exact: true,
            titulo: "Configurar Jobs", //"Relatórios", 
            subtitulo: "", //"Lista dos relatórios prontos ou a revisar", 
            conteudo: <ConfigurarJobs {...notificacao} />,
            icone: cogOutline, //receipt,
            desativado: false, //!configurarJobsOpt,
            efeito: null, //contadorConfigJobs(),
        },
        {
            path: URL_DET,
            exact: true,
            titulo: "Revisão", 
            subtitulo: "Analise e preencha os campos obrigatórios das evidências", 
            conteudo: <RevisarRelatorio {...notificacao} />,
            icone: checkmarkCircle,
            desativado: !evidenciaPag,
            efeito: null,
        },
    ];


    function animationEnd() {
        setBoasVindas(true);
    }

    function contadorConfigJobs() {
        //if (jobsCount === 0) return null;
        return (
            <span className='badge bg-primary config-job-count'>??? {/*jobsCount*/}</span>
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

    function rotasVisitante() {
        return (
            <IonRouterOutlet>
                <Route path={URL_LOGIN} exact> <Login /> </Route>
                <Route> <Redirect from='/*' to={URL_LOGIN} /> </Route>
            </IonRouterOutlet>
        );
    }

    function menuVisitante() {
        return (
            <IonTabBar slot="top" className='pt-4 mt-2 pb-1 mx-0 mx-md-1 bg-transparent mt-1 border-gold' >
                <IonTabButton tab='Login' href={URL_LOGIN} className='pt-1 bg-transparent fw-bold' >
                    <IonIcon icon={logoGoogle} />
                    <IonLabel>Login</IonLabel>
                </IonTabButton>
            </IonTabBar>
        );
    }

    function rotasAutenticado() {
        return (
            <IonRouterOutlet>
                {
                    rotas.map((r, index) =>
                        <Route key={index} path={r.path} exact={r.exact}>
                            <DynamicPage key={index} titulo={r.titulo} subtitulo={r.subtitulo} elemento={r.conteudo} />
                        </Route>
                    )
                }
                <Route>
                    <Redirect from='/*' to={URL_PIPELINES} />
                </Route>
            </IonRouterOutlet>
        );
    }

    function menuAutenticado() {
        return (
            <IonTabBar slot="top" className='pt-4 mt-2 pb-1 mx-0 mx-md-1 bg-transparent mt-1 border-gold' >
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
        );
    }

    function logado() {
        return (validarJwt(jwt) && validarUser(user));
        
    }

    function mapaDeRotas() {
        return logado() ? rotasAutenticado() : rotasVisitante();
    }

    function mapaDeMenus() {
        return logado() ? menuAutenticado() : menuVisitante();
    }

    return (
        <IonApp>
            <IonReactRouter basename={process.env.PUBLIC_URL}>
                <div className='banner h-100'>
                    <IonHeader id='ppw-titulo' className='text-center'>
                        <div className="navbar-brand disabled text-white fs-1 m-0 lh-1" >
                            Peopleware
                        </div>
                    </IonHeader>
                    <IonTabs>
                        {mapaDeRotas()}
                        {mapaDeMenus()}
                    </IonTabs>
                    <DynamicButtons avatar={ <Avatar user={user}/> } />
                </div>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
