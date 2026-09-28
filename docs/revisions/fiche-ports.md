# 🔌 Ports à connaître pour l'examen TSSR

## Vue d'ensemble par catégorie

```mermaid
mindmap
  root((Ports TSSR))
    Accès distant
      22 SSH
      23 Telnet
      3389 RDP
    Fichiers
      20/21 FTP
      445 SMB
    Web
      80 HTTP
      443 HTTPS
    Messagerie
      25 SMTP
      110 POP3
      143 IMAP
    Infrastructure
      53 DNS
      67/68 DHCP
    Active Directory
      88 Kerberos
      389 LDAP
```

## Tableau détaillé

| Port | Protocole | Service | Signification |
|:---:|:---:|---|---|
| **20 / 21** | TCP | **FTP** — *File Transfer Protocol* | Transfert de fichiers non chiffré (20 = données, 21 = commandes) |
| **22** | TCP | **SSH** — *Secure Shell* | Administration à distance chiffrée, SFTP, SCP |
| **23** | TCP | **Telnet** — *Teletype Network* | Accès distant non chiffré (obsolète) |
| **25** | TCP | **SMTP** — *Simple Mail Transfer Protocol* | Envoi de mails entre serveurs |
| **53** | UDP/TCP | **DNS** — *Domain Name System* | Résolution de noms en adresses IP |
| **67 / 68** | UDP | **DHCP** — *Dynamic Host Configuration Protocol* | Attribution automatique d'IP (67 = serveur, 68 = client) |
| **80** | TCP | **HTTP** — *HyperText Transfer Protocol* | Web non chiffré |
| **88** | TCP/UDP | **Kerberos** — *pas un acronyme* (chien à trois têtes de la mythologie) | Authentification Active Directory |
| **110** | TCP | **POP3** — *Post Office Protocol version 3* | Récupération des mails (téléchargés puis supprimés du serveur) |
| **143** | TCP | **IMAP** — *Internet Message Access Protocol* | Consultation des mails synchronisée avec le serveur |
| **389** | TCP/UDP | **LDAP** — *Lightweight Directory Access Protocol* | Interrogation de l'annuaire (Active Directory) |
| **443** | TCP | **HTTPS** — *HyperText Transfer Protocol Secure* | Web chiffré (TLS) |
| **445** | TCP | **SMB** — *Server Message Block* | Partage de fichiers et d'imprimantes Windows |
| **3389** | TCP | **RDP** — *Remote Desktop Protocol* | Bureau à distance Windows |


## 💡 Astuces mémo

- **UDP** pour l'infrastructure qui doit être rapide (DNS, DHCP).
- **TCP** pour les services qui ont besoin de fiabilité (web, mail, SSH).
- Le **« S »** final (HTTPS, LDAPS, IMAPS…) indique la version chiffrée par TLS.
- Plages : ports bien connus **0-1023**, enregistrés **1024-49151**, dynamiques **49152-65535**.
