# Module 6 : Le service DNS

*Cours : [Cours 8 - Les services réseau en environnement Microsoft](../index.md)*

## 🎯 Objectif du module

Ce module explique le fonctionnement de la résolution de noms (cache, fichier hosts, service DNS), la hiérarchie DNS, la distinction résolveur/hébergeur, les mécanismes d'interrogation et de redirection, les zones et enregistrements, les mises à jour/transferts de zone, et les sous-domaines/délégations.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. La résolution de noms

Pour localiser un service, une machine effectue une requête vers le **DNS** du réseau. C'est essentiel aussi bien pour accéder au web que pour joindre des ressources du réseau local.

### Les 3 mécanismes de résolution

| Mécanisme | Description |
|---|---|
| **Le cache DNS** | Conserve les correspondances déjà résolues. Attention : il conserve aussi les **réponses négatives** — si un site indisponible reste inaccessible dans le temps, ça peut venir du cache (`ipconfig /flushdns` pour le vider) |
| **Le service DNS** | Interrogé pour toute nouvelle demande de résolution |
| **Le fichier hosts** | Ancêtre du DNS (`system32\drivers\etc\hosts`). Ses entrées sont **prioritaires** sur le DNS : si une correspondance y figure, aucune requête DNS n'est déclenchée |

```
ipconfig /displaydns    # afficher le cache DNS
ipconfig /flushdns      # vider le cache DNS
```

⚠️ Syntaxe hosts : IP en 1ère colonne, nom d'hôte en 2e. Une entrée erronée (volontaire ou non) peut tromper un utilisateur sur l'adresse réelle d'un service.

---

## 2. Le service DNS

Le DNS transforme des **adresses IP** en **noms compréhensibles** (ex. 10.1.1.1 → « mon poste »). Il repose sur une architecture **distribuée** et **hiérarchique**, normée par des RFC.

**EDNS** (*Extension Mechanisms for DNS*) ajoute des fonctionnalités au DNS classique, notamment la prise en charge de paquets plus volumineux.

---

## 3. Noms d'hôtes et noms de domaine

Une machine intégrée à un domaine porte un nom complet : `nom_machine.nom_domaine`, appelé **FQDN** (*Fully Qualified Domain Name*). Le nom seul du poste (sans domaine) est le nom **NetBIOS**.

| Partie | Exemple (www.google.fr) | Rôle |
|---|---|---|
| **Hôte** | www | Identifie le poste au sein de son espace de noms |
| **Domaine** | google.fr | Identifie l'espace de noms |

⚠️ **Ne pas confondre un domaine DNS et un domaine d'authentification (Active Directory)** — deux notions bien distinctes.

Espace de noms **privé** (interne entreprise) vs **public** (Internet) : mieux vaut éviter qu'un espace privé reprenne un nom déjà référencé publiquement, pour ne pas créer d'erreurs.

---

## 4. La hiérarchisation des espaces de noms

De haut en bas :

1. **Le domaine racine** — pas un serveur unique, mais **13 serveurs** disséminés mondialement (NASA, US Army, ICANN...).
2. **Les TLD** (*Top Level Domain*) — .fr, .com, .de... (liste exhaustive sur www.iana.org).
3. **Domaines de 2e/3e niveau** — ex. www.education.gouv.fr.

📌 Le point final de la racine est implicite mais toujours présent (`www.google.fr.`).

### Les rôles d'un serveur DNS

| Rôle | Description |
|---|---|
| **DNS résolveur** | Résout les noms **externes** à l'entreprise |
| **DNS hébergeur** | Héberge un espace de noms interne (ex. pour AD) |

Un même serveur peut cumuler les deux rôles, ou ceux-ci peuvent être répartis — selon les besoins identifiés en amont.

---

## 5. Le rôle du DNS résolveur

Le résolveur agit comme **intermédiaire** : le client l'interroge, et lui se charge d'adresser la requête au bon serveur DNS. Point important : le résolveur **ne gère pas d'espace de noms** lui-même — il ne fait que router les requêtes vers les serveurs qui détiennent les enregistrements.

---

## 6. Les mécanismes d'interrogation

| Requête | Moyen mnémotechnique | Fonctionnement |
|---|---|---|
| **Récursive** | R = Réponse | Le client attend une **réponse complète** de son serveur DNS |
| **Itérative** | I = Indice | Entre serveurs : si la réponse est inconnue, on interroge la racine, qui indique le serveur du TLD concerné, et ainsi de suite jusqu'à obtenir l'IP |

⚠️ Les requêtes itératives multiplient les échanges réseau, avec un risque de saturation à grande échelle — d'où l'importance d'un bon dimensionnement, et de deux mécanismes d'amortissement : **redirecteurs** et **mise en cache**.

---

## 7. Les redirections

| Type | Fonctionnement |
|---|---|
| **Non conditionnelle** | Sans config particulière, interrogation des serveurs racines (ou du DNS du FAI) |
| **Conditionnelle** | Redirecteur ciblé pour un espace de noms précis, souvent privé (ex. domaine interne d'entreprise) |

**Mise en cache** : chaque résultat obtenu est mis en cache pour optimiser les résolutions futures. Sa durée de conservation est le **TTL** (*Time To Live*), variable par enregistrement. Les réponses négatives sont aussi conservées.

---

## 8. Démonstration – Configuration du service DNS

VM Windows Server 2019 (2 CPU, 2 Go RAM, 60 Go disque), carte Bridge + VMnet. IP en DHCP (ex. 192.168.0.16), DNS = **localhost** (le serveur s'interroge lui-même une fois le rôle installé).

**Installation** : rôle DNS via le gestionnaire de serveur. Vérification :

```
nslookup google.fr              # OK, résolution externe
nslookup monentreprise.local    # erreur, pas encore de redirecteur configuré
```

**Redirecteur conditionnel** : créé pour `monentreprise.local` + son IP, afin de résoudre ce nom privé non référencé sur le web. Testé côté client via une IP fixe pointant vers ce serveur DNS.

---

## 9. Le DNS hébergeur

Contrairement au résolveur, le **DNS hébergeur** fait **autorité** sur un espace de noms : il répond directement avec les informations qu'il détient.

```
example.com. IN A 192.0.2.1
```

---

## 10. Les zones DNS

Une **zone** est un conteneur regroupant les enregistrements d'un espace de noms — comme un carton dans lequel on range les infos d'un espace de noms donné. Chaque zone est stockée dans un fichier dédié (sauf les zones intégrées à AD).

| Type de zone | Rôle |
|---|---|
| **Directe** | Résout **nom → IP** |
| **Inverse** | Résout **IP → nom** |

### Maître / esclave

| Rôle | Zone | Accès |
|---|---|---|
| **Maître** (principal) | Zone principale | Lecture/écriture |
| **Esclave** (secondaire) | Zone secondaire | Lecture seule |

📌 Les deux serveurs **font autorité** et peuvent répondre — ce qui assure la tolérance de panne.

### Les enregistrements DNS

| Type | Description |
|---|---|
| **SOA** | FQDN du serveur DNS ayant la zone en écriture |
| **NS** | Serveurs faisant autorité pour la zone |
| **A** | Nom d'hôte → IPv4 |
| **AAAA** | Nom d'hôte → IPv6 |
| **CNAME** | Alias vers un autre domaine |
| **MX** | Serveur de messagerie |
| **PTR** | (zones inverses) IP → nom |

---

## 11. Démonstration – Configuration d'un serveur DNS hébergeur

Serveur DNS : 192.168.1.3 · Client W10-DNS : 192.168.1.11 · SRV1 : 192.168.1.4 (VMnet 11).

1. **Zone directe** principale `ma-zone.local`, sans mise à jour dynamique → génère automatiquement SOA et NS.
2. **Zone inverse** principale IPv4 pour `192.168.1.`, sans mise à jour dynamique.
3. Ajout d'enregistrements **A** avec l'option « créer un pointeur d'enregistrement » cochée → génère automatiquement le PTR dans la zone inverse.

**Tests** :
```
nslookup ma-zone.local          # zone hébergée
nslookup yahoo.com              # redirection externe
nslookup monentreprise.local    # redirecteur conditionnel
```

---

## 12. Les mises à jour

| Type d'enregistrement | Usage |
|---|---|
| **Statique** | Saisi manuellement, figé — recommandé pour les services critiques (mail, web) |
| **Dynamique** | Créé/mis à jour automatiquement (ex. un poste rejoignant un domaine AD s'enregistre seul : hôte + pointeur créés) |

### Transferts de zone

Échange entre un **serveur principal** et un **serveur secondaire**. Le principe : une requête de transfert vérifie si le **numéro de version** de la zone a changé.
- **IXFR** (*Incremental*) : récupère seulement les **changements**.
- **AXFR** (*All*) : transfert **complet** de la zone.

Le numéro de série est incrémenté à chaque modification, ce qui déclenche la notification puis le transfert vers les secondaires.

```
nslookup -type=all mon_domaine.local
```

---

## 13. Démonstration – Mises à jour et transfert de zones

**Mise à jour dynamique** : 3 options (Aucun, Non sécurisé, Sécurisé) dans les propriétés de zone. Une fois activée, chaque nouvel hôte s'enregistre automatiquement. 📌 Quand un AD est installé, un DNS est configuré avec ses zones associées, et les mises à jour y sont généralement réservées aux **clients sécurisés uniquement**.

**Transfert de zone** : Propriétés de la zone → onglet **Transfert de zone** → autoriser le transfert uniquement vers l'IP du serveur cible. Sur le second serveur : création d'une **zone secondaire** avec le nom de la zone et l'IP du maître.

**Test** : un premier transfert manuel synchronise la zone secondaire (en **lecture seule**). Ajout d'un hôte sur le maître → actualisation sur l'esclave → réplication confirmée.

---

## 14. Les sous-domaines et délégations

Un **sous-domaine** regroupe des enregistrements par appartenance à une même entité (ex. plusieurs sites : `nantes.mondomaine.local`). Défini dans sa propre zone, il peut fonctionner **indépendamment** tout en restant rattaché au domaine racine.

Une **délégation** confie la gestion d'un sous-domaine à **un autre serveur DNS**, rendant les sites plus autonomes. La zone racine reste autorité pour elle-même, mais plus pour les espaces délégués — elle peut néanmoins toujours répondre si besoin.

---

## 15. Démonstration – Sous-domaines et délégations

Serveur initial : zone `mazone.local`. Nouveau serveur (site Rennes) : zone `rennes.mazone.local`.

**Sans délégation** : `nslookup test.rennes.mazone.local` → échec, domaine inconnu.

**Création de la délégation** : sur `mazone.local` → clic droit → **Nouvelle délégation** → domaine délégué `rennes` → ajout du serveur DNS faisant autorité pour cette zone. 📌 Une délégation correcte apparaît **grisée** (pas jaune), avec l'enregistrement **NS** adéquat.

**Vérification** : `nslookup test.rennes.mazone.local` → réponse obtenue. Ajout d'un nouvel hôte `test2` sur le serveur délégué → nouveau test concluant.

---

## ✅ Points clés à retenir

- Ordre de priorité : **fichier hosts > cache DNS > requête au service DNS**.
- **FQDN** = nom NetBIOS + domaine ; ne pas confondre domaine DNS et domaine Active Directory.
- Hiérarchie : **racine → TLD → domaines de 2e/3e niveau**.
- **DNS résolveur** = résout les requêtes externes ; **DNS hébergeur** = fait autorité sur un espace de noms.
- **Récursive** = réponse complète attendue ; **itérative** = résolution progressive entre serveurs.
- **Zone directe** = nom → IP ; **zone inverse** = IP → nom.
- Enregistrements clés : **SOA, NS, A, AAAA, CNAME, MX, PTR**.
- **IXFR** = changements seuls, **AXFR** = transfert complet ; le secondaire est toujours en **lecture seule**.
- Les **délégations** confient la gestion d'un sous-domaine à un serveur distinct, tout en gardant le lien avec le domaine racine.

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-08-les-services-reseau-en-environnement-microsoft-module-6-le-service-dns"></div>

<script type="application/json" id="quiz-cours-08-les-services-reseau-en-environnement-microsoft-module-6-le-service-dns-data">
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
      containerId: "quiz-cours-08-les-services-reseau-en-environnement-microsoft-module-6-le-service-dns",
      dataId: "quiz-cours-08-les-services-reseau-en-environnement-microsoft-module-6-le-service-dns-data",
    });
  });
</script>
