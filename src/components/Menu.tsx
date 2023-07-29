import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonAccordionGroup, IonAccordion, IonButton, } from "@ionic/react";
import { useLocation } from "react-router-dom";
import { filmOutline, filmSharp, carSportOutline, carSportSharp, roseOutline, roseSharp, heartHalfOutline, heartHalfSharp, happyOutline, happySharp, bookOutline, bookSharp, rocketOutline, rocketSharp, timeOutline, timeSharp, checkbox, document, cog, flash, } from "ionicons/icons";
import "./Menu.css";
import { endpoint } from "../TMDB";
import Acount from "./Acount";

interface AppPage {
    url: string;
    iosIcon: string;
    mdIcon: string;
    title: string;
}

interface MovieSumary {
    id: number;
    name: string;
    icon: string;
    genre: number[];
}

const appPages: AppPage[] = [
    { title: "Abrir Schedule", url: "/det-maker/open", iosIcon: document, mdIcon: document },
    { title: "Selecionar Jobs", url: "/det-maker/select", iosIcon: checkbox, mdIcon: checkbox },
    { title: "Configurar Jobs", url: "/det-maker/config", iosIcon: cog, mdIcon: cog },
    { title: "Executar!", url: "/det-maker/run", iosIcon: flash, mdIcon: flash },
];

const userRecents: MovieSumary[] = [
    {
        id: 550,
        name: "Fight Club",
        icon: "Fight Club",
        genre: [28],
    }
];

const Menu = (props: any) => {
    const location = useLocation();
    // const loadMovie = () => endpoint(28);

    function pageSelection(title: string) {
        const callBack = props.callBack;
        callBack(title);
    }

    return (
        <IonMenu contentId="main" type="overlay" id="menu">
            <IonContent>
                <Acount />
                {
                    //Gerando menu
                    appPages.map((appPage, index) => {
                        return (
                            <IonMenuToggle
                                key={index}
                                autoHide={false}
                                className="menu-panel"
                            >
                                <IonItem
                                    className={
                                        location.pathname === appPage.url
                                            ? "selected"
                                            : ""
                                    }
                                    routerLink={appPage.url}
                                    routerDirection="none"
                                    lines="none"
                                    detail={false}
                                    onClick={() => pageSelection(appPage.title)}
                                >
                                    <IonIcon
                                        slot="start"
                                        ios={appPage.iosIcon}
                                        md={appPage.mdIcon}
                                        color="#"
                                        className="ion-padding-start"
                                    />
                                    <IonLabel>{appPage.title}</IonLabel>
                                </IonItem>
                            </IonMenuToggle>
                        );
                    })
                }
                <IonAccordionGroup>
                    <IonAccordion
                        value="recents"
                        className="menu-panel"
                        toggleIcon="none"
                    >
                        <div slot="header">
                            <IonItem button={true} lines="none">
                                <IonIcon
                                    slot="start"
                                    ios={timeSharp}
                                    md={timeOutline}
                                    color="#"
                                    className="ion-padding-start"
                                />
                                <IonLabel>Recentes</IonLabel>
                            </IonItem>
                        </div>
                        <IonList slot="content" lines="none">
                            {userRecents.map((movieSumary, index) => {
                                return (
                                    <IonItem key={index}>
                                        <IonButton
                                            fill="clear"
                                            color="warning"
                                            className="recent-item"
                                        >
                                            {movieSumary.name}
                                        </IonButton>
                                    </IonItem>
                                );
                            })}
                        </IonList>
                    </IonAccordion>
                </IonAccordionGroup>
            </IonContent>
        </IonMenu>
    );
};

export default Menu;
