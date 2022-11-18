# MiracleListVue: Vue.js Web Client für das MiracleList Backend
Autor: Dr. Holger Schwichtenberg, <a href="http://www.IT-Visions.de">www.IT-Visions.de</a>

Diese Webanwendung läuft zu Test- und Schulungszwecken live in der Cloud: <a href="http://miraclelist-vue.azurewebsites.net">http://miraclelist-vue.azurewebsites.net</a>

Eingesetzte Techniken im Client: Vue.js 3, ~~Vue CLI~~ **Vite**, TypeScript, Bootstrap, Moment.js, Vuelidate, SignalR, vue.draggable, Vue-Toastification, ~~Jest~~ **Vitest**, Vue Test Utils, Nightwatch

# Fachbuch
Das Vue.js-Buch zu diesem Code: <a href="https://it-visions.de/vuebuch">Vue.js 3 Crashkurs</a>

# Branches
- <a href="https://github.com/HSchwichtenberg/MiracleListVue/tree/Sprint1">Sprint 1</a>: Ausgangszustand
- <a href="https://github.com/HSchwichtenberg/MiracleListVue/tree/Sprint2">Sprint 2</a>: REST-Dienste nutzen, Rendern von Daten mit Templates, Benutzerereignisse
- <a href="https://github.com/HSchwichtenberg/MiracleListVue/tree/Sprint3">Sprint 3</a>: Formulare, Zwei-Wege-Datenbindung, modalen Dialoge, Komponentenbildung
- <a href="https://github.com/HSchwichtenberg/MiracleListVue/tree/Sprint4">Sprint 4</a>: Authentifizierung, Anwendungszustand, Browserspeicher, Deployment und Lazy Loading
- <a href="https://github.com/HSchwichtenberg/MiracleListVue/tree/Sprint5">Sprint 5</a>: Design und User Experience 
- <a href="https://github.com/HSchwichtenberg/MiracleListVue/tree/Sprint6">Sprint 6</a>: Automatisierte Tests (Unit Tests und Ende-zu-Ende-Tests)
- <a href="https://github.com/HSchwichtenberg/MiracleListVue/tree/Main">Main</a>: Aktueller Entwicklungsstand, der über Sprint 6 hinausgeht
- <a href="https://github.com/HSchwichtenberg/MiracleListVue/tree/Vite">Vite</a>: Migration von Vue CLI mit Jest und Nightwatch nach Vite mit Vitest und Nightwatch

# Nutzung des Backends
MiracleList basiert auf einem in der öffentlich Cloud zugänglichen Backend. Sie benötigen eine Client-ID, die Sie unter https://miraclelistbackend.azurewebsites.net/clientid beantragen müssen. Die Client-ID muss dann in VUE_APP_ENV_ClientID=TODO in der Datei .env im Code erfasst werden.

# Was ist MiracleList?
<img align="right" src="/public/img/MiracleListLogo.jpg">
 <h4>Die Aufgabenverwaltung "MiracleList" ist ein praxisnahes Fallbeispiel für eine Cross-Platform-Anwendung auf Basis einer Single-Page-Webapplication (SPA). MiracleList dient Test- und Weiterbildungszwecken, d.h. MiracleList wird sowohl in den <a href="https://www.IT-Visons.de/Schulungen">Schulungen</a> als auch in den <a href="https://www.IT-Visons.de/Verlag">Fachbüchern</a> von <a href="https://www.IT-Visons.de">www.IT-Visions.de</a> behandelt. 
 Es gibt ein Backend und verschiedene Implementierung des Clients.</h4>
            <h5>Live-Systeme in der Cloud:</h5>
            <ul>
                <li>Backend: <a href="https://miraclelistbackend.azurewebsites.net">https://miraclelistbackend.azurewebsites.net</a></li>
                <li>Web- + Cross-Platform-Frontend TypeScript/Angular: <a href="http://www.miraclelist.net">http://www.miraclelist.net</a></li>
                <li>Web-Frontend TypeScript/VueJS:<a href="http://miraclelist-vue.azurewebsites.net/">http://miraclelist-vue.azurewebsites.net/</a>
                <li>Web-Frontend C#/Blazor Server: <a href="http://miraclelist-bs.azurewebsites.net">http://miraclelist-bs.azurewebsites.net</a></li>
                <li>Web-Frontend C#/Blazor WebAssembly: <a href="http://miraclelist-bw.azurewebsites.net">http://miraclelist-bw.azurewebsites.net</a></li>
                <li>Windows-Client TypeScript/Angular/Electron: <a href="https://Miraclelist.azurewebsites.net/download/MiracleListElectron-win32-x64.rar">https://Miraclelist.azurewebsites.net/download/MiracleListElectron-win32-x64.rar</a></li>
                <li>MacOS-Client TypeScript/Angular/Electron: <a href="https://Miraclelist.azurewebsites.net/download/MiracleListElectron-darwin-x64.rar">https://Miraclelist.azurewebsites.net/download/MiracleListElectron-darwin-x64.rar</a></li>
                <li>Linux-Client TypeScript/Angular/Electron: <a href="https://Miraclelist.azurewebsites.net/download/MiracleListElectron-linux-x64.rar">https://Miraclelist.azurewebsites.net/download/MiracleListElectron-linux-x64.rar</a></li></ul>
   <h5>Quellcode:</h5>
            <ul>
                <li>Backend .NET: <a href="https://github.com/HSchwichtenberg/MiracleListBackend">https://github.com/HSchwichtenberg/MiracleListBackend</a></li>
                <li>Web- + Cross-Platform-Frontend: <a href="https://github.com/HSchwichtenberg/MiracleListClient">https://github.com/HSchwichtenberg/MiracleListClient</a></li>
                <li>Web-Frontend TypeScript/VueJS: <a href="https://github.com/HSchwichtenberg/MiracleListVue">https://github.com/HSchwichtenberg/MiracleListVue</a></li>
                <li>Web-Frontend C#/Blazor: <a href="http://leanpub.com/BlazorBuch">http://leanpub.com/BlazorBuch (in den Downloads zu diesem Buch)</a></li>
            </ul>
</ul>

# Namensrichtlinien in diesem Vue.js-Projekt
lowerCamelCasing
- Lokale Variablen 
- Private Variablen auf Komponentenebene

UpperCamelCasing (Pascal Casing)
- Komponentennamen
- Klassennamen
- Methoden/Funktionen auf Komponentenebene
- Öffenliche Properties

# Wichtige Kommandozeilenbefehle für Vite

## Pakete installieren
```
npm install
```

### Entwicklungswebserver mit Hot Reload
```
npm run dev
```

### Produktionsbuild
```
npm run build
```

### Unit Tests mit Vitest
```
npm run test:unit
```

### End-to-End Tests (Browser-UI-Tests) mit Nightwatch
```
npm run test:e2e
```