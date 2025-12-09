# Guía para Generar APK - El Impostor

## Requisitos Previos
- ✅ EAS CLI instalado globalmente
- 📱 Cuenta de Expo (gratuita)

## Pasos para Generar la APK

### 1. Iniciar sesión en Expo
```bash
eas login
```
Introduce tus credenciales de Expo. Si no tienes cuenta, créala en https://expo.dev

### 2. Configurar el proyecto para EAS Build
```bash
eas build:configure
```
Este comando creará el archivo `eas.json` con la configuración de build.

### 3. Generar la APK
Para generar una APK que puedas instalar directamente en tu dispositivo:

```bash
eas build -p android --profile preview
```

**Opciones:**
- `-p android`: Especifica que quieres construir para Android
- `--profile preview`: Usa el perfil de preview que genera una APK instalable

### 4. Esperar la construcción
- El proceso se ejecuta en los servidores de Expo
- Recibirás un enlace para seguir el progreso
- La construcción puede tardar 10-20 minutos

### 5. Descargar la APK
Una vez completada la construcción:
- Recibirás un enlace de descarga
- También puedes ver todas tus builds en: https://expo.dev/accounts/[tu-usuario]/projects/el-impostor/builds
- Descarga el archivo `.apk`

### 6. Instalar en tu dispositivo
1. Transfiere el archivo APK a tu dispositivo Android
2. Abre el archivo APK en tu dispositivo
3. Permite la instalación de fuentes desconocidas si es necesario
4. ¡Listo! La app estará instalada

## Notas Importantes

### Primera vez
Si es tu primera vez usando EAS Build, te pedirá:
- Crear un proyecto en Expo
- Configurar credenciales de Android (se hace automáticamente)

### Builds gratuitos
- Expo ofrece builds gratuitos con algunas limitaciones
- Suficiente para desarrollo y pruebas personales

### Actualizar la APK
Para generar una nueva versión después de hacer cambios:
1. Haz tus cambios en el código
2. Ejecuta `eas build -p android --profile preview` nuevamente
3. Descarga e instala la nueva APK

## Alternativa: Build Local (Avanzado)
Si prefieres construir localmente sin usar los servidores de Expo:
```bash
eas build -p android --profile preview --local
```
Requiere tener Android Studio y el SDK de Android instalados.

## Solución de Problemas

### Error de credenciales
```bash
eas credentials
```
Usa este comando para gestionar las credenciales de Android.

### Ver builds anteriores
```bash
eas build:list
```

### Cancelar un build en progreso
```bash
eas build:cancel
```

## Recursos
- Documentación oficial: https://docs.expo.dev/build/setup/
- Dashboard de Expo: https://expo.dev/
