# Module 2 : Les unités informatiques

*Cours : [Cours 1 - Bases des réseaux](../index.md)*

## 🎯 Objectif du module

Ce module présente les systèmes de numération utilisés en informatique (binaire, octal, décimal, hexadécimal), les méthodes de conversion entre ces bases, ainsi que les unités de mesure informatiques (bits, octets, multiples, débits).

📌 *Note de réorganisation : le cours source explique chaque base de numération une première fois (principe + un exemple de conversion), puis revient sur les conversions décimal ↔ base dans des sections séparées. Comme la méthode de conversion est **la même pour toutes les bases** (seul le diviseur change), cette fiche la présente **une seule fois de façon générique**, suivie d'un tableau récapitulatif de tous les exemples du cours — plus rapide à réviser qu'une répétition de la même méthode 3 fois.*


## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

# Module 2 – Les unités informatiques
---

## 1. Les bases de numération : vue d'ensemble

La **numération** est le système utilisé pour représenter les nombres. En informatique, 4 bases reviennent constamment :

| Base | Nom | Chiffres utilisés | Pourquoi on l'utilise |
|---|---|---|---|
| **2** | Binaire | 0, 1 | Base fondamentale : correspond directement aux 2 états électriques d'un circuit (0 = pas de courant, 1 = courant qui passe) |
| **8** | Octale | 0 à 7 | Représentation compacte du binaire (1 chiffre octal = 3 bits, car 8 = 2³) — utile notamment pour les permissions Unix/Linux |
| **10** | Décimale | 0 à 9 | La base « humaine », utilisée au quotidien |
| **16** | Hexadécimale | 0 à 9 puis A à F (A=10 … F=15) | Représentation compacte du binaire (1 chiffre hexa = 4 bits, car 16 = 2⁴) — très utilisée pour les adresses IPv6, les adresses MAC, les couleurs web |

### Tableau d'équivalence (0 à 15)

| Décimal | Binaire | Octal | Hexadécimal |
|---|---|---|---|
| 0 | 0000 | 0 | 0 |
| 1 | 0001 | 1 | 1 |
| 2 | 0010 | 2 | 2 |
| 3 | 0011 | 3 | 3 |
| 4 | 0100 | 4 | 4 |
| 5 | 0101 | 5 | 5 |
| 6 | 0110 | 6 | 6 |
| 7 | 0111 | 7 | 7 |
| 8 | 1000 | 10 | 8 |
| 9 | 1001 | 11 | 9 |
| 10 | 1010 | 12 | **A** |
| 11 | 1011 | 13 | **B** |
| 12 | 1100 | 14 | **C** |
| 13 | 1101 | 15 | **D** |
| 14 | 1110 | 16 | **E** |
| 15 | 1111 | 17 | **F** |

---

## 2. Le principe de la valeur positionnelle

Toutes les bases fonctionnent sur le **même principe** : chaque position d'un chiffre dans un nombre représente une **puissance de la base**, et la valeur totale du nombre est la somme de chaque chiffre multiplié par la puissance correspondant à sa position (en partant de la droite, position 0).

```
Position :     ...  2  1  0
Puissance :    ... B² B¹ B⁰      (B = la base : 2, 8, 10 ou 16)
```

**Exemple en base 10** — le nombre **325** :
```
3 × 10² + 2 × 10¹ + 5 × 10⁰  =  300 + 20 + 5  =  325
```

**Exemple en base 2** — le nombre **1011** :
```
1 × 2³ + 0 × 2² + 1 × 2¹ + 1 × 2⁰  =  8 + 0 + 2 + 1  =  11 (en décimal)
```

**Exemple en base 8** — le nombre **237** :
```
2 × 8² + 3 × 8¹ + 7 × 8⁰  =  128 + 24 + 7  =  159 (en décimal)
```

**Exemple en base 16** — le nombre **2AF** :
```
2 × 16² + A(10) × 16¹ + F(15) × 16⁰  =  512 + 160 + 15  =  687 (en décimal)
```

📌 C'est exactement ce principe qui est utilisé dans la méthode de conversion « base X → décimal » présentée en section 4.

---

## 3. Pourquoi et où utilise-t-on chaque base ?

### Le binaire
Base fondamentale de l'informatique : chaque **bit** correspond à un état électrique (0 = absence de courant, 1 = passage de courant). Tout le reste (octal, hexadécimal) n'existe que pour rendre le binaire plus lisible pour un humain.

### L'octal
Un chiffre octal représente exactement **3 bits** (8 = 2³), ce qui permet de regrouper un nombre binaire par paquets de 3 pour le raccourcir. Usage concret : les **permissions de fichiers Unix/Linux** (ex. `755`, `644`), et historiquement certaines configurations bas niveau de périphériques.

### L'hexadécimal
Un chiffre hexadécimal représente exactement **4 bits** (16 = 2⁴), ce qui en fait le format le plus compact et le plus lisible pour manipuler de grandes valeurs binaires. Usages concrets :

| Usage | Exemple |
|---|---|
| **Adresses IPv6** | `2001:0db8:85a3:0000:0000:8a2e:0370:7334` (128 bits regroupés par blocs de 4) |
| **Adresses MAC** | `00:1A:2B:3C:4D:5E` |
| **Couleurs web (RGB)** | `#FF5733` → FF (rouge fort), 57 (vert moyen), 33 (bleu faible) |

---

## 4. Les méthodes de conversion

Il existe deux méthodes génériques, valables **quelle que soit la base cible** (2, 8 ou 16) :

### Méthode A — Convertir un nombre décimal vers une autre base (divisions successives)

1. **Diviser** le nombre décimal par la base cible, noter le **reste**.
2. **Reprendre le quotient** obtenu et le diviser à nouveau par la base.
3. **Répéter** jusqu'à obtenir un quotient de **0**.
4. Le nombre converti s'obtient en **lisant les restes de bas en haut** (du dernier reste obtenu au premier).

*(Pour l'hexadécimal, si un reste est ≥ 10, le remplacer par la lettre correspondante : 10→A, 11→B... 15→F.)*

```
Exemple : 25 (décimal) → binaire (base 2)

25 ÷ 2 = 12   reste 1   ↑
12 ÷ 2 =  6   reste 0   │  on lit
 6 ÷ 2 =  3   reste 0   │  de bas
 3 ÷ 2 =  1   reste 1   │  en haut
 1 ÷ 2 =  0   reste 1   │
                         └─→  résultat : 1 1 0 0 1

25 (décimal) = 11001 (binaire)
```

### Méthode B — Convertir une autre base vers le décimal (méthode positionnelle)

1. Identifier la **position** de chaque chiffre, en partant de la droite (position 0).
2. **Multiplier** chaque chiffre par la **base élevée à la puissance de sa position**.
3. **Additionner** tous les résultats obtenus.

*(C'est exactement la méthode vue en section 2.)*

```
Exemple : 10110 (binaire) → décimal

position :  4 3 2 1 0
bit      :  1 0 1 1 0

1×2⁴ + 0×2³ + 1×2² + 1×2¹ + 0×2⁰ = 16+0+4+2+0 = 22

10110 (binaire) = 22 (décimal)
```

### Tous les exemples de conversion du cours

| Conversion | Méthode | Exemple | Résultat |
|---|---|---|---|
| Décimal → Binaire | A (÷2) | 25 | **11001** |
| Binaire → Décimal | B (×2ⁿ) | 10110 | **22** |
| Décimal → Octal | A (÷8) | 156 | **234** |
| Octal → Décimal | B (×8ⁿ) | 234 | **156** |
| Décimal → Hexadécimal | A (÷16) | 254 | **FE** |
| Hexadécimal → Décimal | B (×16ⁿ) | 3F | **63** |

📌 On remarque que les deux premières lignes et les deux suivantes sont des conversions **inverses l'une de l'autre** (156 → 234 puis 234 → 156) — de bons exemples pour s'entraîner dans les deux sens.

### Raccourci pratique : binaire ↔ octal / hexadécimal

Comme un chiffre octal = 3 bits et un chiffre hexadécimal = 4 bits, on peut convertir **directement** entre binaire et octal/hexadécimal, sans passer par le décimal — il suffit de regrouper les bits par paquets de 3 (octal) ou de 4 (hexadécimal), en partant de la droite.

```
Binaire → Octal :        110110  →  110 | 110  →  6 | 6  →  66 (octal)

Binaire → Hexadécimal :  10101111  →  1010 | 1111  →  A | F  →  AF (hexadécimal)
```

---

## 5. Les unités informatiques

### Bit et octet

| Unité | Définition |
|---|---|
| **Bit** (b) | La plus petite unité d'information : une valeur binaire, 0 ou 1 |
| **Octet** (B, *Byte*) | 8 bits regroupés — l'unité de base pour représenter un caractère (ex. une lettre ≈ 1 octet) |

### Les multiples de l'octet : deux systèmes à ne pas confondre

Il existe **deux façons** de compter les multiples de l'octet, ce qui est une source fréquente de confusion (notamment sur les disques durs, où les fabricants utilisent le système décimal alors que les systèmes d'exploitation utilisent le système binaire) :

| Système **binaire** (base 2) | Valeur | Système **décimal** (base 10) | Valeur |
|---|---|---|---|
| **Kio** (Kibioctet) | 2¹⁰ = 1 024 octets | **Ko** (Kilooctet) | 10³ = 1 000 octets |
| **Mio** (Mébioctet) | 2²⁰ = 1 048 576 octets | **Mo** (Mégaoctet) | 10⁶ = 1 000 000 octets |
| **Gio** (Gibioctet) | 2³⁰ ≈ 1,07 milliard d'octets | **Go** (Gigaoctet) | 10⁹ = 1 milliard d'octets |
| **Tio** (Tébioctet) | 2⁴⁰ ≈ 1,1 billion d'octets | **To** (Téraoctet) | 10¹² = 1 billion d'octets |

⚠️ C'est pour cette raison qu'un disque dur annoncé « 1 To » par le fabricant (système décimal) apparaît toujours plus petit qu'attendu une fois branché sur un ordinateur (qui compte en Tio, système binaire).

### Les unités de débit (vitesse de transmission)

Pour mesurer la **vitesse de transfert** des données sur un réseau (et non plus une quantité de données stockées), on utilise des unités basées sur le **bit**, pas sur l'octet :

| Unité | Signification |
|---|---|
| **bps** | bits par seconde — unité de base |
| **Kbps** | 1 000 bps |
| **Mbps** | 1 000 000 bps |
| **Gbps** | 1 000 000 000 bps |

📌 Piège classique : ne pas confondre un débit en **Mbps** (mégabits/seconde, utilisé pour une connexion Internet) avec une taille de fichier en **Mo** (mégaoctets) — il y a un facteur **8** entre les deux (1 octet = 8 bits), ce qui explique pourquoi un débit annoncé « 100 Mbps » ne donne pas une vitesse de téléchargement de 100 Mo/s, mais plutôt de 12,5 Mo/s.

---


## ✅ Points clés à retenir

- 4 bases à connaître : **binaire (2)**, **octale (8)**, **décimale (10)**, **hexadécimale (16)**.
- Le principe est toujours le même : chaque position = une **puissance de la base**, en partant de la droite (position 0).
- **Décimal → autre base** : divisions successives, lecture des restes **de bas en haut**.
- **Autre base → décimal** : multiplier chaque chiffre par (base)^position, puis additionner.
- **Binaire ↔ octal** : regrouper par 3 bits. **Binaire ↔ hexadécimal** : regrouper par 4 bits.
- **Bit** = 0/1 ; **Octet** = 8 bits.
- Ne pas confondre les multiples **binaires** (Kio, Mio, Gio... en puissances de 2) et **décimaux** (Ko, Mo, Go... en puissances de 10) — c'est la source de l'écart entre la taille annoncée et la taille réelle d'un disque dur.
- Les débits réseau (**bps, Kbps, Mbps, Gbps**) se mesurent en **bits**, pas en octets — attention au facteur 8 avec les tailles de fichiers.

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-01-bases-des-reseaux-module-2-les-unites-informatiques"></div>

<script type="application/json" id="quiz-cours-01-bases-des-reseaux-module-2-les-unites-informatiques-data">
[
  {
    "question": "Combien de chiffres sont utilisés dans le système de numération binaire ?",
    "options": ["2 (0 et 1)", "8 (de 0 à 7)", "10 (de 0 à 9)", "16 (de 0 à F)"],
    "correctIndex": 0,
    "explanation": "Le système binaire, ou base 2, utilise uniquement deux chiffres, 0 et 1 (bits), car il correspond directement aux deux états électriques des circuits informatiques (activé/désactivé)."
  },
  {
    "question": "Quels symboles sont utilisés dans le système de numération hexadécimale ?",
    "options": ["Les chiffres de 0 à 7", "Les chiffres de 0 à 9 et les lettres de A à F", "Les chiffres de 0 à 9 uniquement", "Les lettres de A à P"],
    "correctIndex": 1,
    "explanation": "L'hexadécimal (base 16) utilise seize symboles : les dix chiffres de 0 à 9 puis les lettres A à F, où A vaut 10 et F vaut 15."
  },
  {
    "question": "À combien de bits binaires correspond un chiffre hexadécimal ?",
    "options": ["2 bits", "3 bits", "4 bits", "8 bits"],
    "correctIndex": 2,
    "explanation": "Chaque chiffre hexadécimal représente exactement quatre bits (un demi-octet), ce qui permet de regrouper un nombre binaire par blocs de quatre pour le convertir facilement en hexadécimal."
  },
  {
    "question": "À combien de bits binaires correspond un chiffre octal ?",
    "options": ["2 bits", "4 bits", "8 bits", "3 bits"],
    "correctIndex": 3,
    "explanation": "Un chiffre octal se traduit directement en trois bits binaires (2³ = 8), ce qui permet de regrouper les bits par paquets de trois pour convertir un nombre binaire en octal."
  },
  {
    "question": "Quel est le résultat de la conversion du nombre décimal 25 en binaire ?",
    "options": ["11001", "11010", "10101", "11100"],
    "correctIndex": 0,
    "explanation": "En divisant successivement 25 par 2, on obtient les restes 1, 0, 0, 1, 1 ; lus de bas en haut, ils forment 11001, l'équivalent binaire de 25."
  },
  {
    "question": "Quel est l'équivalent décimal du nombre binaire 10110 ?",
    "options": ["20", "22", "24", "18"],
    "correctIndex": 1,
    "explanation": "10110 correspond à (1×2⁴)+(0×2³)+(1×2²)+(1×2¹)+(0×2⁰) = 16+0+4+2+0 = 22."
  },
  {
    "question": "Quel est l'équivalent octal du nombre décimal 156 ?",
    "options": ["236", "244", "234", "232"],
    "correctIndex": 2,
    "explanation": "En divisant successivement 156 par 8, on obtient les restes 4, 3, 2 ; lus de bas en haut, ils donnent 234 en base 8."
  },
  {
    "question": "Quel est l'équivalent décimal du nombre hexadécimal 3F ?",
    "options": ["61", "65", "58", "63"],
    "correctIndex": 3,
    "explanation": "3F correspond à (3×16¹)+(15×16⁰) = 48+15 = 63, puisque F représente la valeur 15 en hexadécimal."
  },
  {
    "question": "Quel est l'équivalent hexadécimal du nombre décimal 254 ?",
    "options": ["FE", "EF", "FD", "F4"],
    "correctIndex": 0,
    "explanation": "En divisant successivement 254 par 16, on obtient les restes 14 (E) puis 15 (F) ; lus de bas en haut, cela donne FE."
  },
  {
    "question": "Pour convertir un nombre binaire en octal, comment regroupe-t-on les bits ?",
    "options": ["Par paquets de quatre bits, en partant de la droite", "Par paquets de trois bits, en partant de la droite", "Par paquets de deux bits, en partant de la gauche", "Par paquets de huit bits, en partant de la droite"],
    "correctIndex": 1,
    "explanation": "Comme un chiffre octal équivaut à trois bits, la conversion binaire-octal regroupe les bits par trois en partant de la droite, chaque groupe étant ensuite remplacé par sa valeur octale."
  },
  {
    "question": "Quelle est la méthode générale pour convertir un nombre décimal vers une autre base (binaire, octale ou hexadécimale) ?",
    "options": ["Des multiplications successives par la base cible", "Une simple addition des chiffres du nombre décimal", "Des divisions successives par la base cible, en lisant les restes de bas en haut", "Une conversion directe caractère par caractère"],
    "correctIndex": 2,
    "explanation": "Quelle que soit la base cible, on divise successivement le nombre décimal par cette base, on note les restes à chaque étape, puis on lit ces restes de bas en haut pour obtenir le résultat converti."
  },
  {
    "question": "Combien de bits compose un octet ?",
    "options": ["4 bits", "16 bits", "10 bits", "8 bits"],
    "correctIndex": 3,
    "explanation": "Un octet (byte) est constitué de 8 bits et sert souvent à représenter un caractère ou une petite unité d'information."
  },
  {
    "question": "Combien d'octets représente 1 Kio (kibioctet) ?",
    "options": ["1 024 octets", "1 000 octets", "1 048 576 octets", "1 100 octets"],
    "correctIndex": 0,
    "explanation": "Le Kio (kibioctet) suit la notation binaire : 1 Kio = 2¹⁰ octets, soit 1 024 octets, contrairement au Ko (kilooctet) décimal qui vaut 1 000 octets."
  },
  {
    "question": "Quelle est la principale différence entre le Ko (kilooctet) et le Kio (kibioctet) ?",
    "options": ["Le Ko et le Kio désignent exactement la même quantité d'octets", "Le Ko utilise la base 10 (1 000 octets) tandis que le Kio utilise la base 2 (1 024 octets)", "Le Ko mesure une vitesse de transfert alors que le Kio mesure une capacité de stockage", "Le Kio est utilisé uniquement pour les vitesses réseau"],
    "correctIndex": 1,
    "explanation": "Le Ko (système décimal, base 10) vaut 1 000 octets, alors que le Kio (système binaire, base 2) vaut 1 024 octets ; cette différence est source de confusion, notamment pour les capacités de disques durs annoncées par les fabricants."
  },
  {
    "question": "Quelle unité est utilisée pour mesurer la vitesse de transfert de données sur un réseau ?",
    "options": ["L'octet (B) et ses multiples (Ko, Mo, Go)", "Le Kio et le Mio", "Le bps (bits par seconde) et ses multiples (Kbps, Mbps, Gbps)", "Le hertz (Hz) uniquement"],
    "correctIndex": 2,
    "explanation": "Le débit réseau se mesure en bits par seconde (bps), avec des multiples comme Kbps, Mbps ou Gbps, à ne pas confondre avec les unités de capacité de stockage exprimées en octets."
  },
  {
    "question": "Dans quel contexte réseau la numération hexadécimale est-elle couramment utilisée ?",
    "options": ["Pour écrire les adresses IPv4 uniquement", "Pour définir les masques de sous-réseau en notation décimale", "Pour configurer les tables de routage OSPF", "Pour écrire les adresses IPv6 et les adresses MAC"],
    "correctIndex": 3,
    "explanation": "L'hexadécimal permet de représenter de façon compacte des adresses longues comme les adresses IPv6 (128 bits) ou les adresses MAC, chaque groupe de quatre bits étant représenté par un seul symbole hexadécimal."
  },
  {
    "question": "Dans quel système Unix/Linux la numération octale est-elle traditionnellement utilisée ?",
    "options": ["Pour définir les permissions des fichiers et dossiers (par exemple 755 ou 644)", "Pour définir les adresses IP des interfaces réseau", "Pour chiffrer les mots de passe utilisateurs", "Pour numéroter les ports TCP/UDP"],
    "correctIndex": 0,
    "explanation": "Sous Unix/Linux, les permissions de fichiers et de dossiers sont couramment exprimées en notation octale, avec des valeurs comme 755 ou 644 indiquant les droits de lecture, d'écriture et d'exécution."
  },
  {
    "question": "Comment une couleur web comme #FF5733 est-elle représentée ?",
    "options": ["En binaire, sous forme de 24 bits consécutifs sans séparation", "En hexadécimal, sous forme de trois paires de chiffres correspondant au rouge, au vert et au bleu", "En octal, sous forme de trois groupes de deux chiffres", "En décimal, sous forme de trois nombres séparés par des virgules"],
    "correctIndex": 1,
    "explanation": "Les couleurs web en hexadécimal codent les niveaux de rouge, vert et bleu (RGB) sur deux chiffres hexadécimaux chacun ; par exemple #FF5733 indique un niveau élevé de rouge (FF), moyen de vert (57) et faible de bleu (33)."
  },
  {
    "question": "Que représente un bit au niveau électronique dans un circuit informatique ?",
    "options": ["Une tension variable pouvant prendre dix niveaux différents", "Une fréquence radio spécifique", "Deux états possibles d'un transistor : passage de courant (1) ou absence de courant (0)", "Une adresse mémoire physique fixe"],
    "correctIndex": 2,
    "explanation": "Le binaire correspond directement aux deux états électriques d'un transistor : le passage de courant est représenté par 1, et son absence par 0, ce qui en fait le système naturel des circuits informatiques."
  },
  {
    "question": "Pourquoi la numération hexadécimale permet-elle une représentation plus compacte des nombres binaires que la numération octale ?",
    "options": ["Parce que l'octal ne peut pas représenter de nombres supérieurs à 100", "Parce que l'hexadécimal n'utilise que des chiffres, sans lettres", "Parce que l'octal a été abandonné par tous les systèmes d'exploitation modernes", "Parce qu'un chiffre hexadécimal représente quatre bits, contre trois bits pour un chiffre octal"],
    "correctIndex": 3,
    "explanation": "Un chiffre hexadécimal correspond à quatre bits contre trois pour l'octal, ce qui rend l'hexadécimal plus compact et plus largement utilisé aujourd'hui pour représenter adresses mémoire, adresses IP ou codes couleurs."
  }
]
</script>


<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-01-bases-des-reseaux-module-2-les-unites-informatiques",
      dataId: "quiz-cours-01-bases-des-reseaux-module-2-les-unites-informatiques-data",
    });
  });
</script>
