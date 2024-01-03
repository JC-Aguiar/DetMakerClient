import { IonImg } from '@ionic/react';
import sphere from '../resources/blurry-sphere7.png';

const Fundo: React.FC = (props: any) => {

    const EM_DEV = true;

    const fundoAnimado = EM_DEV ? 
        <></> : 
        <div id="inner-orbit">
            <div className="orbit-cirlce1">
                <IonImg src={sphere} className="blurry-sphere bg-night rotate" />
            </div>
            <div className="orbit-cirlce2">
                <IonImg src={sphere} className="blurry-sphere bg-twilight rotate" />
            </div>
            <div className="orbit-cirlce3">
                <IonImg src={sphere} className="blurry-sphere bg-sky rotate" />
            </div>
        </div>;

    return (
        <div id="fundo" className='w-100 h-100'>
            {fundoAnimado}
        </div>
    );
}

export default Fundo;