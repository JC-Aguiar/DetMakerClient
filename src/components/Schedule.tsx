import { IonCard, IonCol, IonContent, IonGrid, IonIcon, IonRow, useIonViewDidEnter } from '@ionic/react';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/ReduxStore';
import ScheduleJob from './ScheduleJob';
import { JobInfoDTO } from '../data/JobInfoDTO';

const Schedule: React.FC = () => {
    const catalogoJobs: JobInfoDTO[] = useSelector((state: RootState) => state.store.catalogoJobs.catalago);
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
            { largura: 400, nome: "JOB" },
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
        <th className='bg-white text-dark px-2' style={{minWidth: `${item.largura}px`}}>
            {item.nome}
        </th>
    );

    return (
            <div className="text-center p-0 ps-2 pt-2 m-0">
                <IonContent className='glass w-100' scrollEvents={true} style={{height: '82vh'}}>
                    <IonRow className='position-absolute w-100 h-100'>
                        <table id='tabela-schedule' className="glass-content text-white p-0 m-0 w-100 h-100" > 
                            <thead className='sticky-top align-items-center align-middle small'>
                                <tr className=''>
                                    {renderizarColunas}
                                </tr>
                            </thead>
                            <tbody className=''>
                                {
                                    catalogoJobs.map((item, index) => {
                                        const indexId: string = `job-index-${item.id}`;
                                        return <ScheduleJob key={index} job={item} indexId={indexId} par={index % 2 === 0} />
                                    })
                                }
                            </tbody>
                        </table>
                    </IonRow>
                </IonContent>
            </div>
    );
};

export default Schedule;

