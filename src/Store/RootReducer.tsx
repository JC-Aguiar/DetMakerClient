import { combineReducers } from "@reduxjs/toolkit";
import tabMenu from './Reducer/ReducerTabMenu';
import login from './Reducer/ReducerUser';
import configAtividade  from './Reducer/ReducerAtividade';
import catalogoClientes from './Reducer/ReducerClientes';
import catalogoJobs from './Reducer/ReducerJobs';
import catalogoPipelines  from './Reducer/ReducerPipelines';
import catalogoRelatorios  from './Reducer/ReducerRelatorios';
import catalogoMassas  from './Reducer/ReducerMassas';
import catalogoQueries  from './Reducer/ReducerQueries';
import docRevisao from "./Reducer/ReducerRevisao";
import projetos from './Reducer/ReducerProjetos';

const rootReducer = combineReducers({
    tabMenu: tabMenu,
    login: login,
    configAtividade: configAtividade,
    configProjeto: projetos,
    catalogoClientes: catalogoClientes,
    catalogoJobs: catalogoJobs,
    catalogoPipelines: catalogoPipelines,
    catalogoMassas: catalogoMassas,
    catalogoQueries: catalogoQueries,
    catalogoRelatorios: catalogoRelatorios,
    docRevisao: docRevisao,
});
  
export default rootReducer;