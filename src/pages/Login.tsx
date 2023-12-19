import { IonPage, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonFab, IonFabButton, IonIcon, IonContent, IonProgressBar, } from "@ionic/react";
import { logoGoogle } from "ionicons/icons";
import { useEffect, useState } from "react";
import { GOOGLE_CLIENT_ID, GOOGLE_AUTH_URL, GOOGLE_REDIRECT_URI } from "../config/OAuth2";
import { useDispatch, useSelector } from "react-redux";
import { ReducerUserTYPE, setJwt, setUser } from '../Store/Reducer/ReducerUser';
import { show, hide } from '../Store/Reducer/ReducerTabMenu';
import { JwtDTO, validarJwt } from "../data/JwtDTO";
import { UserDTO } from "../data/UserDTO";
import { getAccessToken, getUserInfo } from "../data/AxiosRequest";
import { RootState } from "../Store/ReduxStore";
import { useHistory } from "react-router";
import * as axiosRequest from "../data/AxiosRequest";


const Login = (props: any) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user: ReducerUserTYPE = useSelector((state: RootState) => state.store.login);
    const [loading, setLoading] = useState<boolean>(validarJwt(user.jwt));
    
    const login = () => {
        console.log(`GOOGLE_REDIRECT_URI: ${GOOGLE_REDIRECT_URI}`);
        console.log(`window.location.origin: ${window.location.origin}`);
        const params = new URLSearchParams({
            response_type: 'code',
            scope: 'openid email profile',
            client_id: GOOGLE_CLIENT_ID,
            redirect_uri: GOOGLE_REDIRECT_URI,
        });
        window.location.href = `${GOOGLE_AUTH_URL}?${params.toString()}`;
    };

    const exchangeAuthorizationCodeForAccessToken = async (authorizationCode: string) => {
        console.log(`[LOGIN]: Authorization-Code: ${authorizationCode}.`);
        try {
            const jwt: JwtDTO = await getAccessToken(authorizationCode);
            const user: UserDTO = await getUserInfo(jwt.access_token);
            dispatch(show());
            dispatch(setJwt(jwt));
            dispatch(setUser(user));
            history.push(axiosRequest.URL_CLIENTES);
        }
        catch (error) {
            dispatch(hide());
            console.error(error);
        }
      };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const authorizationCode = urlParams.get('code');
        if (!authorizationCode) return;
        setLoading(true);
        exchangeAuthorizationCodeForAccessToken(authorizationCode);
    }, []);

    function conteudo() {
        if (loading) return (<IonProgressBar type="indeterminate" />); 
        return (
            <IonFab className="login-btn" vertical="center" > {/*horizontal="center" vertical="center"*/}
                <IonFabButton id="google" onClick={(e) => login()}>
                    <IonIcon icon={logoGoogle} color="white"></IonIcon>
                </IonFabButton>
            </IonFab>
        );
    }

    return (
        <IonPage>
            <IonContent fullscreen={true} scrollEvents={true} className="">
                <div className='pt-3 pt-md-4'></div>
                <IonCard target="_self" className="p-5 mx-0 mx-md-5">
                    <IonCardHeader id="det-maker-login" className="pb-lg-5 ">
                        <IonCardTitle id="det-maker-big-logo">
                            <h1 className="card-title destaque lh-1 m-0 text-center">DET MAKER</h1>
                        </IonCardTitle>
                        <h4 className="py-2 h4 text-primary ms-2 text-center">
                            Entre com seu login para acessar os recursos da aplicação.
                        </h4>
                    </IonCardHeader>
                    <IonCardContent className="pt-5 pt-sm-0">
                        {conteudo()}
                    </IonCardContent>
                    {
                        /*
                        <IonCardContent className="pt-5 mt-5 d-flex justify-content-center">
                            <button className="bg-primary rounded-circle p-5">
                                    <IonIcon id="login-btn" icon={logoGoogle} className="fs-1" color="white"></IonIcon>
                            </button>
                        </IonCardContent>
                        */
                    }
                <div className='py-5'></div>
                </IonCard>
            </IonContent>
        </IonPage>
    );

}

export default Login;
