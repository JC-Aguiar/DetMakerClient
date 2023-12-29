import { IonIcon, useIonViewDidEnter } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Store/ReduxStore';
import ScheduleJob from '../components/ScheduleJob';
import { Noticacao } from '../components/Noticacao';
import { URL_CLIENTES } from '../data/AxiosRequest';
import { JobInfoDTO } from '../data/JobInfoDTO';

const Schedule: React.FC = () => {
    const catalogoJobs: JobInfoDTO[] = useSelector((state: RootState) => state.store.catalogoJobs.catalago);
    const [checks, setChecks] = useState<boolean>(true);
    const history = useHistory();

    //async function handlerCheckAll() {
    //    console.log(`[ESCOLHER-JOBS] Alterando check de todos os jobs para 'false'`);
    //    catalogoJobs.forEach((item) => dispatch( 
    //        checkitem({
    //            id: item.id, 
    //            checked: false,
    //            ordem: item.ordem
    //        })
    //    ));
    //}

    interface HeaderTYPE {
        colunas: ColunaTYPE[];
    }

    interface ColunaTYPE {
        largura: number, 
        nome: string,
    }

    const header: HeaderTYPE = {
        colunas: [
            { largura: 20, nome: "ID" },
            { largura: 20, nome: "JOB" },
            { largura: 50, nome: "EXECUTAR APÓS" },
            { largura: 20, nome: "GRUPO" },
            { largura: 20, nome: "FASE" },
            { largura: 900, nome: "DESCRIÇÃO" },
            { largura: 20, nome: "UDA" },
            { largura: 20, nome: "PROGRAMA" },
            { largura: 20, nome: "TABELAS" },
            { largura: 20, nome: "SERVIDOR" },
            { largura: 20, nome: "JOB PATH" },
            { largura: 20, nome: "PARÂMETROS" },
            { largura: 900, nome: "DESCRIÇÕES PARÂMETROS" },
            { largura: 20, nome: "CARGAS PATH" },
            { largura: 20, nome: "CARGAS MÁSCARA" },
            { largura: 20, nome: "PRODUTOS PATH" },
            { largura: 20, nome: "PRODUTOS MÁSCARA" },
            { largura: 20, nome: "LOGS PATH" },
            { largura: 20, nome: "LOGS MÁSCARA" },
            { largura: 20, nome: "TRATAMENTO" },
            { largura: 20, nome: "ESCALATION" },
            { largura: 90, nome: "DATA" },
            { largura: 50, nome: "ATUALZIADO POR" }
        ]
    };

    const renderizarColunas = header.colunas.map((item, index) => 
        <th className='bg-primary' style={{minWidth: `${item.largura}px`}}>
            {item.nome}
        </th>
    );
        // min-width: 12vw;
        // max-width: 28vw;

    return (
            <div className="schedule-tabela scroll text-center p-0 m-0">
                <table className="table p-0 m-0"> {/* table-light table-striped */}
                    <thead className='sticky-top align-items-center align-middle small'>
                        <tr className='text-white '>
                            {renderizarColunas}
                        </tr>
                    </thead>
                    <tbody>
                    {
                        catalogoJobs.map((item, index) => {
                            const indexId: string = `job-index-${item.id}`;
                            return <ScheduleJob key={index} job={item} indexId={indexId} cor={index % 2 ? "" : "bg-white"} />
                        })
                    }
                    </tbody>
                </table>
            </div>
    );
};

export default Schedule;

