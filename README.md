# MiracleListVue: Vue.js Web Client für das MiracleList Backend
Autor: Dr. Holger Schwichtenberg, <a href="http://www.IT-Visions.de">www.IT-Visions.de</a></div>
Diese Webanwendung läuft zu Test- und Schulungszwecken live in der Cloud: <a href="http://miraclelist-vue.azurewebsites.net">http://miraclelist-vue.azurewebsites.net</a>

Eingesetzte Techniken im Client: Vue.js 3, Vue CLI, TypeScript, Bootstrap, Moment.js, Vuelidate, SignalR, vue.draggable, Vue-Toastification, Jest, Vue Test Utils, Nightwatch

# Branches
- <a href="https://github.com/HSchwichtenberg/MiracleListVue/tree/Sprint1">Sprint 1</a>: Ausgangszustand
- <a href="https://github.com/HSchwichtenberg/MiracleListVue/tree/Sprint2">Sprint 2</a>: REST-Dienste nutzen, Rendern von Daten mit Templates, Benutzerereignisse
- <a href="https://github.com/HSchwichtenberg/MiracleListVue/tree/Sprint3">Sprint 3</a>: Formulare, Zwei-Wege-Datenbindung, modalen Dialoge, Komponentenbildung
- <a href="https://github.com/HSchwichtenberg/MiracleListVue/tree/Sprint4">Sprint 4</a>: Authentifizierung, Anwendungszustand, Browserspeicher, Deployment und Lazy Loading
- <a href="https://github.com/HSchwichtenberg/MiracleListVue/tree/Sprint5">Sprint 5</a>: Design, User Experience und automatisierte Tests (Unit Tests und E2E-Tests)
- <a href="https://github.com/HSchwichtenberg/MiracleListVue/tree/Main">Main</a>: Aktueller Entwicklungsstand, der ggf. über Sprint 5 hinausgeht

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

# Kommandozeilenbefehle der Vue CLI

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
