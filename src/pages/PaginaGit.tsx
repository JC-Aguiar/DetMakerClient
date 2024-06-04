import { IonAccordionGroup, IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonItem, IonLabel, IonList, IonMenu, IonRow, IonSplitPane, useIonViewWillEnter } from "@ionic/react";
import * as axiosRequest from "../data/AxiosRequest";
import axios from 'axios';
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import dayjs from "dayjs";
import ListaRetratril, { ListaRetratrilAgrupada, ListaRetratrilProps } from "../components/Core/ListaRetratil";
import ItemLista from "../components/Core/ItemLista";
import { add, cube, fingerPrint, folder, layers, library, pricetag, refresh } from "ionicons/icons";
import Carregando from "../components/Core/Carregando";
import Botao from "../components/Core/Botao";
import ListaCatalogoJobs from "../components/Lists/ListaCatalogoJobs";
import ListaCatalogoMassas from "../components/Lists/ListaCatalogoMassas";
import ListaCatalogoPipelines from "../components/Lists/ListaCatalogoPipelines";
import { ButtonLayoutProps, layoutGrupoBotoes } from "../components/Core/ButtonLayout";
import Informativo from "../components/Core/Informativo";

export interface GitlabGroup {
    id: number,
    web_url: string,
    name: string,
    path: string,
    description: string,
    visibility: string,
    share_with_group_lock: boolean,
    require_two_factor_authentication: boolean,
    two_factor_grace_period: number,
    project_creation_level: string,
    auto_devops_enabled: boolean,
    subgroup_creation_level: string,
    emails_disabled: boolean,
    mentions_disabled: boolean,
    lfs_enabled: boolean,
    default_branch_protection: number,
    avatar_url: string,
    request_access_enabled: boolean,
    full_name: string,
    full_path: string,
    created_at: string,
    parent_id: number,

    //frontend only
    projects_id: number[]
}

export interface GitlabNamespace {
    id: number,
    name: string,
    path: string,
    kind: string,
    full_path: string,
    parent_id: number,
    avatar_url: string,
    web_url: string,
}
  
export interface GitlabRepository {
    id: number;
    description: string;
    name: string;
    name_with_namespace: string;
    path: string;
    path_with_namespace: string;
    created_at: string;
    default_branch: string;
    topics: string[];
    ssh_url_to_repo: string;
    http_url_to_repo: string;
    web_url: string;
    readme_url: string,
    avatar_url: string | null;
    last_activity_at: string;
    namespace: GitlabNamespace;
    packages_enabled: boolean;
    empty_repo: boolean;
    archived: boolean;
    visibility: string;
    issues_enabled: boolean;
    merge_requests_enabled: boolean;
    wiki_enabled: boolean;
    jobs_enabled: boolean;
    snippets_enabled: boolean;
    shared_runners_enabled: boolean;
    creator_id: number;
    star_count: number;
    forks_count: number;
    open_issues_count: number;
    public_jobs: boolean;
    shared_with_groups: any[];
    request_access_enabled: boolean;
}




const PaginaGit: React.FC = () => {

    const urlBase = `https://gitlab.toppen.com.br/api/v4/`;

    //Listar todos os projetos
    const projectsGetAll = () => {
        return { metodo: `GET`, path: `projects` };
    }

    //Obter informações de um projeto específico
    const projectsGetOne = (id: number) => {
        return { metodo: `GET`, path: `projects/${id}` };
    }

    //Criar um novo projeto
    const projectsNew = () => {
        return { metodo: `POST`, path: `projects` };
    }

    //Atualizar um projeto existente
    const projectsUpdate = (id: number) => {
        return { metodo: `PUT`, path: `projects/${id}` };
    }

    //Excluir um projeto
    const projectsDelete = (id: number) => {
        return { metodo: `DELETE`, path: `projects/${id}` };
    }

    //Listar todos os usuários
    const usersGetAll = () => {
        return { metodo: `GET`, path: `users` };
    }

    //Obter informações de um usuário específico
    const usersGetOne = (id: number) => {
        return { metodo: `GET`, path: `users/${id}` };
    }

    //Listar todos os grupos
    const groupsGetAll = () => {
        return { metodo: `GET`, path: `groups` };
    }

    //Obter informações de um grupo específico
    const groupsGetOne = (id: number) => {
        return { metodo: `GET`, path: `groups/${id}` };
    }

    //Criar um novo grupo
    const groupsNew = () => {
        return { metodo: `POST`, path: `groups` };
    }

    //Atualizar um grupo existente
    const groupsUpdate = (id: number) => {
        return { metodo: `PUT`, path: `groups/${id}` };
    }

    //Excluir um grupo
    const groupsDelete = (id: number) => {
        return { metodo: `DELETE`, path: `groups/${id}` };
    }

    //Listar todos os pipelines de um projeto
    const projectsGetAllPipelines = (id: number) => {
        return { metodo: `GET`, path: `projects/${id}/pipelines` };
    }

    //Obter informações de um pipeline específico
    const projectsGetOnePipeline = (id: number, pipelineId: number) => {
        return { metodo: `GET`, path: `projects/${id}/pipelines/${pipelineId}` };
    }

    //Listar todos os jobs de um pipeline
    const projectsGetPipelineAllJobs = (id: number, pipelineId: number) => {
        return { metodo: `GET`, path: `projects/${id}/pipelines/${pipelineId}/jobs` };
    }

    //Obter informações de um job específico
    const projectsGetPipelineJob = (id: number, jobId: number) => {
        return { metodo: `GET`, path: `projects/${id}/jobs/${jobId}` };
    }

    //Listar todos os commits de um projeto
    const projectsGetAllCommits = (id: number) => {
        return { metodo: `GET`, path: `projects/${id}/repository/commits` };
    }

    //Obter informações de um commit específico
    const projectsGetOneCommit = (id: number, sha: string) => {
        return { metodo: `GET`, path: `projects/${id}/repository/commits/${sha}` };
    }

    //Listar todas as branches de um projeto
    const projectsGetAllBranches = (id: number) => {
        return { metodo: `GET`, path: `projects/${id}/repository/branches` };
    }

    //Obter informações de uma branch específica
    const projectsGEtOneBranche = (id: number, branchName: string) => {
        return { metodo: `GET`, path: `projects/${id}/repository/branches/${branchName}` };
    }


    const [loading, setLoading] = useState<boolean>(false);
    const [gitGroups, setGitGroups] = useState<GitlabGroup[]>([]);
    const [gitRepos, setGitRepos] = useState<GitlabRepository[]>([]);

    const atendimento1Id = 43;
    const atendimento1Token = "glpat-smesac78LP1EdVtJxD8Q";
    const config = {
        headers: { 'Authorization': `Bearer ${atendimento1Token}` }
    };

/*
    async function atendimento1GetAllGroups(): Promise<GitlabGroupDTO[]> {
        return await axios
            .get(`${urlBase}groups/${atendimento1Id}/subgroups?all_available=true`, config)
            .then(response => response.data)
            .catch(erro => { throw erro });
    }
*/

    async function requestAllGroups(id: number): Promise<GitlabGroup[]> {
        return await axios
            .get(`${urlBase}groups/${id}/subgroups?all_available=true`, config)
            .then(response => response.data)
            .catch(erro => { throw erro });
    }

    async function requestAllProjects(id: number): Promise<GitlabRepository[]> {
        return await axios
            .get(`${urlBase}groups/${id}/projects`, config)
            .then(response => response.data)
            .catch(erro => { throw erro });
    }

    async function requestAllInnerProjects(id: number): Promise<GitlabRepository[]> {
        return await axios
            .get(`${urlBase}groups/${id}/projects?include_subgroups=true`, config)
            .then(response => response.data)
            .catch(erro => { throw erro });
    }

    async function requestAllRepositories(): Promise<GitlabRepository[]> {
        return await axios
            .get(`${urlBase}projects?sort=asc`, config)
            .then(response => response.data)
            .catch(erro => { throw erro });
    }


    async function requestAllRepositories2(): Promise<GitlabNamespace[]> {
        return await axios
            .get(`${urlBase}projects/${atendimento1Id}/groups`, config)
            .then(response => response.data)
            .catch(erro => { throw erro });
    }

/*
    const getGroupAllInfo = async (id: number) => {
        setGitGroups([]);
        await requestAllGroups(id).then(groups => {
            setGitGroups(actualGroups => [...actualGroups, ...groups])
            groups.forEach(async group => await getGroupAllInfo(group.id));
        });
    }
*/

    const coletarRecursos = () => {
        setLoading(true);
        setGitGroups([]);
        setGitRepos([]);

        Promise
            .all([
                requestAllGroups(atendimento1Id).then(setGitGroups),
                requestAllRepositories().then(repos => setGitRepos(repos.filter(repo => !repo.archived)))
            ])
            .then(() => setLoading(false));

        /*
        requestAllGroups(atendimento1Id).then(groups => {
            groups.forEach(group => {
                requestAllProjects(group.id).then(repos => {
                    setGitRepos(actualRepos => [...actualRepos, ...repos]);
                });
                requestAllInnerProjects(group.id).then(repos => {
                    setGitRepos(actualRepos => [...actualRepos, ...repos]);
                });
            });
            setGitGroups(groups);
        });
        */
    } 

    const butoes: ButtonLayoutProps[] = [ 
        {
            title: 'Atualizar',
            icon: refresh,
            trigger: () => coletarRecursos(),
            disabled: false, //isLoading,
        },
    ];

    useIonViewWillEnter(() => {
        if (gitRepos.length > 0 || gitGroups.length > 0 || loading) 
            return;
        coletarRecursos();
    }, []);


    const grupoRepositorios = (gruopId: number) => {
        const repos = gitRepos.filter(repo => repo.namespace.parent_id === gruopId || repo.namespace.id === gruopId);
        return <IonList className="m-0 p-0">
            {
                repos.map((repo, index) => {
                    const color = index % 2 === 0 ? 'medium' : 'none';
                    return <ItemLista text={repo.name} tag={repo.id} key={index} color={color} icon={folder} innerPad={3} />
                })
            }
        </IonList>
    }

    const conteudoGrupo = (group: GitlabGroup) => {
        const formattedDate = dayjs(group.created_at).format('DD/MM/YYYY HH:mm:ss');
        return <IonCardContent className="m-0 p-0">
                <IonBadge className="w-100 py-0 my-0" color="#">
                    <IonRow className="ion-justify-content-beetwen px-2">
                        <IonCol className="text-start">ID {group.id}</IonCol>
                        <IonCol className="text-start">{formattedDate}</IonCol>
                        <IonCol className="text-end">{group.visibility.toUpperCase()}</IonCol>
                    </IonRow>
                </IonBadge>
                {grupoRepositorios(group.id)}
            </IonCardContent>
    }

    const listasRetratil: ListaRetratrilProps[] = gitGroups
        .filter(group => group.parent_id === atendimento1Id)
        .map((group, index) => {
            return ({ title: group.name, icon: folder, content: conteudoGrupo(group) })
        });

    //Renderização da página
    if (loading) return <Carregando />;
    else if (gitRepos.length < 1) return (
        <div className='p-0 m-0'> 
            {layoutGrupoBotoes(butoes)}
            <Informativo status='SemDados' />
        </div>
    );
    return ( 
        <div className='p-0 m-0'> 
            {layoutGrupoBotoes(butoes)}
            <IonSplitPane when="xs" contentId="gitContent" className='ps-5 ms-5 '>
                <IonMenu contentId="gitContent" className='glass' color='#'>
                    <IonContent className='glass-content p-0 m-0 mx-5'>
                        <ListaRetratrilAgrupada listas={listasRetratil} />
                    </IonContent>
                </IonMenu>
                <div className="container" id="gitContent" >
                    <IonContent className='w-100 h-100' scrollY fullscreen>
                        <IonList>
                        {
                            gitRepos.map((repo, index) => <ItemLista text={repo.name_with_namespace} />)
                        }
                        </IonList>
                        {/*conteudoPainelPrincipal()*/}
                    </IonContent>
                </div>
            </IonSplitPane>
        </div>
    );
}

export default PaginaGit;

/*
<Swiper slidesPerView={3}
            grid={{ rows: 3, fill: "row" }}
            spaceBetween={10}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[Grid, Navigation]}
        >
            {
                gitGroups.filter(group => group.parent_id === atendimento1Id).map((group, index) => {
                    const formattedDate = dayjs(group.created_at).format('DD/MM/YYYY HH:mm:ss');
                    return <SwiperSlide key={index} className="">
                        <IonAccordionGroup>
                            <IonCard className="glass m-3">
                                <IonCardHeader className="m-0 p-0">
                                    <a href={group.web_url} target="_blank" className="text-decoration-none">
                                        <IonItem color="primary m-0 p-0">
                                            <IonBadge color="tertiary">ID {group.id}</IonBadge>
                                            <IonCardTitle className="ms-2 text-dark">
                                                {group.name}
                                            </IonCardTitle>
                                        </IonItem>
                                    </a>
                                </IonCardHeader>
                                <IonCardContent className="mt-2 p-0">
                                    <IonBadge className="w-100 py-0 my-0" color="#">
                                    <IonRow className="ion-justify-content-beetwen px-2">
                                        <IonCol className="text-start">{formattedDate}</IonCol>
                                        <IonCol className="text-end">{group.visibility.toUpperCase()}</IonCol>
                                    </IonRow>
                                    </IonBadge>
                                    <ListaRetratril title="Repositórios"
                                        content={renderGitRepositoryList(group.id)}
                                        glass={false}
                                    />
                                </IonCardContent>
                            </IonCard>
                        </IonAccordionGroup>
                    </SwiperSlide>
                })
            }
        </Swiper>
*/