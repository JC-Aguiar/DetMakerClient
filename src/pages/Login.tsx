import { IonPage, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonFab, IonFabButton, IonIcon, IonContent, IonProgressBar, IonHeader, IonTitle, } from "@ionic/react";
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
import logoGrande from '../resources/det-maker-logo-v3-grande.png';


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
            setLoading(false);
        }
        catch (error) {
            dispatch(hide());
            console.error(error);
        }
      };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const authorizationCode = urlParams.get('code');
        if (!authorizationCode) {
            setLoading(false);
            return;
        }
        setLoading(true);
        exchangeAuthorizationCodeForAccessToken(authorizationCode);
    }, []);

    function conteudo() {
        if (loading) return (<IonProgressBar type="indeterminate" />); 
        return (
            <IonFab className="login-btn" vertical="center" >
                <IonFabButton id="google" color="#" onClick={(e) => login()}>
                    <IonIcon icon={logoGoogle} color="light" className="glass-content"></IonIcon>
                </IonFabButton>
            </IonFab>
        );
    }

    return (
        <div className="container"  >
                <IonTitle id="det-maker-big-logo border-0 shadow-0">
                    <h1 className="d-flex ion-justify-content-center card-title destaque lh-1 m-0 text-start">
                        <img src={logoGrande} className='' style={{width: '11vw', height: '11vw' }} />
                        <div>DET<br/>MAKER</div>
                    </h1>
                </IonTitle>
            <div className="mt-5">
                <h4 className="h4 text-white text-center">
                    Acesse sua conta Google para se logar na aplicação
                </h4>
                <p hidden>{GOOGLE_REDIRECT_URI}</p>
                {conteudo()}
            </div>
        </div>
    );

}

export default Login;
