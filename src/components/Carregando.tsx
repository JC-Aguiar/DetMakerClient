import Informativo from "./Informativo"
import { globeOutline } from "ionicons/icons";


const Carregando = () => {
    return <Informativo mensagem='Carregando recursos do banco' icone={globeOutline} status='Carregando' />
}

export default Carregando;