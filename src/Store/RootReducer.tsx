import { combineReducers } from "@reduxjs/toolkit";
import tabMenu from './Reducer/ReducerTabMenu';
import catalogoJobs from './Reducer/ReducerJobs';
import relatorios from "./Reducer/ReducerRelatorios";
import catalogoPipelines  from './Reducer/ReducerPipelines';
import configAtividade  from './Reducer/ReducerAtividade';
import projetos from './Reducer/ReducerProjetos';
import evidencia from './Reducer/ReducerEvidencia';
import login from './Reducer/ReducerUser';
import buttons from './Reducer/ReducerButtons';

const rootReducer = combineReducers({
    tabMenu: tabMenu,
    login: login,
    buttons: buttons,
    pilhaJobs: catalogoJobs,
    catalogoPipelines: catalogoPipelines,
    evidencia: evidencia,
    relatorios: relatorios,
    configAtividade: configAtividade,
    configProjeto: projetos,
});
  
export default rootReducer;