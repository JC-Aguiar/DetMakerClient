export namespace StringUtils {

    export function getVariavel(texto: string): RegExpExecArray | null {
        const regex = /\${(.*?)}/;
        return regex.exec(texto);
    }

}