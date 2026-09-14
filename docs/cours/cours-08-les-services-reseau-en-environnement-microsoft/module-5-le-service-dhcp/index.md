# Module 5 : Le service DHCP

*Cours : [Cours 8 - Les services réseau en environnement Microsoft](../index.md)*

## 🎯 Objectif du module

Ce module explique le fonctionnement du DHCP : ses avantages/inconvénients, la notion de bail et le processus DORA, les conteneurs de gestion (étendues, exclusions, réservations), les options, l'agent relais, la gestion en environnement Active Directory, et plusieurs démonstrations.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Qu'est-ce que le DHCP ?

Le **DHCP** (*Dynamic Host Configuration Protocol*) automatise la configuration réseau des postes, notamment l'attribution des adresses IP, ce qui réduit fortement la charge d'administration.

**Avantages** : centralisation (homogénéisation des paramètres), réduction des erreurs de configuration, propagation automatique d'un changement (passerelle, DNS...) à tous les postes en IP dynamique.

**Inconvénients** : vulnérabilité accrue aux attaques par **déni de service** (le protocole est ouvert aux demandes externes) — atténuable par du filtrage sur les switches. Nécessite aussi une planification/calibrage soignés pour rester fiable.

---

## 2. La notion de bail

Un **bail** est le « contrat » (adresse IP, masque, durée, DNS...) qu'un client obtient auprès du serveur DHCP pour une durée donnée. Son contenu est configuré au niveau de l'**étendue**.

### Le processus DORA

| Étape | Requête | Description |
|---|---|---|
| **D** | Discover | Le client cherche un serveur DHCP sur le réseau |
| **O** | Offer | Un serveur propose un bail |
| **R** | Request | Le client choisit l'offre |
| **A** | Acknowledgement | Le serveur valide, le client reçoit ses paramètres |

**Renouvellement** : intervient à **50 %** de la durée du bail (ex. bail de 6 jours → renouvellement possible à 3 jours). En cas de non-réponse, un second appel intervient à **87,5 %**. **Résiliation** : via une requête **DHCP Release** — mais attention, **le bail n'est pas résilié automatiquement à l'arrêt du poste**.

---

## 3. Les conteneurs de gestion

| Conteneur | Rôle |
|---|---|
| **Étendue** | Regroupe un nom, une plage d'adresses allouables, une durée de bail |
| **Plage d'exclusion** | Sous-ensemble d'adresses **à l'intérieur** de l'étendue, volontairement non allouées |
| **Réservation** | Assigne une IP **fixe** à un poste précis (nom + IP + adresse MAC), rattachée à une étendue |

📌 La réservation est plus ciblée que l'exclusion, et peut être utilisée en complément.

---

## 4. Démonstration – Configuration du serveur DHCP

VM Windows Server 2019 (2 Go RAM, 2 CPU, 32 Go disque), carte réseau custom VMnet, IP fixe, hors domaine, nom `DHCP`.

**Installation** : Gérer → Ajouter des rôles → **DHCP** → à la fin, créer les groupes de sécurité de délégation (administrateurs et utilisateurs DHCP).

**Création de l'étendue** : nom `lan_client`, plage 192.168.1.20 à .30, exclusion de .20 à .29 → il ne reste qu'une seule IP disponible : **192.168.1.30**. Durée de bail : 8 jours par défaut.

**Test client** : activer « Obtenir une IP automatiquement » sur Windows 10, vérifier avec `ipconfig` → le client récupère bien 192.168.1.30.

---

## 5. La gestion des options

Les **options** permettent de transmettre des paramètres complémentaires aux clients (ex. passerelle, serveurs DNS).

```powershell
Set-DhcpServerv4OptionValue -DnsServer 192.168.1.1 -ScopeId "192.168.1.0"
```

### Les 3 niveaux de définition

| Niveau | Portée |
|---|---|
| **Serveur** | S'applique à **tous les baux**, toutes étendues confondues |
| **Étendue** | S'applique uniquement à **cette étendue** |
| **Réservation** | S'applique uniquement au(x) poste(s) **réservé(s)** |

**Démo** : option routeur (192.168.1.254) au niveau de l'étendue ; options DNS (192.168.1.1 / .2) au niveau du serveur, donc valables pour toutes les étendues. Validation côté client :

```
ipconfig /release
ipconfig /renew
ipconfig /all
```

---

## 6. L'agent relais DHCP

Problème : deux **réseaux de diffusion** différents doivent parfois partager un seul serveur DHCP. L'**agent relais DHCP** répond à ce besoin : il capte les requêtes des clients situés sur une zone sans serveur DHCP et les transmet vers un serveur DHCP situé sur un autre domaine de diffusion.

Le déroulé DORA reste le même, mais chaque requête transite par l'agent relais : Discover → relais → serveur → Offer → relais → client → Request → relais → serveur → Acknowledgement → relais → client. Résultat : **un seul serveur DHCP peut ainsi desservir plusieurs réseaux**.

---

## 7. Le DHCP en environnement Active Directory

### Autorisation

En environnement AD, un serveur DHCP doit être **autorisé** avant de pouvoir distribuer des adresses IP — sans cela, il **ne démarre pas**. Particularité : les serveurs Linux n'ont pas besoin de cette autorisation, et si le DHCP est déployé directement sur un contrôleur de domaine, l'autorisation est gérée automatiquement.

### Sauvegarde

| Type | Fonctionnement |
|---|---|
| **Synchrone** | Automatique, toutes les heures |
| **Asynchrone** | Nécessite une action manuelle |

### Fractionnement des étendues

Permet de répartir la charge entre deux serveurs DHCP (ex. 20 % / 80 % de la plage).

```
subnet 192.168.0.0 netmask 255.255.255.0 { range 192.168.0.1 192.168.0.20; }
subnet 192.168.0.0 netmask 255.255.255.0 { range 192.168.0.21 192.168.0.254; }
```

---

## 8. Démonstration – Autoriser un serveur DHCP dans un domaine AD

1. Vérifier les paramètres réseau (IP fixe, DNS pointant vers l'AD).
2. Renommer le serveur, rejoindre le domaine, redémarrer.
3. Vérifier le fonctionnement du DHCP : sans autorisation, le service s'arrête et **aucune IP n'est distribuée** au client de test.
4. Autoriser le serveur dans la console de gestion → actualiser.
5. Côté client : `ipconfig /renew` → toutes les infos IP sont bien récupérées.

---

## 9. Pour aller plus loin

- **DHCP Failover** : configurer un serveur DHCP de secours, non démarré par défaut, qui prend le relais en cas de défaillance du serveur principal.
- **Filtrage MAC** : permet d'autoriser ou refuser qu'une machine précise reçoive une IP, configurable dès le niveau des switches.
- **Journaux** : un fichier de log est généré **chaque jour** dans le répertoire du serveur DHCP — à consulter en priorité en cas d'anomalie, avec le journal d'audit Windows.

---

## ✅ Points clés à retenir

- Le bail suit toujours la séquence **DORA** (Discover, Offer, Request, Acknowledge).
- Renouvellement à **50 %** de la durée du bail, puis **87,5 %** en cas de non-réponse.
- Un bail **n'est pas résilié automatiquement** à l'arrêt du poste.
- Options définissables à **3 niveaux** : serveur, étendue, réservation.
- L'**agent relais** permet à un serveur DHCP unique de desservir plusieurs domaines de diffusion.
- En environnement AD, un serveur DHCP doit être **autorisé** (sauf Linux, ou déploiement direct sur un contrôleur de domaine).
- **Fractionnement des étendues** = répartition de charge entre deux serveurs.

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-08-les-services-reseau-en-environnement-microsoft-module-5-le-service-dhcp"></div>

<script type="application/json" id="quiz-cours-08-les-services-reseau-en-environnement-microsoft-module-5-le-service-dhcp-data">
[
  {
    "question": "Exemple de question à remplacer",
    "options": ["Réponse A", "Réponse B", "Réponse C"],
    "correctIndex": 0,
    "explanation": "Explique ici pourquoi cette réponse est correcte."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-08-les-services-reseau-en-environnement-microsoft-module-5-le-service-dhcp",
      dataId: "quiz-cours-08-les-services-reseau-en-environnement-microsoft-module-5-le-service-dhcp-data",
    });
  });
</script>
