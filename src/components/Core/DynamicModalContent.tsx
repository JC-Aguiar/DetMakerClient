import { IonFabButton } from "@ionic/react";

export interface DynamicModalContent {//<T> extends React.FC<T> {
    //buttons: Array<JSX.Element & { type: typeof IonFabButton }>;
    getButtons?: () => Array<JSX.Element & { type: typeof IonFabButton }>;
}