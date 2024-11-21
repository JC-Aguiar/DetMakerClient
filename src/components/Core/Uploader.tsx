import { IonBadge } from "@ionic/react";
import InfoTag from "./InfoTag";
import GlassInput from "./GlassInput";

export interface UploaderProps {
    key?: number | null
    titulo: string,
    arquivosAtuais?: string[],
    accept: string,
    multiple: boolean,
    trigger: (arquivos: FileList | null) => void;
}

const Uploader: React.FC<UploaderProps> = ({ key = null, titulo, arquivosAtuais, accept, multiple, trigger }) => {

    const maxMB = 1 ; // 1MB
    const maxByteSize = maxMB * 1024 * 1024;

    const selecionarArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) {
            return;
        }
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            if (file.size > maxByteSize) {
                e.target.value = '';
                throw `Arquivo '${file.name}': o tamanho excede o limite de ${maxByteSize}MB.`;
            }
        }
        trigger(e.target.files);
    }

//    <div key={key} className="position-relative glass mx-3 mt-2 mb-4 py-3 px-2">
    return(
        <GlassInput key={key} text={titulo} className="">
            <form action="/upload" method="post" encType="multipart/form-data" className="m-2 mt-0" >
                <label htmlFor="formFile" className="form-label">
                    <span 
                        hidden={arquivosAtuais === undefined}
                        className="px-2 bg-transparent d-flex" 
                        style={{color: `var(--ion-color-primary)`}}
                    >
                        {arquivosAtuais && arquivosAtuais.length > 1 ? "Arquivos Atuais:" : "Arquivo Atual:"} 
                        <div>
                        {
                            arquivosAtuais?.map((item, index) => {
                                return <IonBadge key={index} color='dark' className="mx-1 px-2 mb-0 font-monospace">
                                    {item}
                                </IonBadge>
                            })
                        }
                        </div>
                    </span>
                </label>
                <input className="form-control" 
                    type="file" 
                    id="formFile" 
                    accept={accept}
                    multiple={multiple}
                    onChange={e => selecionarArquivo(e)} 
                />
            </form>
        </GlassInput>
    );
}

export default Uploader;