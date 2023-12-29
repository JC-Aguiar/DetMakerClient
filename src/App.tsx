import { IonApp, IonCol, IonGrid, IonHeader, IonIcon, IonLabel, IonRouterOutlet, IonRow, IonTabBar, IonTabButton, IonTabs, ToastButton, setupIonicReact, useIonToast } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
//import { show, hide } from './Store/Reducer/ReducerTabMenu';
import dayjs from 'dayjs';
import Intro from './pages/Intro';
import "./App.css";
import miniLogo from './resources/det-maker-logo-v3-mini.png';
import iconUserTie from './resources/user-tie.svg';

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
import Schedule from './pages/Schedule';
import ConfigurarJobs from './pages/ConfigurarJobs';
import { JobConfigDTO } from './data/JobConfigDTO';
import { RootState } from './Store/ReduxStore';
import RevisarRelatorio from './pages/RevisarRelatorio';
import { validarJwt } from './data/JwtDTO';
import { validarUser } from './data/UserDTO';
import Avatar from './components/Avatar';
import DynamicPage from './components/DynamicPage';
import { Noticacao } from './components/Noticacao';
import { URL_CLIENTES, URL_PIPELINES, URL_RELATORIOS, URL_DET, URL_LOGIN } from './data/AxiosRequest';
import { createBrowserHistory } from "history";
import DynamicButtons from './components/DynamicButtons';
import { JobInfoDTO } from './data/JobInfoDTO';
import EscolherClientes from './pages/EscolherClientes';
import EscolherRelatorios from './pages/EscolherRelatorios';
import Fundo from './components/Fundo';

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

export function offsetDateTimeParaString(data: number): string {
    return dayjs.unix(data).format('DD/MM/YYYY HH:mm:ss');
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
    const catalagoJobs: JobInfoDTO[] = useSelector((state: RootState) => state.store.catalogoJobs.catalago);
    const mainAmbiente: string = useSelector((state: RootState) => state.store.configAtividade.mainAmbiente);
    const escolherJobsOpt: boolean = catalagoJobs.length > 0;
    //const jobsCount: number = catalagoJobs.filter((item) => item.job.checked).length;
    //const configurarJobsOpt: boolean = jobsCount > 0;
    //const executarJobsOpt: boolean = false;
    const docParaRevisar: boolean = useSelector((state: RootState) => state.store.docRevisao.value) !== null;

    const isLoadingJobs: boolean = useSelector((state: RootState) => state.store.catalogoJobs.loading);
    const isLoadingPipelines: boolean = useSelector((state: RootState) => state.store.catalogoPipelines.loading);
    const isLoadingRelatorios: boolean = useSelector((state: RootState) => state.store.catalogoRelatorios.loading);

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
            path: URL_CLIENTES,
            exact: true,
            titulo: "Clientes", 
            subtitulo: "Escolha ou crie perfis de Clientes para acessar os recursos", 
            conteudo: <EscolherClientes />,
            icone: iconUserTie,
            desativado: false,
            efeito: null,
        },
        {
            path: URL_PIPELINES,
            exact: true,
            titulo: "Pipelines", 
            subtitulo: "Escolha ou crie uma Pipeline para iniciar um fluxo de execução", 
            conteudo: <EscolherPipelines {...notificacao} />,
            icone: layers,
            desativado: mainAmbiente.length < 1 || isLoadingJobs || isLoadingPipelines,
            efeito: null, 
        },
        {
            path: URL_RELATORIOS,
            exact: true,
            titulo: "Relatórios", 
            subtitulo: "Lista dos relatórios prontos ou a revisar", 
            conteudo: <EscolherRelatorios {...notificacao} />,
            icone: receipt,
            desativado: mainAmbiente.length < 1 || isLoadingRelatorios,
            efeito: null, //contadorConfigJobs(),
        },
        {
            path: URL_DET,
            exact: true,
            titulo: "Revisão", 
            subtitulo: "Analise e preencha os campos obrigatórios das evidências", 
            conteudo: <RevisarRelatorio {...notificacao} />,
            icone: checkmarkCircle,
            desativado: !docParaRevisar,
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
            <IonTabButton tab='Login' href={URL_LOGIN} className='bg-transparent fw-bold p-0' disabled>
                <IonIcon icon={logoGoogle} hidden/>
                <IonLabel hidden>Login</IonLabel>
            </IonTabButton>
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
                    <Redirect from='/*' to={URL_CLIENTES} />
                </Route>
            </IonRouterOutlet>
        );
    }

    function menuAutenticado() {
        return rotas.map((r, index) =>
            <IonTabButton key={index} tab={r.titulo} href={r.path}
                className='pt-1 p-0 m-0 bg-transparent fw-bold'
                disabled={r.desativado}
            >
                <IonIcon icon={r.icone} />
                <IonLabel>{r.titulo}{r.efeito}</IonLabel>
            </IonTabButton>
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
        <IonApp className=''>
            <Fundo />
            <IonReactRouter basename={process.env.PUBLIC_URL}>
                <div className='h-100'>
                    <IonGrid>
                        <IonRow>
                            <IonTabs >
                                {mapaDeRotas()}
                                <IonTabBar slot="top"
                                    className='bg-transparent border-bottom-0'
                                    style={{ justifyContent: 'flex-start'}}
                                >
                                    <IonTabButton 
                                        tab='Titulo' 
                                        href={URL_LOGIN}
                                        disabled
                                        className='bg-transparent fw-bold' 
                                        style={{minWidth: '92px', maxWidth: '92px'}}
                                    >
                                        <img src={miniLogo} className='fixed-top ms-2' style={{ top: '2px', width: '88px', height: 'auto' }} />
                                        <IonHeader id='ppw-titulo' className='fixed-top text-start text-white pt-1 pb-0'>
                                            <small className='small m-0 lh-1 fixed-top' style={{ top: '44px', left: '18px' }}>
                                                Ⓡ Peopleware
                                            </small>
                                        </IonHeader>
                                    </IonTabButton>
                                    {mapaDeMenus()}
                                </IonTabBar>
                            </IonTabs>
                        </IonRow>
                    </IonGrid>
                    <DynamicButtons avatar={ <Avatar user={user}/> } />
                </div>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;

/*
<IonApp className='bg-transparent'>
            <IonReactRouter basename={process.env.PUBLIC_URL}>
                <div className='h-100'>
                    <IonGrid>
                        <IonRow>
                            <IonTabs >
                                {mapaDeRotas()}
                                <IonTabBar slot="top"
                                    className='bg-transparent'
                                    style={{ justifyContent: 'flex-start'}}
                                >
                                    <IonTabButton 
                                        tab='Titulo' 
                                        href={URL_LOGIN} 
                                        disabled 
                                        className='bg-transparent fw-bold' 
                                        style={{minWidth: '12%', maxWidth: '12%'}}
                                    >
                                        <img src={minilogo} className='fixed-top ms-2' style={{ top: '2px', width: '150px', height: 'auto' }} />
                                        <IonHeader id='ppw-titulo' className='fixed-top text-start text-dark pt-1 pb-0'>
                                            <small className='small m-0 lh-1 fixed-top' style={{ top: '44px', left: '52px' }}>
                                                Peopleware
                                            </small>
                                        </IonHeader>
                                    </IonTabButton>
                                    {mapaDeMenus()}
                                </IonTabBar>
                            </IonTabs>
                        </IonRow>
                    </IonGrid>
                    <DynamicButtons avatar={ <Avatar user={user}/> } />
                </div>
            </IonReactRouter>
        </IonApp>
*/