# Cours 10 - Mise en situation professionnelle : service réseau

!!! abstract "Informations pratiques"
    **Dates :** 21/09/2026

    **Formateur(s) :** Cédric RICHEZ

*Ce cours ne comporte pas de modules détaillés dans le référentiel : utilise cette page comme un module unique.*

## 🎯 Support de cours

<iframe class="tssr-pdf-frame" src="mspreseau.pdf"></iframe>

<p><a href="mspreseau.pdf" target="_blank">📄 Ouvrir le PDF dans un nouvel onglet</a></p>

## 🖼️ Résumé visuel

Configuration de l'infrastructure


```mermaid
flowchart TB
    subgraph serveur["Réseau LAN Serveur — 192.168.179.0/24"]
        c1["Serveur Windows Srv-Win1<br/>192.168.179.101"]
        c2["Serveur Windows Srv-Win2<br/>192.168.179.102"]
        c3["Serveur Linux Srv-Linux<br/>192.168.179.111"]
    end

    subgraph client["Réseau LAN Client — 192.168.179.0/24"]
        s1["Client Windows Win-PC1<br/>192.168.176.10"]
        s2["Poste Linux 1<br/>192.168.176.3"]
    end

    r1(("Routeur ROUTEUR-R1<br/>10.107.42.44 /16"))

    subgraph wan["Réseau WAN — 10.107.42.44 /16"]
    end

    serveur -->|"192.168.179.254 /24"| r1
    client -->|"192.168.176.254 /24"| r1
    r1 --- wan

    classDef node fill:#1a1a1a,stroke:#5fb3d9,stroke-width:1.5px,color:#ffffff;
    class c1,c2,c3,s1,s2,r1 node;

    style serveur fill:#d9ead3,stroke:#8fb28f,color:#1a1a1a
    style client fill:#cfe2f3,stroke:#7ea0bb,color:#1a1a1a
    style wan fill:#e6ddf0,stroke:#b39ddb,color:#1a1a1a
```

## 📖 Cours consolidé

_À compléter._

## ✅ Points clés à retenir

_À compléter._
