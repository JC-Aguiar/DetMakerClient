import { combineReducers } from "@reduxjs/toolkit";
import tabMenu from './Reducer/ReducerTabMenu';
import pilhaJobs from './Reducer/ReducerPilhaJobs';
import carregarJobs from "./Reducer/ReducerCarregarJobs";
import escolherJobs from "./Reducer/ReducerEscolherJobs";
import configurarJobs from "./Reducer/ReducerConfigurarJobs";
import relatorios from "./Reducer/ReducerRelatorios";
import configPipelines  from './Reducer/ReducerPipelines';
import projetos from './Reducer/ReducerProjetos';
import evidencia from './Reducer/ReducerEvidencia';
import login from './Reducer/ReducerUser';

const rootReducer = combineReducers({
    pilhaJobs: pilhaJobs,
    tabMenu: tabMenu,
    carregarJobs: carregarJobs,
    escolherJobs: escolherJobs,
    configurarJobs: configurarJobs,
    evidencia: evidencia,
    relatorios: relatorios,
    configPipelines: configPipelines,
    configProjeto: projetos,
    login: login,
});
  
export default rootReducer;