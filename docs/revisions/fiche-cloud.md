# Comparaison des types de cloud

| Critère | Cloud public | Cloud privé | Cloud hybride |
|---|---|---|---|
| **Principe** | Ressources hébergées et fournies par un prestataire | Matériel dédié dans un datacenter tiers ou interne | Combinaison d'hébergement local, de cloud privé et de cloud public |
| **Propriété du matériel** | Fournisseur de services | Entreprise (achat ou location d'équipements spécifiques) | Mixte, selon les briques choisies |
| **Mutualisation** | Oui, ressources partagées | Non, matériel dédié | Partielle |
| **Évolutivité** | Quasi illimitée, limitée par la taille physique des baies du fournisseur | Dépend d'investissements importants et de la place disponible dans la baie | Flexible : on choisit la solution adaptée à chaque besoin |
| **Fiabilité / maintenance** | Garantie par l'hébergeur ; les pannes matérielles (disques, cartes réseau) ne sont pas à notre charge | À notre charge : fiabilité et sécurité de l'infrastructure | Partagée entre le fournisseur et l'entreprise |
| **Sécurité** | Dépend du fournisseur, matériel partagé | Renforcée, car le matériel n'est pas mutualisé | Maîtrisée : données sensibles en privé, le reste en public |
| **Coûts** | Faibles (pas de matériel à maintenir), facturation à la consommation | Élevés (investissements, maintenance) | Optimisés, gestion plus fine selon les besoins et le budget |
| **Points de vigilance** | Volume de données échangées et temps d'allumage des VM, qui font grimper la facture (ex. Azure) | Saturation de la baie : s'étendre peut imposer une nouvelle baie dans un autre datacenter | Bien anticiper les évolutions de l'infrastructure pour investir judicieusement |
| **Profil type** | Toute entreprise voulant éviter la gestion du matériel | Grandes entreprises (datacenter interne) ou location chez un tiers | Entreprise cherchant à équilibrer coûts, sécurité et performances |
| **Exemples** | Azure, Office 365 | Datacenters Oceanet, Bretagne Télécom | Office 365 + baie dédiée en datacenter pour le PRA |

## Critères de choix

Le choix entre hébergement local, cloud public, privé ou hybride dépend de :

- la **criticité des données** ;
- le **niveau de disponibilité** requis ;
- les **coûts** impliqués ;
- les **compétences internes** disponibles.
