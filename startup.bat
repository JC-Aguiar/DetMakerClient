@echo off
SETLOCAL

echo "==================================================="
echo "==|   \| __|_   _|================================="
echo "==| |) | _|==| |==================================="
echo "==|___/|___|=|_|==================================="
echo "==================================================="
echo "==|  \/  | /_\ | |/ / __| _ \======================"
echo "==| |\/| |/ _ \| ' <| _||   /======================"
echo "==|_|==|_|_/=\_\_|\_\___|_|_\======================"
echo "==================================================="
echo "===/ __| |==|_ _| __| \| |_   _|==================="
echo "==| (__| |__ | || _|| .` |=| |====================="
echo "===\___|____|___|___|_|\_|=|_|====================="
echo "==================================================="
echo. 

echo Validando dependências para inicar o DET-MAKER CLIENT.
echo.

echo 1) Verificando se o Node.js está instalado.
call node -v
IF ERRORLEVEL 1 (
    echo Recurso indisponível. Instalando agora...
    powershell -Command "Start-Process -Wait -File 'https://nodejs.org/dist/latest/node-v23.2.0-x64.msi' -ArgumentList '/quiet' -Verb RunAs"
    echo.
    echo Recurso instalado.
    call node -v
) ELSE (
    echo Recurso já está instalado.
)
echo.

echo 2) Verificando se o http-server está instalado.
call http-server -v
IF ERRORLEVEL 1 (
    echo Recurso indisponível. Instalando agora...
    npm install -g http-server
    echo.
    echo Recurso instalado.
    call http-server -v
) ELSE (
    echo Recurso já está instalado.
)
echo.

echo "==================================================="
echo Iniciando servidor do DET-MAKER CLIENTE com http-server na porta 8080...
http-server --port 8080 -P http://localhost:8080?

ENDLOCAL