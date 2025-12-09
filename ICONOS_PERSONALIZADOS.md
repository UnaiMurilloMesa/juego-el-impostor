# Guía para Añadir Iconos Personalizados - El Impostor

## Ubicación de los Iconos
Todos los iconos deben estar en la carpeta: `assets/`

## Iconos Necesarios

### 1. **icon.png** (Icono Principal)
- **Ruta**: `assets/icon.png`
- **Tamaño**: 1024x1024 px
- **Formato**: PNG con transparencia
- **Uso**: Icono de la app en iOS y base para Android

### 2. **adaptive-icon.png** (Icono Adaptativo Android)
- **Ruta**: `assets/adaptive-icon.png`
- **Tamaño**: 1024x1024 px
- **Formato**: PNG con transparencia
- **Importante**: 
  - El contenido principal debe estar en el círculo central (diámetro ~660px)
  - Los bordes pueden ser cortados en algunos dispositivos
  - El fondo se configura en `app.json` (actualmente blanco)

### 3. **splash-icon.png** (Pantalla de Carga)
- **Ruta**: `assets/splash-icon.png`
- **Tamaño Recomendado**: 1284x2778 px (o cualquier proporción vertical)
- **Formato**: PNG
- **Uso**: Se muestra mientras la app carga

## Pasos para Añadir tus Iconos

### Opción 1: Tienes tus propias imágenes
1. Prepara tus imágenes en los tamaños correctos
2. Nómbralas exactamente como se indica arriba
3. Colócalas en la carpeta `assets/` (reemplaza las existentes)

### Opción 2: Crear iconos simples
Si quieres crear iconos rápidos:
1. Usa una herramienta como Canva, Figma, o Photoshop
2. Crea un diseño cuadrado de 1024x1024
3. Exporta como PNG

### Opción 3: Generar desde una imagen
Si tienes una imagen y quieres generar todos los tamaños:
- Usa: https://www.appicon.co/
- Sube tu imagen
- Descarga los iconos generados

## Personalizar el Color de Fondo (Android)

En `app.json`, puedes cambiar el color de fondo del icono adaptativo:

```json
"android": {
  "adaptiveIcon": {
    "foregroundImage": "./assets/adaptive-icon.png",
    "backgroundColor": "#0f172a"  // Cambia este color
  }
}
```

Colores sugeridos para "El Impostor":
- `#0f172a` - Slate-900 (oscuro, como tu app)
- `#3b82f6` - Blue-500 (azul de acento)
- `#ef4444` - Red-500 (rojo de acento)

## Personalizar Pantalla de Carga

En `app.json`, puedes cambiar el color de fondo de la splash screen:

```json
"splash": {
  "image": "./assets/splash-icon.png",
  "resizeMode": "contain",
  "backgroundColor": "#0f172a"  // Cambia este color
}
```

## Verificar los Iconos

Después de añadir tus iconos:
1. Reinicia el servidor de Expo: `npx expo start -c`
2. Los iconos se actualizarán en la app
3. Para la APK, los iconos se incluirán automáticamente en el build

## Consejos de Diseño

### Para el Icono Principal
- Usa un diseño simple y reconocible
- Evita texto pequeño (difícil de leer en tamaños pequeños)
- Usa colores contrastantes
- Tema sugerido: Máscara, interrogación, o algo relacionado con "impostor"

### Para el Icono Adaptativo
- El diseño debe verse bien tanto en círculo como en cuadrado
- Mantén los elementos importantes en el centro

### Para la Splash Screen
- Puede ser el logo centrado
- Usa el mismo esquema de colores que tu app
- Mantén el diseño simple

## Ejemplo de Configuración Completa

```json
{
  "expo": {
    "name": "El Impostor",
    "slug": "el-impostor",
    "version": "1.0.0",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#0f172a"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0f172a"
      }
    }
  }
}
```

## Recursos Útiles
- Generador de iconos: https://www.appicon.co/
- Documentación Expo: https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/
- Guía de iconos adaptativos: https://developer.android.com/develop/ui/views/launch/icon_design_adaptive
