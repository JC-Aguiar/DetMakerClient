import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonImg, IonLabel, IonRow, IonTextarea, IonThumbnail, useIonViewDidEnter } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { ItemPilha } from "./ItemPilha";
import { AgendaDTO } from "./AgendaDTO";
import { ComandoSQL } from "./ComandoSQL";
import { validarExibirData } from "../pages/AbrirSchedule";

export interface JobCardProps {
    dto: AgendaDTO,
    numeroPilha: number
}

const JobCard = (item: JobCardProps) => {
    //const job: ItemPilha = props.conteudo;
    const [argumentos, setArgumentos] = useState<string[]>([]);
    const agenda: AgendaDTO = (item.dto);
    const numeroPilha: number = (item.numeroPilha);
    const [queries, setQueries] = useState<ComandoSQL[]>([]);
    const [cargas, setCargas] = useState<string[]>([]);
    const [pronto, setPronto] = useState<boolean>(false);

    useIonViewDidEnter(() => {
        if (!agenda) return;
        console.log(`[CARD-JOB] renderizando card do job ${agenda.job}.`);
    }, []);

    function configParametros() {
        if (agenda.parametros.length === 0) return;
        return (
            <div className="p-1 mb-3 banner rounded rounded-2">
                <label className="form-label fw-bold text-white" htmlFor={`job${agenda.id}-param`}>PARÂMETROS</label>
                {
                    agenda.parametros.map((param, index) => {
                        return (
                            <input id={`job${agenda.id}-param`}
                                type="text"
                                className="form-control"
                                aria-label="Sizing example input"
                                aria-describedby="inputGroup-sizing-default"
                                placeholder={agenda.descricaoParametros[index]} />
                        );
                    })
                }
            </div>
        );
    }

    function configQuerys() {
        if (agenda.tabelas.length === 0) return;
        return (
            <div className="p-1 mb-3 banner rounded rounded-2">
                <label className="form-label fw-bold text-white align-items-start" htmlFor={`job${agenda.id}-sql`}>SQL QUERIES</label>
                {
                    agenda.tabelas.map((tabelaNome) => {
                        return (
                            <IonTextarea id={`job${agenda.id}-sql`}
                                className="form-control"
                                aria-label="With textarea"
                                autoGrow={true}
                                placeholder={`SELECT * FROM ${tabelaNome} WHERE...`}
                            />
                        );
                    })
                }
            </div>
        );
    }

    function configCarga() {
        if (agenda.mascaraEntrada.length === 0) return;
        return (
            <div className="p-1 mb-3 banner rounded rounded-2">
                <label className="form-label fw-bold text-white align-items-start" htmlFor={`job${agenda.id}-carga`}>CARGA</label>
                {
                    agenda.mascaraEntrada.map(() => {
                        return (
                            <textarea id={`job${agenda.id}-carga`}
                                className="form-control"
                                aria-label="With textarea"
                                placeholder="Conteúdo txt da carga"
                            ></textarea>
                        );
                    })
                }
            </div>
        );
    }

    if (!agenda) return null;
    return (
        <IonCard target="_self" className="border border-1 p-0">
            <IonCardHeader className="banner p-2" >
                <IonCardTitle  >
                    <span className="badge bg-white me-1 text-primary">{agenda.id}</span>
                    <span className="font-monospace text-white fw-bold">{agenda.job}</span>
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="rounded rounded-2 bg-light m-3">
                <p className="lh-1 py-2">
                    <span className="badge bg-info my-1">Stack Nº{numeroPilha}</span>
                    {/* TODO: converter a data uma única vez e transitar ela entre componentes <---(!) */}
                    <span className="badge bg-info my-1">Versão: {validarExibirData(agenda.dataAtualizacao)}</span>
                    <span className="badge bg-info my-1">Executar após IDs: {agenda.executarAposJob.join(", ")}</span>
                    <span className="badge bg-info my-1">Programas: {agenda.programa.join(", ")}</span>
                    <span className="badge bg-info my-1">Tabelas: {agenda.programa.join(", ")}</span>
                    <span className="badge bg-info my-1">Grupo: UDA{agenda.grupoUda}</span>
                    <div className="my-2"></div>
                    <span className="text-dark">{agenda.descricao}</span>
                </p>
                {configParametros()}
                {configQuerys()}
                {configCarga()}
            </IonCardContent>
        </IonCard>
    );
};

export default JobCard;
